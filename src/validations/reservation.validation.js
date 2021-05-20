const Joi = require('joi');

module.exports = {
	// POST /v1/parkings/reservationUsers
	save_booking: {
		body: {
			name: Joi.string().required(),
			mobile: Joi.string().required(),
			gender: Joi.string().optional(),
			vehicleNo: Joi.string().required(),
			carColour: Joi.string().optional(),
			carModal: Joi.string().optional(),
			isPregnent: Joi.boolean().required(),
			isDisabled: Joi.boolean().required()
		},
		query: {},
		param: {},
	},

	// PUT /v1/parkings/reservationUsers
	update_reservation: {
		body: {},
		query: {},
		param: {
			_id: Joi.string().required()
		},
	},

	//GET /v1/parkings/occupied?offset=0&limit=10
	get_all_occupied: {
		param: {},
		query: {},
		body: {},
	},
	//GET /v1/parkings/available?offset=0&limit=10
	get_all_available: {
		param: {},
		query: {},
		body: {},
	},

	//GET /v1/parkings/reservationUsers?offset=0&limit=10
	get_reservations: {
		param: {},
		query: {},
		body: {},
	},


};
