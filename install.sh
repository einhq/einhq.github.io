#!/usr/bin/env bash
# EiN's installer. It asks how EiN is to be installed, checks this machine against EiN's system
# requirements, then fetches ein/deploy into ~/ein and runs its setup.sh, which downloads EiN's images
# (or builds them from another source) and starts it with podman compose or docker compose. It needs
# no root.
#
#   curl -fsSL https://einhq.eu/install.sh | bash                          asks, each default shown
#   curl -fsSL https://einhq.eu/install.sh | bash -s -- --yes              the defaults, asking nothing
#   curl -fsSL https://einhq.eu/install.sh | bash -s -- archive assistant  these modules, asking the rest
#
# A first install asks, at a terminal: where EiN goes, the folder for your files, the admin's
# password, which official modules to install, the web interface's and SSH's ports, and whether
# other machines reach it. Enter takes the default in brackets, and an option given answers its
# question. Without a terminal, or with --yes, it takes the defaults. Run again where EiN is, it
# updates it with the settings it has, and asks nothing.
#
# An official module's name alone (MODULES below) is that module with the services it needs:
# archive is --ems --module archive, assistant --llm --module assistant.
#
#   --home DIR          where EiN goes (default: ~/ein); its ./setup.sh updates it or adds an option later
#   --yes, -y           ask nothing: the defaults, and what the options say
#   --check             check the machine against what the options ask for, and stop
#   --data DIR          the folder for your files (default: DIR/data under --home)
#   --http-port N       the web interface's port (default: 8080, or the next free one)
#   --ssh-port N        SSH and SFTP's port (default: 2222, or the next free one)
#   --bind ADDRESS      0.0.0.0, every address of this machine (default), or 127.0.0.1, this machine
#                       alone, behind an HTTPS proxy of your own
#
# Every other option is setup.sh's, passed on as it is (`--help` there lists them): --ems, --llm,
# --automation, --module NAME, --db-dir DIR, --engine, --source URL. The checks follow them: the media
# service needs the most of the machine, the card only matters with it or the model. The secrets
# come in the environment, kept off the command line:
#
#   INITIAL_ADMIN_PASSWORD  the admin's first password, instead of asking or making one
#   EIN_SOURCE_KEY          the token for --source's repositories, when they are private
#
# --source names the organisation the sources come from instead of GitHub's einhq, such as a Forgejo
# or a Gitea with EiN's repositories under the same names, deploy among them; with private ones, this
# script is fetched from there with the token too:
#
#   curl -fsSL -H "Authorization: token $K" 'http://forge.example:3000/api/v1/repos/ein/einhq.github.io/raw/install.sh?ref=main' \
#     | EIN_SOURCE_KEY=$K bash -s -- --source http://forge.example:3000/ein archive
set -uo pipefail

# The official modules: each a name, the setup.sh options for the services it needs, and what it is.
MODULES=(
  'archive|--ems|photos, videos and documents, people and places; with the media service, ~30 GB'
  'assistant|--llm|a chat that answers questions; with a language model here, about 6 GB'
  'automation|--automation|sensors, plugs, lights and cameras, and automations; with an MQTT broker and a restreamer'
  'album-folders|--ems|the Archive'"'"'s albums as folders on disk; brings the Archive'
  'recipes|--ems|recipes with ingredients, steps and pictures; with the media service'
  'todo||todo lists, personal or shared within a group'
)

