
require( 'dotenv' ).config();
const config = {
    default: {
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_ROOT_PASSWORD,
        dialect: 'mysql',
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST || '127.0.0.1',
    },
    development: {
        extend: 'default',
        database: process.env.MYSQL_DATABASE,
        dialect: 'mysql',
        host: process.env.MYSQL_HOST || '127.0.0.1',

    },
    test: {
        extend: 'default',
        database: process.env.MYSQL_DATABASE,
        dialect: 'mysql',

    },
    production: {
        use_env_variable: 'DATABASE_URL'
    },
};


Object.keys( config ).forEach( ( configKey ) => {
    const configValue = config[configKey];
    if ( configValue.extend ) {
        config[configKey] = { ...config[configValue.extend], ...configValue };
    }
} );
module.exports = config;