import * as COMMANDS from '../../ws/commands.mjs'; 

export class SocketClient {
    _socket;
    _id;
    _token;
    _name;
    _color;
    _path;
    _process = null;
    _containers;
    _onlineUsers = [];

    get WS_AUTH() {
        return {
            id: this._id,
            token: this._token,
            name: this._name,
            color: this._color,
            path: this._path
        }
    }

    get name() {
        return this._name;
    }

    get process() {
        return this._process;
    }

    set process(value) {
        this._appendToHistory(value === null ? `locking process removed` : `locking process changed to ${value.text} (use ctrl+c to exit)`, { isLog: true, sender: { module: 'LOCKER' } });
        this._process = value;
    }

    set id(value) { this.updateWSAuth('id', value); }
    set token(value) { this.updateWSAuth('token', value); }
    set color(value) { this.updateWSAuth('color', value); }
    set name(value) { this.updateWSAuth('name', value); }


    constructor() {
        this._socket = new WebSocket(`ws://${window.location.host}:8082`);
        this._socket.onopen = this.socketOnOpen;
        this._socket.onclose = this.socketOnClose;
        this._socket.onerror = this.socketOnError;
        this._socket.onmessage = this.socketOnMessage;
    }

    auth(data) {
        let authData = JSON.parse(window.localStorage.getItem('ws_auth'));
        if (authData === null) authData = { token: data.token };

        for (const [key, value] of Object.entries(authData)) this[key] = value;

        this._socket.send(JSON.stringify({ type: 'WS_AUTH', data: authData }));
    }

    socketOnOpen(event) {
        window._OS.socketClient._appendToHistory('websocket connected', { isLog: true, sender: { module: 'SOCKET' } }); 
        window._audioFiles.socket.connected.play();

        window._OS.socketClient.containers.status.innerText = 'online';
    }

    socketOnClose(event) {
        window._OS.socketClient._appendToHistory('websocket connection closed. reconnecting', { isLog: true, sender: { module: 'SOCKET' } });
        window._audioFiles.socket.disconnected.play();

        window._OS.socketClient.containers.status.innerText = 'offline';
    }

    socketOnError(event) {
        window._OS.socketClient._appendToHistory('websocket connection error!', { isLog: true, sender: { module: 'SOCKET' } });
        console.error(event);
        
        window._OS.socketClient.socketOnClose(event);
    }
    
    socketOnMessage(event) {
        let input = JSON.parse(event.data);

        switch (input.type) {
            case 'WS_AUTH': window._OS.socketClient.auth(input.data); break;
            case 'WS_AUTH_SUCCESS': window._OS.socketClient.id = input.data.id; break;
            case 'WS_AUTH_UPDATE': 
                for (const [key, value] of Object.entries(input.data)) window._OS.socketClient.updateWSAuth(key, value); 
                break;
            case 'USERS': window._OS.socketClient.actualizeAddresses(input.data); break;
            case 'MESSAGE_LOG':
            case 'MESSAGE_CHAT': 
                let messageBlock = createMessageBlock({ style: { color: input.data.color ?? 'inherit' }, text: `${input.data.from}@${input.data.to}` }, { text: `: ${input.data.text}` }); 
                window._OS.socketClient._appendToHistory(messageBlock, input.type == 'MESSAGE_LOG');
                if (input.type == 'MESSAGE_CHAT') window._audioFiles.message.got.play();
                break;
            case 'PROCESS_LOCK':
            case 'PROCESS_UNLOCK': 
                // let messageBlock = createMessageBlock({ style: { color: input.data.color ?? 'inherit' }, text: `${input.data.from}@${input.data.to}` }, { text: `: ${input.data.text}` }); 
                // window._OS.socketClient._appendToHistory(messageBlock, input.type == 'MESSAGE_LOG');
                // if (input.type == 'MESSAGE_CHAT') window._audioFiles.message.got.play();
                break;
            default: break;
        }
    }

