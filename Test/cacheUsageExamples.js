/**
 * Example: Using the Cache System in Commands
 * 
 * This example shows how to migrate existing commands to use the new caching system
 * for improved performance.
 */

// Example of updating a command to use caching
module.exports = {
  name: 'userinfo',
  alt: ['user', 'profile'],
  description: 'Get user information with caching for better performance',
  
  async execute(context) {
    const userId = context.message.author.id;
    
    try {
      // OLD WAY (direct database access)
      // const user = await User.findByPk(userId);
      // const profiles = await Profile.findAll({ where: { user_id: userId }, include: [User] });
      
      // NEW WAY (with caching)
      const { Helper } = require('../../Data/SQLWrapper');
      
      // Get user data with 10-minute cache
      const user = await Helper.getUserCached(userId, 600);
      
      // Get user profiles with 5-minute cache
      const profiles = await Helper.getUserProfilesCached(userId, 300);
      
      if (user) {
        let response = `**User Information for ${user.name}**\n`;
        response += `ID: ${user.id}\n`;
        response += `Discriminator: ${user.discriminator}\n`;
        response += `Created: ${user.created}\n`;
        response += `Profiles: ${profiles.length}\n`;
        
        await context.message.reply(response);
      } else {
        await context.message.reply('User not found');
      }
      
    } catch (error) {
      console.error('Failed to get user info:', error);
      await context.message.reply('Error retrieving user information');
    }
  }
};

// Example of using CheckBaseDataCached for better performance
module.exports.setupCommand = {
  name: 'setup',
  alt: ['configure'],
  description: 'Setup command with optimized data loading',
  
  async execute(context) {
    try {
      // OLD WAY (multiple sequential database calls)
      // const dataContext = await CheckBaseData(context.message.guild, context.message.channel, context.message.author);
      
      // NEW WAY (cached with parallel loading)
      const { Helper } = require('../../Data/SQLWrapper');
      const dataContext = await Helper.CheckBaseDataCached(
        context.message.guild, 
        context.message.channel, 
        context.message.author,
        600 // 10-minute cache
      );
      
      // Process setup with cached data context
      await context.message.reply('Setup completed with cached data!');
      
    } catch (error) {
      console.error('Setup failed:', error);
      await context.message.reply('Setup failed');
    }
  }
};

// Example of cache invalidation when updating user data
module.exports.updateUserCommand = {
  name: 'updateuser',
  alt: ['edituser'],
  description: 'Update user data and invalidate cache',
  
  async execute(context) {
    const userId = context.message.author.id;
    
    try {
      // Update user data
      const { User, invalidateUserCache } = require('../../Data/SQLWrapper');
      
      await User.update(
        { name: 'NewName' },
        { where: { id: userId } }
      );
      
      // Important: Invalidate cache after updates
      await invalidateUserCache(userId);
      
      await context.message.reply('User updated and cache invalidated!');
      
    } catch (error) {
      console.error('Failed to update user:', error);
      await context.message.reply('Update failed');
    }
  }
};

// Example of cache monitoring command
module.exports.cacheStatsCommand = {
  name: 'cachestats',
  alt: ['cacheinfo'],
  description: 'Display cache performance statistics',
  
  async execute(context) {
    try {
      const { getCacheStatistics } = require('../../Data/SQLWrapper');
      const stats = getCacheStatistics();
      
      let response = '**Cache Performance Statistics**\n';
      response += `Uptime: ${stats.uptime} seconds\n`;
      response += `Overall Hit Ratio: ${Math.round(stats.overallHitRatio * 100)}%\n`;
      response += `Memory Cache: ${stats.memory.hits} hits, ${stats.memory.misses} misses\n`;
      response += `Persistent Cache: ${stats.persistent.hits} hits, ${stats.persistent.misses} misses\n`;
      response += `Database Queries: ${stats.database.queries}\n`;
      response += `Errors: ${stats.errors}\n`;
      
      await context.message.reply('```\n' + response + '\n```');
      
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      await context.message.reply('Error retrieving cache statistics');
    }
  }
};

/**
 * Best Practices for Using the Cache System:
 * 
 * 1. Use appropriate TTL values:
 *    - User data: 10+ minutes (600+ seconds)
 *    - Guild data: 10+ minutes (600+ seconds)
 *    - Channel data: 10+ minutes (600+ seconds)
 *    - Dynamic data (profiles, relationships): 5 minutes (300 seconds)
 * 
 * 2. Always invalidate cache after updates:
 *    - After User.update() -> invalidateUserCache(userId)
 *    - After Guild.update() -> invalidateGuildCache(guildId)
 *    - After Channel.update() -> invalidateChannelCache(channelId)
 * 
 * 3. Use cached versions for read operations:
 *    - Replace User.findByPk() with getUserCached()
 *    - Replace CheckBaseData() with CheckBaseDataCached()
 * 
 * 4. Monitor cache performance:
 *    - Use getCacheStatistics() to track hit ratios
 *    - Aim for 80%+ hit ratio on frequently accessed data
 * 
 * 5. Handle cache failures gracefully:
 *    - Cache functions automatically fall back to database
 *    - No code changes needed for error handling
 */
