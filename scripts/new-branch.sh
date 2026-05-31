#!/usr/bin/env bash
# Create a short-lived working branch from an up-to-date main, following the
# naming convention in CONTRIBUTING.md:  <type>/<short-kebab-summary>
#
# Usage:  ./scripts/new-branch.sh <type> <summary...>
# Example: ./scripts/new-branch.sh feat auth
#          ./scripts/new-branch.sh fix login redirect loop
set -euo pipefail

VALID_TYPES="feat fix chore docs refactor test perf style ci"

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <type> <summary...>" >&2
  echo "  type ∈ { $VALID_TYPES }" >&2
  exit 1
fi

type="$1"; shift
if [[ ! " $VALID_TYPES " == *" $type "* ]]; then
  echo "Invalid type '$type'. Must be one of: $VALID_TYPES" >&2
  exit 1
fi

# Build kebab-case summary from the remaining args.
summary="$(echo "$*" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/^-//;s/-$//')"
branch="${type}/${summary}"

# Refuse to branch with uncommitted changes to avoid carrying WIP across branches.
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is dirty. Commit or stash before branching." >&2
  exit 1
fi

echo "Updating main…"
git switch main
git pull --ff-only 2>/dev/null || echo "(no remote / already up to date)"

echo "Creating branch: $branch"
git switch -c "$branch"
echo "Done. You are now on $branch (from main)."
