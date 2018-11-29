import * as log from 'loglevel';
import server from './server';

server.listen(3000, () => log.warn('Listening on port 3000'));
