import { SocketClient } from './ws.mjs';

export class OS {
    static AUDIO = {
        user: {
            join: {
                src: '/assets/audio/user-join.wav',
                play: function () { (new Audio(this.src)).play() }
            }, 
            left: {
                src: '/assets/audio/user-leave.wav',
                play: function () { (new Audio(this.src)).play() }
            }
        }, 
        message: {
            got: {
                src: '/assets/audio/message-got.wav',
                play: function () { (new Audio(this.src)).play() }
            }, 
            sent: {
                src: '/assets/audio/message-sent.wav',
                play: function () { (new Audio(this.src)).play() }
            }
        }, 
                play: function () { (new Audio(this.src)).play() }
            }, 
            disconnected: {
                src: '/assets/audio/socket-disconnected.wav',
                play: function () { (new Audio(this.src)).play() }
            }
        },
        _lib: {
            socketConnected: '/assets/audio/socket-connected.wav',
        }, 
        play: (name) => {

        }
    }

}


SocketClient.connect();