import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { eventEmitter, EventData } from '../../../common/shared/services';
import { logger } from '../../../common/shared';

interface ServerToClientEvents {
    event: (data: EventData) => void;
}

interface ClientToServerEvents {
    subscribe: (eventType: string) => void;
    unsubscribe: (eventType: string) => void;
}

class SocketService {
    private static instance: SocketService;
    private io: SocketServer<ClientToServerEvents, ServerToClientEvents> | null = null;

    private constructor() {}

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public initialize(server: HTTPServer): void {
        if (this.io) {
            logger.warn('Socket.IO server already initialized');
            return;
        }

        this.io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            },
            pingTimeout: 60000,
            pingInterval: 25000
        });

        this.setupEventHandlers();
        this.initializeEventEmitter();
        logger.info('Socket.IO server initialized successfully');
    }

    private setupEventHandlers(): void {
        if (!this.io) {
            logger.error('Cannot setup event handlers: Socket.IO server not initialized');
            return;
        }

        this.io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
            logger.info(`Client connected: ${socket.id}`);

            socket.on('subscribe', (eventType: string) => {
                try {
                    socket.join(eventType);
                    logger.info(`Client ${socket.id} subscribed to ${eventType}`);
                } catch (error) {
                    const err = error instanceof Error ? error : new Error('Unknown error');
                    logger.error(`Error subscribing client ${socket.id} to ${eventType}`, err);
                    socket.emit('event', {
                        type: 'error',
                        payload: { message: 'Failed to subscribe to event' },
                        timestamp: new Date()
                    });
                }
            });

            socket.on('unsubscribe', (eventType: string) => {
                try {
                    socket.leave(eventType);
                    logger.info(`Client ${socket.id} unsubscribed from ${eventType}`);
                } catch (error) {
                    const err = error instanceof Error ? error : new Error('Unknown error');
                    logger.error(`Error unsubscribing client ${socket.id} from ${eventType}`, err);
                }
            });

            socket.on('disconnect', (reason: string) => {
                logger.info(`Client ${socket.id} disconnected: ${reason}`);
            });

            socket.on('error', (error: Error) => {
                logger.error(`Socket error for client ${socket.id}`, error);
            });
        });

        this.io.on('error', (error: Error) => {
            logger.error('Socket.IO server error', error);
        });
    }

    private initializeEventEmitter(): void {
        if (!this.io) {
            logger.error('Cannot initialize event emitter: Socket.IO server not initialized');
            return;
        }
        
        eventEmitter.initialize(this.io);
        logger.info('Event emitter initialized with Socket.IO server');
    }

    public getIO(): SocketServer<ClientToServerEvents, ServerToClientEvents> | null {
        return this.io;
    }
}

export const socketService = SocketService.getInstance();