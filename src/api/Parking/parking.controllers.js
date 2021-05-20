const httpStatus = require('../../../node_modules/http-status');
const ParkingService = require('./parking.service');
const logger = require('../../utils/logger')(__filename);
const common = require('../../constants/constants.common');
const reservedSlots = Number(common.reservedSlots);
const totalParkingSlots = Number(common.totalParkingSlots);
const floor = Number(common.floor);


const saveParkings = async () => {
	try {
		let totalReserved = 0;
		const parkingData = [];
		if(totalParkingSlots >0 && reservedSlots >0){
		totalReserved = ((totalParkingSlots * reservedSlots) / 100)
		for(let i=0; i < totalParkingSlots; i++) {
			const parkingObj = {
				parkingId: `slot-${Math.random().toString(36).slice(2)}`,
				slotType: 'General',
				floor: Math.floor(Math.random() * floor),
				isBooked: false,
				isCloseToLift = (i %2 === 0)? true : false,
				isActive: true
			}
			parkingData.push(parkingObj);
		}
		const response = await ParkingService.save_parking(parkingData);
		if (response.status == 200) {
			const query = {
				isActive: true,
				isCloseToLift: true
			}
			let liftAreaData = await ParkingService.get_parkings_filter(query);
			liftAreaData = liftAreaData.data.parkings;
			for(let i = 0; i < totalReserved; i++){
				if(i < totalReserved){
					liftAreaData[i].slotType = 'Reserved';
				}
			}
			console.log('Database Created and Ready for Use');
		} else {
			console.log('Database Not Ready for Use');
		}
	}else {
		console.log('Please update env file');
	}
	} catch (err) {
		next(err);
	}
};

const createReservation = async (req, res, next) => {
	try {
		let params = req.body;
		params.isRequirdReservation = (params.isPregnent === true || params.isDisabled === true) ? true : false;
		const response = await ParkingService.save_reservation(params,totalParkingSlots);
		if (response.status == 200) {
			return res.status(httpStatus.OK).json(response);
		} else {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
		}
	} catch (err) {
		next(err);
	}
};
const updateReservation = async (req, res, next) => {
	try {
		let params = req.params;
		params.inTime = +new Date();
		const response = await ParkingService.update_reservation(params);
		if (response.status == 200) {
			return res.status(httpStatus.OK).json(response);
		} else {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
		}
	} catch (err) {
		next(err);
	}
};
const getOccupied = async (req, res, next) => {
	try {
		const param = {};
		param.offset = Math.max(0, req.query.offset) || 0;
		param.limit = Math.max(0, req.query.limit) || 10000;
		const query = {
			isActive:true,
			isBooked:true
		}
		const response = await ParkingService.get_parkings(param, query);
		if (response.status == 200) {
			return res.status(httpStatus.OK).json(response);
		} else {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
		}
	} catch (e) {
		next(e);
	}
};
const getAvailable = async (req, res, next) => {
	try {
		const param = {};
		param.offset = Math.max(0, req.query.offset) || 0;
		param.limit = Math.max(0, req.query.limit) || 10000;
		const query = {
			isActive:true,
			isBooked:false
		}
		const response = await ParkingService.get_parkings(param, query);
		if (response.status == 200) {
			return res.status(httpStatus.OK).json(response);
		} else {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
		}
	} catch (e) {
		next(e);
	}
};
const getReservationsUsers = async (req, res, next) => {
	try {
		const param = {};
		param.offset = Math.max(0, req.query.offset) || 0;
		param.limit = Math.max(0, req.query.limit) || 10000;
		const query = {
			isActive:true
		}
		const response = await ParkingService.get_reservations(param, query);
		if (response.status == 200) {
			return res.status(httpStatus.OK).json(response);
		} else {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
		}
	} catch (e) {
		next(e);
	}
};
const cancelReservation = async () => {
	try {
		const response = await ParkingService.cancel_reservation();
		if (response.status == 200) {
			return res.status(httpStatus.OK).json(response);
		} else {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
		}
	} catch (e) {
		next(e);
	}
};

module.exports = {
	createReservation,
	getAvailable,
	getOccupied,
	saveParkings,
	updateReservation,
	getReservationsUsers,
	cancelReservation
};