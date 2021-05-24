require('dotenv').config();
const express = require('express');
const http = require("http")
const cors = require('cors');
const socketio = require("socket.io")

const index = require('./routes/index');
const users = require('./routes/users');
const sale_points = require('./routes/sale_points');
const stores = require('./routes/stores');
const products = require('./routes/products');
const technical_chars = require('./routes/technical_chars');
const sessions = require('./routes/session');


const db = require('./models');
const { access } = require('fs');

const app = express();
const port = process.env.NODEJS_LOCAL_PORT;
const frontendClient = process.env.FRONTEND_CLIENT_ORIGIN;


app.use(cors({
  origin: frontendClient,
  optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(require('./controllers/session_controller').check_session);

app.use('/', index);
app.use('/users', users);
app.use('/sale-points', sale_points);
app.use('/stores', stores);
app.use('/products', products);
app.use('/chars', technical_chars);
app.use('/sessions', sessions);


const server = http.createServer(express());
const io = socketio(server, {
  cors: true
})

io.on("connection", socket =>{
  socket.on("peticion_asistentes", (sale_point_id) => {
    socket.to(sale_point_id).emit("llegada_peticion",socket.id)
  })
  socket.on("join_sala_asistente", (sale_points_id) => {
    socket.join(sale_points_id)
    console.log(sale_points_id)
  })
  socket.on("accept_videocall", (client_socket_id) => {
    console.log("aceptando")
    socket.to(client_socket_id).emit("accept_call", "aaa")
  })
})

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
