const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const initSockets = require('./sockets');

// Ładowanie konfiguracji środowiskowej
dotenv.config({ path: './.env' });

const PORT_EXPRESS = process.env.PORT_EXPRESS || 3000;
const PORT_SOCKETS = process.env.PORT_SOCKETS || 3001;

const app = express();
const server = http.createServer(app);

// Inicjalizacja Socket.IO
initSockets(server);

// Ścieżka do publicznych plików statycznych
const pub_dir = path.join(__dirname, './public');
app.use(express.static(pub_dir));

// Middleware do obsługi JSON i URL-encoded danych
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing - modularność
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/app', require('./routes/app'));

// Ustawienia widoku
app.set('view engine', 'hbs');




// Uruchomienie serwera HTTP na porcie 3001 (główny serwer)
server.listen(PORT_SOCKETS, () => {
  console.log(`Serwer sockets.io uruchomiony na porcie: ${PORT_SOCKETS}`);
});

// Uruchomienie serwera Express na głównym porcie
app.listen(PORT_EXPRESS, () => {
  console.log(`Serwer express uruchomiony na porcie: ${PORT_EXPRESS}`);
});