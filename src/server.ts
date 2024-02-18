import mongoose from 'mongoose';
import app from './app';
import config from './app/configs';
import { Server } from 'http';
import { blue, green, red } from 'colors';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    seedSuperAdmin();
    console.log(blue(`Database is Connected Successfully!!!`).bold);
    server = app.listen(config.port, () => {
      console.log(
        green(`Ph University Server is running on ${config.port}`).bold,
      );
    });
  } catch (err) {
    console.log(err);
  }
}

main();

// handle unhandledRejection for asynchronous error:
process.on('unhandledRejection', () => {
  console.log(red(`Server detected UnHandledRejection 😡`));
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// handle unCaughtException Error :
process.on('uncaughtException', () => {
  console.log(red(`Server detected unCaughtException 😡`));
  process.exit(1);
});
