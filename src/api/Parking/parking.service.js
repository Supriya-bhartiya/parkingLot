const parking_model = require('./parking.model').Parking;
const reservation_model = require('./parking.model').Reservation;
const response_handler = require('../../middlewares/response_handler');
const logger = require('../../utils/logger')(__filename);
const ObjectId = require('mongodb').ObjectID;

class ParkingService {

	static save_parking = async (data) => {
		try {
			const response = await parking_model.create(data);
			logger.debug('created parking', response);
			return response_handler.success(response);
		} catch (err) {
			logger.info('error occurred in save_parkings');
			logger.error('error in save_parkings', err);
			return response_handler.errorHandler('Internal_Server_Error');
		}
	};
	static update_parking = async (data) => {
		try {
			console.log('in------', data);
			const response = await parking_model.findOneAndUpdate({
				_id: ObjectId(data._id),
			},
				data
			);
			logger.debug('response of update', response);
			return response_handler.success({
				id: response._id,
			});
		} catch (error) {
			// console.log(error);
			logger.info('error occurred in update_parking');
			logger.error('error in update_parking', error);
			return response_handler.errorHandler('Internal_Server_Error');
		}
	};
	static get_parkings = async (param, data) => {
		try {
			let response;
			let count;
			if (param && param.offset && param.limit) {
				response = await parking_model
					.find(data)
					.sort({
						_id: 'asc',
					})
					.skip(param.offset)
					.limit(param.limit);
				count = await parking_model.countDocuments(data);
			} else {
				response = await parking_model
					.find(data)
					.sort({
						_id: 'asc',
					});
				count = response.length;
			}
			logger.debug('response in get parkings', response);
			return response_handler.success({
				parkings: response,
				total_counts: count
			});
		} catch (err) {
			logger.info('error occurred in get_parkings');
			logger.error('error in get_parkings', err);
			return response_handler.errorHandler('Internal_Server_Error');
		}
	};
	static get_parkings_filter = async (data) => {
		try {
			const response = await parking_model.find(data);
			const count = response.length;
			logger.debug('response in get parkings', response);
			return response_handler.success({
				parkings: response,
				total_counts: count
			});
		} catch (err) {
			logger.info('error occurred in get_parkings');
			logger.error('error in get_parkings', err);
			return response_handler.errorHandler('Internal_Server_Error');
		}
	};
	static save_reservation = async (data,totalParkingSlots) => {
		try {
			const dataReservation = await checkReservations(data,totalParkingSlots);
			if (dataReservation && dataReservation.parkingId) {
				const response = await reservation_model.create(dataReservation);
				if (response && response._id) {
					const updateData = {
						_id: dataReservation.parkingId,
						isBooked: true
					}
					const res = await this.update_parking(updateData);
					console.log('res', res);
					return response_handler.success({ id: response._id });
				} else {
					return response_handler.errorHandler('No parking slot found');
				}
			} else {
				return response_handler.errorHandler('No parking slot found');
			}

		} catch (err) {
			logger.info('error occurred in save_reservation');
			logger.error('error in save_reservation', err);
			return response_handler.errorHandler('Internal_Server_Error');
		}
	};
	static update_reservation = async (data) => {
		try {
			const response = await reservation_model.findOneAndUpdate({
				_id: ObjectId(data._id),
			},
				data
			);
			logger.debug('response of update', response);
			return response_handler.success({
				id: response._id,
			});
		} catch (error) {
			logger.info('error occurred in update_reservation');
			logger.error('error in update_reservation', error);
			return response_handler.errorHandler('Internal_Server_Error');
		}
	};
	static get_reservations = async (param, data) => {
		try {
			let response;
			let count;
			if (param && param.offset && param.limit) {
				response = await reservation_model
					.find(data)
					.sort({
						_id: 'asc',
					})
					.skip(param.offset)
					.limit(param.limit);
				count = await parking_model.countDocuments(data);
			} else {
				response = await reservation_model
					.find(data)
					.sort({
						_id: 'asc',
					});
				count = response.length;
			}
			logger.debug('response in get parkings', response);
			return response_handler.success({
				parkings: response,
				total_counts: count
			});
		} catch (err) {
			logger.info('error occurred in get_reservations');
			logger.error('error in get_reservations', err);
			return response_handler.errorHandler('Internal_Server_Error');
		}
	};
	static get_reservation = async (param) => {
		try {
			const response = await reservation_model.findOne({
				_id: ObjectId(param.id)
			});
			logger.debug('response at get reservation', response);
			return response_handler.success({
				parking: response,
			});
		} catch (err) {
			console.log(err);
			logger.info('error occurred in get_reservation');
			logger.error('error in get_reservation', err);
			return response_handler.errorHandler('Internal_Server_Error');
		}
	};
	static cancel_reservation = async () => {
		try {
			const cancelData = await reservation_model.find({
				waitingTime: { $exists: true, $lte: new Date()},
				bookingTime: { $gt: new Date(new Date().getTime() - 1000 * 60 * 31)}
			});
			
			if(cancelData && cancelData.length > 0){
			   cancelData.forEach(obj=>{
				   const data = {
					   _id : obj._id,
					   cancelTime :new Date(),
					   updatedAt:new Date(),
					   isActive:false
				   }
				   const parkingData = {
					_id : obj.parkingId,
					isBooked:false,
					updatedAt:new Date(),
				}
                    this.update_reservation(data);
                    this.update_parking(parkingData);
			   })
			}
			logger.debug('response at cancel_reservation', response);
			return response_handler.success(cancelData);
		} catch (err) {
			console.log(err);
			logger.info('error occurred in cancel_reservation');
			logger.error('error in cancel_reservation', err);
			return response_handler.errorHandler('Internal_Server_Error');
		}
	};
}

