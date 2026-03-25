import { SocketClientTable } from './SocketClientTable.js';
import { WebSocketServer } from 'ws';

const heartbeatInterval = 10;
const server = Object.assign(
    new WebSocketServer({ port: 8082 }), 
    { SocketClientTable: SocketClientTable }
);

server.on('connection', client => {
    client = Object.assign(client, {
        alive: true,
        authorized: false,
        token: generateToken(),
        socketClient: function() {
            return server.SocketClientTable.findByToken(client.token);
        }
    });
    
    client.send(JSON.stringify({ type: 'AUTH', data: { token: client.token } }));

    client.on('message', e => { parseMessage(e, client) });
    client.on('pong', e => { client.alive = true; });
    client.on('close', e => { 
        let socketClient = client.socketClient();

        if (socketClient) {
            socketClient.destroySocket(client.id);

            if (socketClient.sockets.length == 0) {
                SocketClientTable.massSend({ 
                    users: [{
                        id: socketClient.id,
                        text: socketClient.name,
                        action: 'LEAVE'
                    }
                ]}, 'USERS', [socketClient.id]);
            }
        }
    });
})

setInterval(heartbeat, heartbeatInterval * 1000);

function parseMessage(e, client) {
    let input = JSON.parse(e.toString()),
        sender = client.socketClient();

    switch (input.type) {
        case 'AUTH': authClient(client, input.data); break;
        case 'MESSAGE_CHAT': sendChatMessage(sender, input.data); break;
        case 'MESSAGE_COMMAND': parseCommand(sender, input.data); break;
        default: break; 
    }
}

function authClient(client, data) {
    if (client.token !== data.token) client.token = data.token;

    let socketClient = client.socketClient();
    if (!socketClient) socketClient = server.SocketClientTable.push(client);
    else socketClient.pushSocket(client);
    
    if(data.color) socketClient.color = data.color;
    if(data.name) socketClient.name = data.name;

    client.authorized = true;

    if (socketClient.banned) socketClient.terminate();

    if (socketClient.sockets.length == 1) {
        SocketClientTable.massSend({ 
            users: [{
                id: socketClient.id,
                text: socketClient.name,
                action: 'JOIN'
            }
        ]}, 'USERS', [socketClient.id]);
    }

    let usersOnline = SocketClientTable.socketClients.map(anotherSocketClient => { 
        if (anotherSocketClient.id !== socketClient.id) return {
            id: anotherSocketClient.id,
            text: anotherSocketClient.name,
            action: 'ACTUALIZING'
        } 
    }).filter(client => client);

    socketClient.send({ users: usersOnline }, 'USERS');
    socketClient.send({ id: socketClient.id }, 'AUTH_SUCCESS');
}

function sendChatMessage(sender, data) {
    if (sender != null) {
        let reciever = server.SocketClientTable.findById(data.to);
        let words = data.text.split(' ');
        let parsedInput = [];

        words.forEach(word => {
            if (word.length > 80) parsedInput = parsedInput.concat(word.match(/.{1,80}/g));
            else parsedInput.push(word);
        });

        data.text = parsedInput.join(' ');

        if (data.to == 'all') server.SocketClientTable.massSend({ to: data.to, from: sender.name ?? sender.id, color: sender.color, text: data.text }, 'MESSAGE_CHAT', [sender.id]);
        else if (reciever) reciever.send({ to: data.to, from: sender.name ?? sender.id, color: sender.color, text: data.text });
        else sender.send({ from: 'OS', text: 'user not found' }, 'MESSAGE_LOG');
    }
}

function parseCommand(sender, data) {
    let args = data.text.split(' '),
        cmd = args.shift();

    switch (cmd) {
        case '/name': 
            sender.name = args.join(' ');
            sender.send({ name: args.join(' ') }, 'WS_AUTH_UPDATE');

            break;
        case '/color': 
            let hexColor = args[0].substring(1, 7);
            if (isNaN(parseInt(hexColor.substring(1,7), 16))) sender.send({ from: 'OS', text: `invalid value entered` }, 'MESSAGE_LOG');
            else {
                sender.color = `#${hexColor}`;
                sender.send({ color: `#${hexColor}` }, 'WS_AUTH_UPDATE');
            }
            break;
        case '/ban':
            let user = server.SocketClientTable.findByName(args[0]);
            if (user) {
                user.banned = true;
                user.terminate();
            } break;
        case '/online': 
            sender.send({ from: 'OS', text: `Users online: ${server.SocketClientTable.socketClients.filter(socketClient => socketClient.alive).map(socketClient => { return socketClient.name }).join(', ')}` }, 'MESSAGE_LOG');

            break;
        default:
            break; 
    }
}

function heartbeat() {
    console.log('new pulse');
    console.log(server.SocketClientTable.socketClients.map(socketClient => { return [socketClient.alive, socketClient.name, socketClient.banned, socketClient._sockets] }))
    server.SocketClientTable.socketClients.forEach(socketClient => {
        socketClient.sockets.forEach(socket => {
            if (!socket.alive || !socket.authorized) {
                console.log(socketClient);

                socket.terminate();
                socketClient.destroySocket(socket.id);
            }
            else {
                socket.alive = false;
                socket.ping();
            }
        });
    })
    console.log('======');
}

function generateToken(length = 30, allowRepeats = false) {
    const alphabet = String('ABCDEFGHIKLMNOPQRSTVXYZabcdefghiklmnopqrstvxyz1234567890').split('');

    let index, letter, token = '';
    for (let i = 0; i < length; i++) {
        do {
            index = Math.floor(Math.random() * alphabet.length);
            letter = alphabet[index];
        } while (letter === null);

        token += letter;
        if (!allowRepeats) alphabet[index] = null;
    }

    return token;
}