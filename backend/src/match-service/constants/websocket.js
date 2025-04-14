export const WebSocketStatus = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
};

export const MessageTypes = {
    START_MATCH: 'START_MATCH',
    CANCEL_MATCH: 'CANCEL_MATCH',
    PING: 'PING',
    CONNECTION_ESTABLISHED: 'CONNECTION_ESTABLISHED',
    MATCH_ERROR: 'MATCH_ERROR',
    MATCH_CANCELLED: 'MATCH_CANCELLED',
    PONG: 'PONG',
    ERROR: 'ERROR'
};

export const WS_PATH = '/match';
