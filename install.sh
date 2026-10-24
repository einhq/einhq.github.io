#!/usr/bin/env bash
# EiN's installer. It checks this machine against EiN's system requirements, then fetches ein/deploy
# into ~/ein and runs its setup.sh, which builds EiN from source and starts it with podman compose or
# docker compose. It needs no root.
#
#   curl -fsSL https://einhq.eu/install.sh | bash                    EiN and its database
#   curl -fsSL https://einhq.eu/install.sh | bash -s -- --ems --llm  with the media service and the assistant's model
#   curl -fsSL https://einhq.eu/install.sh | bash -s -- --module archive
#
# The options are setup.sh's, passed on as they are (`--help` lists them). The checks follow them:
# the media service needs the most of the machine, the card only matters with it or the model.
#
#   EIN_HOME   where EiN goes (default: ~/ein); run its ./setup.sh to update or add an option later
#   EIN_DATA   the folder for your files, the first time (default: $EIN_HOME/data)
#   EIN_CHECK  1: check the machine and stop
set -uo pipefail

# Everything runs from main, called on the last line, so a download cut short runs nothing.
main() {
  local home=${EIN_HOME:-$HOME/ein} git=${EIN_GIT:-https://github.com/einhq} arg
  ems=0 llm=0
  for arg in "$@"; do
    case $arg in --ems) ems=1 ;; --llm) llm=1 ;; esac
  done
  # A machine installed before keeps its options: they are in its .env.
  if [ -f "$home/.env" ]; then
    grep -qx 'EIN_EMS=1' "$home/.env" && ems=1
    grep -qx 'EIN_LLM=1' "$home/.env" && llm=1
  fi
  local data=${EIN_DATA:-$home/data}
  failed=0
  warned=0

  echo "EiN: checking this machine against the system requirements"
  echo

  # --- system ---
  local os arch
  os=$(uname -s) arch=$(uname -m)
  if [ "$os" = Linux ] && [ "$arch" = x86_64 ]; then
    say system ok "Linux on x86-64"
  else
    need system "EiN runs on Linux on x86-64; this is $os on $arch"
    summary
    return
  fi

  # --- tools ---
  engine
  local tool
  for tool in git curl openssl; do
    if command -v "$tool" >/dev/null; then say "$tool" ok ""; else need "$tool" "install $tool"; fi
  done

  # --- processor and memory: the media service is what needs them ---
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
  elif [ "$memory_gb" -ge 4 ]; then
    say memory ok "$memory_gb GB"
  else
    need memory "$memory_gb GB: EiN needs at least 4 GB"
  fi

  # --- disk: measured on the nearest folder that exists, as EIN_DATA may not be made yet ---
  local dir=$data free_gb where want_gb=10
  [ "$ems" = 1 ] && want_gb=100
  while [ ! -d "$dir" ] && [ "$dir" != / ]; do dir=$(dirname "$dir"); done
  free_gb=$(df -Pk "$dir" 2>/dev/null | awk 'NR == 2 {printf "%d", $4 / 1024 / 1024}')
  free_gb=${free_gb:-0}
  where="under $data"
  [ "$dir" = "$data" ] || where="under $data (not made yet; measured on $dir)"
  if [ "$free_gb" -ge "$want_gb" ]; then
    say disk ok "$free_gb GB free $where, plus room for your own files"
  else
    need disk "$free_gb GB free $where: about $want_gb GB is needed for the images and the database, plus your files"
  fi

  if [ "$ems" = 1 ] || [ "$llm" = 1 ]; then graphics; fi

  summary || return 1
  [ "${EIN_CHECK:-0}" = 1 ] && return

  echo
  if [ -d "$home/.git" ]; then
    echo "Updating $home"
    git -C "$home" pull --ff-only --quiet || return 1
  else
    echo "Fetching ein/deploy into $home"
    git clone --quiet "$git/deploy.git" "$home" || return 1
  fi
  EIN_DATA=$data EIN_GIT=$git exec "$home/setup.sh" "$@"
}

# --- the container engine: rootless podman, or Docker, each with its compose ---
engine() {
  if command -v podman >/dev/null; then
    local version rootless
    version=$(podman --version | awk '{print $3}')
    rootless=$(podman info --format '{{.Host.Security.Rootless}}' 2>/dev/null)
    case $rootless in
      true) say podman ok "$version, rootless" ;;
      false) short podman "$version, run as root here: run the installer, and EiN, as your own user" ;;
      *) short podman "$version, but 'podman info' fails: run it to see why" ;;
    esac
    if podman compose version >/dev/null 2>&1; then
      say compose ok "podman compose"
    else
      need compose "install podman-compose, which 'podman compose' runs"
    fi
  elif command -v docker >/dev/null; then
    say docker ok "$(docker --version | awk '{print $3}' | tr -d ,)"
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
  # podman and Docker 28.2 and newer both pass the card through it.
  if ! command -v nvidia-ctk >/dev/null; then
    short "container GPU" "install nvidia-container-toolkit 1.18 or newer, so the containers can use the card"
    return
  fi
  local ctk
  ctk=$(nvidia-ctk --version 2>/dev/null | awk '/version/ {print $NF; exit}')
  if [ "$(printf '%s\n' 1.18 "${ctk:-0}" | sort -V | head -1)" != 1.18 ]; then
    short "container GPU" "nvidia-container-toolkit ${ctk:-?}: 1.18 or newer is needed (it ships nvidia-cdi-refresh.service)"
  elif [ -s /var/run/cdi/nvidia.yaml ]; then
    say "container GPU" ok "nvidia-container-toolkit $ctk, CDI spec in /var/run/cdi"
  elif compgen -G '/etc/cdi/nvidia*.yaml' >/dev/null; then
    short "container GPU" "nvidia-container-toolkit $ctk with a hand-made spec in /etc/cdi: let nvidia-cdi-refresh.service write /var/run/cdi/nvidia.yaml instead"
  else
    short "container GPU" "nvidia-container-toolkit $ctk, but no CDI spec: sudo systemctl enable --now nvidia-cdi-refresh.service"
  fi
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
