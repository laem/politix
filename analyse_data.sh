#!/bin/bash

basic_allow="--allow-read --allow-net"
env_allow="--allow-env --env-file"

# Bluesky
deno run ${basic_allow} --allow-write=data/bluesky-data.json analyse/analyseBluesky.ts

# Mastodon
deno run ${basic_allow} ${env_allow} --allow-write=data/mastodon-data.json analyse/analyseMastodon.ts

# European Parliament
deno run ${basic_allow} ${env_allow} --allow-write=data/europe-data.json analyse/analyseEurope.ts
