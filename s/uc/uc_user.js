/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Zhang
 * Date: 2013-02-17
 * Description: 用戶中心服務
 */
var btg = require("../../c/btg.js").btg
	,config = require("../../config")
	,md5 = require('MD5')
	,message = require("../../i18n/zh_TW.js").message
	,session = require("../../c/session.js").session;

var mongodb = config.mongodb
	,mysql = config.mysql
	,redis = config.redis
	,seaking_config = config.seaking_config;

var client = redis.createClient();
redis = {
	redis: redis,
	client: client
};

var uc_user = {
	
};

(function(uc_user) {
	/**
	 * 添加用戶
	 * key:T{registerType}_{loginName} {userId,loginName,password,nickname,registerType,email,phoneNum,country,province,city,birthdate,registerDate,date,bz,updateBz} hashmap registerType 1 - 用户名注册 6 - email 7 - 手机号
	 */
	uc_user.addUser = function(redis, userInfo) {
		btg.selectDb(redis);
		var date = new Date();
		var time = date.getTime();
		var key = "T" + userInfo.registerType + "_" + userInfo.loginName;
		redis.client.hset(key, "userId", userInfo.userId, redis.print);
		redis.client.hset(key, "registerType", userInfo.registerType, redis.print);
		redis.client.hset(key, "loginName", userInfo.loginName, redis.print);
		redis.client.hset(key, "password", userInfo.password, redis.print);
		redis.client.hset(key, "registerDate", time, redis.print);
		redis.client.hset(key, "date", time, redis.print);
		redis.client.hset(key, "bz", 1, redis.print);
		redis.client.hset(key, "updateBz", 1, redis.print);
	};

	/**
	 * 更新用戶
	 */
	uc_user.updateUser = function(userInfo) {
		
	};
	
	/**
	 * 保存sessionId
	 */
	uc_user.saveSessionId = function(redis, sessionId, userInfo) {
		btg.selectDb(redis);
		var key = "T" + userInfo.registerType + "_" + userInfo.loginName;
		redis.client.hset(key, "sessionId", sessionId);
	}

	/**
	 * 獲得userId
	 */
	uc_user.getUserId = function(redis) {
		btg.selectDb(redis);
		var key = "userId";
		redis.client.incr(key, function(err, reply) {
			
		});
	};
})(uc_user);

