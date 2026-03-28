// import { OS } from './os.mjs';
console.log('привет');
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


document.addEventListener('DOMContentLoaded', () => {
    document.forms.send.onsubmit = e => {
        e.preventDefault();
        e.stopImmediatePropagation();

        let fd = {};
        (new FormData(e.currentTarget)).forEach((value, key) => {  fd[key] = typeof value == 'string' ? value.trim() : value });

        window._OS.socketClient.parseInput(fd);
        e.currentTarget.querySelector('input[name="text"]').value = '';

        return false;
    }
})

// window._OS = new OS(); 