import { SocketClient } from './ws.mjs';

export class OS {
    static get App() {
        return window._OS_INSTANCE;
    }

    static AUDIO = {
        _lib: {
            socketConnected: 'socket-connected.wav',
            socketDisconnected: 'socket-disconnected.wav',
            messageGot: 'message-got.wav',
            messageSent: 'message-sent.wav',
            userJoin: 'user-join.wav',
            userLeft: 'user-leave.wav'
        }, play: (name) => { return new Audio(`/assets/audio/${this.AUDIO._lib[name]}`).play(); }
    }
}


// SocketClient.connect();

window.OS = OS;
window._OS_INSTANCE = new OS();

OS.AUDIO.play('socketConnected');