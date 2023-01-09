const Discord = require('discord.js');
const Data = require('../Modules/Data/SQLWrapper');
const Log = require('../Modules/Log/Logger');


module.exports = {
    name: 'setimage',
    alt: ['img'],
    description: 'Sets the background image to the given URL',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string} content 
    */
    execute: (message, content) => {
        // ToDo: Add query to Profile entity
        Data.ExecuteQuery('UPDATE ' + process.env.SQL_NAME + ".profile SET bg_url = '" + Data.sql.connection.escape(content).replaceAll("'", "") + "' WHERE user_id = " + message.author.id, 
        (error) => {
            message.author.send('There was an error updating your background image...\nPlease try again later.');
            Log.logDM(error, message.author);
        })
        .then((result) => {
            if (result == true) {
                message.author.send('Your background image has been updated. Refresh your overlay to see the changes.');
            }
        });
    }
};
