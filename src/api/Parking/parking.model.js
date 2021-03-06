//Require Mongoose
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

//Define a schema
const Schema = mongoose.Schema;

const Parking = new Schema({
	parkingId:String,
	slotType:{
		type: String,
		enum: ['Reserved','General']
	},
	floor: Number,
	pillar: String,
	isCloseToLift:Boolean,
	isBooked: Boolean,
	isActive: {
		type: Boolean,
		default: true
	},
	createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});
const Reservation = new Schema({
	parkingId:ObjectId,
	userId:ObjectId,
	vehicleNo:String,
	carColour:String,
	carModal:String,
	isRequirdReservation:Boolean, //from ui any key either ispregnent or isdisbled is true this is set to true
	bookingTime: Date,
	waitingTime: Date,
	inTime:Date,
	outTime: Date,
	cancelTime:Date,
	isActive: {
		type: Boolean,
		default: true
	},
	createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});
const User = new Schema({
	name:String,
	mobile:String,
	gender:String,
	isActive: {
		type: Boolean,
		default: true
	},
	createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports.Parking = mongoose.model('Parking', Parking);
module.exports.Reservation = mongoose.model('Reservation', Reservation);
module.exports.User = mongoose.model('User', User);