const checkReservations = async (data,totalParkingSlots) => {
	try {
		const query = {
			isActive: true,
			isBooked: true
		}
		let availableParkings = await getParkingsForReservation(data);
		if (availableParkings && availableParkings.status === 200) {
			availableParkings = availableParkings.data.parkings[0];
			const obj = Object.assign({}, data);
			obj.parkingId = availableParkings._id;
			obj.bookingTime = new Date();
			let currentTime = new Date();
			const occupied = await ParkingService.get_parkings({}, query);
			if(occupied && occupied.status === 200 && occupied.data.total_counts > 0 && (occupied.data.total_counts<(totalParkingSlots * 50 / 100))){
				obj.waitingTime = new Date(currentTime.setMinutes(currentTime.getMinutes() + 30)); //default 30 min including 15 min prio booking allowed
			} else {
				obj.waitingTime = new Date(currentTime.setMinutes(currentTime.getMinutes() + 15)); //eliminating 15 min on 50% reservation
			}
			return obj;
		} else {
			return data;
		}
	} catch (error) {
	logger.info('error occurred at checkReservations', error);
	return error;
}

}
const getParkingsForReservation = async (data) => {
	try {
		const filterParams = {
			isActive: true,
			isBooked: false
		}
		// isRequirdReservation is true either pregnent or disbled or any addition to rule like old age.
		if (data.isRequirdReservation) {
			filterParams.slotType = 'Reserved';
			filterParams.isCloseToLift = true;
		} else {
			filterParams.slotType = 'General';
		}
		const response = await parking_model.find({ $query: filterParams, $orderby: { floor: 1 } }).limit(1);
		if(response && response.length === 0){
			filterParams.slotType = 'General';
			const res = await parking_model.find({ $query: filterParams, $orderby: { floor: 1 } }).limit(1);
			return res;
		}
		return response;
	} catch (error) {
		logger.info('error occurred at checkReservations', error);
		return error;
	}

}

module.exports = ParkingService;