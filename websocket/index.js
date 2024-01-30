const WebSocket = require('ws');

const ws = new WebSocket('wss://radial-compatible-panorama.solana-devnet.quiknode.pro/82da712d6b72152691aba84b5571f6bec5f2f233/');

ws.on('open', () => {
  console.log('WebSocket connection opened.');

  const subscribeRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'accountSubscribe',
    params: [
      '9w5mNyu2vfpG2ATs1whoe6kvPdD7FWEHYUZVWVPk1VpR',
      {
        encoding: 'jsonParsed',
        commitment: 'finalized'
      }
    ]
  };

  ws.send(JSON.stringify(subscribeRequest));
});

ws.on('message', (data) => {
  // Convert the Buffer to a string
  const messageString = data.toString('utf-8');

  try {
    // Parse the string as JSON
    const messageJSON = JSON.parse(messageString);
    console.log('Received message:', messageJSON);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});

ws.on('close', (code, reason) => {
  console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});