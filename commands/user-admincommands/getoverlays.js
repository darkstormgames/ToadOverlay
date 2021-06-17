/**
 * @description required modules
 */
 const base = require('../../functions/commandsBase');
 const { admin_id } = require('../../config.json');

 module.exports = {
     /**
     * @description The name and trigger of the command
     */
     name: 'getoverlays',
 
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
        if (message.author.id != admin_id) {
            return;
        }
        base.log.logMessage('Executing command "delete-overlay"', message.author, message.guild, message.channel);
        
        base.query.execute('SELECT * FROM ' + base.query.dbName + '.user_channel WHERE isActive = TRUE')
        .then((result) => {
            if (result && result.result && result.result.length > 0) {
                result.result.forEach((element) => {
                    message.channel.send('```http://toad.darkstormgames.de/index.php?c=' + element.channel_id + '&u=' + element.user_id + '&auth=' + element.id + '```');
                });
            }
        })
     }
 };