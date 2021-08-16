module.exports = {


    // user-commands
    MKCSetGuest: 'Setting the guest team:\n```_guest [mkc-team-id or -url]\n  Example: _guest 1324\n  or:   _guest https://www.mariokartcentral.com/mkc/registry/teams/1324```',
    MKCSetHome: 'Setting the home team:\n```_home [mkc-team-id or -url]\n  Example: _home 1324\n  or:   _home https://www.mariokartcentral.com/mkc/registry/teams/1324```',

    Friendcode: '```Set/Update friendcodes:\n  Your own fc:\n      _fc SW-1234-5678-9012\n  Another\'s fc:\n      _fc @UserToSet SW-1234-5678-9012\n      _fc SW-1234-5678-9012 @UserToSet\n\nGet friendcodes:\n  Your own fc:\n      _fc\n  All friendcodes:\n      _fc all\n  Another\'s fc:\n      _fc @UserToGet\n      _fc UserTo\n\n  FCs can be searched by likeness of the given parameter\n    Example: _fc U\n      prints all registered FCs for users containing the letter "U"```',


}
