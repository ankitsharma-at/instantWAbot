/**
 * Message handlers for different types of Telegram bot interactions
 */
const { isValidPhoneNumber, formatPhoneNumber, generateLinks } = require('./phoneUtils');

/**
 * Handles the /start command
 * @param {Object} bot - The Telegram bot instance
 * @param {Object} msg - The message object
 */
function handleStartCommand(bot, msg) {
  const chatId = msg.chat.id;
  const welcomeMessage = 
    "👋 *Welcome to Phone Links Bot!*\n\n" +
    "Send me a phone number (with or without country code), and I'll provide you with useful links.\n\n" +
    "For example, you can send:\n" +
    "- `1234567890` (I'll assume it's an Indian number)\n" +
    "- `919876543210` (with country code)\n\n" +
    "I'll give you links for WhatsApp, Truecaller, SMS, and direct calling.";
  
  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
}

/**
 * Handles phone number input
 * @param {Object} bot - The Telegram bot instance
 * @param {Object} msg - The message object
 */
function handlePhoneNumber(bot, msg) {
  const chatId = msg.chat.id;
  const input = msg.text;
  
  if (!isValidPhoneNumber(input)) {
    bot.sendMessage(
      chatId, 
      "⚠️ That doesn't look like a valid phone number. Please send a number with 9-15 digits.",
      { parse_mode: 'Markdown' }
    );
    return;
  }
  
  const formattedNumber = formatPhoneNumber(input);
  const links = generateLinks(formattedNumber);
  
  const responseMessage = 
    `✅ *Phone Links for ${formattedNumber}*\n\n` +
    `🟢 [WhatsApp Chat](${links.whatsapp})\n` +
    `🔍 [Truecaller Lookup](${links.truecaller})\n` +
    `💬 [Send SMS](${links.sms})\n` +
    `📞 [Make Call](${links.call})`;
  
  bot.sendMessage(chatId, responseMessage, { 
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  });
}

/**
 * Routes the message to the appropriate handler
 * @param {Object} bot - The Telegram bot instance
 * @param {Object} msg - The message object
 */
function handleMessage(bot, msg) {
  const text = msg.text || '';
  
  // Handle /start command
  if (text.startsWith('/start')) {
    handleStartCommand(bot, msg);
    return;
  }
  
  // Ignore other slash commands
  if (text.startsWith('/')) {
    return;
  }
  
  // Try to handle as phone number
  handlePhoneNumber(bot, msg);
}

module.exports = {
  handleMessage,
};