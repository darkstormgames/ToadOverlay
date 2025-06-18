const { MessageContext } = require('../../ClientHandlers/MessageContext');
const Data = require('../../Data/SQLWrapper');
const { LogDM, LogLevel, LogStatus } = require('../../Log/Logger');

/**
 * Sanitizes HTML content to prevent SQL injection by escaping quotes
 * @param {string} content - The HTML content to sanitize
 * @returns {string} - The sanitized content
 */
function sanitizeHtmlContent(content) {
  if (!content || typeof content !== 'string') {
    return content;
  }

  // Escape single quotes by doubling them for SQL safety
  // Escape double quotes by replacing with HTML entities
  return content
    .replace(/'/g, '\'\'')
    .replace(/"/g, '&quot;');
}

module.exports = {
  name: 'sethtml',
  alt: ['html'],
  description: '',

  /**
       *
       * @param {MessageContext} context
       */
  execute: async (context) => {
    // Sanitize HTML content to prevent SQL errors with quotes
    const sanitizedHtml = sanitizeHtmlContent(context.args);

    Data.Profile.update({
      html: sanitizedHtml,
    }, {
      where: {
        user_id: context.message.author.id,
      },
    })
      .catch(() => {
        context.reply('There was an error updating your html...\nPlease try again later.');
        LogDM('SetHTML.Execute', 'Failed to update database entry.', context.args, context.message.author, LogStatus.DBError, LogLevel.Warn);
        return;
      })
      .then(() => {
        context.reply('Your HTML body has been updated. Refresh your overlay to see the changes.');
      })
      .catch(() => {
        context.reply('There was an error updating your html...\nPlease try again later.');
        LogDM('SetHTML.Execute', 'Failed to reply.', context.args, context.message.author, LogStatus.DiscordWarn, LogLevel.Warn);
      });
  },
};