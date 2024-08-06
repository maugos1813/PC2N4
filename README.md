DOCUMENTACIÓN DEL SISTEMA DE AUTENTICACIÓN CON JWT:

Introducción:

Este proyecto de Node.js utiliza Express.js y JSON Web Tokens (JWT) para implementar un sistema de autenticación. La aplicación incluye endpoints para la autenticación de usuarios, la creación de publicaciones y la verificación de tokens JWT.

Configuración Inicial:
1. Iniciar un nuevo proyecto de Node.js con el siguiente comando: "npm init -y"

2. Instalar las dependencias necesarias: "npm i express jsonwebtoken"

3. Estructura de archivos:
.
├── node_modules/
├── app.js
├── package.json
└── package-lock.json

Código de Aplicación (./app.js):
1. Importacion de dependencias:
- import express from 'express';
- import jwt from 'jsonwebtoken';

2. Inicialización de Aplicación y Middlewares:
- const app = express();
- app.use(express.json());

3. Endpoins:
- GET '/api':
app.get('/api', (req, res) => {
    res.json({ message: 'Nodejs and JWT' });
});

- POST 'api/login':
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'Mauro' && password === 'password') {
        const user = {
            id: 1,
            name: 'Mauro',
            email: 'mauro@gmail.com'
        };

        jwt.sign({ user }, 'secretKey', { expiresIn: '30m' }, (err, token) => {
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

- POST '/api/post':
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

- GET 'api/verify':
app.get('/api/verify', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            res.status(401).json({ message: 'Token inválido o expirado' });
        } else {
            res.status(200).json({ message: 'Token válido', authData });
        }
    });
});

- Middleware para verificación de Tokens:
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

- Inicio del Servidor:
app.listen(3000, function() {
    console.log('Node.js app running...');
});

PRUEBAS: Thunder Client

Prueba del endpoint Login:
1. URL: http://localhost:3000/api/login
2. Método: POST
3. Headers: Content-Type: application/json
4. Body (raw): {
    "username": "Mauro",
    "password": "password"
}

Prueba del Endpoint de Creación de Publicaciones:
1. URL: http://localhost:3000/api/post
2. Método: POST
3. Headers:
- Content-Type: application/json
- Authorization: Bearer <token> (reemplaza <token> con el token recibido del endpoint de login)

Prueba del Endpoint de Verificación de Tokens:
1. URL: http://localhost:3000/api/verify
2. Método: GET
3. Headers:
- Authorization: Bearer <token> (reemplaza <token> con el token recibido del endpoint de login)

Consideraciones de Seguridad:
- Clave Secreta: Mantén la clave secreta (secretKey) fuera del código fuente. Utiliza variables de entorno para mayor seguridad.
-     Protección contra Ataques: Implementa medidas adicionales para proteger tu aplicación contra ataques como la fuerza bruta y el cross-site scripting (XSS).
