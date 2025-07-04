<img width="140" height="150" align="left" style="float: left; margin: 0 10px 0 0;" alt="ToadOverlay" src="http://toad.darkstormgames.de/images/to_toad.jpg">  

# ToadOverlay

[![Discord.js](https://img.shields.io/badge/discord.js-v13.1.0-blue.svg?logo=npm)](https://github.com/discordjs)
[![GitHub license](https://img.shields.io/badge/license-GPL--3.0-blue)](https://github.com/darkstormgames/ToadOverlay/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues-raw/darkstormgames/ToadOverlay)](https://github.com/darkstormgames/ToadOverlay/issues)
[![CodeFactor](https://www.codefactor.io/repository/github/darkstormgames/toadoverlay/badge)](https://www.codefactor.io/repository/github/darkstormgames/toadoverlay)

ToadOverlay is an extension bot to [Toad](https://www.mariokartcentral.com/forums/index.php?threads/toadv2-a-discord-bot-for-mk8.532/), a MK8 discord bot and is used as a browser source overlay for competitive Mario Kart streamers to show their current scores live on stream.
The bot is written from scratch in JavaScript based on the [Discord.js](https://github.com/discordjs) framework for Node.js.

<img height="120" align="left" style="float: left; margin: 0 10px 0 0;" alt="ToadOverlay" src="http://hosting133705.a2f81.netcup.net/toad.darkstormgames/images/overlay_sample.gif"> 

## Features

* Fully customizable streaming overlay to keep track of scores in competitive Mario Kart matches
* Works as an extension to [Toad bot](https://www.mariokartcentral.com/forums/index.php?threads/toadv2-a-discord-bot-for-mk8.532/)
* Supports multiple instances per server (just like Toad bot)
* Interactive war scheduling with reaction-based signup system
* Real-time score updates via Toad bot integration
* Custom HTML/CSS overlay styling and branding

## 📚 Documentation

For complete command reference and advanced usage, see **[COMMANDS.md](COMMANDS.md)** - our comprehensive documentation covering all bot features, commands, and tutorials.

## Basic Installation
[![](https://img.shields.io/badge/ToadOverlay-invite-success?logo=discord&colorB=7289DA)](https://discord.com/api/oauth2/authorize?client_id=710403066213433385&permissions=0&scope=bot)

### Setting up your first overlay

1. Make sure the bot has the same permissions on your server as the Toad bot.
2. Execute the command `_setup` in the channel, where you usually use your Toad bot.
3. Add a new browser source in OBS or Streamlabs and use the URL the bot has sent you per DMs.
  * Width: 1000
  * Height: ~120-150
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

## Using custom team data
If you want to use this overlay for a subclan that isn't registered on MKC, you can do so by just overriding the data with the following commands:

| Command | Parameter type | Description |
| --- | --- | --- |
| `_setlogo-home` | IMAGE/URL/EMPTY | Upload an image with the command as text, or use an URL to your logo. Leaving any sort of parameter empty just removes the image URL |
| `_setlogo-guest` | IMAGE/URL/EMPTY | Upload an image with the command as text, or use an URL to your logo. Leaving any sort of parameter empty just removes the image URL |
| `_setname-home` | TEXT | Just pass the name of the team as text |
| `_setname-guest` | TEXT | Just pass the name of the team as text |
| `_settag-home` | TEXT | Just pass the tag used as text |
| `_settag-guest` | TEXT | Just pass the tag used as text |

## Additional help
After setting up your overlay, you can just write `help` in the DMs with the bot, to get some basic help on commands.
For more help on using the commands and editing the overlay, refer to **[COMMANDS.md](COMMANDS.md)** for complete documentation or the **[official tutorial post on MKC](https://www.mariokartcentral.com/forums/index.php?threads/toadoverlay-an-extension-bot-to-toad-for-streamers-and-more.10749/)**.

----------------------------

[![Twitter](https://img.shields.io/twitter/follow/darkstormgames?logo=twitter)](https://twitter.com/darkstormgames) | [![Twitch](http://img.shields.io/twitch/status/rollo_dev)](https://twitch.tv/rollo_dev)
