# Express TypeScript Application

A robust Node.js backend application built with Express and TypeScript.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- Docker

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker (optional)
- MongoDB

## Setup

1. Clone the repository
```bash
git clone <repository-url>
cd express-ts-app
```

2. Install dependencies
```bash
npm install
```

3. Environment Setup
```bash
cp .env.example .env
# Update the .env file with your configuration
```

4. Development
```bash
npm run dev
```

5. Build
```bash
npm run build
```

6. Production
```bash
npm start
```

## Docker Setup

Build and run using Docker Compose:
```bash
docker-compose up --build
```

## Features

- TypeScript support
- Express with middleware setup
- MongoDB integration
- WebSocket support with Socket.IO
- Rate limiting
- Logging with Winston
- Security with Helmet
- Input validation with Joi
- ESLint and Prettier for code quality
- Husky for git hooks
