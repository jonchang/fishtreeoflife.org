#!/usr/bin/env bash
#
# Fetch the build data from the fishtreeoflife-docker data image and place it
# where the Astro site expects it:
#
#   image /_data/, /_fossils/  ->  data/_data/, data/_fossils/   (build input, never served)
#   image /downloads/          ->  public/downloads/
#   image /assets/img/         ->  public/assets/img/            (generated vertical_tree*.png)
#
# All of these destinations are gitignored, except the two tracked files in
# public/downloads/ (final_alignment.partitions, front-page-tree@1x.png).
#
# Usage:
#   scripts/fetch-data.sh                 # docker if the daemon is up (as in CI), else skopeo
#   scripts/fetch-data.sh --from DIR      # use an already-extracted image root
#                                         # (a directory holding _data/, _fossils/, downloads/, assets/img/)
#
# Set IMAGE to fetch a different tag, e.g. IMAGE=ghcr.io/jonchang/fishtreeoflife-docker:latest

set -euo pipefail

IMAGE="${IMAGE:-ghcr.io/jonchang/fishtreeoflife-docker:master}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
    sed -n '2,/^$/s/^# \{0,1\}//p' "${BASH_SOURCE[0]}" >&2
    exit "${1:-0}"
}

from=""
while [ $# -gt 0 ]; do
    case "$1" in
        --from) from="${2:?--from needs a directory}"; shift 2 ;;
        --from=*) from="${1#--from=}"; shift ;;
        -h|--help) usage 0 ;;
        *) echo "fetch-data.sh: unknown argument: $1" >&2; usage 1 ;;
    esac
done

tmp="$(mktemp -d "${TMPDIR:-/tmp}"/fishtree-data.XXXXXX)"
cid=""
cleanup() {
    if [ -n "$cid" ]; then docker rm "$cid" >/dev/null || true; fi
    rm -rf "$tmp"
}
trap cleanup EXIT

fetch_docker() {
    echo "Fetching $IMAGE with docker" >&2
    docker pull "$IMAGE"
    cid="$(docker create "$IMAGE" /bin/true)"
    mkdir -p "$tmp/root/assets"
    docker cp "$cid:/_data" "$tmp/root/_data"
    docker cp "$cid:/_fossils" "$tmp/root/_fossils"
    docker cp "$cid:/downloads" "$tmp/root/downloads"
    docker cp "$cid:/assets/img" "$tmp/root/assets/img"
}

fetch_skopeo() {
    echo "Docker daemon not available; fetching $IMAGE with skopeo" >&2
    skopeo --override-os linux --override-arch amd64 copy "docker://$IMAGE" "dir:$tmp/image"
    mkdir -p "$tmp/root"
    # The first layer is the alpine base image; the data lives in the layers above it.
    local layers
    layers="$(node -e '
        const m = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
        for (const l of m.layers.slice(1)) console.log(l.digest.replace(/^sha256:/, ""));
    ' "$tmp/image/manifest.json")"
    local digest entry
    for digest in $layers; do
        # Apply OCI whiteouts (deletions recorded by this layer) before unpacking it.
        while IFS= read -r entry; do
            entry="${entry#./}"
            case "$(basename "$entry")" in
                .wh..wh..opq) rm -rf "${tmp:?}/root/$(dirname "$entry")"/* ;;
                .wh.*) rm -rf "${tmp:?}/root/$(dirname "$entry")/$(basename "$entry" | sed 's/^\.wh\.//')" ;;
            esac
        done < <(tar -tf "$tmp/image/$digest" | grep '\.wh\.' || true)
        tar -xf "$tmp/image/$digest" -C "$tmp/root"
    done
    find "$tmp/root" -name '.wh.*' -exec rm -rf {} +
}

if [ -n "$from" ]; then
    src="$(cd "$from" && pwd)"
    echo "Using extracted image data from $src" >&2
elif command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    fetch_docker
    src="$tmp/root"
elif command -v skopeo >/dev/null 2>&1; then
    fetch_skopeo
    src="$tmp/root"
else
    echo "fetch-data.sh: need a running docker daemon, skopeo, or --from DIR" >&2
    exit 1
fi

for d in _data _fossils downloads assets/img; do
    if [ ! -d "$src/$d" ]; then
        echo "fetch-data.sh: $src/$d is missing; is this the data image?" >&2
        exit 1
    fi
done

cd "$ROOT"

# data/ is fully owned by this script, so replace it wholesale.
rm -rf data/_data data/_fossils
mkdir -p data public/downloads public/assets/img
cp -R "$src/_data" data/_data
cp -R "$src/_fossils" data/_fossils

# public/ also holds tracked files, so merge rather than replace.
cp -R "$src/downloads/." public/downloads/
cp -R "$src/assets/img/." public/assets/img/

echo "Data placed in data/, public/downloads/ and public/assets/img/" >&2
