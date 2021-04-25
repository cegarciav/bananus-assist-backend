# bananus-assist-backend

## Configuraciones y consideraciones para hacer funcionar el código

### Primeros pasos
**Despues de clonar el repositorio correr los siguientes comandos**
- docker-compose build;
- docker-compose up;

### Consideraciones

- Se encuentra seteada para correr con nodemon.
- Se instalo dotenv para el manejo de variables de entorno.
- Se levantan los contenedores app y mysqldb pero no se crea la base de datos (aun no lo investigamos, suponemos que corriendo el comando: **docker-compose run app yarn sequelize db:create** )
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
