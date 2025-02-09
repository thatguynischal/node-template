import helmet from 'helmet';

export const helmetCSPConfig = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",  // Required for Socket.IO client
      'https://cdn.socket.io',  // Allow Socket.IO CDN
      'https://www.google-analytics.com',
    ],
    scriptSrcAttr: ["'unsafe-inline'"],  // Allow inline event handlers
    connectSrc: [
      "'self'",
      'ws://localhost:3000',  // Allow WebSocket connections
      'http://localhost:3000',  // Allow HTTP connections
      'ws://127.0.0.1:3000',
      'http://127.0.0.1:3000'
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://www.google-analytics.com',
      'https://image.flaticon.com',
      'https://images.unsplash.com',
    ],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  },
});
