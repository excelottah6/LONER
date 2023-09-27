const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const SESSION_FILE_PATH = './session/session.json'; // Change this path as needed

let sessionData;

// Load session data if it exists
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionData,
});

client.on('qr', (qr) => {
  console.log('Scan the QR code to log in:');
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('Authenticated as ' + session.user.name);
  // Save the session data to a file
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();

// Helper function to send a stylish menu
function sendStylishMenu(to, userPrefix) {
  // Customize and send your menu here
  const menu = `
╭───────╮
│ My Bot Menu │
├───────╯
│ Available commands:
│
│ 1. ${userPrefix}hello: Greet the bot
│ 2. ${userPrefix}say [text]: Make the bot say something
│ 3. ${userPrefix}menu: Show available commands
│
╰─────────────╯
`;
  client.sendMessage(to, menu);
}

// Handle incoming messages
client.on('message', async (message) => {
  const { body, from, to } = message;
  const userPrefix = '/'; // User-defined prefix, you can set it as needed

  if (body === `${userPrefix}hello`) {
    await client.sendMessage(from, `Hello! How can I assist you?`);
  } else if (body.startsWith(`${userPrefix}say `)) {
    const text = body.slice(`${userPrefix}say `.length);
    await client.sendMessage(from, text);
  } else if (body === `${userPrefix}menu`) {
    sendStylishMenu(from, userPrefix);
  }
});

// Handle other events and bot logic as needed
