export class GameBase {
    id;

    _idGenInstance;
    _stopwatchInterval; 
    _stopwatch = 0;

    _state;

    _socketClients = [];

    get STATES() {
        return {
            'ERROR': -1,
            'IDLE': 1,
            'PAUSE': 2,
            'PLAYING': 3,
            'FINISH': 4
        }
    }
    get idNext() { return this._idGenInstance.next().value }
    get stopwatch() {
        let time = [
            String(this._stopwatch % 60).padStart(2,'0'),
            String(Math.floor(this._stopwatch / 60)).padStart(2,'0'),
            String(Math.floor(this.stopwatch / 3600)).padStart(2,'0')
        ];
        
        return `${time[2] == '00' ? '' : `${time[2]} ч. `}${time[1]} мин. ${time[0]} сек.`;
    }

    get state() { return Object.entries(this.STATES).find(state => state[1] == this._state); }
    set state(value) {
        this._toggleStopwatch(value === this.STATES.PLAYING, this._state === this.STATES.PAUSE && value === this.STATES.PLAYING)
        this._state = value;
    }

    constructor(...socketClients) {
        this.id = this.idNext;
        this.state = this.STATES.IDLE;
        this._socketClients = socketClients;

    }

    startGame() {
        this.state = this.STATES.PLAYING;
    }

    finishGame() {
        this.state = this.STATES.FINISH;
    }

    pauseGame() {
        this.state = this.STATES.PAUSE;
    }

    _toggleStopwatch(doStart, doContinue = false) {
        if (this._stopwatchInterval !== null) {
            clearInterval(this._stopwatchInterval); 
            this._stopwatchInterval = null;
        }
        
        if (doStart) {
            if (!doContinue) this._stopwatch = 0;
            this._stopwatchInterval = setInterval(() => { this._stopwatch++; }, 1000);
        }
    }

    * idGen() {
        let id = 0;
        while (true) yield id++;
    }
}