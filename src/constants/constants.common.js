/**
 * Common constants across all the environments (dev, staging, prod)
 */
const dotenv = require('dotenv');
dotenv.config({ path: '../.env.example'});

module.exports = {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	DATABASE: process.env.DATABASE,
	floor: process.env.FLOOR,
	totalParkingSlots: process.env.TotalParkingSlots,
	reservedSlots: process.env.Reservation
};
