import * as log from 'loglevel';
import dotenv from 'dotenv';
import server from './server';
import { env } from './utils';

dotenv.config({ silent: true });

const port = env('PORT', 3000);
server.listen(port, () => log.warn(`Listening on port ${port}`));
