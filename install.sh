#!/usr/bin/env bash
# EiN's installer, for now a check only: it compares this machine with EiN's system requirements and
# says what is missing. It installs nothing and needs no root; it only asks podman, nvidia-smi, lscpu
# and df about the machine.
#
#   curl -fsSL https://einhq.github.io/install.sh | bash
#
# The install itself (fetching the images, starting the database, the media service and EiN, and
# handing over the admin account) comes in a later version of this script. Until then, follow
# https://einhq.github.io/#start
#
# EIN_DATA picks the folder whose disk is checked for space (default: your home folder); it need not
# exist yet.
set -uo pipefail

# Everything runs from main, called on the last line, so a download cut short runs nothing.
main() {
  local data=${EIN_DATA:-$HOME}
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
  if command -v podman >/dev/null; then
    local version rootless
    version=$(podman --version | awk '{print $3}')
    rootless=$(podman info --format '{{.Host.Security.Rootless}}' 2>/dev/null)
    case $rootless in
      true) say podman ok "$version, rootless" ;;
      false) short podman "$version, run as root here: run this check, and EiN, as your own user" ;;
      *) short podman "$version, but 'podman info' fails: run it to see why" ;;
    esac
  else
    need podman "install podman (EiN's containers run in rootless podman; Docker is not tested)"
  fi
  local tool
  for tool in git make curl openssl; do
    if command -v "$tool" >/dev/null; then say "$tool" ok ""; else need "$tool" "install $tool"; fi
  done
  if command -v deno >/dev/null; then
    local dv
    dv=$(deno --version | awk 'NR == 1 {print $2}')
    if [ "${dv%%.*}" -ge 2 ] 2>/dev/null; then
      say deno ok "$dv"
    else
      need deno "deno $dv: Deno 2 is needed to build EiN's web interface (deno upgrade)"
    fi
  else
    need deno "install Deno 2 (https://deno.com): it builds EiN's web interface"
  fi

  # --- processor and memory ---
  local cores threads
  cores=$(lscpu -p=core,socket 2>/dev/null | grep -v '^#' | sort -u | wc -l)
  threads=$(nproc 2>/dev/null || echo 0)
  [ "$cores" -gt 0 ] || cores=$threads
  if [ "$cores" -ge 6 ]; then
    say processor ok "$cores cores"
  elif [ "$cores" -ge 4 ]; then
    short processor "$cores cores: enough, 6 or more is recommended"
  else
    need processor "$cores cores ($threads threads): at least 4 cores are needed"
  fi

  local memory_gb
  memory_gb=$(awk '/^MemTotal:/ {printf "%d", $2 / 1024 / 1024 + 0.5}' /proc/meminfo 2>/dev/null)
  memory_gb=${memory_gb:-0}
  if [ "$memory_gb" -ge 30 ]; then
    say memory ok "$memory_gb GB"
  elif [ "$memory_gb" -ge 15 ]; then
    short memory "$memory_gb GB: enough with the assistant off or on a hosted model; 32 GB is recommended"
  else
    need memory "$memory_gb GB: at least 16 GB is needed"
  fi

  # --- disk: measured on the nearest folder that exists, as EIN_DATA may not be made yet ---
  local dir=$data free_gb where
  while [ ! -d "$dir" ] && [ "$dir" != / ]; do dir=$(dirname "$dir"); done
  free_gb=$(df -Pk "$dir" 2>/dev/null | awk 'NR == 2 {printf "%d", $4 / 1024 / 1024}')
  free_gb=${free_gb:-0}
  where="under $data"
  [ "$dir" = "$data" ] || where="under $data (not made yet; measured on $dir)"
  if [ "$free_gb" -ge 100 ]; then
    say disk ok "$free_gb GB free $where, plus room for your own files"
  else
    need disk "$free_gb GB free $where: about 100 GB is needed for the images and the database, plus your files"
  fi

  graphics

  summary
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
  if ! command -v nvidia-ctk >/dev/null; then
    short "container GPU" "install nvidia-container-toolkit 1.18 or newer, so podman can pass the card to the media service"
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

summary() {
  echo
  if [ "$failed" -gt 0 ]; then
    echo "$failed requirement(s) not met."
  elif [ "$warned" -gt 0 ]; then
    echo "This machine can run EiN; $warned item(s) are below what is recommended."
  else
    echo "This machine meets the recommended requirements."
  fi
  echo
  echo "The installer itself is not written yet, so nothing was installed."
  echo "Build EiN from source in the meantime: https://einhq.github.io/#start"
  [ "$failed" -eq 0 ]
}

main "$@"
