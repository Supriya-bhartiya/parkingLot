var redis = require('redis');
var _redis_client = redis.createClient(process.env.REDIS_URL);
var logger = require('./logger')(__filename);

const { promisify } = require('util');

const get_keys = promisify(_redis_client.keys).bind(_redis_client);
const get_all_async = promisify(_redis_client.hgetall).bind(_redis_client);
const session_timeout = process.env.SESSION_TIMEOUT || 20;
const time_out_in_seconds = process.env.TIME_OUT || 0; //No timeout. if need it should be in seconds.

var redis_store = function() {
	_redis_client.on('error', function(err) {
		logger.error('Err:' + err);
	});
	_redis_client.set('connectiontest', new Date(), function(err, result) {
		logger.info('connecting redis ', result);
	});
	return {
		set: async function(topic, key, value, ttl) {
			// console.log("ttl....",topic, key, value,ttl);
			_redis_client.hset(topic, key, value);
			if (ttl) {
				return await _redis_client.expire(topic, ttl);
			} else if (time_out_in_seconds > 0) {
				return await _redis_client.expire(topic, time_out_in_seconds);
			} else {
				return;
			}
		},
		delete: function(topic, key) {
			return _redis_client.hdel(topic, key);
		},
		get_all_values_by_keys: async function(keys) {
			var vals = [];
			for (const k of keys) {
				try {
					vals.push(await get_all_async(k));
				} catch (e) {
					logger.error('Error while fetching keys for topic %s, err %s', topic, e);
				}
			}
			return vals;
		},
		get_all_exact: async function(topic, callback) {
			var keys = await get_keys(topic);
			var results = await this.get_all_values_by_keys(keys);
			return results;
		},
	};
};
module.exports = redis_store();
