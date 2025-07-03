# ToadOverlay - AI Agent Instructions

## Project Overview
ToadOverlay is a Discord bot extension for competitive Mario Kart 8 streamers that provides customizable browser source overlays for OBS/Streamlabs. The bot integrates with the existing "Toad" bot to display live scores, team information, and match data during streams. It serves HTML overlays via web endpoints that streamers can use as browser sources in their streaming software.

## Key Features
- **Live Score Tracking**: Real-time score updates from Mario Kart matches via Toad bot integration
- **Team Management**: Support for home/guest team configurations with MarioKartCentral.com integration
- **Customizable Overlays**: HTML/CSS/JS overlays with custom styling, logos, and team data
- **Multi-Instance Support**: Multiple overlay instances per Discord server/channel
- **Web Interface**: Browser-accessible overlay endpoints for streaming software
- **Comprehensive Logging**: Multi-level logging system (console, file, database)

## 🛠️ Available Discord MCP Tools

The project integrates with discord-mcp for Discord API operations during development and testing:

#### Server Information
 - [`get_server_info`](): Get detailed discord server information

#### Message Management
 - [`send_message`](): Send a message to a specific channel
 - [`edit_message`](): Edit a message from a specific channel
 - [`delete_message`](): Delete a message from a specific channel
 - [`read_messages`](): Read recent message history from a specific channel
 - [`send_private_message`](): Send a private message to a specific user
 - [`edit_private_message`](): Edit a private message from a specific user
 - [`delete_private_message`](): Delete a private message from a specific user
 - [`read_private_messages`](): Read recent message history from a specific user
 - [`add_reaction`](): Add a reaction (emoji) to a specific message
 - [`remove_reaction`](): Remove a specified reaction (emoji) from a message

#### Channel Management
 - [`create_text_channel`](): Create text a channel
 - [`delete_channel`](): Delete a channel
 - [`find_channel`](): Find a channel type and ID using name and server ID
 - [`list_channels`](): List of all channels

#### Category Management
 - [`create_category`](): Create a new category for channels
 - [`delete_category`](): Delete a category
 - [`find_category`](): Find a category ID using name and server ID
 - [`list_channels_in_category`](): List of channels in a specific category

### Testing Environment

For development and testing of Discord integrations, use:
- **Test Server**: `Copilot Debugging` (ID: `1389974396768096428`)
- **Test Category**: `Testing` (ID: `1389974397485580409`)
- **Test Channel**: `toadoverlay` (ID: `1389988127224889404`)

## Tech Stack
- **Runtime**: Node.js 18.18.2
- **Framework**: Discord.js v14.13.0
- **Database**: MySQL 2 with Sequelize ORM v6.29.1
- **Deployment**: Docker with Docker Compose
- **External APIs**: MarioKartCentral API integration
- **Environment**: Supports both local (.env) and Docker secret-based configuration

## Project Architecture

### Top-Level Directory Structure
```
├── index.js                # Main entry point and Discord client initialization
├── package.json            # Dependencies and scripts
├── Dockerfile              # Container configuration
├── compose.yaml            # Docker Compose service definition
├── README.md               # Project documentation
├── .github/
│   ├── copilot-instructions.md  # AI agent instructions (this file)
│   ├── docs/               # AI agent generated documentation
│   └── plans/              # GitHub Copilot plans
├── app_data/               # Runtime data directory (logs, schedules)
├── ClientHandlers/         # Discord client event and message handling
├── CommandsMessage/        # Command implementations
├── Data/                   # Database models and SQL operations
├── Help/                   # Help text and instruction content
├── Log/                    # Logging system implementation
├── Modules/                # Additional feature modules
└── Test/                   # Test utilities and mock data
```

### Key Source Directories

#### ClientHandlers/
Core Discord.js client management and event handling:
- `ClientHandler.js` - Main client initialization, database sync, event setup
- `ClientEventHandler.js` - Discord client event listeners
- `MessageHandler.js` - Legacy message-based command routing
- `ReactionHandler.js` - Discord reaction event handling
- `MessageContext.js` - Command execution context wrapper
- `MessageValidations.js` - Message type validation utilities
- `DataContext.js` - Database context for commands

