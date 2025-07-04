# Implementation Plan: Command-Wide MySQL Caching Migration

## Executive Summary
- **Objective**: Migrate all 28+ commands across the ToadOverlay project to utilize the newly implemented MySQL entity caching system for optimal performance
- **Impact**: 2-5x performance improvement for all commands, reduced MySQL server load by 60-80%, enhanced user experience during high-traffic periods
- **Timeline**: 3-4 weeks development and testing
- **Risk Level**: Low - caching system is already implemented and tested, migration preserves existing functionality

## Project Overview

### Existing Plans Analysis
- **Current Pipeline**: Builds upon the completed mysql_entity_caching.plan.md implementation
- **Related Plans**: Direct continuation of the MySQL entity caching system - no conflicts
- **Dependencies on Existing Plans**: Requires completion of CacheManager.js and SQLDataHelper cached methods (already implemented)
- **Lessons Learned**: The CacheManager implementation shows excellent patterns for transparent caching that can be applied across all commands

### Current State Analysis
- **Architecture Overview**: 
  - 28 individual command files across 3 contexts (DirectMessage, GuildMessage, ScoreBot)
  - All commands currently use direct database access via Sequelize models
  - MessageContext provides data access through CheckBaseData function
- **Technical Debt**: 
  - No commands currently utilize the implemented caching system
  - Inconsistent database access patterns across commands
  - Direct Sequelize model calls bypass caching layer
- **Dependencies**: 
  - Existing CacheManager.js implementation
  - All commands use MessageContext for database access
  - SQLWrapper.js already exports cached functions
- **Constraints**: 
  - Must maintain 100% command functionality
  - Zero downtime migration - commands must work during transition
  - Preserve all existing command aliases and behaviors

### Requirements Specification

#### Functional Requirements
- [REQ-F001]: Migrate all command database operations to use cached equivalents
- [REQ-F002]: Maintain identical command behavior and response patterns
- [REQ-F003]: Implement cache invalidation for all data-modifying commands
- [REQ-F004]: Provide performance monitoring for command execution times
- [REQ-F005]: Support gradual rollout with fallback mechanisms
- [REQ-F006]: Ensure all includes are at the top of command files

#### Non-Functional Requirements
- [REQ-NF001]: Zero breaking changes to existing command interfaces
- [REQ-NF002]: 2-5x performance improvement for frequently used commands
- [REQ-NF003]: Backward compatibility with non-cached operations during transition
- [REQ-NF004]: Command execution time should not exceed 500ms even on cache misses
- [REQ-NF005]: Cache hit ratio should exceed 80% for frequently accessed commands

#### Technical Requirements
- [REQ-T001]: All require() statements must be at the top of command files
- [REQ-T002]: Use consistent caching TTL values across similar operations
- [REQ-T003]: Implement proper error handling with fallback to non-cached operations
- [REQ-T004]: Add cache invalidation after all update/delete operations
- [REQ-T005]: Maintain existing logging patterns and error messages

## Architecture & Design

### Command Categories and Migration Strategy

#### Category 1: DirectMessage Commands (3 files)
- **Files**: DMHelp.js, SetHTML.js, SetImage.js, SetStyle.js
- **Current Pattern**: Direct Profile.update() calls
- **Migration Strategy**: Add cache invalidation after updates
- **Impact**: Medium - these commands modify user profile data

#### Category 2: GuildMessage/Commands (4 files)
- **Files**: GuildHelp.js, SetGuest.js, SetHome.js, Setup.js, Status.js
- **Current Pattern**: Heavy use of CheckBaseData via context.data
- **Migration Strategy**: CheckBaseData already updated to use caching
- **Impact**: High - most frequently used commands

#### Category 3: GuildMessage/Scheduling (2 files)
- **Files**: ScheduleWar.js, TrackTable.js
- **Current Pattern**: File system operations with minimal database access
- **Migration Strategy**: Minimal changes needed
- **Impact**: Low - limited database operations

#### Category 4: GuildMessage/SetData (6 files)
- **Files**: GuestLogo.js, GuestName.js, GuestTag.js, HomeLogo.js, HomeName.js, HomeTag.js
- **Current Pattern**: Direct Channel.update() calls
- **Migration Strategy**: Add cache invalidation after Channel updates
- **Impact**: Medium - these commands modify channel data

#### Category 5: ScoreBot Commands (2 files)
- **Files**: Startwar.js, UpdateScore.js
- **Current Pattern**: Direct Channel.update() via context.data.channel
- **Migration Strategy**: Add cache invalidation after score updates
- **Impact**: High - real-time score updates need optimal performance

### Migration Patterns

