
import * as express from 'express';

export let server = express();

server.get('/', (req, res) => {
    res.send('helo');
})