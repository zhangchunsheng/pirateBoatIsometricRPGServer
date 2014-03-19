/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Zhang
 * Date: 2013-02-23
 * Description: 會話管理
 */
var btg = require("./btg.js").btg
	,md5 = require('MD5')
	,config = require("../config");

var mongodb = config.mongodb
	,mysql = config.mysql
	,redis = config.redis
	,seaking_config = config.seaking_config;

var client = redis.createClient();
redis = {
	redis: redis,
	client: client
};

var session = {
	
};

(function(session) {
	/**
	 * 獲得sessionId
	 */
	session.getSessionId = function() {
		var sessionId = "BTG";
		var date = new Date();
		sessionId += date.getTime();
		sessionId += btg.random(100000, 999999);
		sessionId = md5(sessionId).toUpperCase();
		return sessionId;
	};
	
	/**
	 * 獲得session內容
	 * @param {obj} data
	 * @return
	 */
	session.getSession = function(data, callback) {
		session.getRedisClient();
		session.selectDb(redis);
		var key = "session_" + data.sessionId;
		redis.client.get(key, function(err, reply) {
			callback.call(data, err, reply);
		});
	};

	/**
	 * 保存會話
	 * session_{sessionId} {T{registerType}_{loginName}}
	 */
	session.saveSession = function(sessionId, userInfo) {
		session.getRedisClient();
		session.selectDb(redis);
		var key = "session_" + sessionId;
		var value = "T" + userInfo.registerType + "_" + userInfo.loginName;
		redis.client.set(key, value, function(err, reply) {

		});
	};
	
	/**
	 * 設置過期時間 in seconds
	 */
	session.expireSession = function(sessionId, expireTime) {
		session.getRedisClient();
		session.selectDb(redis);
		var key = "session_" + sessionId;
		redis.client.expire(key, expireTime, function(err, reply) {
			
		});
	}
	
	/**
	 * 刪除會話
	 */
	session.removeSession = function(sessionId) {
		session.getRedisClient();
		session.selectDb(redis);
		var key = "session_" + sessionId;
		redis.client.del(key, function(err, reply) {
			
		});
	};
	
	/**
	 * 獲得redisClient
	 */
	session.getRedisClient = function() {
		redis.client = redis.redis.createClient();
	}
	
	/**
	 * 選擇數據庫
	 */
	session.selectDb = function(redis) {
		redis.client.select(seaking_config.SESSION_REDIS_DB, function() {
			
		});
	};
})(session);

exports.session = session;