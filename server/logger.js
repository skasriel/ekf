var winston = require('winston');
//var wrappedLogger = new winston.Logger();
winston.emitErrs = true;

/*var wrappedLogger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'debug',
            filename: './all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug', //level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});*/
wrappedLogger = console;

var loggers = [];

function Logger(name) {
	this.name = name
	return this;
}

Logger.DEFAULT = "default";

Logger.get = function(name) {
	var logger = loggers[name];
	if (! logger) {
		loggers[name] = new Logger(name);
		logger = loggers[name];
	}
	return logger;
};

Logger.prototype.info = function(msg) {
	wrappedLogger.log('info', " ["+this.name+"]: "+msg);
};

Logger.prototype.log = function(msg) {
	wrappedLogger.log('debug', " ["+this.name+"]: "+msg);
};

Logger.prototype.error = function(msg) {	
	wrappedLogger.log('error', " ["+this.name+"]: "+msg);
};

var self = module.exports = Logger; 

module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};