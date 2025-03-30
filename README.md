# Politix

Politix https://politix.top analyses MPs' activity on X, Bluesky and Mastodon.

### Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

### Analyse data

Just run :

```
deno task analyse_data
```

Add the following variable to the hidden .env file in the form :

```
NAME=value
```

- BLUESKY_APP_ACCOUNT : name of your Bluesky account (to analyse the top Bluesky Fr)
- BLUESKY_APP_PASSWORD : password of your Bluesky account (same)
- MASTODON_SERVER : server of your Mastodon account
- MASTODON_TOKEN : token given by Mastodon in Development section of your account preferences (to speed up analysis on Mastodon)
