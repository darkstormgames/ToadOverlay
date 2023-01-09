const CommandTexts = {
    // user-commands
    SetupOverlay:   'Setting up a new overlay / Resending the overlay-URL:\n' +
                    'Just type `_setup-overlay` or `_setup` to get started.\n' +
                    '```' + 
                    'Sets up a new overlay for the channel, this command has been executed in.\n' +
                    'If there already is an overlay for your account in the executed channel, the bot tries to resend the overlay-URL to your direct messages.' + 
                    '```' +
                    '',
    DeleteOverlay:  'Deleting an overlay:\n' +
                    '```' +
                    'Deleting your own overlay:\n' +
                    '  _delete-overlay\n' +
                    '  _delete\n\n' +
                    'Deleting another\'s overlay:\n' +
                    '  _delete-overlay @UserToDeleteOverlay\n' +
                    '  _delete @UserToDeleteOverlay\n' +
                    '  To delete the overlay of another user, you need to have at least the "KICK MEMBERS" permission on your server.' +
                    '```' +
                    '',
    ResetOverlay:   'Reset scores on the overlay:\n' +
                    'Just type `_reset-scores` or `_reset` to reset scores.\n' +
                    '```' +
                    'Resets the scores displayed on the overlay back to zero.\n' +
                    'Starting a new war through Toad bot also resets the scores.' +
                    '```' +
                    '',
    MKCSetTeam: 'Setting the {{team}} team:\n' +
                '```' +
                '_setmkc-{{team}} [mkc-team-id or -url]\n' +
                '_{{team}} [mkc-team-id or -url]\n' +
                '  Example: _{{team}} 1324\n' +
                '  or:   _{{team}} https://www.mariokartcentral.com/mkc/registry/teams/1324' +
                '```' +
                'This command is also available as slash-command without the need to search for the team on the MKC registry.\n' +
                'Just type `/{{team}}`, send the message and click your way through. (Both bot and users need the permission "USE APPLICATION COMMANDS" for this feature)',
    
    // override-commands
    OverrideLogo:   'Override the displayed image on the overlay for the {{team}} team:\n' +
                    '```' +
                    'Removing the image:\n' +
                    '  _setlogo-{{team}}\n' +
                    '  _{{prefix}}logo\n\n' +
                    'Setting a custom image from an URL:\n' +
                    '  _setlogo-{{team}} https://toad.darkstormgames.de/images/to_toad.jpg\n' +
                    '  _{{prefix}}logo https://toad.darkstormgames.de/images/to_toad.jpg\n\n' +
                    'Setting a custom image from file:\n' +
                    '  Upload an image through discord and set the image text to one of the following:\n' +
                    '    _setlogo-{{team}}\n' +
                    '    _{{prefix}}logo' +
                    '```' +
                    '',
    OverrideName:   'Override the displayed full name on the overlay for the {{team}} team:\n' +
                    '```' +
                    'Sets a custom full name for the {{team}} team.\n' +
                    '  _setname-{{team}} Some random Teamname\n' +
                    '  _{{prefix}}name Some random Teamname' +
                    '```' +
                    '',
    OverrideTag:    'Override the displayed tag on the overlay for the {{team}} team:\n' +
                    '```' +
                    'Sets a custom tag for the {{team}} team.\n' +
                    '  _setname-{{team}} TAG\n' +
                    '  _{{prefix}}tag TAG' +
                    '```' +
                    '',

    // other commands
    ScheduleWar:    'Scheduling matches:\n' +
                    '```' +
                    'Schedule matches as per set default times:\n' +
                    '  _schedulewar\n' +
                    '  _war\n\n' +
                    'Schedule matches with specific times:\n' +
                    '  _schedulewar 22 23 12am 1am\n' +
                    '  _war 8pm 9pm 10:15pm 23:30' +
                    '```' +
                    'This command relies on embeds. This means, that the bot needs to have the "EMBED LINKS" permission to work.\n' +
                    'The bot tries to automatically remove reactions from users, so that they don\'t need to do it themselves, but needs the "MANAGE MESSAGES" permission to do so.\n' +
                    'For more information on all permissions needed, refer to the tutorial on MKC:\nhttps://www.mariokartcentral.com/forums/index.php?threads/toadoverlay-an-extension-bot-to-toad-for-streamers-and-more.10749/',
    ScheduleWarDefault: 'Setting new default times:\n' +
                        '```' +
                        'Sets new default times, the command "_war" uses without parameters in the channel, both commands have been executed.\n' +
                        '  _schedulewar setdefault 19 20 21 22\n' +
                        '  _war setdefault 7pm 8pm 9pm 10pm' +
                        '```' +
                        '',
    ScheduleWarTimeout: 'Setting the timeout, scheduled matches should be valid:\n' +
                        '```' +
                        'Sets the timeout in hours for scheduled matches in the channel, this command has been executed.\n' +
                        '  _schedulewar settimeout 24\n' +
                        '  _war settimeout 168\n\n' +
                        'Valid times are between 1 and 168 (inclusive).\n' +
                        'This command is currently unused, but will be needed for the planned automatic lineup creation.' +
                        '```' +
                        '',
    Friendcode: '```' +
                'Set/Update friendcodes:\n' +
                '  Your own fc:\n' +
                '    _fc SW-1234-5678-9012\n' +
                '  Another\'s fc:\n' +
                '    _fc @UserToSet SW-1234-5678-9012\n' +
                '    _fc 1234-5678-9012 @UserToSet\n\n' +
                'Get friendcodes:\n' +
                '  Your own fc:\n' +
                '    _fc\n' +
                '  All friendcodes:\n' +
                '    _fc all\n' +
                '  Another\'s fc:\n' +
                '    _fc @UserToGet\n' +
                '    _fc UserTo\n\n' +
                '  FCs can be searched by likeness of the given parameter\n' +
                '    Example: _fc U\n' +
                '      prints all registered FCs for users containing the letter "U"' +
                '```',
    Tracktable: 'Print tracktable images:\n' +
                '```' +
                'Print the tracktable image for the given track abbreviation:\n' +
                '  _tracktable rDKJ\n' +
                '  _track mks\n\n' +
                'Casing of abbreviations is irrelevant. (MKS works exactly like mKs)\n' +
                'All MK8DX tracks - except Baby Park, because why should it? - are implemented.\n' +
                'To respect the old bot and to not have overlaps, the command "_tt" has been disabled permanently.' +
                '```' +
                '',
}

