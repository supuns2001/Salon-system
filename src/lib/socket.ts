import { io } from 'socket.io-client';

let socket: any;

export const initiateSocketConnection = () => {
    socket = io({
        path: '/api/socket',
        addTrailingSlash: false,
    });
    console.log(`Connecting socket...`);
}

export const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    if(socket) socket.disconnect();
}

export const subscribeToQueueUpdates = (cb: any) => {
    if (!socket) return(true);
    socket.on('refresh-queue', () => {
        console.log('Websocket event received!');
        return cb();
    });
}

export const emitQueueUpdate = () => {
    if (socket) socket.emit('queue-update');
}
