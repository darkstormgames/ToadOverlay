# ToadOverlay

[![Discord.js](https://img.shields.io/badge/discord.js-v12.2.0-blue.svg?logo=npm)](https://github.com/discordjs)
[![GitHub license](https://img.shields.io/badge/license-GPL--3.0-blue)](https://github.com/darkstormgames/ToadOverlay/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues-raw/darkstormgames/ToadOverlay)](https://github.com/darkstormgames/ToadOverlay/issues)
[![CodeFactor](https://www.codefactor.io/repository/github/darkstormgames/toadoverlay/badge)](https://www.codefactor.io/repository/github/darkstormgames/toadoverlay)

ToadOverlay is an extension bot to [Toad](https://www.mariokartcentral.com/forums/index.php?threads/toadv2-a-discord-bot-for-mk8.532/), a MK8 discord bot and is used as a browser source overlay for streamers to show their current scores live on stream.

## Features

* Fully customizable streaming overlay to keep track of MK scores
* Supports multiple instances per server

## Basic Installation
[![](https://img.shields.io/badge/ToadOverlay-invite-success?logo=discord&colorB=7289DA)](https://discord.com/api/oauth2/authorize?client_id=710403066213433385&permissions=0&scope=bot)

### Setting up your first overlay

1. Make sure the bot has the same permissions on your server as the Toad bot.
2. Execute the command **_setup** in the channel, where you usually use your Toad bot.
3. Add a new browser source in OBS or Streamlabs and use the URL the bot has sent you per DMs.
  * Width: 1000
  * Check the two boxes at the bottom of the page ("Shutdown source when not visible" and "Refresh browser when scene becomes active")
4. Use Toad bot as you are used to.

### Setting up the home and guest team

