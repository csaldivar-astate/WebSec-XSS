const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));

app.use(session({
    secret: 'superSecret',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(8000, () => {
    console.log('Server listening on 127.0.0.1:8000');
});


function createServer (port) {
    const app = express();
    const router = new express.Router();

    router.use((req, res, next) => {
        res.set('X-XSS-Protection', '0');
        next();
    });

    router.use(express.urlencoded({ extended: false }));
    router.use(express.json());

    app.use(router);

    app.listen(port);

    return router;
}

const vulnRouter = createServer(9000);

vulnRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vuln-register.html'));
});