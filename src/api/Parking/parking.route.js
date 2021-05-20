const express = require('express');
const validate = require('express-validation');
const controller = require('./parking.controllers');
const validation = require('../../validations/reservation.validation');

const router = express.Router();

router.route('/occupied').get(validate(validation.get_all_occupied),controller.getOccupied);
router.route('/available').get(validate(validation.get_all_available),controller.getAvailable);
router.route('/reservationUsers').post(validate(validation.save_booking),controller.createReservation);
router.route('/reservationUsers').put(validate(validation.update_reservation),controller.updateReservation);
router.route('/reservationUsers').get(validate(validation.get_reservations),controller.getReservationsUsers);

module.exports = router;