#### Pattern 1: Read-Only Commands
```javascript
// BEFORE: Direct database access
const user = await User.findByPk(userId);

// AFTER: Cached access
const { Helper } = require('../../Data/SQLWrapper');
const user = await Helper.getUserCached(userId, 600);
```

#### Pattern 2: Update Commands with Cache Invalidation
```javascript
// BEFORE: Direct update
await Channel.update({ name: 'new name' }, { where: { id: channelId } });

// AFTER: Update with cache invalidation
const { Channel, invalidateChannelCache } = require('../../Data/SQLWrapper');
await Channel.update({ name: 'new name' }, { where: { id: channelId } });
await invalidateChannelCache(channelId);
```

#### Pattern 3: CheckBaseData Usage (Already Implemented)
```javascript
// BEFORE: Non-cached CheckBaseData
const dataContext = await CheckBaseData(guild, channel, user);

// AFTER: CheckBaseData now uses caching internally (no change needed)
const dataContext = await CheckBaseData(guild, channel, user);
```

### TTL (Time To Live) Strategy

#### Entity-Based TTL Values
- **User entities**: 600 seconds (10 minutes)
- **Guild entities**: 600 seconds (10 minutes)  
- **Channel entities**: 600 seconds (10 minutes)
- **Profile entities**: 300 seconds (5 minutes)
- **Relationship entities**: 300 seconds (5 minutes)
- **Score/dynamic data**: 60 seconds (1 minute)

#### Context-Based TTL Values
- **Setup commands**: 600 seconds (long-lived data)
- **Score updates**: 60 seconds (frequently changing)
- **Profile updates**: 300 seconds (moderate changes)

## Implementation Plan

### Phase 1: Infrastructure Validation [Timeline: 1 week]

#### Milestone 1.1: Verify Cache System Integration
- **Objective**: Ensure all cached functions are properly exported and accessible
- **Tasks**:
  - [ ] Verify SQLWrapper.js exports all cached functions
  - [ ] Test CheckBaseData caching functionality in development
  - [ ] Validate cache invalidation mechanisms
  - [ ] Confirm TTL configurations are working
- **Deliverables**: 
  - Functional verification of caching system
  - Performance baseline measurements
- **Dependencies**: Completed CacheManager implementation
- **Risks**: 
  - **Risk**: Cache functions not properly integrated
  - **Mitigation**: Run comprehensive integration tests first

#### Milestone 1.2: Command Analysis and Categorization
- **Objective**: Analyze all commands and create migration prioritization
- **Tasks**:
  - [ ] Audit all 28+ command files for database operations
  - [ ] Document current database access patterns
  - [ ] Identify high-impact commands for priority migration
  - [ ] Create command dependency map
- **Deliverables**: 
  - Complete command inventory with migration complexity ratings
  - Priority order for migration phases
- **Dependencies**: None
- **Risks**: 
  - **Risk**: Overlooking complex database operations
  - **Mitigation**: Use semantic search to find all database calls

### Phase 2: High-Priority Command Migration [Timeline: 1 week]

#### Milestone 2.1: GuildMessage/Commands Migration
- **Objective**: Migrate the most frequently used commands to caching
- **Tasks**:
  - [ ] Update Setup.js to use cached CheckBaseData (already done)
  - [ ] Migrate SetGuest.js and SetHome.js with cache invalidation
  - [ ] Update Status.js for cached data access
  - [ ] Add performance logging to measure improvements
- **Deliverables**: 
  - 5 core guild commands fully migrated to caching
  - Performance metrics showing improvement
- **Dependencies**: Milestone 1.1 completion
- **Risks**: 
  - **Risk**: Commands may break during migration
  - **Mitigation**: Implement gradual rollout with feature flags

#### Milestone 2.2: ScoreBot Command Migration
- **Objective**: Optimize real-time score tracking with caching
- **Tasks**:
  - [ ] Migrate Startwar.js with channel cache invalidation
  - [ ] Update UpdateScore.js with optimized caching for real-time updates
  - [ ] Implement aggressive cache invalidation for score changes
  - [ ] Test score update latency improvements
- **Deliverables**: 
  - ScoreBot commands optimized for real-time performance
  - Measured latency improvements for score updates
- **Dependencies**: Milestone 2.1 completion
- **Risks**: 
  - **Risk**: Cache invalidation may cause score inconsistencies
  - **Mitigation**: Implement immediate cache invalidation after score updates

### Phase 3: Medium-Priority Command Migration [Timeline: 1 week]

