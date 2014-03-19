/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Zhang
 * Date: 2013-02-17
 * Description: 遊戲服務器端程序入口，啟動服務：node server.js
 */
var express = require('express'),
	stylus = require('stylus'),
	nib = require('nib'),
	io = require('socket.io'),
	config = require("./config"),
	btg = require("./c/btg.js").btg,
	uc_user = require("./s/uc/uc_user.js").uc_user,
	seaking_user = require("./s/seaking_user").seaking_user,
	talkService = require("./s/talkService").talkService,
	taskService = require("./s/game/taskService"),
	induService = require("./s/game/induService"),
	packageService = require("./s/game/packageService");

var mongodb = config.mongodb,
	mysql = config.mysql,
	redis = config.redis,
	seaking_config = config.seaking_config;

var app = express(),
	server = require('http').createServer(app),
	io = io.listen(server);

var client = redis.createClient();
redis = {
	redis: redis,
	client: client
};

var players = [];
var nextId = 0;
var player = {};
var x = 0;
var y = 0;
for(var i = 0 ; i < 100 ; i++) {
	nextId++;
	players[i] = {};
	players[i].id = nextId;
	players[i].x = btg.random(600, 4000);
	players[i].y = btg.random(100, 2000);
}

// Game server part
io.sockets.on('connection', function(socket) {
	var player;

	exports.socket = socket;
	exports.players = players;
	exports.player = player;
	exports.nextId = nextId;
	socket.on('logon', seaking_user.login);

	socket.on('move', function(data) {
		if (player) {
			player.x = data.x;
			player.y = data.y;

			// Broadcast position change to all other clients
			socket.broadcast.emit('moved', player);
		}
	});
	
	var result = {
		status: "200",
		loginName: "alan",
		message: "pretty girl"
	};
	socket.broadcast.emit("1602", result);
	result = {
		status: "200",
		loginName: "jonas",
		message: "which one?"
	};
	socket.broadcast.emit("1602", result);
	result = {
		status: "200",
		loginName: "peter",
		message: "I have no idea"
	};
	socket.broadcast.emit("1602", result);

	/**
	 * 註冊
	 */
	socket.on("1001", uc_user.register);

	/**
	 * 登錄
	 */
	socket.on("1003", uc_user.login);

	/** 
	 * 保持登錄
	 */
	socket.on("1005", uc_user.loginBySessionId);

	/**
	 * 聊天
	 */
	socket.on("1601", talkService.talkToWorld);
	
	/**
	 * 广播
	 */
	socket.on("1605", talkService.broadcast);
	
	/**
	 * 创建角色
	 */
	socket.on("1007", seaking_user.createCharacter);
	
	/**
	 * 获得角色信息
	 */
	socket.on("1009", seaking_user.getCharacterInfo);

	/**
	 * 获取任务
	 */
	socket.on("1301", function(req) {
		taskService.getTaskInfo(req, function(err, res, type) {
			var result;
			if (err) {
				result = {
					status: err.code,
					message: err.message
				};
			} else {
				result = {
					status: "200",
					taskInfo: res,
					type: type
				};
			}

			socket.emit("1302", result);
		});
	});
	
	/**
	 * 更新用户金币和经验数据
	 */
	socket.on("1015", seaking_user.updateMoneyAndExp);
	
	/**
	 * 获得用户副本数据
	 */
	socket.on("1101", induService.getUserInduInfo);
	
	/**
	 * 更新用户副本数据
	 */
	socket.on("1103", induService.updateUserInduInfo);
	
	/**
	 * 获得用户背包数据
	 */
	socket.on("1011", packageService.getPackageInfo);
	
	/**
	 * 更新用户背包数据
	 */
	socket.on("1013", packageService.updatePackageInfo);

	socket.on('disconnect', function() {
		players.splice(players.indexOf(player), 1);
		io.sockets.emit('disconnected', player);
	});
});

server.listen(7002);

console.log('server listening on port %s', server.address().port);