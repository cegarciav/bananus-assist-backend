/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const fileupload = require('express-fileupload');

const index = require('./routes/index');
const users = require('./routes/users');
const sale_points = require('./routes/sale_points');
const stores = require('./routes/stores');
const products = require('./routes/products');
const technical_chars = require('./routes/technical_chars');
const sessions = require('./routes/session');
const assistants = require('./routes/assistants');
const massive_charge = require('./routes/massive_charge');

const central_tablets = require('./routes/central_tablets');
const devices = require('./routes/devices');

const db = require('./models');

const app = express();
const port = process.env.NODEJS_LOCAL_PORT;
const frontendClient = process.env.FRONTEND_CLIENT_ORIGIN;

app.use(cors({
  origin: frontendClient,
  optionsSuccessStatus: 200,
}));
app.use(fileupload());

app.use(express.json());
app.use(require('./controllers/session_controller').check_session);

app.use('/', index);
app.use('/users', users);
app.use('/sale-points', sale_points);
app.use('/stores', stores);
app.use('/products', products);
app.use('/chars', technical_chars);
app.use('/sessions', sessions);
app.use('/assistants', assistants);
app.use('/massive_charge', massive_charge);
app.use('/central-tablets', central_tablets);
app.use('/devices', devices);

const server = http.createServer(app);
const io = socketio(server, {
  cors: true,
});

io.on('connection', (socket) => {
  socket.on('peticion_asistentes', (sale_point_id) => {
    socket.to(sale_point_id).emit('llegada_peticion', socket.id);
  });

  socket.on('join_sala_asistente', (sale_points_id) => {
    socket.join(sale_points_id);
  });

  socket.on('accept_videocall', (client_socket_id, sale_points_id) => {
    socket.to(client_socket_id).emit('accept_call', 'Dirijase a tablet central donde un asistente lo atendera');
    io.sockets.to(sale_points_id).emit('delete_peticion', client_socket_id);
  });

  socket.on('join_to_videocall_room', (sale_point_id) => {
    socket.join(sale_point_id.concat('home'));
  });

  socket.on('video_stream_upload', (sale_point_id, stream_video) => {
    io.sockets.to(sale_point_id.concat('home')).emit('video_stream_download', stream_video);
  });

  socket.on('me_ida', () => {
    io.sockets.to(socket.id).emit('me', socket.id);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('callEnded');
  });

  socket.on('callUser', (data) => {
    socket.to(data.sale_point_id.concat('home'))
      .emit('callUser', { signal: data.signalData, from: data.from, name: data.name });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', { signal: data.signal, from: data.from });
  });

  socket.on('ended', (data) => {
    io.to(data.to).emit('finished');
  });

  socket.on('face-detected', (sale_point_id) => {
    socket.to(sale_point_id).emit('face-detected_assistant', socket.id);
  });

  socket.on('assistant_alert', (client_id, msge) => {
    socket.to(client_id).emit('user_alert', msge);
  });
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');

    if (process.env.NODE_ENV !== 'test') {
      server.listen(port, (err) => {
        if (err) {
          return console.error('Failed', err);
        }
        console.log(`Listening on port ${port}`);
        return app;
      });
    }
  })
  .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = app;
