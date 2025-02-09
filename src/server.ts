process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception:', err);
});

import { initServices } from './helpers';
import { server } from './core/framework/webserver';
import { socketService } from './core/framework/socket';
import { logger } from './common/shared';
import { config } from './core/config';

async function startServer() {
  try {
    await initServices();
    
    // Initialize socket service with HTTP server
    socketService.initialize(server);
    
    server.listen(config.port, () => {
      logger.info(`Server running on http://localhost:${config.port}`);
      logger.info('Socket.IO server is ready for connections');
    });
  } catch (error) {
    logger.error('Failed to initialize services', error as any);
    process.exit(1);
  }
}

startServer();