    socketSend(message) {
        this._socket.send(JSON.stringify(message));
    }

    updateWSAuth(key, value) {
        this[`_${key}`] = value;
        console.log([this, key]);
        this.containers[key].innerText = value;

        this._appendToHistory(`${key} updated to ${value}`, { isLog: true, sender: { module: 'WS_AUTH' } });
        window.localStorage.setItem('ws_auth', JSON.stringify(this.WS_AUTH));
    } 

    actualizeAddresses(data) {
        const update = function (user) {
            if (user.action == 'LEAVE') {
                window._audioFiles.user.left.play();

                window._OS.socketClient._onlineUsers = window._OS.socketClient._onlineUsers.filter(contact => contact.id !== user.id);
                window._OS.socketClient._appendToHistory(`${user.text} disconnected`, { isLog: true, sender: { module: 'CLIENTS' } });
            } else if (user.action == 'JOIN' || user.action == 'ACTUALIZING') {
                window._OS.socketClient._onlineUsers.push(user);

                if (user.action == 'JOIN') {
                    window._audioFiles.user.join.play();
                    window._OS.socketClient._appendToHistory(`${user.text} connected`, { isLog: true, sender: { module: 'CLIENTS' } });
                }
            }
        }
        
        data.users.forEach(update);   
    }

    parseInput(formData) {
        let body = { type: 'OS_COMMAND', data: formData }
        
        if (body.data.text) {
            if (this.process == null) {
                if (body.data.text.startsWith('/')) body = this._parseChatCommand(body);
                else body = this._parseSystemCommand(body);
            } else { 
                console.log(123);
            }
        }



        // if (fd.text.trim() != '') parseInput(fd);

        if (fd.text.trim() != '') {
            if (fd.text.startsWith('/')) { // 1
                window._OS.socketClient._appendToHistory(`you called ${fd.text}`, true);
                window._OS.socketClient._socket.send(JSON.stringify({
                    type: 'MESSAGE_COMMAND',
                    data: fd
                }));
            } else {
                let messageBlock = createMessageBlock({ style: { color: window._OS.socketClient.color ?? 'inherit' }, text: `${window._OS.socketClient.name ?? 'you'}@${fd.to}: ` }, { text: fd.text });

                window._OS.socketClient._appendToHistory(messageBlock, false, true);
                window._OS.socketClient._socket.send(JSON.stringify({
                    type: 'MESSAGE_CHAT',
                    data: fd
                }));
            }

            window._audioFiles.message.sent.play();
            e.currentTarget.querySelector('input').value = '';
        }
    }

    _parseChatCommand() {

    }

    _appendToHistory(text, params = {}) {
        let historyRow = document.createElement('div');
        historyRow.classList.add('history-row');

        historyRow.classList.toggle('mine', params.isMine === true);
        historyRow.classList.toggle('log', params.isLog === true);

        let timeSpan = document.createElement('span');
        timeSpan.classList.add('timestamp');
        timeSpan.innerText = `${new Date().toLocaleString()} | `;
        historyRow.appendChild(timeSpan);

        let senderSpan = document.createElement('span');
        senderSpan.classList.add('sender');
        senderSpan.innerText = `${params.sender?.name ?? 'OS'}${params.sender?.module ? `.${params.sender.module}` : ''}${params.sender?.at ? `@${params.sender.at}` : ''}: `;

        if (params.sender?.style) senderSpan.style = params.sender.style;
        historyRow.appendChild(senderSpan);

        if (Array.isArray(text)) text.forEach(textSpan => {
            textSpan.classList.add('content');

            historyRow.appendChild(textSpan);
        }); else if (text instanceof HTMLElement) {
            text.classList.add('content');

            historyRow.appendChild(text);
        } else {
            let textSpan = document.createElement('span');
            textSpan.classList.add('content');
            textSpan.innerText = text;

            historyRow.appendChild(textSpan);
        }

        this.containers.history.appendChild(historyRow);
    }

    static connect() {
        return new SocketClient();
    }
}


