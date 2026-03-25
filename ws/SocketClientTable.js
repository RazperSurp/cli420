import { SocketClient } from "./SocketClient.js";

export class SocketClientTable {
    static socketClients = [];
    static _idSequence = SocketClientTable._idGeneratorFn();
    static get nextId() { return SocketClientTable._idSequence.next().value; }

    static findByToken(token) {
        return SocketClientTable.socketClients.find(socketClient => socketClient.token === token);
    }

    static findById(id) {
        return SocketClientTable.socketClients.find(socketClient => socketClient.id === Number(id));
    }

    static findByName(name) {
        return SocketClientTable.socketClients.find(socketClient => socketClient.name === name);
    }

    static push(socket) {
        let socketClient = new SocketClient(SocketClientTable.nextId, socket);
        SocketClientTable.socketClients.push(socketClient);
        
        return socketClient;
    }

    static* _idGeneratorFn() {
        let id = 0;
        while (true) yield id++;
    }

    static massSend(data, type = 'MESSAGE_CHAT', exclude = []) {
        let recievers = SocketClientTable.socketClients;
        if (exclude.length > 0) recievers = recievers.filter(socketClient => exclude.find(id => id == socketClient.id) === undefined);

        recievers.forEach(socketClient => { socketClient.send(data, type) });
    }
}