#### Milestone 3.1: SetData Commands Migration
- **Objective**: Migrate team data modification commands
- **Tasks**:
  - [ ] Update all 6 SetData commands (HomeName, GuestName, etc.)
  - [ ] Implement consistent cache invalidation patterns
  - [ ] Add validation for cached vs. non-cached data consistency
  - [ ] Performance test team data modifications
- **Deliverables**: 
  - All team data commands using caching with proper invalidation
  - Consistency validation between cache and database
- **Dependencies**: Milestone 2.2 completion
- **Risks**: 
  - **Risk**: Team data cache may become stale
  - **Mitigation**: Use shorter TTL for team data (300 seconds)

#### Milestone 3.2: DirectMessage Commands Migration
- **Objective**: Optimize user profile modification commands
- **Tasks**:
  - [ ] Migrate SetHTML.js with profile cache invalidation
  - [ ] Update SetImage.js and SetStyle.js with caching
  - [ ] Implement user-specific cache invalidation patterns
  - [ ] Test profile update performance improvements
- **Deliverables**: 
  - DirectMessage commands fully cached and optimized
  - User profile cache invalidation working correctly
- **Dependencies**: Milestone 3.1 completion
- **Risks**: 
  - **Risk**: Profile changes may not reflect immediately
  - **Mitigation**: Invalidate user cache immediately after profile updates

### Phase 4: Final Migration and Optimization [Timeline: 1 week]

#### Milestone 4.1: Remaining Commands Migration
- **Objective**: Complete migration of all remaining commands
- **Tasks**:
  - [ ] Migrate TrackTable.js (minimal database usage)
  - [ ] Update ScheduleWar.js caching where applicable
  - [ ] Complete GuildHelp.js optimization
  - [ ] Final performance validation across all commands
- **Deliverables**: 
  - 100% command migration to caching system
  - Complete performance benchmark comparison
- **Dependencies**: Milestone 3.2 completion
- **Risks**: 
  - **Risk**: Edge case commands may have hidden database operations
  - **Mitigation**: Comprehensive testing of all command paths

#### Milestone 4.2: Performance Validation and Documentation
- **Objective**: Validate performance improvements and document changes
- **Tasks**:
  - [ ] Run comprehensive performance tests on all commands
  - [ ] Document cache hit ratios and performance improvements
  - [ ] Update command documentation with caching behaviors
  - [ ] Create monitoring dashboard for cache performance
- **Deliverables**: 
  - Complete performance analysis report
  - Updated documentation for all cached commands
  - Production monitoring for cache effectiveness
- **Dependencies**: Milestone 4.1 completion
- **Risks**: 
  - **Risk**: Performance improvements may not meet expectations
  - **Mitigation**: Implement fine-tuning based on production metrics

## Detailed Migration Guide

### Template for Command Migration

#### Step 1: Update Imports (Top of File Only)
```javascript
// BEFORE: Direct Sequelize imports
const { Channel } = require('../../Data/SQLWrapper');

// AFTER: Import cached functions and invalidation
const { Channel, invalidateChannelCache, Helper } = require('../../Data/SQLWrapper');
```

#### Step 2: Replace Direct Database Calls
```javascript
// BEFORE: Direct findByPk
const user = await User.findByPk(userId);

// AFTER: Cached access
const user = await Helper.getUserCached(userId, 600);
```

#### Step 3: Add Cache Invalidation After Updates
```javascript
// BEFORE: Update only
await Channel.update({ name: newName }, { where: { id: channelId } });

// AFTER: Update with invalidation
await Channel.update({ name: newName }, { where: { id: channelId } });
await invalidateChannelCache(channelId);
```

#### Step 4: Implement Error Handling
```javascript
try {
  const user = await Helper.getUserCached(userId, 600);
  // ... rest of command logic
} catch (error) {
  console.error('Cache error, falling back to direct access:', error);
  const user = await User.findByPk(userId);
  // ... continue with non-cached logic
}
```

### Command-Specific Migration Details

#### SetHTML.js, SetImage.js, SetStyle.js Pattern
```javascript
// Add cache invalidation after Profile.update()
const { Profile, invalidateUserCache } = require('../../Data/SQLWrapper');

// In execute function:
await Profile.update({ html: sanitizedHtml }, { where: { user_id: userId } });
await invalidateUserCache(userId); // Invalidate user-related cache
```

#### SetGuest.js, SetHome.js Pattern
```javascript
// Add cache invalidation after Channel.update()
const { Channel, invalidateChannelCache } = require('../../Data/SQLWrapper');

// In execute function:
await Channel.update({ guest_name: newName }, { where: { id: channelId } });
await invalidateChannelCache(channelId); // Invalidate channel cache
```

