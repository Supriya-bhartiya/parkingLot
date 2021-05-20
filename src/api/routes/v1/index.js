const express = require('express');

// import all the routes here
const ReservationRoutes = require('../../Parking/parking.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res, next) => {
	// console.log('inside status');
	res.send({
		message: 'OK',
		timestamp: new Date().toISOString(),
		IP: req.ip,
		URL: req.originalUrl,
	});
	next();
});

router.use('/parkings', ReservationRoutes);

module.exports = router;
