import * as log from 'loglevel';
import dotenv from 'dotenv';
import server from './server';
import { env } from './helpers';

dotenv.config({ silent: true });

const port = env('APP_PORT', 3000);
server.listen(port, () => log.warn(`Listening on port ${port}`));
