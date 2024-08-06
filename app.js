import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ message: 'Nodejs and JWT' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'Mauro' && password === 'password') {
        const user = {
            id: 1,
            name: 'Mauro',
            email: 'mauro@gmail.com'
        };

        jwt.sign({ user }, 'secretKey', { expiresIn: '30s' }, (err, token) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json({ token });
            }
        });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
});

app.post('/api/post', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post was created',
                authData
            });
        }
    });
});

app.get('/api/verify', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            res.status(401).json({ message: 'Token inválido o expirado' });
        } else {
            res.status(200).json({ message: 'Token válido', authData });
        }
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(3000, function() {
    console.log('Node.js app running...');
});