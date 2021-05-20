const { port, env } = require('./constants');
const app = require('./config/express.config');
const logger = require('./utils/logger')(__filename);
const ParkingController = require('../src/api/Parking/parking.controllers');


// listen to requests
app.listen(port, (err) => {
	if (err) {
		return logger.error('server failed to start ', err);
	}
	require('./config/mongo.config');
// please comment below line setTimeout for duplicate data cretion
	// setTimeout(()=>{
	// 	ParkingController.saveParkings();
	// },3000);
	return logger.info(`server started [env, port] = [${env}, ${port}]`);
});

var CronJob = require('cron').CronJob;
var job = new CronJob('*/1 * * * *', function() {
	ParkingController.cancelReservation();
});
job.start();


	


/**
 * Exports express
 * @public
 */
module.exports = app;
