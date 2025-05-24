#!/bin/bash

basic_allow="--allow-read --allow-net"
env_allow="--allow-env --env-file"

# Bluesky
deno run ${basic_allow} --allow-write=data/bluesky-data.json analyse/analyseBluesky.ts

# Mastodon
deno run ${basic_allow} ${env_allow} --allow-write=data/mastodon-data.json analyse/analyseMastodon.ts

# European Parliament
deno run ${basic_allow} ${env_allow} --allow-write=data/europe-data.json analyse/analyseEurope.ts


# Début de l'analyse des comptes sur X
rm -rf $HOME/.cache/astral

# Parlementaires français
deno run ${basic_allow} --allow-env --allow-write=data/x-data.json,/tmp,$HOME/.cache/astral --allow-run analyse/analyse.ts

# Gouvernement français
deno run ${basic_allow} --allow-env --allow-write=data/ministres.json,/tmp,$HOME/.cache/astral --allow-run analyse/analyseMinistres.ts

# Fin de l'analyse des comptes sur X
rm -rf $HOME/.cache/astral
