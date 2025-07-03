# ToadOverlay Commands Documentation

<img width="140" height="150" align="left" style="float: left; margin: 0 10px 0 0;" alt="ToadOverlay" src="http://toad.darkstormgames.de/images/to_toad.jpg">

Complete reference guide for all ToadOverlay bot commands. ToadOverlay is an extension bot to [Toad](https://www.mariokartcentral.com/forums/index.php?threads/toadv2-a-discord-bot-for-mk8.532/) that provides customizable browser source overlays for competitive Mario Kart streamers.

<br clear="left"/>

---

## Table of Contents

1. [🚀 Quick Start Guide](#-quick-start-guide)
2. [🏠 Guild Commands](#-guild-commands)
   - [Setup Commands](#setup-commands)
   - [Team Configuration](#team-configuration)
   - [Overlay Overrides](#overlay-overrides)
   - [Scheduling](#scheduling)
   - [Utilities](#utilities)
3. [📨 Direct Message Commands](#-direct-message-commands)
4. [🤖 Bot Integration](#-bot-integration)
5. [🔧 Advanced Usage](#-advanced-usage)
6. [❓ Troubleshooting](#-troubleshooting)
7. [📚 Reference](#-reference)

---

## 🚀 Quick Start Guide

### Essential Setup Steps

1. **Invite the bot** to your server with the same permissions as Toad bot
2. **Set up your overlay** with `_setup` in the channel where you use Toad
3. **Configure teams** using `_home` and `_guest` commands
4. **Add to OBS** using the URL sent to your DMs
5. **Customize** your overlay via DM commands (optional)

### Command Format

- **Guild Commands**: Use `_` prefix (e.g., `_setup`, `_home`)
- **DM Commands**: No prefix needed, use format `command [content]` (e.g., `html [content]`)
- **Help**: Use `_help` or `_?` for general help, `_help command` for specific command help

### Required Permissions

**For Basic Functionality:**
- Send Messages
- Read Message History
- Use External Emojis

**For Enhanced Features:**
- Embed Links (for war scheduling)
- Add Reactions (for war scheduling)
- Manage Messages (for reaction cleanup)

---

## 🏠 Guild Commands

Guild commands are executed in Discord server channels and affect overlays for that specific channel.

### Setup Commands

#### `_setup` / `_setup-overlay`
**Description:** Creates a new overlay for the current channel or resends existing overlay URL.

**Syntax:** `_setup [help]`

**Examples:**
```
_setup
_setup help
```

**Behavior:**
- First time: Creates overlay and sends setup instructions + URL to DMs
- Existing overlay: Resends URL to DMs
- With `help`: Shows detailed setup information

**Notes:**
- Each user can have one overlay per channel
- URLs are unique per user/channel combination

#### `_status`
**Description:** Shows current bot status and implemented features.

**Syntax:** `_status`

**Examples:**
```
_status
```

**What it shows:**
- List of working commands
- Current limitations
- Development status

#### `_help` / `_?`
**Description:** Provides help information for commands.

**Syntax:** 
- `_help` - Basic command list
- `_?` - Complete help overview
- `_help [command]` - Specific command help

**Examples:**
```
_help
_?
_help setup
_help home
```

---

### Team Configuration

#### `_home` / `_setmkc-home`
**Description:** Sets the home team using MarioKartCentral team data.

**Syntax:** `_home [mkc-team-id|mkc-url|help]`

**Aliases:** `setmkchome`, `set-home`, `sethome`, `mkc-home`, `mkchome`

**Examples:**
```
_home 1064
_home https://www.mariokartcentral.com/mkc/registry/teams/1064
_home help
```

**Parameters:**
- `mkc-team-id`: Numeric team ID from MKC registry
- `mkc-url`: Full URL to MKC team page
- `help`: Shows detailed usage information

**Notes:**
- Automatically fetches team name, tag, and logo from MKC
- Overwrites any existing home team data
- May take a few seconds to update

#### `_guest` / `_setmkc-guest`
**Description:** Sets the guest team using MarioKartCentral team data.

**Syntax:** `_guest [mkc-team-id|mkc-url|help]`

**Aliases:** `setmkcguest`, `set-guest`, `setguest`, `mkc-guest`, `mkcguest`

**Examples:**
```
_guest 100
_guest https://www.mariokartcentral.com/mkc/registry/teams/100
_guest help
```

**Parameters:**
- Same as `_home` command
- Sets guest team instead of home team

---

### Overlay Overrides

Use these commands to override team data with custom information, useful for unregistered subclans or custom branding.

#### Logo Commands

##### `_setlogo-home` / `_hlogo`
**Description:** Sets custom logo for home team.

**Syntax:** `_setlogo-home [url]` or upload image with command

**Aliases:** `hsetlogo`, `hlogo`, `logo-home`

**Examples:**
```
_hlogo https://example.com/logo.png
_hlogo (with image attachment)
_hlogo (empty - removes logo)
```

**Parameters:**
- `url`: Direct link to image
- Image upload: Attach image to Discord message
- Empty: Removes custom logo

##### `_setlogo-guest` / `_glogo`
**Description:** Sets custom logo for guest team.

**Syntax:** `_setlogo-guest [url]` or upload image with command

**Aliases:** `gsetlogo`, `glogo`, `logo-guest`

**Examples:**
```
_glogo https://example.com/logo.png
_glogo (with image attachment)
_glogo (empty - removes logo)
```

#### Name Commands

##### `_setname-home` / `_hname`
**Description:** Sets custom full name for home team.

**Syntax:** `_setname-home [team name]`

**Aliases:** `hsetname`, `hname`, `name-home`

**Examples:**
```
_hname Team Rocket
_setname-home Bowser's Minions
```

##### `_setname-guest` / `_gname`
**Description:** Sets custom full name for guest team.

**Syntax:** `_setname-guest [team name]`

**Aliases:** `gsetname`, `gname`, `name-guest`

**Examples:**
```
_gname Team Plasma
_setname-guest Mario's Heroes
```

#### Tag Commands

##### `_settag-home` / `_htag`
**Description:** Sets custom tag/abbreviation for home team.

**Syntax:** `_settag-home [tag]`

**Aliases:** `hsettag`, `htag`, `tag-home`

**Examples:**
```
_htag RKT
_settag-home BMW
```

##### `_settag-guest` / `_gtag`
**Description:** Sets custom tag/abbreviation for guest team.

**Syntax:** `_settag-guest [tag]`

**Aliases:** `gsettag`, `gtag`, `tag-guest`

**Examples:**
```
_gtag PLM
_settag-guest MRO
```

**Notes for Override Commands:**
- Override commands clear MKC URL data
- Use these for teams not registered on MKC
- Changes are immediate but may require overlay refresh

---

### Scheduling

#### `_war` / `_schedulewar`
**Description:** Creates interactive war schedule embeds with reaction-based signup.

**Syntax:** 
- `_war` - Schedule with default times
- `_war [time1] [time2] ...` - Schedule specific times
- `_war setdefault [times]` - Set new default times
- `_war settimeout [hours]` - Set schedule validity timeout

**Examples:**
```
_war
_war 19 20 21
_war 7pm 8pm 9pm
_war 22:30 23:00
_war setdefault 19 20 21 22
_war settimeout 24
```

**Time Formats:**
- 24-hour: `19`, `20:30`, `23:45`
- 12-hour: `7pm`, `8:30pm`, `11am`

**Reaction System:**
- ✅ Can play
- ❕ Substitute
- ❔ Not sure
- ❌ Cannot play / Dropped

**Required Permissions:**
- Send Messages
- Embed Links
- Add Reactions
- Read Message History
- Manage Messages (optional, for reaction cleanup)

#### `_track` / `_tracktable`
**Description:** Displays track table images for Mario Kart 8 Deluxe tracks.

**Syntax:** `_track [track-abbreviation]`

**Examples:**
```
_track mks
_track rDKJ
_track BC
```

**Track Abbreviations:** All MK8DX tracks supported (case insensitive)
- **Mushroom Cup:** mks, wp, ssc, tr
- **Flower Cup:** mc, th, tm, sgf
- **Star Cup:** sa, ds, ed, mw
- **Crown Cup:** cc, bdd, bc, rr
- And many more...

**Notes:**
- Case insensitive (`MKS` = `mks`)
- All DLC tracks included
- Images hosted externally

---

### Utilities

Commands referenced in help system but may not be fully implemented:

#### `_delete` / `_delete-overlay` ⚠️
**Description:** *Referenced in help but implementation status unclear*

**Expected Syntax:** `_delete [@user]`

**Expected Behavior:**
- Delete your own overlay: `_delete`
- Delete another's overlay: `_delete @user` (requires KICK_MEMBERS permission)

#### `_reset` / `_reset-scores` ⚠️
**Description:** *Referenced in help but implementation status unclear*

**Expected Syntax:** `_reset`

**Expected Behavior:**
- Reset current scores to 0-0
- Alternative to starting new war with Toad

**Note:** ⚠️ These commands are mentioned in help texts but may not be fully implemented. Check with `_status` command for current implementation status.

---

## 📨 Direct Message Commands

Direct message commands are sent privately to the bot and affect all your overlays across all channels.

### Command Format
All DM commands use the format: `command [content in square brackets]`

#### `html` / `sethtml`
**Description:** Sets custom HTML content for your overlay.

**Syntax:** `html [HTML content]`

**Aliases:** `sethtml`

**Examples:**
```
html [<div class="custom">My Custom Overlay</div>]
sethtml [<h1>Tournament Stream</h1><p>Round 1</p>]
```

**Notes:**
- Content must be enclosed in square brackets
- HTML is sanitized for security
- Supports most HTML tags and attributes
- Changes apply to all your overlays

#### `style` / `css`
**Description:** Sets custom CSS styles for your overlay.

**Syntax:** `style [CSS content]`

**Aliases:** `css`, `setstyle`

**Examples:**
```
style [.home-team { color: red; } .guest-team { color: blue; }]
css [body { background: linear-gradient(45deg, #ff0000, #0000ff); }]
```

**Notes:**
- Content must be enclosed in square brackets
- Standard CSS syntax supported
- Changes apply to all your overlays
- Can override default styling

#### `img` / `image`
**Description:** Sets background image URL for your overlay.

**Syntax:** `img [image-url]`

**Aliases:** `image`, `setimage`

**Examples:**
```
img [https://example.com/background.jpg]
image [https://i.imgur.com/example.png]
img [] (empty - removes background)
```

**Notes:**
- Must be direct link to image file
- Supports most image formats (jpg, png, gif, etc.)
- Empty brackets remove background image
- Image is set as CSS background

#### `help`
**Description:** Shows comprehensive help information in DMs.

**Syntax:** `help`

**Aliases:** `gethelp`

**Examples:**
```
help
```

**Response:**
- Sends two detailed help embeds
- Page 1: General commands (setup, teams, etc.)
- Page 2: Overlay customization commands

---

## 🤖 Bot Integration

These commands are automatically triggered by Toad bot messages and don't require manual execution.

### Automatic Score Updates

#### War Start Detection
**Trigger:** When Toad bot sends "Started MK" or "started war between" message

**Behavior:**
- Automatically resets overlay scores to 0-0
- Prepares overlay for new match tracking
- Logs war start event

#### Score Updates
**Trigger:** When Toad bot sends "Total Score after Race" embed

**Behavior:**
- Extracts scores from Toad's embed
- Updates overlay scores in real-time
- Maintains score history during match

**Requirements:**
- Toad bot must be active in the same channel
- ToadOverlay must have same permissions as Toad
- Both bots must be able to read each other's messages

---

## 🔧 Advanced Usage

### Multi-Channel Setup

Each user can have separate overlays for different channels:

1. Run `_setup` in each channel where you want an overlay
2. Configure teams separately for each channel using `_home` and `_guest`
3. Each overlay gets its own unique URL
4. DM customizations (HTML/CSS/background) apply to all overlays

### Streaming Setup Workflow

#### Initial Setup
1. **Bot Setup:** `_setup` in your streaming channel
2. **Team Configuration:** `_home [your-team]` and `_guest [opponent-team]`
3. **OBS Configuration:**
   - Add Browser Source
   - Use URL from bot DMs
   - Width: 1000px, Height: 120-150px
   - Enable "Shutdown source when not visible"
   - Enable "Refresh browser when scene becomes active"

#### Match Day Workflow
1. **Update Teams:** Use `_home` and `_guest` for new opponents
2. **Schedule Wars:** Use `_war` commands for match scheduling
3. **Start Streaming:** Scores update automatically via Toad integration
4. **Team Switching:** Update teams between matches as needed

### Customization Best Practices

#### HTML Customization
- Keep HTML semantic and clean
- Use class names for styling hooks
- Test changes in a development environment first

#### CSS Customization
- Use specific selectors to avoid conflicts
- Consider responsive design for different overlay sizes
- Test with different team name lengths

#### Background Images
- Use high-resolution images for crisp display
- Consider overlay content contrast
- Host images on reliable services

---

## ❓ Troubleshooting

### Common Issues

#### "No response from bot"
**Possible Causes:**
- Bot lacks permissions in channel
- Command syntax error
- Bot may be offline

**Solutions:**
1. Check bot has Send Messages permission
2. Verify command syntax (use `_help`)
3. Try `_status` to test bot responsiveness

#### "Can't receive DM/overlay URL"
**Possible Causes:**
- DMs disabled from server members
- Bot blocked
- Privacy settings

**Solutions:**
1. Enable DMs from server members
2. Unblock bot if previously blocked
3. Check Discord privacy settings

#### "Overlay not updating"
**Possible Causes:**
- Browser source cache
- Incorrect URL
- Bot connection issues

**Solutions:**
1. Refresh browser source in OBS
2. Verify URL is correct and current
3. Try `_setup` to get fresh URL

#### "Scores not updating automatically"
**Possible Causes:**
- Toad bot not in same channel
- Missing bot permissions
- Toad bot using different format

**Solutions:**
1. Ensure both bots in same channel
2. Check Read Message History permission
3. Verify Toad bot is working correctly

#### "Team data not loading from MKC"
**Possible Causes:**
- Invalid team ID/URL
- MKC website issues
- Network connectivity

**Solutions:**
1. Verify team ID exists on MKC
2. Try again after a few minutes
3. Use override commands as fallback

### Permission Troubleshooting

#### Required Basic Permissions
- ✅ Send Messages
- ✅ Read Message History
- ✅ Use External Emojis

#### Enhanced Feature Permissions
- ✅ Embed Links (for war scheduling)
- ✅ Add Reactions (for war scheduling)
- ✅ Manage Messages (for reaction cleanup)

#### Missing Permission Symptoms
- Commands not responding → Send Messages
- Can't see command history → Read Message History
- War embeds not showing → Embed Links
- Can't add reactions → Add Reactions

---

## 📚 Reference

### Complete Command List

#### Guild Commands (Use in server channels)
| Command | Aliases | Description |
|---------|---------|-------------|
| `_setup` | `setup-overlay` | Create/resend overlay |
| `_status` | - | Show bot status |
| `_help` | `?` | Get help information |
| `_home` | `setmkc-home`, `setmkchome`, `set-home`, `sethome`, `mkc-home`, `mkchome` | Set home team from MKC |
| `_guest` | `setmkc-guest`, `setmkcguest`, `set-guest`, `setguest`, `mkc-guest`, `mkcguest` | Set guest team from MKC |
| `_setlogo-home` | `hsetlogo`, `hlogo`, `logo-home` | Set custom home logo |
| `_setlogo-guest` | `gsetlogo`, `glogo`, `logo-guest` | Set custom guest logo |
| `_setname-home` | `hsetname`, `hname`, `name-home` | Set custom home name |
| `_setname-guest` | `gsetname`, `gname`, `name-guest` | Set custom guest name |
| `_settag-home` | `hsettag`, `htag`, `tag-home` | Set custom home tag |
| `_settag-guest` | `gsettag`, `gtag`, `tag-guest` | Set custom guest tag |
| `_war` | `schedulewar` | Schedule wars with reactions |
| `_track` | `tracktable` | Show track table images |

#### Direct Message Commands (Use in DMs with bot)
| Command | Aliases | Description |
|---------|---------|-------------|
| `html` | `sethtml` | Set custom HTML content |
| `style` | `css`, `setstyle` | Set custom CSS styles |
| `img` | `image`, `setimage` | Set background image |
| `help` | `gethelp` | Get detailed help |

#### Automatic Commands (Triggered by Toad bot)
| Trigger | Description |
|---------|-------------|
| "Started MK" | Reset scores to 0-0 |
| "Total Score after Race" | Update scores from embed |

### Quick Reference Cards

#### New User Setup
```
1. _setup                    # Create overlay
2. _home [team-id]          # Set home team  
3. _guest [team-id]         # Set guest team
4. Add URL to OBS           # Use URL from DMs
```

#### Team Management
```
# MKC Teams
_home 1064                  # From team ID
_home https://mkc.../teams/1064  # From URL

# Custom Teams  
_setname-home Team Name     # Custom name
_settag-home TAG           # Custom tag
_setlogo-home [image-url]  # Custom logo
```

#### Overlay Customization
```
# In DMs with bot
html [<div>Custom HTML</div>]
style [.team { color: red; }]
img [https://example.com/bg.jpg]
```

### External Resources

- **MKC Team Registry:** https://www.mariokartcentral.com/mkc/registry/teams/
- **Official Tutorial:** https://www.mariokartcentral.com/forums/index.php?threads/toadoverlay-an-extension-bot-to-toad-for-streamers-and-more.10749/
- **Toad Bot Information:** https://www.mariokartcentral.com/forums/index.php?threads/toadv2-a-discord-bot-for-mk8.532/

### Support

For additional help or bug reports:
- DM `rollo_dev` on Discord
- Check the `_status` command for current limitations
- Refer to the MKC tutorial for detailed setup guides

---

*© darkstormgames 2025 - ToadOverlay Documentation*
