import dotenv from 'dotenv';

dotenv.config();

interface Config {
    runningProd: boolean;
    app: string;
    port: number;
    rate: {
        limit: number;
        max: number;
    };
    db: {
        uri: string;
        name: string;
        clientPort: number;
    };
    redis: {
        host: string;
        port: number;
        serverPort: number;
        tokenExpireTime: number;
        blacklistExpireTime: number;
    };
}

export const config: Config = {
    runningProd: process.env.NODE_ENV === 'production',
    app: process.env.APP_NAME || 'myapp',
    port: parseInt(process.env.PORT || '9095', 10),
    rate: {
        limit: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes in milliseconds
        max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },
    db: {
        uri: process.env.DB_URI || 'mongodb://localhost:27017',
        name: process.env.DB_NAME || 'mydatabase',
        clientPort: parseInt(process.env.MONGO_CLIENT_PORT || '9005', 10),
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        serverPort: parseInt(process.env.REDIS_SERVER_PORT || '9079', 10),
        tokenExpireTime: parseInt(
            process.env.REDIS_TOKEN_EXPIRE_TIME || '31536000',
            10,
        ),
        blacklistExpireTime: parseInt(
            process.env.REDIS_BLACKLIST_EXPIRE_TIME || '2592000',
            10,
        ),
    },
};