#### Setup.js Pattern (Already Using CheckBaseData)
```javascript
// No changes needed - CheckBaseData now uses caching internally
// Performance improvement is automatic
```

#### Startwar.js, UpdateScore.js Pattern
```javascript
// Add cache invalidation after score updates
const { invalidateChannelCache } = require('../../Data/SQLWrapper');

// In execute function:
await context.data.channel.update({ home_current: 0, guest_current: 0 });
await invalidateChannelCache(context.data.channel.id); // Immediate invalidation for real-time updates
```

## Testing Strategy

### Unit Testing
- **Cache Function Testing**: Verify all cached functions return identical results to non-cached versions
- **Invalidation Testing**: Ensure cache invalidation properly clears related entries
- **TTL Testing**: Validate that cache entries expire at correct intervals
- **Error Handling**: Test fallback to non-cached operations when cache fails

### Integration Testing
- **Command Flow Testing**: Execute complete command flows with caching enabled
- **Performance Testing**: Measure command execution times before and after migration
- **Consistency Testing**: Verify cached data matches database data
- **Concurrency Testing**: Test multiple simultaneous command executions

### Performance Benchmarks
- **Baseline Measurements**: Record current command execution times
- **Cache Hit Ratio**: Target 80%+ hit ratio for frequently accessed commands
- **Response Time Improvement**: Target 2-5x improvement for cached operations
- **Database Load Reduction**: Target 60-80% reduction in direct database queries

## Risk Mitigation

### Risk 1: Cache Inconsistency
- **Mitigation**: Implement immediate cache invalidation after all updates
- **Detection**: Regular consistency checks between cache and database
- **Recovery**: Automatic cache refresh on inconsistency detection

### Risk 2: Cache Memory Usage
- **Mitigation**: Monitor cache memory usage and implement size limits
- **Detection**: Regular memory usage monitoring
- **Recovery**: Implement LRU eviction and emergency cache clearing

### Risk 3: Command Functionality Changes
- **Mitigation**: Comprehensive testing of all command paths
- **Detection**: Automated testing of command responses
- **Recovery**: Quick rollback capability to non-cached versions

## Success Metrics

### Performance Metrics
- **Command Execution Time**: 2-5x improvement for cached operations
- **Database Query Reduction**: 60-80% fewer direct database queries
- **Cache Hit Ratio**: 80%+ for frequently accessed commands
- **Memory Usage**: Cache memory usage under 256MB

### Reliability Metrics
- **Command Success Rate**: Maintain 99%+ success rate
- **Cache Availability**: 99.9% cache system uptime
- **Data Consistency**: 100% consistency between cache and database
- **Error Rate**: No increase in command error rates

### User Experience Metrics
- **Response Time**: Faster command responses, especially for setup and status commands
- **System Stability**: No increase in Discord bot timeouts or failures
- **Feature Availability**: 100% command functionality maintained during migration

## Rollback Plan

### Emergency Rollback Procedure
1. **Immediate**: Disable cache system via environment variable
2. **Short-term**: Revert command files to non-cached versions
3. **Long-term**: Investigate and fix caching issues before re-enabling

### Gradual Rollout Strategy
1. **Phase 1**: Enable caching for 25% of commands (highest impact, lowest risk)
2. **Phase 2**: Expand to 50% of commands after validation
3. **Phase 3**: Full rollout after comprehensive testing
4. **Monitoring**: Continuous monitoring at each phase with automatic rollback triggers

## Post-Migration Monitoring

### Cache Performance Dashboard
- **Real-time Metrics**: Cache hit ratios, response times, memory usage
- **Historical Trends**: Performance improvements over time
- **Alert System**: Notifications for cache failures or performance degradation

### Command Performance Tracking
- **Individual Command Metrics**: Execution times, success rates, cache utilization
- **Comparative Analysis**: Before/after migration performance comparison
- **User Impact Analysis**: User experience improvements measurement

This comprehensive migration plan ensures that all ToadOverlay commands will benefit from the implemented caching system while maintaining full functionality and providing significant performance improvements.
- [REQ-NF005]: Zero downtime deployment during migration
- [REQ-NF006]: Maintained logging patterns for debugging and monitoring

#### Technical Requirements
- [REQ-T001]: Use Helper.* cached methods instead of direct model access
- [REQ-T002]: Implement cache invalidation in all update operations
- [REQ-T003]: Optimize CheckBaseData usage with CheckBaseDataCached
- [REQ-T004]: Maintain existing import patterns at file tops
- [REQ-T005]: Preserve all JSDoc documentation and typing
- [REQ-T006]: Support both development and production environments

## Architecture & Design

