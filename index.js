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
    res.sendFile(path.join('public', 'index.html'));
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
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Register</title>
    </head>
    <body>
        
        <form id="registerForm" method="post" action="/user">
            <input type="text" id="username" placeholder="Username" name="username" oninput="sendInput()"><br>
            <input id="email" style="height: 150px; width: 250px;" id="email" type="text" placeholder="Email" name="email" oninput="sendInput()"><br>
            <input type="text" placeholder="password" name="password" id="password"><br>
    
            <button type="submit">Submit</button>
    
        </form>
    </body>
    <script>
        function sendInput () {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            window.parent.postMessage(JSON.stringify({username, email}), '*');
        }
    </script>
    </html>
    `)
});