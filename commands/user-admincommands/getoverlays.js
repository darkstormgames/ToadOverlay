/**
 * @description required modules
 */
 const base = require('../../Functions/CommandsBase');

 module.exports = {
     /**
     * @description The name and trigger of the command
     */
     name: 'admin-getoverlays',
 
     /**
     * @description Alternative trigger(s) for the command
     */
     alt: [],
 
     /**
     * @description Defines the type of the command
     * This field is used for validation
     */
     type: base.CommandTypeEnum.General,
 
     /**
     * @description Short description of the command
     */
     description: 'Delete your overlay from the server this command was executed from.',
 
     /**
     * @description execution of the command
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
     execute: (message, args) => {
        if (message.author.id != process.env.ADMIN_ID) {
            return;
        }
        base.log.logMessage('Trying to execute admin command "getoverlays"', 'admin-getoverlays', message.content, message.guild, message.channel, message.author);
        
     }
 };
