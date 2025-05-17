/**
 * Main entry point for the Telegram Phone Links Bot
 * This bot converts phone numbers into useful links for various services
 */
const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN } = require('./config');
const { handleMessage } = require('./messageHandlers');

// Retry configuration
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 60000; // 1 minute
const MAX_RETRIES = 5;

// Create a bot instance with polling enabled and retry options
const bot = new TelegramBot(BOT_TOKEN, {
  polling: true,
  request: {
    retries: MAX_RETRIES,
    timeout: 30000, // 30 seconds
  }
});

console.log('Bot is starting...');

// Register message listener
bot.on('message', (msg) => {
  try {
    handleMessage(bot, msg);
  } catch (error) {
    console.error('Error handling message:', error);
    
    // Send a user-friendly error message
    bot.sendMessage(
      msg.chat.id, 
      '❌ Sorry, an error occurred while processing your request. Please try again later.',
      { parse_mode: 'Markdown' }
    );
  }
});

let retryCount = 0;
let retryDelay = INITIAL_RETRY_DELAY;

// Enhanced polling error handler with exponential backoff
bot.on('polling_error', async (error) => {
  console.error('Polling error:', error);

  if (error.code === 'ETELEGRAM' && error.response.statusCode === 404) {
    console.error('Invalid bot token detected. Please check your BOT_TOKEN in .env file');
    process.exit(1);
  }

  if (retryCount < MAX_RETRIES) {
    console.log(`Retrying connection in ${retryDelay/1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
    
    // Stop current polling
    await bot.stopPolling();
    
    // Wait for the retry delay
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    
    // Increase retry delay exponentially
    retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
    retryCount++;
    
    try {
      // Restart polling
      await bot.startPolling();
      console.log('Polling resumed successfully');
      
      // Reset counters on successful connection
      retryCount = 0;
      retryDelay = INITIAL_RETRY_DELAY;
    } catch (startError) {
      console.error('Failed to restart polling:', startError);
    }
  } else {
    console.error('Maximum retry attempts reached. Please check your internet connection and bot token.');
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping bot...');
  bot.stopPolling();
  process.exit(0);
});

console.log('Bot is running and waiting for messages...');