### System Architecture
- **Component Diagram**: 
  ```
  Commands (28 files) → SQLWrapper (Helper.*Cached) → CacheManager → [Memory Cache + SQLite Cache] → MySQL Database
  ```
- **Data Flow**: 
  1. Command execution → Check cache → Return cached data OR Query database → Cache result → Return data
  2. Update operations → Update database → Invalidate related cache entries
- **Integration Points**: 
  - All commands import from SQLWrapper (already established pattern)
  - MessageContext.data uses CheckBaseDataCached automatically
  - Logging system captures cache performance metrics
- **Technology Stack**: 
  - Existing command architecture (no changes)
  - Enhanced SQLWrapper with cached methods (already implemented)
  - CacheManager for transparent caching (already implemented)

### Database Design
- **Schema Changes**: None - cache layer is transparent to commands
- **Cache Strategy**: 
  - Entity reads: Use *Cached methods with appropriate TTL
  - Entity updates: Use standard methods + cache invalidation
- **Performance Considerations**: 
  - Read-heavy commands get maximum benefit
  - Update commands maintain data consistency through invalidation

### API Design
- **Migration Pattern**: 
  ```javascript
  // OLD: Direct model access
  const user = await User.findByPk(userId);
  
  // NEW: Cached access
  const { Helper } = require('../../../Data/SQLWrapper');
  const user = await Helper.getUserCached(userId, 600);
  ```
- **Cache Invalidation Pattern**: 
  ```javascript
  // After updates
  await Channel.update(data, { where: { id: channelId } });
  await Helper.invalidateChannelCache(channelId);
  ```
- **CheckBaseData Migration**: 
  ```javascript
  // OLD: Standard data loading
  const dataContext = await CheckBaseData(guild, channel, user);
  
  // NEW: Cached data loading
  const dataContext = await Helper.CheckBaseDataCached(guild, channel, user, 600);
  ```

## Implementation Plan

### Phase 1: Core Command Infrastructure Migration [Timeline: 1 week]
#### Milestone 1.1: Setup and Status Commands
- **Objective**: Migrate fundamental setup and informational commands to use caching
- **Tasks**:
  - [ ] Migrate `Setup.js` to use CheckBaseDataCached and cached entity methods
  - [ ] Update `Status.js` to include cache statistics and performance metrics
  - [ ] Migrate `GuildHelp.js` to use cached data loading for context
  - [ ] Test all setup workflows to ensure identical behavior
  - [ ] Validate cache invalidation in setup operations
- **Deliverables**: 
  - 3 core commands using caching system
  - Enhanced status command with cache metrics
  - Comprehensive testing results
- **Dependencies**: Completed CacheManager implementation
- **Risks**: 
  - **Risk**: Setup command complexity may expose edge cases in caching
  - **Mitigation**: Thorough testing with multiple channel/user combinations

#### Milestone 1.2: MessageContext Integration Enhancement
- **Objective**: Optimize MessageContext to use CheckBaseDataCached by default
- **Tasks**:
  - [ ] Update MessageHandler.js to use CheckBaseDataCached for all command contexts
  - [ ] Implement configurable TTL values based on command type
  - [ ] Add cache performance logging to MessageContext creation
  - [ ] Test MessageContext changes across all command types
  - [ ] Validate no breaking changes to existing command interfaces
- **Deliverables**: 
  - Enhanced MessageContext with automatic caching
  - Configurable TTL system for different command contexts
  - Performance improvement across all commands
- **Dependencies**: Milestone 1.1 completion
- **Risks**: 
  - **Risk**: MessageContext changes could affect all commands
  - **Mitigation**: Comprehensive regression testing before deployment

### Phase 2: Team Management Commands Migration [Timeline: 1 week]
#### Milestone 2.1: MKC Team Commands
- **Objective**: Migrate MKC team configuration commands to use caching with write-through invalidation
- **Tasks**:
  - [ ] Migrate `SetHome.js` to use cached data access and invalidation
  - [ ] Migrate `SetGuest.js` to use cached data access and invalidation
  - [ ] Implement cache invalidation in team update operations
  - [ ] Test team configuration workflows end-to-end
  - [ ] Validate MKC API integration performance with caching
- **Deliverables**: 
  - 2 team configuration commands using caching
  - Cache invalidation on team updates
  - Performance metrics for team operations
- **Dependencies**: Milestone 1.2 completion
- **Risks**: 
  - **Risk**: MKC API integration timing may affect cache consistency
  - **Mitigation**: Implement retry logic and proper error handling

