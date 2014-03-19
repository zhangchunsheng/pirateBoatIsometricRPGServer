/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Zhang
 * Date: 2013-02-17
 * Description: 用戶相關服務
 */
var btg = require("../c/btg.js").btg
	,redis = require("../config").redis
	,session = require("../c/session.js").session;
	
var client = redis.createClient();
redis = {
	redis: redis,
	client: client
};

var talkService = {
	
};

(function(talkService) {
	/**
	 * 在世界聊天
	 * @param {obj} data {registerType, loginName, userId, sessionId, serverId, message}
	 * @return
	 */
	talkService.talkToWorld = function(data) {
		var socket = require("../server").socket;
		if(data == null || data.sessionId == null || data.sessionId == "") {
			var result = {
				status: "100",
				message: message.no_loginName
			};
			socket.emit("1602", result);
			return;
		}
		session.getSession(data, function(err, reply) {
			var validKey = "T" + data.registerType + "_" + data.loginName;
			if(validKey == reply) {
				var result = {
					status: "200",
					loginName: data.loginName,
					message: data.message
				};
				socket.broadcast.emit("1602", result);
			} else {
				var result = {
					status: "101",
					message: message.session_expire
				};
				socket.emit("1602", result);
				return;
			}
		});
	}
	
	/**
	 * 广播
	 * @param {obj} data {registerType, loginName, userId, sessionId, serverId, message}
	 * @return
	 */
	talkService.broadcast = function(data) {
		var socket = require("../server").socket;
		if(data == null || data.sessionId == null || data.sessionId == "") {
			var result = {
				status: "100",
				message: message.no_loginName
			};
			socket.emit("1606", result);
			return;
		}
		session.getSession(data, function(err, reply) {
			var validKey = "T" + data.registerType + "_" + data.loginName;
			if(validKey == reply) {
				var result = {
					status: "200",
					loginName: data.loginName,
					message: data.message
				};
				socket.emit("1606", result);
				socket.broadcast.emit("1606", result);
			} else {
				var result = {
					status: "101",
					message: message.session_expire
				};
				socket.emit("1606", result);
				return;
			}
		});
	}
})(talkService);

exports.talkService = talkService;