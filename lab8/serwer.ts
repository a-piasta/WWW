import {createServer} from 'http';

let server = createServer(
    (req, res) => {
        res.write('dupadupa');
        res.end();
    }
);

server.listen(2137);