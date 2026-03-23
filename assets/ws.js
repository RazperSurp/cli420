window.socket = connect();
window.WS_AUTH = JSON.parse(window.localStorage.getItem('ws_auth')) ?? {};

window.socket.onopen = e => {
    appendToHistory('websocket connected', true)
    document.querySelector('#socket-status > u').innerText = 'online';
};

window.socket.onmessage = e => {
    let input = JSON.parse(e.data);

    switch (input.type) {
        case 'AUTH': 
            auth(input.data); 
            break;
        case 'AUTH_SUCCESS': 
            document.querySelector('#client-id').innerText = input.data.id; 
            appendToHistory(`recieved id ${input.data.id}`, true); 
            break;
        case 'WS_AUTH_UPDATE':
            updateWSAuth(input.data);
            break;
        case 'MESSAGE_LOG':
        case 'MESSAGE_CHAT': 
            let messageBlock = createMessageBlock({ style: { color: input.data.color ?? '#000000' }, text: `${input.data.from}@${input.data.to}` }, { text: `: ${input.data.text}` }); 
            appendToHistory(messageBlock, input.type == 'MESSAGE_LOG');
            break;
        case 'USERS': 
            actualizeAddresses(input.data); 
            break;
        default: break;
    }
    
};

window.socket.onclose = e => {
    appendToHistory('websocket connection closed. reconnecting', true)
    document.querySelector('#socket-status > u').innerText = 'offline';
    window.socket = connect();
}

window.socket.onerror = e => {
    appendToHistory('websocket connection error. reconnecting', true)
    window.socket = connect();
}

function connect() {
    return new WebSocket(`ws://26.44.196.200:8082`);
    // return new WebSocket(`ws://192.168.65.116:8082`);
    // return new WebSocket(`ws://192.168.62.87:8082`);
    // return new WebSocket(`ws://127.0.0.1:8082`);
    // return new WebSocket(`ws://${window.location.host}:8082`);
}

function auth(data) {
    let authData = JSON.parse(window.localStorage.getItem('ws_auth'));
    if (authData === null) { 
        authData = { token: data.token };
        updateWSAuth(authData);
    }

    window.socket.send(JSON.stringify({ type: 'AUTH', data: authData }));
    appendToHistory(`logged with token ${authData.token}`, true)
}

function actualizeAddresses(data) {
    const usersSelect = document.querySelector('#send > select[name="to"]');
    const update = function (user) {
        let option = usersSelect.querySelector(`option[value="${user.id}"]`);

        if (user.action == 'LEAVE' && option) {
            option.remove();
            
            appendToHistory(`${user.text} disconnected`, true);
        } else if (user.action == 'JOIN' || user.action == 'ACTUALIZING') {
            if (!option) {
                option = document.createElement('option');
                option.value = user.id;
                option.innerText = user.text;

                usersSelect.appendChild(option);

                if (user.action == 'JOIN') appendToHistory(`${user.text} connected`, true);
            }
        }

    
    }

    data.users.forEach(update);   
}

function createMessageBlock(...messages) {
    let span, spans = [];
    messages.forEach(message => {
        span = document.createElement('span');

        if (message.style !== null && message.style !== undefined && Object.keys(message.style).length > 0) {
            for (const [key, value] of Object.entries(message.style)) {
                span.style[key] = value;
            }
        }

        span.innerText = message.text;

        spans.push(span);
    })

    return spans;
}

function updateWSAuth(data) {
    window.WS_AUTH = Object.assign(JSON.parse(window.localStorage.getItem('ws_auth')) ?? {}, data);
    window.localStorage.setItem('ws_auth', JSON.stringify(window.WS_AUTH));

    for (const [key, value] of Object.entries(data)) {
        appendToHistory(`WS_AUTH: ${key} changed to ${value}`, true);
    }
}

function appendToHistory(text, isLog, isMine = false) {
    let timestamp = document.createElement('span');
    timestamp.innerText = `${new Date().toLocaleString()} | `;

    let historyRow = document.createElement('div');

    historyRow.appendChild(timestamp);

    if (typeof text === 'string') {
        let textSpan = document.createElement('span');
        textSpan.innerText = text;

        historyRow.appendChild(textSpan);
    } else if (Array.isArray(text)) text.forEach(part => { historyRow.appendChild(part) });

    if (isLog) historyRow.classList.add('history-log');
    if (isMine) historyRow.classList.add('history-mine');

    document.querySelector('#history').appendChild(historyRow);
}

document.addEventListener('DOMContentLoaded', () => {
    document.forms.send.onsubmit = e => {
        e.preventDefault();
        e.stopImmediatePropagation();

        let fd = {};
        (new FormData(e.currentTarget)).forEach((value, key) => { fd[key] = value; })
        if (fd.text.trim() != '') {
            if (fd.text.startsWith('/')) { // 1
                appendToHistory(`you called ${fd.text}`, true);
                window.socket.send(JSON.stringify({
                    type: 'MESSAGE_COMMAND',
                    data: fd
                }));
            } else {
                let messageBlock = createMessageBlock({ style: { color: window.WS_AUTH.color ?? '#000000' }, text: `${window.WS_AUTH.name ?? 'you'}@${fd.to}: ` }, { text: fd.text });

                appendToHistory(messageBlock, false, true);
                window.socket.send(JSON.stringify({
                    type: 'MESSAGE_CHAT',
                    data: fd
                }));
            }

            e.currentTarget.querySelector('input').value = '';
        }

        return false;
    }
})