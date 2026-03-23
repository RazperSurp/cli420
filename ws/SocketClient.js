export class SocketClient {
    _id;
    _name;
    _token; 
    _sockets = [];
    _socketIdGeneratorInstance;

    _activities = [];

    color;

    get nextSocketId() { return this._socketIdGeneratorInstance.next().value; }

    get id() { return this._id; }
    get name() { return this._name ?? this._id; }
    get token() { return this._token; }
    get sockets() { return this._sockets; }
    get isBusy() { return this._activities.length > 0; }
    get alive() { return this._sockets.length > 0; }

    set name(value) { this._name = value; }
    
    set sockets(value) {
        this._sockets = value;
        this._sockets.forEach(socket => {
            socket.send(JSON.stringify({ type: 'CLIENTS_COUNT', data: this._sockets.length }));
        })
    }

    constructor (id, socket) {
        this._id = id; 
        this._token = socket.token;

        this._socketIdGeneratorInstance = this._socketIdGenerator();

        this.pushSocket(socket);
    }

    pushSocket(socket) {
        socket.id = this.nextSocketId;
        this.sockets = this.sockets.concat([socket]);
    }

    destroySocket(id) {
        this.sockets = this._sockets.filter(socket => socket.id !== id);
        if (this.isBusy) this._activities.forEach(activity => {
            activity.sendDisconnectNotify(this);
        })
    }

    * _socketIdGenerator() {
        let id = 1;
        while (true) yield id++;
    }

    send(data, type = 'MESSAGE_CHAT') {
        const output = JSON.stringify({ type: type, data: data });

        this.sockets.forEach(socket => { socket.send(output); })
    }
}