#### CommandsMessage/
Command implementations organized by context:
- `DirectMessage/` - Private message commands (HTML/CSS/image setup)
- `GuildMessage/Commands/` - Server commands (setup, configuration)
- `GuildMessage/Scheduling/` - War scheduling functionality
- `GuildMessage/SetData/` - Team data configuration commands
- `ScoreBot/` - Toad bot integration commands

#### Data/
Database layer with Sequelize ORM:
- `SQLBase.js` - Database connection configuration
- `SQLWrapper.js` - Main data access layer with entity relationships
- `SQLDataHelper.js` - Common database operations
- `Entities/` - Sequelize model definitions for all tables

#### Log/
Comprehensive logging system:
- `Logger.js` - Main logging interface
- `LogConsole.js`, `LogFile.js`, `LogNoSQL.js` - Output-specific loggers
- `LogLevel.js`, `LogStatus.js`, `LogType.js` - Logging enumerations

### Discord.js Bot System Architecture

#### Command System
The bot uses a **legacy message-based command system** (not slash commands):
- Commands are prefixed with `_` (configurable via `PREFIX` environment variable)
- Commands are prefixed with `-` in debug mode for easier testing
- Three command contexts: Guild Messages, Direct Messages, and ScoreBot integration
- Commands are dynamically loaded from filesystem using `readdirSync()`
- Each command exports: `name`, `alt` (aliases), `description`, and `execute(context)` function

#### Message Flow
1. `MessageHandler.js` receives all Discord messages via `Events.MessageCreate`
2. `MessageValidations.js` determines message type (user command, private message, Toad bot message)
3. Commands are matched by name or aliases and executed with `MessageContext`
4. Database operations logged via comprehensive logging system

#### Event Handling
- Client initialization in `ClientHandler.js` sets up all event listeners
- Database tables synchronized in specific order due to foreign key dependencies
- Keepalive mechanism prevents Discord timeouts (sends periodic messages)

## Coding Standards

### File Organization
- **PascalCase** for class/module and utility files (`MessageHandler.js`, `SQLWrapper.js`, `messageValidations.js`)
- Commands organized by functional context in subdirectories
- Database entities in dedicated `Entities/` subfolder

### Code Conventions
- **async/await** pattern throughout (no Promise chains)
- **JSDoc comments** for function parameters and return types
- **Module.exports** object pattern for utilities and handlers
- **Destructuring** for Discord.js imports and database entities
- **Environment variables** for all configuration (no hardcoded values)

### Error Handling
- Comprehensive logging at multiple levels (Trace, Debug, Info, Warn, Error, Fatal)
- Database operations wrapped with try/catch and logged
- Process exit codes for different failure scenarios (1, 3, 15)
- Graceful handling of Discord API failures and reconnection

### Database Patterns
- **Sequelize ORM** with explicit foreign key relationships
- **Helper functions** in `SQLDataHelper.js` for common operations
- **Entity synchronization** in dependency order during startup
- **Lazy loading** of database connections and entities

### Environment Configuration
- **Docker secrets** support for production deployment
- **dotenv** fallback for local development
- **Cross-platform** path handling (Windows/Linux directory separators)
- **Runtime folder creation** for logs and data storage

## Development Guidelines

### Adding New Commands
1. Create command file in appropriate `CommandsMessage/` subdirectory
2. Export object with `name`, `alt`, `description`, and `execute(context)` function
3. Use `MessageContext` parameter for message and database access
4. Add comprehensive logging with appropriate log levels
5. Commands auto-loaded by `MessageHandler.js` on startup

### Database Changes
1. Modify entity models in `Data/Entities/`
2. Update relationships in `SQLWrapper.js`
3. Ensure sync order in `ClientHandler.js` respects foreign key dependencies
4. Test with both fresh database and migrations

### Adding New Features
1. Follow existing modular pattern in `Modules/` directory
2. Integrate via `ClientHandler.js` initialization sequence
3. Use established logging patterns for debugging and monitoring
4. Consider both Docker and local development environments

### Environment Variables
Always use environment variables for:
- API tokens and secrets
- Database connection details
- Feature flags and configuration
- File paths and external service URLs