(function(uc_user) {
	/**
	 * 註冊
	 */
	uc_user.register = function(data) {
		var socket = require("../../server").socket;
		if(data == null || data.loginName == null || data.loginName == "") {
			var result = {
				status: "100",
				message: message.no_loginName
			};
			socket.emit("1002", result);
			return;
		}
		/*var validInfo = uc_user.validLoginName(data);
		if(validInfo.validNum < 1) {
			var result = {
				status: "100",
				message: validInfo.message
			};
			socket.emit("1002", result);
			return;
		}*/
		if(data.password == null || data.password == "") {
			var result = {
				status: "100",
				message: message.no_password
			};
			socket.emit("1002", result);
			return;
		}
		//由於密碼經md5加密，密碼將在前端驗證
		/*validInfo = uc_user.validPassword(data);
		if(validInfo.validNum < 1) {
			var result = {
				status: "100",
				message: validInfo.message
			};
			socket.emit("1002", result);
			return;
		}*/
		btg.getRedisClient(redis);
		btg.selectDb(redis);
		var key = "T" + data.registerType + "_" + data.loginName;
		redis.client.exists(key, function(err, reply) {
			if(reply == 0) {
				uc_user.getUserId(redis);
				var sessionId = session.getSessionId();
				redis.client.get("userId", function(err, reply) {
					data.userId = reply;
					uc_user.addUser(redis, data);
					session.saveSession(sessionId, data);
					uc_user.saveSessionId(redis, sessionId, data);
					var result = {
						status: "200",
						userId: reply,
						registerType: data.registerType,
						loginName: data.loginName,
						sessionId: sessionId,
						message: message.register_success
					};
					socket.emit("1002", result);
					btg.closeDb(redis);
				});
			} else {
				var result = {
					status: "100",
					message: message.exists_loginName
				};
				socket.emit("1002", result);
				btg.closeDb(redis);
				return;
			}
		});
	};
	
	/**
	 * 登錄
	 */
	uc_user.login = function(data) {
		var socket = require("../../server").socket;
		if(data == null || data.loginName == null || data.loginName == "") {
			var result = {
				status: "100",
				message: message.no_loginName
			};
			socket.emit("1004", result);
			return;
		}
		/*var validInfo = uc_user.validLoginName(data);
		if(validInfo.validNum < 1) {
			var result = {
				status: "100",
				message: validInfo.message
			};
			socket.emit("1004", result);
			return;
		}*/
		if(data.password == null || data.password == "") {
			var result = {
				status: "100",
				message: message.no_password
			};
			socket.emit("1004", result);
			return;
		}
		//由於密碼經md5加密，密碼將在前端驗證
		/*validInfo = uc_user.validPassword(data);
		if(validInfo.validNum < 1) {
			var result = {
				status: "100",
				message: validInfo.message
			};
			socket.emit("1004", result);
			return;
		}*/
		btg.getRedisClient(redis);
		btg.selectDb(redis);
		var key = "T" + data.registerType + "_" + data.loginName;
		redis.client.exists(key, function(err, reply) {
			if (reply == 0) {
 				var result = {
 					status: "100",
 					message: message.notexists_loginName
 				};
 				socket.emit("1004", result);
 				return;
			} else {
				redis.client.hget(key, "password", function(err, reply) {
					if (data.password != reply) {
						var result = {
							status: "100",
							message: message.password_wrong
						};
						socket.emit("1004", result);
						return;
					} else {
						redis.client.hgetall(key, function(err, userInfo) {
							if(userInfo.sessionId != "") {
								session.removeSession(userInfo.sessionId);
							}
							var sessionId = session.getSessionId();
							session.saveSession(sessionId, data);
							uc_user.saveSessionId(redis, sessionId, data);
							redis.client.hget(key, "userId", function(err, reply){
								var result = {
									status: "200",
									userId: reply,
									registerType: data.registerType,
									loginName: data.loginName,
									sessionId: sessionId,
									message: message.login_success
								};
								socket.emit("1004", result);
								return;
							});
						});
					}
				});
			}
		});
	}
	
	/**
	 * 保持登錄
	 */
	uc_user.loginBySessionId = function(data) {
		var socket = require("../../server").socket;
		if(data == null || data.sessionId == null || data.sessionId == "") {
			var result = {
				status: "100",
				message: message.no_loginName
			};
			socket.emit("1006", result);
			return;
		}
		session.getSession(data, function(err, reply) {
			var validKey = "T" + data.registerType + "_" + data.loginName;
			if(validKey == reply) {
				var result = {
					status: "200",
					userId: data.userId,
					registerType: data.registerType,
					loginName: data.loginName,
					sessionId: data.sessionId,
					message: message.login_success
				};
				socket.emit("1006", result);
			} else {
				var result = {
					status: "100",
					message: message.loginName_notmatch
				};
				socket.emit("1006", result);
				return;
			}
		});
	}

	/**
	 * 驗證用戶名
	 */
	uc_user.validLoginName = function(data) {
		if((data.loginName.length < 6) || (data.loginName.length > 16)) {
			return {
				validNum: 0,
				message: message.loginName_length
			};
		}
		var pattern=/[a-z,A-Z]+/;
		if(!pattern.test(data.loginName)) {
			return {
				validNum: -1,
				message: message.loginName_valid
			};
		}
		return {
			validNum: 1
		};
	}

	/**
	 * 驗證密碼
	 */
	uc_user.validPassword = function(data) {
		if((data.password.length < 6) || (data.password.length > 16)) {
			return {
				validNum: 0,
				message: message.password_length
			};
		}
		return {
			validNum: 1
		};
	}
})(uc_user);

exports.uc_user = uc_user;