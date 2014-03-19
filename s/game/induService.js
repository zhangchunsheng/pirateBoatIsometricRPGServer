/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Zhang
 * Date: 2013-05-05
 * Description: 副本系统服务
 */
var btg = require("../../c/btg.js").btg
	,redis = require("../../config").redis
	,config = require("../../config")
	,session = require("../../c/session.js").session
	,message = require("../../i18n/zh_TW.js").message;
	
var client = redis.createClient();
redis = {
	redis: redis,
	client: client
};

var induService = {
	
};

redis.client.select(config.seaking_config.SEAKING_REDIS_DB, function() {
	
});

/**
 * 初始化用户副本数据
 */
induService.initUserInduInfo = function(data, callback) {
	var key = "INDU_" + data.induId;
	redis.client.hgetall(key, function(err, reply) {
		key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName + "_INDU_" + data.induId;
		for(var o in reply) {
			redis.client.hset(key, o, reply[o], redis.print);
		}
		callback.call(this, err, reply);
	});
};

/**
 * 获取用户副本数据
 */
induService.getUserInduInfo = function(data) {
	var socket = require("../../server").socket;
	session.getSession(data, function(err, reply) {
		var validKey = "T" + data.registerType + "_" + data.loginName;
		if(validKey == reply) {
			var induId = data.induId;
			var key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName + "_INDU_" + induId;
			redis.client.exists(key, function(err, reply) {
				if(reply == 0) {//初始化用户副本数据
					induService.initUserInduInfo(data, function(err, induInfo) {
						induInfo.enemyData = JSON.parse(induInfo.enemyData);
						induInfo.enemyData = induInfo.enemyData.enemy;
						var result = {
							status: "200",
							induInfo: induInfo
						};
						socket.emit("1102", result);
					});
				} else {
					/*redis.client.hgetall(key, function(err, induInfo) {
						console.log(induInfo);
						induInfo.enemyData = JSON.parse(induInfo.enemyData);
						induInfo.enemyData = induInfo.enemyData.enemy;
						var result = {
							status: "200",
							induInfo: induInfo
						};
						socket.emit("1102", result);
					});*/
					induService.initUserInduInfo(data, function(err, induInfo) {
						induInfo.enemyData = JSON.parse(induInfo.enemyData);
						induInfo.enemyData = induInfo.enemyData.enemy;
						var result = {
							status: "200",
							induInfo: induInfo
						};
						socket.emit("1102", result);
					});
				}
			});
		} else {
			var result = {
				status: "101",
				message: message.session_expire
			};
			socket.emit("1102", result);
			return;
		}
	});
};

/**
 * 更新用户副本信息
 */
induService.updateUserInduInfo = function(data) {
	var socket = require("../../server").socket;
	session.getSession(data, function(err, reply) {
		var validKey = "T" + data.registerType + "_" + data.loginName;
		if(validKey == reply) {
			if(data.action == "del") {
				var induId = data.induId;
				var indexId = data.indexId;
				var key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName + "_INDU_" + induId;
				var induInfo = {};
				console.log(key);
				redis.client.hget(key, "enemyData", function(err, enemyData) {
					console.log(enemyData);
					var enemyData = JSON.parse(enemyData);
					for(var i = 0 ; i < enemyData.enemy.length ; i++) {
						if(enemyData.enemy[i].indexId == indexId) {
							enemyData.enemy[i].disable = true;
							break;
						}
					}
					induInfo.enemyData = enemyData.enemy;
					console.log(JSON.stringify(enemyData));
					redis.client.hset(key, "enemyData", JSON.stringify(enemyData), redis.print);
					var result = {
						status: "200",
						induInfo: induInfo
					};
					socket.emit("1104", result);
				});
				
			}
		} else {
			var result = {
				status: "101",
				message: message.session_expire
			};
			socket.emit("1104", result);
			return;
		}
	});
};

exports = module.exports = induService;