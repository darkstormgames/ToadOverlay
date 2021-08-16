const Discord = require('discord.js');
const Data = require('../Modules/Data/SQLWrapper');
const Log = require('../Modules/Log/Logger');

module.exports = {
    name: 'sethtml',
    alt: ['html'],
    description: 'Sets the HTML of the overlay to the given one',

    /**
    * @description execution of the command
    * @param {Discord.Message} message 
    * @param {string} content 
    */
    execute: (message, content) => {
        // ToDo: Add query to Profile entity
        Data.ExecuteQuery("UPDATE " + process.env.SQL_NAME + ".profile SET html = '" + Data.sql.connection.escape(content).replaceAll("'", "") + "' WHERE user_id = " + message.author.id, 
        (error) => {
            message.author.send('There was an error updating your html...\nPlease try again later.');
            Log.logDM(error, message.author);
        })
        .then((result) => {
            if (result == true) {
                message.author.send('Your HTML body has been updated. Refresh your overlay to see the changes.');
            }
        });
    }
};