#### Milestone 2.2: Team Data Override Commands
- **Objective**: Migrate all team data override commands in SetData directory
- **Tasks**:
  - [ ] Migrate `HomeLogo.js` with file upload handling and cache invalidation
  - [ ] Migrate `HomeName.js` and `HomeTag.js` with cached access patterns
  - [ ] Migrate `GuestLogo.js`, `GuestName.js`, and `GuestTag.js` commands
  - [ ] Implement consistent cache invalidation for all team data updates
  - [ ] Test all override combinations and edge cases
- **Deliverables**: 
  - 6 team data override commands using caching
  - Consistent invalidation patterns for team data
  - Optimized performance for team customization workflows
- **Dependencies**: Milestone 2.1 completion
- **Risks**: 
  - **Risk**: File upload operations may complicate cache invalidation timing
  - **Mitigation**: Implement post-upload cache invalidation with error recovery

### Phase 3: User Interface Commands Migration [Timeline: 1 week]
#### Milestone 3.1: Direct Message Commands
- **Objective**: Migrate private message commands for overlay customization
- **Tasks**:
  - [ ] Migrate `SetHTML.js` to use cached profile access and invalidation
  - [ ] Migrate `SetStyle.js` to use cached profile access and invalidation
  - [ ] Migrate `SetImage.js` to use cached profile access and invalidation
  - [ ] Migrate `DMHelp.js` to use cached user context loading
  - [ ] Implement profile cache invalidation for all customization updates
- **Deliverables**: 
  - 4 direct message commands using caching
  - Profile cache invalidation for customizations
  - Improved DM command response times
- **Dependencies**: Milestone 2.2 completion
- **Risks**: 
  - **Risk**: Profile updates may affect multiple channels requiring broad cache invalidation
  - **Mitigation**: Implement comprehensive profile-related cache invalidation

#### Milestone 3.2: Scheduling Commands
- **Objective**: Migrate complex scheduling commands with optimized caching
- **Tasks**:
  - [ ] Migrate `ScheduleWar.js` to use cached guild/channel data access
  - [ ] Migrate `TrackTable.js` to use cached context loading
  - [ ] Optimize permission checking with cached guild data
  - [ ] Implement cache strategies for scheduling data persistence
  - [ ] Test scheduling workflows with multiple concurrent users
- **Deliverables**: 
  - 2 scheduling commands using caching
  - Optimized permission checking performance
  - Enhanced concurrent user handling
- **Dependencies**: Milestone 3.1 completion
- **Risks**: 
  - **Risk**: Complex scheduling logic may have cache coherency issues
  - **Mitigation**: Implement careful cache TTL management for scheduling data

### Phase 4: Integration Commands and Optimization [Timeline: 1 week]
#### Milestone 4.1: ScoreBot Integration Commands
- **Objective**: Migrate Toad bot integration commands with specialized caching
- **Tasks**:
  - [ ] Migrate `Startwar.js` to use cached entity loading for score resets
  - [ ] Migrate `UpdateScore.js` to use cached context with score invalidation
  - [ ] Implement score-specific cache invalidation strategies
  - [ ] Optimize real-time score update performance
  - [ ] Test integration with actual Toad bot message patterns
- **Deliverables**: 
  - 2 ScoreBot integration commands using caching
  - Specialized score cache invalidation
  - Improved real-time update performance
- **Dependencies**: Milestone 3.2 completion
- **Risks**: 
  - **Risk**: Real-time score updates may require immediate cache invalidation
  - **Mitigation**: Implement immediate invalidation with performance monitoring

#### Milestone 4.2: Performance Optimization and Monitoring
- **Objective**: Implement comprehensive performance monitoring and optimization
- **Tasks**:
  - [ ] Add cache performance metrics to all migrated commands
  - [ ] Implement command-specific TTL optimization based on usage patterns
  - [ ] Create cache monitoring dashboard in Status command
  - [ ] Implement automatic cache warming for frequently accessed entities
  - [ ] Conduct comprehensive performance testing across all commands
- **Deliverables**: 
  - Comprehensive cache performance monitoring
  - Optimized TTL values for each command type
  - Cache warming strategies
  - Complete performance test results
- **Dependencies**: Milestone 4.1 completion
- **Risks**: 
  - **Risk**: Performance optimization may reveal cache capacity issues
  - **Mitigation**: Implement cache size monitoring and management

## Command Migration Specifications

### DirectMessage Commands (4 files)
#### DMHelp.js
```javascript
// Current: Basic help text display
// Migration: Add cached user context for personalized help
// TTL: 600 seconds (static content)
// Cache Keys: user:{userId}
```