/**
 * 
 * @param {String} text 
 * @param {String} placeholder 
 * @param {String} replaceWith 
 * @returns 
 */
function replacePlaceholder(text, placeholder, replaceWith) {
    let replaceStr = placeholder.startsWith('{{') ? placeholder : ('{{' + placeholder + '}}');
    return text.replaceAll(replaceStr, replaceWith);
}

module.exports = {
    // basic help
    OverlaySetup:   'All overlay commands:\n' + 
                    '```' + 
                    '_setup  \n  Sets up a new overlay in the channel, this command has been executed in and sends the URL to the overlay.\n\n' +
                    '_delete \n  Deletes your overlay for the channel, this command has been executed in or the one of the pinged user.\n\n' +
                    '_reset  \n  Resets the scores displayed on the overlay back to zero. (Starting a new war through Toad also resets scores)\n\n' +
                    '_home   \n  Gets the data from the given mkc team profile and sets it as the home team.\n\n' +
                    '_guest  \n  Gets the data from the given mkc team profile and sets it as the guest team.\n\n' +
                    '```',
    OverlayOverride: 'All overlay override commands:\n' +
                     '```' +
                     '_hlogo  \n  Overrides the home logo. Upload an image with the command as text, or use an URL to your logo. Leaving any sort of parameter empty just removes the image.\n\n' +
                     '_glogo  \n  Overrides the guest logo. Upload an image with the command as text, or use an URL to your logo. Leaving any sort of parameter empty just removes the image.\n\n' +
                     '_hname  \n  Overrides the name of the home team.\n\n' +
                     '_gname  \n  Overrides the name of the guest team.\n\n' +
                     '_htag   \n  Overrides the tag of the home team.\n\n' +
                     '_gtag   \n  Overrides the tag of the guest team.' +
                     '```',
    OtherCommands:  'All other commands:\n' +
                    '```' +
                    '_war            \n  Schedules matches as per default or given time(s).\n\n' +
                    '_war setdefault \n  Sets the default times for the `_war` command\n\n' +
                    '_war settimeout \n  Sets the time in hours, each schedule for the current channel should be valid.\n\n' +
                    '_fc             \n  Gets or sets friendcodes for your server to display.\n\n' +
                    '_fc all         \n  Print all friendcodes available on your server.\n\n' +
                    '_track          \n  Prints the tracktable image of the given MK8DX track abbreviation.' +
                    '```' + 
                    'For more help on a specific command, type `_help command` or `_? command`. (Replace the word "command" with the command you want more help on)\n' +
                    'You can also review the tutorial on MKC for more specific information:\nhttps://www.mariokartcentral.com/forums/index.php?threads/toadoverlay-an-extension-bot-to-toad-for-streamers-and-more.10749/',
    SlashCommands:  'All available slash-commands:\n' +
                    '```' +
                    '' +
                    '' +
                    '' +
                    '' +
                    '' +
                    '```' +
                    'Slash-commands are meant to be a good alternative for comfort or anyone who cannot receive direct messages. (More slash-commands coming soon™)',

    // user-commands
    SetupOverlay: CommandTexts.SetupOverlay,
    DeleteOverlay: CommandTexts.DeleteOverlay,
    ResetOverlay: CommandTexts.ResetOverlay,
    MKCSetHome: replacePlaceholder(CommandTexts.MKCSetTeam, 'team', 'home'),
    MKCSetGuest: replacePlaceholder(CommandTexts.MKCSetTeam, 'team', 'guest'),
    // override-commands
    OverrideHomeLogo: replacePlaceholder(replacePlaceholder(CommandTexts.OverrideLogo, 'team', 'home'), 'prefix', 'h'),
    OverrideGuestLogo: replacePlaceholder(replacePlaceholder(CommandTexts.OverrideLogo, 'team', 'guest'), 'prefix', 'g'),
    OverrideHomeName: replacePlaceholder(replacePlaceholder(CommandTexts.OverrideName, 'team', 'home'), 'prefix', 'h'),
    OverrideGuestName: replacePlaceholder(replacePlaceholder(CommandTexts.OverrideName, 'team', 'guest'), 'prefix', 'g'),
    OverrideHomeTag: replacePlaceholder(replacePlaceholder(CommandTexts.OverrideTag, 'team', 'home'), 'prefix', 'h'),
    OverrideGuestTag: replacePlaceholder(replacePlaceholder(CommandTexts.OverrideTag, 'team', 'guest'), 'prefix', 'g'),
    // other commands
    ScheduleWar: CommandTexts.ScheduleWar,
    ScheduleWarDefault: CommandTexts.ScheduleWarDefault,
    ScheduleWarTimeout: CommandTexts.ScheduleWarTimeout,
    Friendcode: CommandTexts.Friendcode,
    Tracktable: CommandTexts.Tracktable,

}
