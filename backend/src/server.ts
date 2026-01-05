import { env } from "node:process";
import { createApp } from "./app.js";
import { assertDatabaseConnection } from "./db/db.js";
import { logger } from "./lib/logger.js";
import http from "node:http";
import { initIo } from "./realTime/io.js";
async function bootstrap() {
  try {
    await assertDatabaseConnection();
    const app = createApp();
    const server = http.createServer(app);
    const port = Number(env.PORT) || 5000;
    initIo(server);
    server.listen(port, () => {
      logger.info(`server is now listening to port : http://localhost:${port}`);
    });
  } catch (err) {
    logger.error(`Failed to start the server:\n${(err as Error).stack}`);

    process.exit(1);
  }
}
bootstrap();