#### SetHTML.js, SetStyle.js, SetImage.js
```javascript
// Current: Direct Profile.update() operations
// Migration: Use Helper.getUserProfilesCached() + invalidateUserCache()
// TTL: 300 seconds (user customizations)
// Cache Keys: profiles:{userId}
// Invalidation: After all update operations
```

### GuildMessage/Commands (5 files)
#### Setup.js
```javascript
// Current: CheckBaseData() + Helper.checkUserChannel()
// Migration: CheckBaseDataCached() + Helper.checkUserChannelCached()
// TTL: 600 seconds (setup data)
// Cache Keys: user_channel_check:{userId}:{channelId}
// Invalidation: After UserChannel activation
```

#### SetHome.js, SetGuest.js
```javascript
// Current: MKC API + direct database updates
// Migration: Use cached entity loading + cache invalidation after updates
// TTL: 600 seconds (team data)
// Cache Keys: guild:{guildId}, channel:{channelId}
// Invalidation: After team configuration updates
```

#### Status.js
```javascript
// Current: Static status information
// Migration: Add cache statistics and performance metrics
// TTL: 60 seconds (dynamic status)
// Cache Keys: cache_stats
```

#### GuildHelp.js
```javascript
// Current: Static help text
// Migration: Use cached context for personalized help
// TTL: 600 seconds (static content)
// Cache Keys: user:{userId}, guild:{guildId}
```

### GuildMessage/SetData (6 files)
#### HomeLogo.js, GuestLogo.js, HomeName.js, GuestName.js, HomeTag.js, GuestTag.js
```javascript
// Current: Direct Channel.update() operations
// Migration: Use Helper.getChannelCached() + invalidateChannelCache()
// TTL: 600 seconds (channel customizations)
// Cache Keys: channel:{channelId}
// Invalidation: After all customization updates
```

### GuildMessage/Scheduling (2 files)
#### ScheduleWar.js
```javascript
// Current: Permission checking + complex guild operations
// Migration: Use cached guild/channel data + optimized permission checking
// TTL: 300 seconds (scheduling data)
// Cache Keys: guild:{guildId}, channel:{channelId}, guild_users_by_guild:{guildId}
```

#### TrackTable.js
```javascript
// Current: Simple command with context loading
// Migration: Use CheckBaseDataCached() for context
// TTL: 600 seconds (static content)
// Cache Keys: Standard context caching
```

### ScoreBot (2 files)
#### Startwar.js, UpdateScore.js
```javascript
// Current: Score updates with database operations
// Migration: Use cached context + specialized score invalidation
// TTL: 60 seconds (real-time data)
// Cache Keys: Scores and overlay data
// Invalidation: Immediate after score updates
```

## Testing Strategy

### Unit Testing
- **Coverage Goals**: 100% of migrated commands tested for cache behavior
- **Key Components**: Cache hit/miss scenarios, invalidation patterns, fallback mechanisms
- **Mock Strategy**: Mock cache manager for testing cache failures and edge cases

### Integration Testing
- **Test Scenarios**: 
  - Multi-user concurrent access patterns
  - Cache invalidation cascades
  - Mixed cached/non-cached command sequences
- **Environment Setup**: Full Discord bot environment with cache monitoring
- **Data Requirements**: Representative production data patterns

### Performance Testing
- **User Journeys**: Complete user workflows (setup → configuration → usage)
- **Load Testing**: Concurrent user simulation with cache metrics
- **Cache Effectiveness**: Hit ratio measurement across different usage patterns

### Acceptance Testing
- **Acceptance Criteria**: 
  - All commands maintain identical user experience
  - 2-5x performance improvement for read operations
  - 80%+ cache hit ratio for frequently accessed entities
- **User Acceptance Tests**: Real user workflows with performance monitoring
- **Rollback Testing**: Ability to disable caching without breaking functionality

## Resource Planning

### Team Requirements
- **Roles Needed**: Backend developer familiar with Node.js, Discord.js, and caching patterns
- **Estimated Effort**: 60-80 person-hours over 3-4 weeks
- **Timeline**: Can be executed by single developer with phased approach

### Infrastructure Requirements
- **Development Environment**: Enhanced logging for cache performance monitoring
- **Testing Environment**: Full Discord bot stack with cache metrics collection
- **Production Changes**: None - caching is transparent enhancement

### External Dependencies
- **Library Updates**: None required - using existing dependencies
- **Database Changes**: None - cache layer is separate from MySQL schema
- **Approval Requirements**: Standard code review process

## Risk Management

### Technical Risks
- **Risk**: Cache invalidation timing issues causing stale data
  - **Probability**: Low
  - **Impact**: Medium
  - **Mitigation**: Implement immediate invalidation after updates with monitoring
  - **Contingency**: Cache TTL as safety net, monitoring for inconsistencies

