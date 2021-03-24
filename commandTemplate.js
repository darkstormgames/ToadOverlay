/**
 * @desc required modules
 */
 const base = require('../functions/commandsBase');
 const dbhelper = require('../../functions/db-helper');

 module.exports = {
     /**
     * @desc The name and trigger of the command
     */
     name: 'template',
 
     /**
     * @desc Alternative trigger(s) for the command
     */
     alt: ['another-name', 'anotherone'],
 
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
        base.log.logMessage('Executing command "template"', message.author, message.guild, message.channel);
        dbhelper.checkBaseData(message.guild, message.channel, message.author);
 
     }
 };