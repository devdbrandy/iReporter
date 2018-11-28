import * as log from 'loglevel';
import server from './server';

server.listen(3000, () => log.warn('compatible-debug'));
