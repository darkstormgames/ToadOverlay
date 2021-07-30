/**
 * @desc required modules
 */
 const base = require('../../Functions/CommandsBase');
 const dbhelper = require('../../Functions/DBDataHelper');

 module.exports = {
     /**
     * @desc The name and trigger of the command
     */
     name: 'admin-addtoaduser',
 
     /**
     * @desc Alternative trigger(s) for the command
     */
     alt: [],
 
     /**
     * @desc Defines the type of the command
     * This field is used for validation
     */
     type: base.CommandTypeEnum.General,
 
     /**
     * @desc Short description of the command
     */
     description: '',
     
     /**
     * @desc execution of the command
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
     execute: (message, args) => {
        if (message.author.id != process.env.ADMIN_ID) {
            message.channel.send('https://tenor.com/view/youre-not-my-dad-kid-gif-8300190');
            return;
        }
        base.log.logMessage('Executing command "admin-addtoaduser"', 'admin-addtoaduser', null, message.guild, message.channel, message.author);
        dbhelper.checkBaseData(message.guild, message.channel, message.author);

        message.client.users.fetch('177162177432649728', {cache: true})
        .then((loadedUser) => {
            dbhelper.checkBaseData(message.guild, message.channel, loadedUser)
            .then(() => {
                base.log.logMessage('ToadUser has been added to the database.', 'admin-addtoaduser', null, message.guild, message.channel, loadedUser);
            });
            
        });
     }
 };
