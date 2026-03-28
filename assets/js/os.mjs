import { SocketClient } from './ws.mjs';

export class OS {
    static get App() { return window._OS_INSTANCE; }
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
    
    /* == private props start == */
        _name;
    /* == == == == == == == == */


    /* == public props start == */
        socketClient;
    /* == == == ====== == == == */


    /* == getters start == */
        get name() { return this_.name; }
        get homePath() { return `/home/user/${this.name}`; }
        get path() { return this._path == this.homePath ? `~` : this._path; }
        get containers() { 
            if (!this._containers) {
                this._containers = {
                    id: document.querySelector('#debug-info #id'),
                    color: document.querySelector('#debug-info #color'),
                    status: document.querySelector('#debug-info #status'),
                    token: document.querySelector('#debug-info #token'),
                    name: document.querySelector('#cli-input #name'),
                    path: document.querySelector('#cli-input #path'),
                    history: document.querySelector('#history')
                }
            }

            return this._containers;
        }
    /* == == == ====== == == == */


    /* == setters start == */
        set name(value) { this._name = value; } 
    /* == == == == == == == == */

    constructor() {
        this.socketClient = SocketClient.connect();
        this.name 
    }
}

// SocketClient.connect();

window.OS = OS;
window._OS_INSTANCE = new OS();

OS.AUDIO.play('socketConnected');