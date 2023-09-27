const fs = require('fs');
const { Client } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json'; // Change this to your session file path

let sessionData;

// Load session data if available
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionData,
  puppeteer: {
    args: ['--no-sandbox'],
  },
});

client.on('qr', (qrCode) => {
  console.log('Scan the QR code below to authenticate:');
  console.log(qrCode);
});

client.on('authenticated', (session) => {
  console.log('Authenticated!');
  // Save the session data to a file
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
});

client.on('ready', () => {
  console.log('WhatsApp bot is ready!');
});

client.on('message', (message) => {
  // Handle incoming messages here
});

client.initialize();

// Handle disconnects
client.on('disconnected', (reason) => {
  console.log('Disconnected:', reason);
  // You can add code here to automatically reconnect if desired
});

// Start the bot
client.initialize();

