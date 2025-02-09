import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import path from 'path';
import {
  apiRateLimiter,
  GlobalErrorHandler,
  NotFoundHandler,
} from '../../../common/shared';
import { default as AllRoutes } from '../../../common/global-router';
import { config } from '../../config';
import { helmetCSPConfig } from '../../constants';

const app = express();
const server = createServer(app);

const morganEnv = config.runningProd ? 'combined' : 'dev';

// Express configuration
app.use(cors());
app.use(helmet()); // Use Helmet to add various security headers
app.use(helmetCSPConfig);
app.use(helmet.frameguard({ action: 'deny' })); // Prevent the app from being displayed in an iframe
app.use(helmet.xssFilter()); // Protect against XSS attacks
app.use(helmet.noSniff()); // Prevent MIME type sniffing
app.use(helmet.ieNoOpen()); // Prevent IE from executing downloads
app.use(morgan(morganEnv));
app.use(express.json());
app.disable('x-powered-by'); // Disable X-Powered-By header

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../../../../public')));

// Client rate limiter middleware
app.use('/api/v1', apiRateLimiter);

// API Routes
app.use('/api/v1', AllRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../public/index.html'));
});

// Error handlers
app.use(NotFoundHandler);
app.use(GlobalErrorHandler);

export { app, server };
