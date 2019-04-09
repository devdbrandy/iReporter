import 'babel-polyfill';
import server from '../server';
import { env } from '../helpers';
import { logger } from '../helpers/utils';

const port = env('PORT', process.env.npm_package_config_port);
server.listen(port, () => logger.log(`Listening on port ${port}`));
