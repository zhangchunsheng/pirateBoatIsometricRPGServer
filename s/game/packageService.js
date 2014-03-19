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

var packageService = {
	
};

redis.client.select(config.seaking_config.SEAKING_REDIS_DB, function() {
	
});

/**
 * 获取用户背包数据
 */
packageService.getPackageInfo = function(data) {
	var socket = require("../../server").socket;
	session.getSession(data, function(err, reply) {
		var validKey = "T" + data.registerType + "_" + data.loginName;
		if(validKey == reply) {
			var key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName + "_C4";
			console.log(key);
			redis.client.hget(key, "package", function(err, packageInfo) {
				console.log(packageInfo);
				packageInfo = JSON.parse(packageInfo);
				packageInfo = packageInfo["package"];
				var result = {
					status: "200",
					packageInfo: packageInfo
				};
				socket.emit("1012", result);
			});
		} else {
			var result = {
				status: "101",
				message: message.session_expire
			};
			socket.emit("1012", result);
			return;
		}
	});
};

/**
 * 更新用户背包信息
 */
packageService.updatePackageInfo = function(data) {
	var socket = require("../../server").socket;
	session.getSession(data, function(err, reply) {
		var validKey = "T" + data.registerType + "_" + data.loginName;
		if(validKey == reply) {
			var key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName + "_C4";
			console.log(key);
			redis.client.hget(key, "package", function(err, packageInfo) {
				console.log(packageInfo);
				packageInfo = JSON.parse(packageInfo);
				var flag = false;
				for(var i = 0 ; i < packageInfo["package"].length ; i++) {
					if(packageInfo["package"][i].itemId == data.itemId) {
						packageInfo["package"][i].itemNum = parseInt(packageInfo["package"][i].itemNum) + parseInt(data.itemNum);
						flag = true;
						break;
					}
				}
				if(!flag) {
					packageInfo["package"].push({
						itemId: data.itemId,
						itemNum: data.itemNum
					});
				}
				redis.client.hset(key, "package", JSON.stringify(packageInfo), redis.print);
				packageInfo = packageInfo["package"];
				var result = {
					status: "200",
					packageInfo: packageInfo
				};
				socket.emit("1014", result);
			});
		} else {
			var result = {
				status: "101",
				message: message.session_expire
			};
			socket.emit("1014", result);
			return;
		}
	});
};

exports = module.exports = packageService;