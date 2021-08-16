const Discord = require('discord.js');
const Data = require('../Modules/Data/SQLWrapper');
const Log = require('../Modules/Log/Logger');

module.exports = {
    name: 'setstyle',
    alt: ['style'],
    description: 'Sets the style of the overlay to the given CSS styles',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    */
    execute: (message, content) => {
        // ToDo: Add query to Profile entity
        Data.ExecuteQuery("UPDATE " + process.env.SQL_NAME + ".profile SET css = '" + Data.sql.connection.escape(content) + "' WHERE user_id = " + message.author.id, 
        (error) => {
            message.author.send('There was an error updating your styles...\nPlease try again later.');
            Log.logDM(error, message.author);
        })
        .then((result) => {
            if (result == true) {
                message.author.send('Your CSS styles have been updated. Refresh your overlay to see the changes.');
            }
        });
    }
};
