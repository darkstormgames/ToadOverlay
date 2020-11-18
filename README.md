<img width="140" height="150" align="left" style="float: left; margin: 0 10px 0 0;" alt="ToadOverlay" src="http://toad.darkstormgames.de/images/tip-toad1.png">  

# ToadOverlay

[![Discord.js](https://img.shields.io/badge/discord.js-v12.2.0-blue.svg?logo=npm)](https://github.com/discordjs)
[![GitHub license](https://img.shields.io/badge/license-GPL--3.0-blue)](https://github.com/darkstormgames/ToadOverlay/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues-raw/darkstormgames/ToadOverlay)](https://github.com/darkstormgames/ToadOverlay/issues)
[![CodeFactor](https://www.codefactor.io/repository/github/darkstormgames/toadoverlay/badge)](https://www.codefactor.io/repository/github/darkstormgames/toadoverlay)



ToadOverlay is an extension bot to [Toad](https://www.mariokartcentral.com/forums/index.php?threads/toadv2-a-discord-bot-for-mk8.532/), a MK8 discord bot and is used as a browser source overlay for competitive Mario Kart streamers to show their current scores live on stream.
The bot is written from scratch in JavaScript based on the [Discord.js](https://github.com/discordjs) framework for Node.js and is currently hosted on a random Windows 8 tablet, I still had lying around, until I can safely afford proper hosting.

<img height="120" align="left" style="float: left; margin: 0 10px 0 0;" alt="ToadOverlay" src="http://hosting133705.a2f81.netcup.net/toad.darkstormgames/images/overlay_sample.gif"> 

## Features

* Fully customizable streaming overlay to keep track of scores in competitive Mario Kart matches
* Works as an extension to [Toad bot](https://www.mariokartcentral.com/forums/index.php?threads/toadv2-a-discord-bot-for-mk8.532/)
* Supports multiple instances per server (just like Toad bot)

## Basic Installation
[![](https://img.shields.io/badge/ToadOverlay-invite-success?logo=discord&colorB=7289DA)](https://discord.com/api/oauth2/authorize?client_id=710403066213433385&permissions=0&scope=bot)

### Setting up your first overlay

1. Make sure the bot has the same permissions on your server as the Toad bot.
2. Execute the command `_setup` in the channel, where you usually use your Toad bot.
3. Add a new browser source in OBS or Streamlabs and use the URL the bot has sent you per DMs.
  * Width: 1000
  * Check the two boxes at the bottom of the page ("Shutdown source when not visible" and "Refresh browser when scene becomes active")
4. Use Toad bot as you are used to.

### Setting up the home and guest team
#### Set home team (for each channel separately)

1. Go to the [registry on mariokartcentral](https://www.mariokartcentral.com/mkc/registry/teams/category/150cc) and look for your own team.
2. Copy the URL to your team or note the id (the number at the end of the URL).
3. Go to the discord channel you have executed the `_setup` command in and use one of the following commands:
  * `_home mkc-url` (replace "mkc-url" with the copied URL) **Example:** `_home https://www.mariokartcentral.com/mkc/registry/teams/1064`
  * `_home mkc-id` (replace "mkc-id" with the noted id of your team) **Example:** `_home 1064`
4. Wait a few seconds, until the bot fetches all data from the profile.
  * If the bot hasn't updated anything in ~30 seconds, try it again, because the bot might have crashed...
  
#### Set guest team (for each channel separately)
1. Execute the same steps as you would for the home team, but replace `_home` with `_guest`.
2. The overlay should be updated after a few seconds.

### Just use Toad bot, as you're used to 

## Additional help
After setting up your overlay, you can just write `help` in the DMs with the bot, to get some basic help on commands.
For more help on using the commands and editing the overlay, refer to the (still empty) [wiki of this repository](https://github.com/darkstormgames/ToadOverlay/wiki).
