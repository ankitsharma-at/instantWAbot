/**
 * Configuration module for the Telegram bot
 * Loads environment variables and validates required values
 */
require('dotenv').config();

// Validate that the BOT_TOKEN is present
if (!process.env.BOT_TOKEN) {
  console.error('BOT_TOKEN is not defined in .env file');
  process.exit(1);
}

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
};