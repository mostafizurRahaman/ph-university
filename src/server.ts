import mongoose from 'mongoose';
import app from './app';
import config from './app/configs';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

// handle unhandledRejection for asynchronous error:

process.on('unhandledRejection', () => {
  console.log(`Server detected UnHandledRejection 😡`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// handle unCaughtException Error :
process.on('uncaughtException', () => {
  console.log(`Server detected unCaughtException 😡`);
  process.exit(1);
});
