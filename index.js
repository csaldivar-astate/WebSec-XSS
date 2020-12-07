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

app.get('/part-two', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'zwei.html'));
});

app.get('/part-three', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'drei.html'));
});

app.listen(8000, () => {
    console.log('Server listening on 127.0.0.1:8000');
});

// Init the vulnerable server
const msngr = express();

msngr.set("view engine", "pug");
msngr.set("views", path.join(__dirname, "views"));
msngr.use(express.static('public'));

msngr.use((req, res, next) => {
    // Don't let the browser mess with our XSS attempts
    res.set('X-XSS-Protection', '0');
    next();
});

msngr.use(express.urlencoded({ extended: false }));
msngr.use(express.json());

const stages = ["one", "two", "three"];
for (let stage of stages) {
    msngr.get(`/register_${stage}`, (req, res) => {
        res.render('vuln-register', {stage});
    });
    msngr.post(`/register_${stage}`, (req, res) => {
        console.log(`\nPOST /register_${stage}`);
        console.log(req.body);
    });
}


msngr.get('/user/:username', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vuln-register.html'));
});


msngr.listen(9000, () => {
    console.log("Vulnerable server is running");
});
