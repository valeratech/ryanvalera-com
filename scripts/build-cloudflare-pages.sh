#!/usr/bin/env bash
# build-cloudflare-pages.sh - assemble the Cloudflare Pages publication directory.
#
# Cloudflare Pages runs this from the repository root:
#   build command           bash scripts/build-cloudflare-pages.sh
#   build output directory  dist
# It copies exactly the website files listed in scripts/cloudflare-pages-files.txt
# into a fresh dist/ and proves the result, so repository documentation and
# configuration (README.md, docs/, scripts/, .github/, dot-files, CNAME) are never
# published. Fail-closed: any discrepancy exits non-zero, Cloudflare Pages then
# publishes nothing, and the previous deployment stays live.
# No network access and no credentials are used.
#
# Changing the website's file set means updating BOTH the allowlist and
# EXPECTED_COUNT below - deliberate double entry.
set -euo pipefail
export LC_ALL=C

LIST="scripts/cloudflare-pages-files.txt"
OUT="dist"
EXPECTED_COUNT=36

fail() {
  echo "build-cloudflare-pages: FAIL - $*" >&2
  exit 1
}

# forbidden() - true for anything that must never be published: any dot-file or
# dot-directory component, Markdown, README, CNAME, and the docs/, scripts/ and
# dist/ trees. Used on allowlist entries and again on the finished output.
forbidden() {
  local l="/${1,,}"
  case "$l" in
    */.*)                        return 0 ;;
    /docs|/docs/*)               return 0 ;;
    /scripts|/scripts/*)         return 0 ;;
    /dist|/dist/*)               return 0 ;;
    *.md|*/readme|*/readme.*)    return 0 ;;
    /cname)                      return 0 ;;
  esac
  return 1
}

[ -f "$LIST" ] && [ ! -L "$LIST" ] || fail "allowlist $LIST missing or not a regular file (run from the repository root)"
ROOT="$(pwd -P)"

# 1. start from a fresh output directory
rm -rf -- "$OUT"
[ ! -e "$OUT" ] || fail "could not remove a previous $OUT"
mkdir -- "$OUT"

# 2-3. consume only the allowlist; validate every entry before copying anything
declare -A seen=()
entries=()
while IFS= read -r p || [ -n "$p" ]; do
  case "$p" in
    "")                       fail "empty line in the allowlist" ;;
    *$'\r'*)                  fail "carriage return in the allowlist (CRLF line endings)" ;;
    *[[:space:]]*)            fail "whitespace in an allowlist entry" ;;
    /*)                       fail "absolute path in the allowlist: $p" ;;
    ..|../*|*/..|*/../*)      fail "path traversal in the allowlist: $p" ;;
    .|./*|*/.|*/./*|*//*|*/)  fail "non-canonical path in the allowlist: $p" ;;
  esac
  if forbidden "$p"; then fail "forbidden path in the allowlist: $p"; fi
  [ -z "${seen[$p]+x}" ] || fail "duplicate allowlist entry: $p"
  seen[$p]=1
  real="$(realpath -e -- "$p" 2>/dev/null)" || fail "missing source path: $p"
  [ "$real" = "$ROOT/$p" ] || fail "source path resolves elsewhere (symbolic link in the path): $p"
  [ -f "$p" ] && [ ! -L "$p" ] || fail "source is not a regular file: $p"
  entries+=("$p")
done < "$LIST"
[ "${#entries[@]}" -eq "$EXPECTED_COUNT" ] || fail "allowlist has ${#entries[@]} entries, expected $EXPECTED_COUNT"

# 4. copy every allowed path, preserving its relative website path
for p in "${entries[@]}"; do
  mkdir -p -- "$OUT/$(dirname -- "$p")"
  cp -- "$p" "$OUT/$p"
done

# 5-6. the generated output path set must equal the allowlist exactly
dist_list="$(cd "$OUT" && find . -mindepth 1 ! -type d -printf '%P\n' | sort)"
want_list="$(printf '%s\n' "${entries[@]}" | sort)"
[ "$dist_list" = "$want_list" ] || fail "the $OUT path set does not equal the allowlist"

# 7. exactly EXPECTED_COUNT regular files, nothing else, each identical to its source
n_files="$(find "$OUT" -type f | wc -l)"
n_other="$(find "$OUT" -mindepth 1 ! -type f ! -type d | wc -l)"
[ "$n_files" -eq "$EXPECTED_COUNT" ] || fail "expected $EXPECTED_COUNT regular files in $OUT, found $n_files"
[ "$n_other" -eq 0 ] || fail "$OUT contains $n_other non-regular objects"
for p in "${entries[@]}"; do
  [ "$(sha256sum < "$p")" = "$(sha256sum < "$OUT/$p")" ] || fail "copy differs from its source: $p"
done

# 8. independently of the checks above: nothing forbidden in the finished output
while IFS= read -r q; do
  if forbidden "$q"; then fail "forbidden object in $OUT: $q"; fi
done < <(cd "$OUT" && find . -mindepth 1 -printf '%P\n')

# proof lines for the deployment log
list_sha="$(sha256sum < "$LIST" | cut -d' ' -f1)"
manifest_sha="$(cd "$OUT" && find . -type f -printf '%P\n' | sort | while IFS= read -r f; do
  printf '%s  %s\n' "$(sha256sum < "$f" | cut -d' ' -f1)" "$f"
done | sha256sum | cut -d' ' -f1)"
echo "build-cloudflare-pages: allowlist $LIST - $EXPECTED_COUNT entries, sha256 $list_sha"
echo "build-cloudflare-pages: $OUT path set equals the allowlist; $n_files regular files, each identical to its source"
echo "build-cloudflare-pages: no Markdown, README, CNAME, docs/, scripts/, dist/ or dot-files in $OUT"
echo "build-cloudflare-pages: content manifest sha256 $manifest_sha"
echo "build-cloudflare-pages: OK"
