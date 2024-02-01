const WebSocket = require('ws');

const ws = new WebSocket('wss://radial-compatible-panorama.solana-devnet.quiknode.pro/82da712d6b72152691aba84b5571f6bec5f2f233/');

ws.on('open', () => {
  console.log('WebSocket connection opened.');

  const subscribeRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'accountSubscribe',
    params: [
      'E8ErhWi252vBcqbmMb3ZR6UBYKmYyk5PDXAGps874QT8',
      {
        encoding: 'base58',
        commitment: 'confirmed'
      }
    ]
  };

  ws.send(JSON.stringify(subscribeRequest));
});

ws.on('message', (data) => {
  
   
  const messageString = data.toString('utf-8');
  console.log(messageString); 
  // try {
  //   // Parse the string as JSON
  //   const messageJSON = JSON.parse(messageString);
  //   console.log('Received message:', messageJSON);
  // } catch (error) {
  //   console.error('Error parsing JSON:', error);
  // }
});

ws.on('close', (code, reason) => {
  console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});