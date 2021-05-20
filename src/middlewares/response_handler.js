const success = (data) => {
	return {
		status: 200,
		message: 'OK',
		data,
	};
};
const custom = (data) => {
	return {
		status: data.status,
		message: data.message
	};
};
const invalid = (data) => {
	return {
		status: 401,
		data,
	};
};

const errorHandler = (error) => {
	return {
		status: 500,
		message: error,
	};
};

module.exports = {
	success,
	invalid,
	errorHandler,
	custom
};
