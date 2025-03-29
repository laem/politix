#!/bin/bash

basic_allow="--allow-read --allow-net"
env_allow="--allow-env --env-file"

# Bluesky
deno run ${basic_allow} --allow-write=data/bluesky-data.json analyse/analyseBluesky.ts

# Mastodon
deno run ${basic_allow} ${env_allow} --allow-write=data/mastodon-data.json analyse/analyseMastodon.ts

# European Parliament
deno run ${basic_allow} ${env_allow} --allow-write=data/europe-data.json analyse/analyseEurope.ts

# Gouvernement français
deno run ${basic_allow} --allow-env  --allow-write=data/ministres.json,/tmp,$HOME/.cache/astral --allow-run=$HOME/.cache/astral/125.0.6400.0/chrome-linux64/chrome analyse/analyseMinistres.ts

rm -rf $HOME/.cache/astral
