# bananus-assist-backend

## Configuraciones y consideraciones para hacer funcionar el código

### Primeros pasos
**Despues de clonar el repositorio correr los siguientes comandos**
- docker-compose build
- docker-compose run app yarn sequelize db:create
- docker-compose run app yarn sequelize db:migrate:undo:all
- docker-compose up


### Revisión de base de datos
- docker ps
- docker exec -it YOUR_MYSQL_CONTAINER_ID bash
- mysql -u root -p
- put the password(root)
- enter
- use example_db;
- show tables;
- describe name_table;

### Test de prueba
OJO QUE SE AGREGO NUEVA VARIABLE DE ENTORNO AL .ENV PARA QUE LA AGREGUEN

O agregar la linea MYSQL_TEST_DATABASE=test_db a sus archivos .env
- Crear base de datos test: docker-compose -f docker-compose.test.yaml run app yarn sequelize db:create
- Correr migraciones en base de datos test: docker-compose -f docker-compose.test.yaml run app yarn sequelize db:migrate
- Correr tests: docker-compose -f docker-compose.test.yaml run app npm test
### Consideraciones

- Se encuentra seteada para correr con nodemon.
- Se instalo dotenv para el manejo de variables de entorno.
- Esta con el ORM sequelize.


## Convenciones de trabajo

### Tipos de branches:

1. **main**: el código en producción. Solo se hará merge desde **develop** en los siguientes casos:
    1. Al final de la etapa QA
    2. Para la entrega final

2. **develop**: el código, en estado de producción (siempre funcional), pero con finalidad de desarrollo. Toda feature debería desarrollarse en una branch que tenga su origen en **develop**. Todos los tests de la etapa de QA se realizarían sobre el código presente en esta branch

3. **feature/name**: las branches que sirven para desarrollar la feature *name*. Este tipo de branches deberían tener su origen y fin (merge) en **develop**. **IMPORTANTE: una branch, una feature**. *name* debería ser un nombre lo suficientemente descriptivo. Si *name* necesita más de una palabra para ser descriptivo, estas deberían separarse por un guion. Ej: feature/more-descriptive-name

4. **bugfix/name**: las branches para arreglar problemas detectados en **develop**. Estas branches deberían tener su origen y fin (merge) en **develop**. *name* debería ser un nombre lo suficientemente descriptivo. Si *name* necesita más de una palabra para ser descriptivo, estas deberían separarse por un guion. Ej: bugfix/descriptive-bug-name

5. **hotfix/name**: las branches para arreglar problemas detectados en **main**. Estas branches deberían tener su origen y fin (merge) en **main**. *name* debería ser un nombre lo suficientemente descriptivo. Si *name* necesita más de una palabra para ser descriptivo, estas deberían separarse por un guion. Ej: hotfix/descriptive-hotfix-name

6. **setup/name**: las branches que contendrían cualquier tipo de configuración o información que no sea una funcionalidad para la aplicación en sí. Estas branches deberían tener su origen y fin (merge) en **develop**. *name* debería ser un nombre lo suficientemente descriptivo. Si *name* necesita más de una palabra para ser descriptivo, estas deberían separarse por un guion. Ej: setup/descriptive-setup-name


### Convenciones para los commits

Cada commit debería incluir un tipo y mensaje lo suficientemente claro con la estructura *tipo: mensaje*. Lo ideal es que cada *hito* dentro de una feature suponga un commit. Tipos de commit

1. **feature**: para añadir una sub-feature dentro de la feature
2. **fix**: para corregir errores dentro de la branch. Debería ser particularmente útil en branches de tipo hotfix y bugfix, pero no exclusivo
3. **improvement**: para mejoras en alguna feature ya existente. Incluiría refactors, mejoras en performance, mejoras en aspecto, etc
4. **setup**: cualquier tipo de commit que no pueda ser incluido en los tipos anteriores


### Protocolos para hacer merge de las branches

1. Uso de pull requests mediante la plataforma web de GitHub y no mediante consola
2. Un pull request debería tener a lo menos la siguiente información:
    1. Título: puede ser el nombre de la branch, pues se asume que será descriptivo
    2. Descriptión: Una pequeña síntesis de lo que se esperaría poder realizar gracias al contenido del pull request (scope de la branch). Puede incluir un listado de características que deberían cumplirse
    3. Resultados de los tests unitarios: la persona que hace el pull request debería poder mostrar que la suite de tests unitarios funcionó correctamente. Al ejecutar `npm test`, todos los tests unitarios deberían ser ejecutados y, al final de este proceso, un resumen de la ejecución será retornado
3. Un pull request debe ser aprobado y mezclado (merge) por una persona diferente a quien crea el pull request. Como caso excepcional, el merge de develop a main deberá ser aprobado por al menos dos personas

## Consideraciones para usar ESLint
Para verificar por consola los problemas de estilo identificados, correr el comando **docker-compose run app npm run lint**. Esto ejecutará ESLint y entregará un output como el siguiente:
![Screenshot from 2021-05-09 19-36-42](https://user-images.githubusercontent.com/30679639/117590516-e6c7cb80-b0fd-11eb-90f8-2aaba06206ce.png)

### Uso de ESLint en VSCode
1. Instalar la extensión ESLint mostrada a continuación:![Screenshot from 2021-05-09 19-38-16](https://user-images.githubusercontent.com/30679639/117590568-20003b80-b0fe-11eb-8961-0c046ecdbb13.png)

2. ESLint debería funcionar inmediatamente una vez instalado. En caso de no funcionar:
    1. Reiniciar VSCode y verificar si los cambios surtieron
    2. Si lo anterior no funciona, reiniciar el computador para que los cambios hagan efecto
    3. Si aún así no funciona, instalar la extensión Remote development mostrada a continuación: ![Screenshot from 2021-05-09 19-41-37](https://user-images.githubusercontent.com/30679639/117590675-a1f06480-b0fe-11eb-83ff-b49159cd0c45.png)
    4. Una vez instalada, seguir los pasos descritos en el siguiente vídeo para poder desarrollar como si estuvieran dentro del container de Docker: https://youtu.be/mi8kpAgHYFo. En este caso, se debe crear los archivos de configuración en base al archivo docker-compose.yaml y no en base al Dockerfile

