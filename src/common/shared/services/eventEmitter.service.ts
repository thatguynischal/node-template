import { EventEmitter } from 'events';
import { Server as SocketServer } from 'socket.io';

export interface EventData {
    type: string;
    payload: any;
    timestamp: Date;
}

export type EventCallback = (data: EventData) => void;

class EventEmitterService {
    private static instance: EventEmitterService;
    private emitter: EventEmitter;
    private io: SocketServer | null = null;
    private simulationInterval: NodeJS.Timeout | null = null;

    private constructor() {
        this.emitter = new EventEmitter();
        this.emitter.setMaxListeners(50);
    }

    public static getInstance(): EventEmitterService {
        if (!EventEmitterService.instance) {
            EventEmitterService.instance = new EventEmitterService();
        }
        return EventEmitterService.instance;
    }

    public initialize(io: SocketServer): void {
        this.io = io;
    }

    public subscribe(eventType: string, callback: EventCallback): void {
        this.emitter.on(eventType, callback);
    }

    public unsubscribe(eventType: string, callback: EventCallback): void {
        this.emitter.off(eventType, callback);
    }

    public emit(eventType: string, data: any): void {
        const eventData: EventData = {
            type: eventType,
            payload: data,
            timestamp: new Date()
        };

        this.emitter.emit(eventType, eventData);
        
        if (this.io) {
            this.io.to(eventType).emit('event', eventData);
        }
    }

    public startEventSimulation(): void {
        if (this.simulationInterval) {
            return;
        }

        const events = ['userLoggedIn', 'newOrder', 'paymentReceived', 'stockUpdate'];
        
        this.simulationInterval = setInterval(() => {
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            const mockData = this.generateMockData(randomEvent);
            this.emit(randomEvent, mockData);
        }, 60000); // Emit event every minute
    }

    public stopEventSimulation(): void {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
    }

    private generateMockData(eventType: string): any {
        switch (eventType) {
            case 'userLoggedIn':
                return {
                    userId: `user_${Math.floor(Math.random() * 1000)}`,
                    username: `user${Math.floor(Math.random() * 1000)}`,
                };
            case 'newOrder':
                return {
                    orderId: `ord_${Math.floor(Math.random() * 10000)}`,
                    amount: Math.floor(Math.random() * 1000),
                    items: Math.floor(Math.random() * 5) + 1,
                };
            case 'paymentReceived':
                return {
                    transactionId: `tx_${Math.floor(Math.random() * 10000)}`,
                    amount: Math.floor(Math.random() * 1000),
                };
            case 'stockUpdate':
                return {
                    productId: `prod_${Math.floor(Math.random() * 100)}`,
                    newQuantity: Math.floor(Math.random() * 50),
                };
            default:
                return {};
        }
    }
}

export const eventEmitter = EventEmitterService.getInstance();
