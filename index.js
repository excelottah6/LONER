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

// Handle your bot logic here
client.on('message', (message) => {
  // Handle incoming messages
  console.log('Received message:', message.body);
});

// Handle other events and bot logic as needed
