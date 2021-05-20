let mongoose = require('mongoose');
const common = require('../constants/constants.common');
const logger = require('../utils/logger')(__filename);

mongoose.Promise = global.Promise;

const connection = mongoose.connect(common.DATABASE, {
	useNewUrlParser: true,
	bufferCommands: false,
	useUnifiedTopology: true,
	useFindAndModify:false
});

connection
	.then((db) => {
		logger.info(`Successfully connected to ${common.DATABASE} MongoDB cluster in ${common.env} mode.`);
		return db;
	})
	.catch((err) => {
		if (err.message.code === 'ETIMEDOUT') {
			logger.info('Attempting to re-establish database connection.');
			mongoose.connect(common.DATABASE);
		} else {
			logger.error('Error while attempting to connect to database:');
			logger.error(err);
		}
	});

module.exports = connection;