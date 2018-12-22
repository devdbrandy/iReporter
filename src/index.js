import * as log from 'loglevel';
import server from './server';
import { env } from './utils';

const port = env('PORT', process.env.npm_package_config_port);
server.listen(port, () => log.warn(`Listening on port ${port}`));
