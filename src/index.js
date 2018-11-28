import * as log from 'loglevel';
import app from './app';

app.listen(3000, () => log.warn('compatible-debug'));