# Everything runs from main, called on the last line, so a download cut short runs nothing.
main() {
  local home= yes=0 check=0 interactive=0 pass=() installed= installed_key=
  key=${EIN_SOURCE_KEY:-}
  source= data= data_given=0 http_port= ssh_port= bind= modules= named=0 ems=0 llm=0
  container= container_version=
  # install.sh's own options taken out; the rest are setup.sh's, passed on.
  while [ $# -gt 0 ]; do
    case $1 in
      --home)
        [ $# -ge 2 ] || { echo "install.sh: --home needs a folder" >&2; return 1; }
        home=$(absolute "$2")
        shift
        ;;
      --yes | -y) yes=1 ;;
      --check) check=1 ;;
      -h | --help)
        echo "How it is used is the head of the script: curl -fsSL https://einhq.eu/install.sh | head -45"
        return
        ;;
      *) pass+=("$1") ;;
    esac
    shift
  done

  local os arch
  os=$(uname -s) arch=$(uname -m)
  if [ "$os" != Linux ] || [ "$arch" != x86_64 ]; then
    echo "EiN runs on Linux on x86-64; this is $os on $arch, so nothing was installed."
    return 1
  fi

  # Asked at a terminal: stdin is this script, piped from curl, so the answers are read from /dev/tty.
  if [ "$yes" = 0 ] && [ "$check" = 0 ] && { : </dev/tty; } 2>/dev/null; then interactive=1; fi
  if [ -z "$home" ]; then
    home=$HOME/ein
    if [ "$interactive" = 1 ] && [ ! -f "$home/.env" ]; then
      echo "Installing EiN. Enter takes the default in brackets; any of these can be changed later."
      echo
      home=$(absolute "$(ask "Where EiN goes" "$home")")
    fi
  fi

  # A machine installed before keeps its options, its modules, its data folder, its source and the
  # source's token: they are in its .env, and setup.sh takes --data only the first time. The token
  # is kept only while the source stays on the same host: another one would refuse it.
  if [ -f "$home/.env" ]; then
    grep -qx 'EIN_EMS=1' "$home/.env" && ems=1
    grep -qx 'EIN_LLM=1' "$home/.env" && llm=1
    modules=$(sed -n 's/^EIN_MODULES=//p' "$home/.env" | tr -d '"')
    data=$(sed -n 's/^EIN_DATA=//p' "$home/.env")
    installed=$(sed -n 's/^EIN_SOURCE=//p' "$home/.env")
    installed_key=$(sed -n 's/^EIN_SOURCE_KEY=//p' "$home/.env")
    [ "$interactive" = 0 ] || echo "EiN is installed in $home: updating it, with the settings it has."
  fi
  expanded=()
  expand "${pass[@]}"
  pass=("${expanded[@]}")
  options "${pass[@]}" || return 1

  if [ ! -f "$home/.env" ]; then
    if [ "$interactive" = 1 ]; then
      questions || return 1
    elif [ "$yes" = 0 ] && [ "$check" = 0 ]; then
      echo "No terminal to ask on: installing with the defaults and the options given, as --yes does."
    fi
    data=${data:-$home/data}
    [ "$data_given" = 1 ] || pass+=(--data "$data")
  fi
  source=${source:-${installed:-https://github.com/einhq}}
  [ -n "$key" ] || [ "$(host_of "$source")" != "$(host_of "$installed")" ] || key=$installed_key
  failed=0
  warned=0

  echo "EiN: checking this machine against the system requirements"
  echo

  # --- system: anything else was refused before the questions ---
  say system ok "Linux on x86-64"

  # --- tools ---
  engine
  local tool
  for tool in git curl; do
    if command -v "$tool" >/dev/null; then say "$tool" ok ""; else need "$tool" "install $tool"; fi
  done

  # --- processor and memory: the media service is what needs them, and memory the language model too ---
  local cores threads
  cores=$(lscpu -p=core,socket 2>/dev/null | grep -v '^#' | sort -u | wc -l)
  threads=$(nproc 2>/dev/null || echo 0)
  [ "$cores" -gt 0 ] || cores=$threads
  if [ "$ems" = 1 ]; then
    if [ "$cores" -ge 6 ]; then
      say processor ok "$cores cores"
    elif [ "$cores" -ge 4 ]; then
      short processor "$cores cores: enough, 6 or more is recommended for the media service"
    else
      need processor "$cores cores ($threads threads): the media service needs at least 4"
    fi
  elif [ "$cores" -ge 2 ]; then
    say processor ok "$cores cores"
  else
    need processor "$cores core: EiN needs at least 2"
  fi

  local memory_gb
  memory_gb=$(awk '/^MemTotal:/ {printf "%d", $2 / 1024 / 1024 + 0.5}' /proc/meminfo 2>/dev/null)
  memory_gb=${memory_gb:-0}
  if [ "$ems" = 1 ]; then
    if [ "$memory_gb" -ge 30 ]; then
      say memory ok "$memory_gb GB"
    elif [ "$memory_gb" -ge 15 ]; then
      short memory "$memory_gb GB: enough with the assistant off or on a hosted model; 32 GB is recommended"
    else
      need memory "$memory_gb GB: the media service needs at least 16 GB"
    fi
  elif [ "$llm" = 1 ] && [ "$memory_gb" -ge 4 ]; then
    if [ "$memory_gb" -ge 10 ]; then
      say memory ok "$memory_gb GB"
    else
      short memory "$memory_gb GB: enough with the language model on the card; on the processor it takes about 6 GB more than EiN's 4"
    fi
  elif [ "$memory_gb" -ge 4 ]; then
    say memory ok "$memory_gb GB"
  else
    need memory "$memory_gb GB: EiN needs at least 4 GB"
  fi

  # --- disk: measured on the nearest folder that exists, as the data folder may not be made yet ---
  local dir=$data free_gb where want_gb=10 what="the images and the database"
  [ "$ems" = 1 ] && want_gb=100
  # The language model's file, about 5.6 GB, is kept in the data folder.
  [ "$llm" = 1 ] && want_gb=$((want_gb + 6)) && what="the images, the database and the language model"
  while [ ! -d "$dir" ] && [ "$dir" != / ]; do dir=$(dirname "$dir"); done
  free_gb=$(df -Pk "$dir" 2>/dev/null | awk 'NR == 2 {printf "%d", $4 / 1024 / 1024}')
  free_gb=${free_gb:-0}
  where="under $data"
  [ "$dir" = "$data" ] || where="under $data (not made yet; measured on $dir)"
  if [ "$free_gb" -ge "$want_gb" ]; then
    say disk ok "$free_gb GB free $where, plus room for your own files"
  else
    need disk "$free_gb GB free $where: about $want_gb GB is needed for $what, plus your files"
  fi

  if [ "$ems" = 1 ] || [ "$llm" = 1 ]; then graphics; fi

  # --- modules: the Archive's photos, videos and documents are analysed by the media service ---
  if [[ " $modules " == *" archive "* ]] && [ "$ems" = 0 ]; then
    short archive "the Archive module needs the media service: add --ems, now or later with $home/setup.sh --ems"
  fi

  summary || return 1
  [ "$check" = 1 ] && return

  echo
  if [ -d "$home/.git" ]; then
    echo "Updating $home from $source/deploy"
    git -C "$home" remote set-url origin "$source/deploy.git" &&
      git_source -C "$home" pull --ff-only --quiet || return 1
  else
    echo "Fetching $source/deploy into $home"
    git_source clone --quiet "$source/deploy.git" "$home" || return 1
  fi
  EIN_SOURCE_KEY=$key exec "$home/setup.sh" "${pass[@]}"
}

# setup.sh's options as far as the questions and the checks need them: the services, the modules,
# the source, the folder and the ports. A module named, by itself or with --module, is not asked for.
options() {
  local arg next=
  for arg in "$@"; do
    case $next in
      source) source=${arg%/} ;;
      module) modules="$modules $arg" named=1 ;;
      data) data=$(absolute "$arg") data_given=1 ;;
      http-port) http_port=$arg ;;
      ssh-port) ssh_port=$arg ;;
      bind) bind=$arg ;;
    esac
    if [ -n "$next" ]; then
      next=
      continue
    fi
    case $arg in
      --ems) ems=1 ;;
      --no-ems) ems=0 ;;
      --llm) llm=1 ;;
      --no-llm) llm=0 ;;
      --module | --source | --data | --http-port | --ssh-port | --bind) next=${arg#--} ;;
      --db-dir | --only | --engine) next=value ;;
    esac
  done
  # setup.sh would take the folder as given, relative to ~/ein: it gets it whole.
  local i
  for i in "${!pass[@]}"; do
    [ "${pass[i]}" != --data ] || [ $((i + 1)) -ge ${#pass[@]} ] || pass[i + 1]=$(absolute "${pass[i + 1]}")
  done
}

# The questions of a first install, each unless an option answered it, then what they add up to, to
# say yes to. The answers go into setup.sh's options, the password into its environment.
questions() {
  local answer port again
  [ -n "$data" ] || { data=$(absolute "$(ask "The folder for your files, the database among them" "$home/data")"); }

  if [ -z "${INITIAL_ADMIN_PASSWORD:-}" ]; then
    while true; do
      read -rsp "The admin account's password, 8 characters or more [Enter: one is made for you]: " answer </dev/tty
      echo
      [ -n "$answer" ] || break
      if [ ${#answer} -lt 8 ]; then
        echo "  That is shorter than 8 characters."
      elif [[ $answer == *[\'\\]* ]]; then
        echo "  A password without ' and \\, please: EiN's settings file cannot keep them as they are."
      else
        read -rsp "The same password again: " again </dev/tty
        echo
        [ "$again" = "$answer" ] && { export INITIAL_ADMIN_PASSWORD=$answer; break; }
        echo "  The two differ."
      fi
    done
  fi

  if [ "$named" = 0 ]; then
    picked=()
    pick
    expanded=()
    expand "${picked[@]}"
    pass+=("${expanded[@]}")
    options "${expanded[@]}"
  fi

  if [ -z "$http_port" ]; then
    port=$(free_port 8080)
    http_port=$(ask_port "The web interface's port" "$port" "$([ "$port" = 8080 ] || echo '8080 is taken')")
    pass+=(--http-port "$http_port")
  fi
  if [ -z "$ssh_port" ]; then
    port=$(free_port 2222)
    ssh_port=$(ask_port "SSH and SFTP's port" "$port" "$([ "$port" = 2222 ] || echo '2222 is taken')")
    pass+=(--ssh-port "$ssh_port")
  fi
  if [ -z "$bind" ]; then
    if yes_no "Can other machines reach EiN? n keeps it to this machine, behind an HTTPS proxy of your own" y; then
      bind=0.0.0.0
    else
      bind=127.0.0.1
    fi
    pass+=(--bind "$bind")
  fi

  echo
  echo "EiN is to be installed with:"
  printf '  %-15s %s\n' folder "$home" "your files" "$data" \
    "admin password" "$([ -n "${INITIAL_ADMIN_PASSWORD:-}" ] && echo 'the one you chose' || echo 'one made for you, shown at the end')" \
    modules "$(services)" \
    "web interface" "port $http_port$([ "$bind" = 127.0.0.1 ] && echo ', this machine alone' || echo ', every address of this machine')" \
    "SSH and SFTP" "port $ssh_port"
  yes_no "Install?" y || { echo "Nothing was installed."; return 1; }
  echo
}

# The modules chosen and the services they bring, in words.
services() {
  local names=() with=() list
  read -ra names <<<"$modules"
  [ "$ems" = 0 ] || with+=("the media service")
  [ "$llm" = 0 ] || with+=("the language model")
  [[ " ${pass[*]} " != *" --automation "* ]] || with+=("the automation sidecar")
  list=${names[*]:-none}
  if [ ${#with[@]} != 0 ]; then
    printf -v list '%s, with %s' "$list" "$(printf '%s, ' "${with[@]}")"
    list=${list%, }
  fi
  echo "$list"
}

# A question at the terminal, its default in brackets; the answer, or the default for Enter.
ask() {
  local answer
  read -rp "$1 [$2]: " answer </dev/tty
  echo "${answer:-$2}"
}

# y or n; Enter takes the default, $2.
yes_no() {
  local answer hint='[Y/n]'
  [ "$2" = y ] || hint='[y/N]'
  read -rp "$1 $hint " answer </dev/tty
  case ${answer:-$2} in [yY]*) return 0 ;; *) return 1 ;; esac
}

# A port, asked until one is given: the default, and why it is not the usual one.
ask_port() {
  local answer
  while true; do
    read -rp "$1 [$2]${3:+ ($3)}: " answer </dev/tty
    answer=${answer:-$2}
    [[ $answer =~ ^[0-9]+$ ]] && [ "$answer" -ge 1 ] && [ "$answer" -le 65535 ] && { echo "$answer"; return; }
    echo "  A port is a number, 1 to 65535." >/dev/tty
  done
}

# The first port from $1 on that nothing on this machine listens on, as setup.sh would take.
free_port() {
  local port=$1
  while port_taken "$port"; do port=$((port + 1)); done
  echo "$port"
}
port_taken() {
  if command -v ss >/dev/null; then
    [ -n "$(ss -ltnH "sport = :$1")" ]
  else
    (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null
  fi
}

# A folder as a whole path: ~ at its start is the home folder, and one relative to here is made whole.
absolute() {
  local path=${1/#\~/$HOME}
  [[ $path == /* ]] || path=$PWD/$path
  [ "$path" = / ] || path=${path%/}
  echo "$path"
}

# Which official modules to install, into `picked`, asked one by one at the terminal.
pick() {
  local entry name needs about answer
  echo "EiN's official modules: y installs one, Enter leaves it out. Any can be added later."
  for entry in "${MODULES[@]}"; do
    IFS='|' read -r name needs about <<<"$entry"
    printf '  %-14s %s [y/N] ' "$name" "$about"
    read -r answer </dev/tty || answer=
    case $answer in [yY]*) picked+=("$name") ;; esac
  done
}

# The command line with each official module named alone made the options it stands for, into
# `expanded`; a name given to an option (--module archive) stays as it is.
expand() {
  local arg prev= entry name needs about found
  for arg in "$@"; do
    found=
    case $prev in
      --module | --source | --only | --db-dir | --data | --http-port | --ssh-port | --bind | --engine) ;;
      *)
        for entry in "${MODULES[@]}"; do
          IFS='|' read -r name needs about <<<"$entry"
          [ "$arg" = "$name" ] && found=1 && break
        done
        ;;
    esac
    if [ -n "$found" ]; then
      # shellcheck disable=SC2206 # needs is a list of options, split on purpose
      expanded+=($needs --module "$name")
    else
      expanded+=("$arg")
    fi
    prev=$arg
  done
}

host_of() {
  local host=${1#*://}
  host=${host%%/*}
  echo "${host,,}"
}

# git with the source's token as a header, given in the environment of this call alone: it is not
# written into .git/config, nor shown on a command line.
git_source() {
  if [ -n "$key" ]; then
    GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=http.extraHeader GIT_CONFIG_VALUE_0="Authorization: token $key" git "$@"
  else
    git "$@"
  fi
}

# --- the container engine: rootless podman, or Docker, each with its compose ---
engine() {
  if command -v podman >/dev/null; then
    local version rootless
    version=$(podman --version | awk '{print $3}')
    container=podman container_version=$version
    rootless=$(podman info --format '{{.Host.Security.Rootless}}' 2>/dev/null)
    case $rootless in
      true) say podman ok "$version, rootless" ;;
      false) short podman "$version, run as root here: run the installer, and EiN, as your own user" ;;
      *) short podman "$version, but 'podman info' fails: run it to see why" ;;
    esac
    local provider
    if provider=$(podman compose version 2>&1); then
      if [[ $provider == *podman-compose* ]]; then
        say compose ok "podman compose, with podman-compose"
      elif curl -sf -o /dev/null --unix-socket "$(podman info --format '{{.Host.RemoteSocket.Path}}' 2>/dev/null)" http://d/_ping; then
        say compose ok "podman compose, with docker-compose through podman's socket"
      else
        need compose "'podman compose' runs docker-compose here, which needs podman's socket: systemctl --user enable --now podman.socket"
      fi
    else
      need compose "install podman-compose, which 'podman compose' runs"
    fi
    # Under the older network backend, CNI, containers find each other by name only with its dnsname
    # plugin, and EiN finds its database by the name db.
    if [ "$(podman info --format '{{.Host.NetworkBackend}}' 2>/dev/null)" = cni ]; then
      local dir dnsname=
      for dir in /usr/local/libexec/cni /usr/libexec/cni /usr/local/lib/cni /usr/lib/cni /opt/cni/bin; do
        [ ! -x "$dir/dnsname" ] || dnsname=$dir/dnsname
      done
      if [ -n "$dnsname" ]; then
        say network ok "CNI, with its dnsname plugin"
      else
        need network "podman's CNI networks give no names here: install its dnsname plugin (Debian and Ubuntu: golang-github-containernetworking-plugin-dnsname; Fedora: podman-plugins)"
      fi
    fi
  elif command -v docker >/dev/null; then
    container=docker container_version=$(docker --version | awk '{print $3}' | tr -d ,)
    say docker ok "$container_version"
    if docker compose version >/dev/null 2>&1; then
      say compose ok "docker compose $(docker compose version --short 2>/dev/null)"
    else
      need compose "install Docker's compose plugin (docker-compose-plugin)"
    fi
  else
    need podman "install podman and podman-compose, or Docker with its compose plugin"
  fi
}

# --- graphics card: optional, NVIDIA only ---
graphics() {
  if ! command -v nvidia-smi >/dev/null && ! grep -qs 0x10de /sys/bus/pci/devices/*/vendor; then
    short graphics "no NVIDIA card: everything runs on the processor, more slowly; a 16 GB NVIDIA card is recommended"
    return
  fi
  if ! nvidia-smi >/dev/null 2>&1; then
    short graphics "an NVIDIA card is present but nvidia-smi cannot reach its driver: run nvidia-smi to see why"
    return
  fi
  # The card with the most memory, which is the one the media service will want.
  local best name card_mb driver count
  best=$(nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader,nounits 2>/dev/null | sort -t, -k2 -nr | head -1)
  name=$(echo "$best" | cut -d, -f1 | xargs)
  card_mb=$(echo "$best" | cut -d, -f2 | xargs)
  driver=$(echo "$best" | cut -d, -f3 | xargs)
  count=$(nvidia-smi -L 2>/dev/null | wc -l)
  [ "$count" -gt 1 ] && name="$name (the largest of $count cards)"
  if [ "${driver%%.*}" -ge 610 ] 2>/dev/null; then
    say graphics ok "$name, $card_mb MB, driver $driver"
  else
    short graphics "$name, $card_mb MB, driver $driver: 610 or newer is needed to encode video on the card"
  fi
  if [ "${card_mb:-0}" -lt 7500 ] 2>/dev/null; then
    short "card memory" "$card_mb MB: cards of 8 GB and more have been tried; transcribing needs about 4 GB of it free"
  elif [ "${card_mb:-0}" -lt 15000 ] 2>/dev/null; then
    short "card memory" "$card_mb MB: works; 16 GB is recommended, room for the media models and the assistant side by side"
  fi

  # The container toolkit 1.18 and newer keeps a CDI spec in /var/run/cdi up to date
  # (nvidia-cdi-refresh.service); a spec made by hand in /etc/cdi names the cards of the moment.
  # podman and Docker 28.2 and newer both pass the card through it, podman before 5 only once the
  # spec is made readable to it (see cdi_spec).
  if ! command -v nvidia-ctk >/dev/null; then
    short "container GPU" "install nvidia-container-toolkit 1.18 or newer, so the containers can use the card"
    return
  fi
  local ctk
  ctk=$(nvidia-ctk --version 2>/dev/null | awk '/version/ {print $NF; exit}')
  if [ "$(printf '%s\n' 1.18 "${ctk:-0}" | sort -V | head -1)" != 1.18 ]; then
    short "container GPU" "nvidia-container-toolkit ${ctk:-?}: 1.18 or newer is needed (it ships nvidia-cdi-refresh.service)"
  elif [ -s /var/run/cdi/nvidia.yaml ]; then
    cdi_spec "$ctk"
  elif compgen -G '/etc/cdi/nvidia*.yaml' >/dev/null; then
    short "container GPU" "nvidia-container-toolkit $ctk with a hand-made spec in /etc/cdi: let nvidia-cdi-refresh.service write /var/run/cdi/nvidia.yaml instead"
  else
    short "container GPU" "nvidia-container-toolkit $ctk, but no CDI spec: sudo systemctl enable --now nvidia-cdi-refresh.service"
  fi
}

# The spec in /var/run/cdi, as the container engine reads it. podman before 5 reads CDI specs up to
# version 0.6.0, and the toolkit 1.17 and newer writes 0.7.0 with additionalGids, which it rejects
# whole: the media service and the model then find no card. ems's deploy/install-cdi-refresh.sh
# makes the refresh rewrite the spec for it each time. Docker reads CDI specs from 28.2 on.
cdi_spec() {
  local ctk=$1 spec=/var/run/cdi/nvidia.yaml version fix
  if [ "$container" = podman ] && [ "${container_version%%.*}" -lt 5 ] 2>/dev/null; then
    version=$(sed -n 's/^cdiVersion: *//p' "$spec" | tr -d "\"'")
    if grep -qiE '^[ -]*additionalGids:' "$spec" ||
      [ "$(printf '%s\n' 0.6.0 "${version:-0.6.0}" | sort -V | tail -1)" != 0.6.0 ]; then
      if [ "$ems" = 1 ]; then
        fix="sudo bash $home/src/ems/deploy/install-cdi-refresh.sh once EiN is installed"
      else
        fix="sudo bash deploy/install-cdi-refresh.sh in a checkout of $source/ems"
      fi
      short "container GPU" "podman $container_version rejects the CDI spec nvidia-container-toolkit $ctk writes (cdiVersion ${version:-?}), so the containers find no card: $fix"
      return
    fi
  elif [ "$container" = docker ] && [ "$(printf '%s\n' 28.2 "${container_version:-0}" | sort -V | head -1)" != 28.2 ]; then
    short "container GPU" "Docker $container_version passes the card through its CDI spec from 28.2 on: update Docker"
    return
  fi
  say "container GPU" ok "nvidia-container-toolkit $ctk, CDI spec in /var/run/cdi"
}

# One line of the report: what was checked, ok / missing / low (coloured on a terminal), and why.
say() {
  local colour=
  if [ -t 1 ]; then
    case $2 in ok) colour=32 ;; missing) colour=31 ;; low) colour=33 ;; esac
  fi
  if [ -n "$colour" ]; then
    printf '  %-16s \e[%sm%-8s\e[0m %s\n' "$1" "$colour" "$2" "$3"
  else
    printf '  %-16s %-8s %s\n' "$1" "$2" "$3"
  fi
}
need() {
  say "$1" missing "$2"
  failed=$((failed + 1))
}
short() {
  say "$1" low "$2"
  warned=$((warned + 1))
}

# The verdict; it fails when a requirement is not met, and nothing is installed then.
summary() {
  echo
  if [ "$failed" -gt 0 ]; then
    echo "$failed requirement(s) not met, so nothing was installed."
    return 1
  elif [ "$warned" -gt 0 ]; then
    echo "This machine can run EiN; $warned item(s) are below what is recommended."
  else
    echo "This machine meets the recommended requirements."
  fi
}

main "$@"