- **Risk**: Memory usage growth from cache storage
  - **Probability**: Medium
  - **Impact**: Low
  - **Mitigation**: Configure cache size limits and implement LRU eviction
  - **Contingency**: Cache size monitoring with automatic cleanup

- **Risk**: Performance regression in update-heavy scenarios
  - **Probability**: Low
  - **Impact**: Medium
  - **Mitigation**: Benchmark update operations with invalidation overhead
  - **Contingency**: Selective caching for read-heavy operations only

### Business Risks
- **Risk**: User experience disruption during migration
  - **Probability**: Low
  - **Impact**: Medium
  - **Mitigation**: Phased rollout with comprehensive testing
  - **Contingency**: Feature flag to disable caching if issues arise

### Timeline Risks
- **Risk**: Complex command migration taking longer than estimated
  - **Probability**: Medium
  - **Impact**: Low
  - **Mitigation**: Prioritize high-impact commands first, parallel development
  - **Contingency**: Extend timeline for thorough testing over speed

## Success Metrics

### Technical Metrics
- **Performance**: 
  - Average command response time improvement: 200-500ms
  - Database query reduction: 60-80%
  - Cache hit ratio: 80%+ for read operations
- **Reliability**: 
  - Zero data consistency issues
  - 100% command functionality preservation
  - Fallback success rate: 100%

### Business Metrics
- **User Experience**: 
  - Faster command responses
  - Reduced latency during high-traffic periods
  - Maintained command reliability
- **System Health**: 
  - Reduced MySQL server load
  - Improved concurrent user handling
  - Enhanced system scalability

## Monitoring & Maintenance

### Monitoring Strategy
- **Cache Performance**: Hit/miss ratios, response times, memory usage
- **Command Performance**: Before/after comparison metrics
- **Error Monitoring**: Cache failures, fallback usage, invalidation issues

### Maintenance Plan
- **Regular Tasks**: Cache statistics review, TTL optimization, cleanup monitoring
- **Update Strategy**: Cache invalidation testing with new features
- **Performance Tuning**: Ongoing TTL and cache size optimization

## Migration Checklist

### Pre-Migration
- [ ] Verify CacheManager.js implementation is complete and tested
- [ ] Confirm all cached methods in SQLDataHelper.js are available
- [ ] Set up cache performance monitoring and logging
- [ ] Create backup plans for rollback scenarios

### Per-Command Migration
- [ ] Import Helper from SQLWrapper at top of file
- [ ] Replace direct model access with cached methods
- [ ] Add cache invalidation after update operations
- [ ] Update CheckBaseData to CheckBaseDataCached where applicable
- [ ] Test command functionality thoroughly
- [ ] Measure performance improvement
- [ ] Update documentation and comments

### Post-Migration
- [ ] Comprehensive integration testing across all commands
- [ ] Performance benchmarking and optimization
- [ ] Cache monitoring dashboard implementation
- [ ] User acceptance testing and feedback collection
- [ ] Production deployment with monitoring

## Appendices

### A. Command Classification by Caching Strategy
**High-Frequency Read Commands** (Aggressive caching, TTL: 600s):
- Setup.js, GuildHelp.js, Status.js, TrackTable.js

**User Data Modification Commands** (Moderate caching, TTL: 300s):
- SetHTML.js, SetStyle.js, SetImage.js, all SetData/*.js commands

**Real-Time Commands** (Minimal caching, TTL: 60s):
- Startwar.js, UpdateScore.js, ScheduleWar.js

**Configuration Commands** (Long caching, TTL: 600s):
- SetHome.js, SetGuest.js

### B. Cache Key Patterns
```javascript
// Entity-specific keys
`user:${userId}`
`guild:${guildId}`
`channel:${channelId}`

// Relationship keys
`user_channels:${userId}`
`guild_users_by_guild:${guildId}`
`profiles:${userId}`

// Context keys
`user_check:${userId}`
`guild_check:${guildId}`
`channel_check:${channelId}`
`user_channel_check:${userId}:${channelId}:${activate}`
```

### C. Performance Benchmarks
**Target Improvements**:
- Setup command: 800ms → 200ms (75% improvement)
- Status command: 400ms → 100ms (75% improvement)
- SetData commands: 600ms → 150ms (75% improvement)
- Real-time commands: 300ms → 200ms (33% improvement)

### D. Rollback Strategy
1. Feature flag: `ENABLE_CACHING=false` to disable all caching
2. Individual command flags for selective rollback
3. Automatic fallback to database on cache failures
4. Monitoring alerts for cache performance degradation
