# bananus-assist-backend

### Primeros pasos
**Despues de clonar el repositorio correr los siguientes comandos**
- docker-compose build;
- docker-compose up;

### Consideraciones

- Se encuentra seteada para correr con nodemon.
- Se instalo dotenv para el manejo de variables de entorno.
- Se levantan los contenedores app y mysqldb pero no se crea la base de datos (aun no lo investigamos, suponemos que corriendo el comando: **docker-compose run app yarn sequelize db:create** )
- Esta con el ORM sequelize.