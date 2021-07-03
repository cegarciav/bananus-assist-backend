const pino = require('pino')
const logger = pino({
  prettyPrint: { colorize: true }
});

class appLogger {
    constructor(configContext) {
        logger.level = 'info';
        if (['development', 'test'].includes(configContext))
            logger.level = 'debug';
    }

    debugLog(context, message, additionalInfo) {
        logger.child({
            type: "debug",
            context,
            additionalInfo
        })
        .debug(message)
    }

    infoLog(context, message, additionalInfo) {
        logger.child({
            type: "info",
            context,
            additionalInfo
        })
        .info(message)
    }

    warnLog(context, message, additionalInfo) {
        logger.child({
            type: "warn",
            context,
            additionalInfo
        })
        .warn(message)
    }

    errorLog(context, message, additionalInfo) {
        logger.child({
            type: "error",
            context,
            additionalInfo
        })
        .error(message)
    }

    fatalLog(context, message, additionalInfo) {
        logger.child({
            type: "error",
            context,
            additionalInfo
        })
        .fatal(message)
    }
}


module.exports = appLogger;