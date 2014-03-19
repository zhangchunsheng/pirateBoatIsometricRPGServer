/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Zhang
 * Date: 2013-02-17
 * Description: 獲得遊戲服務器列表，啟動服務：node getServerList.js
 */
var express = require('express')
	,stylus = require('stylus')
	,nib = require('nib')
	,io = require('socket.io')
	,mongodb = require("./config").mongodb
	,mysql = require("./config").mysql
	,redis = require("./config").redis
	,seaking_config = require("./config").seaking_config
	,btg = require("./c/btg.js").btg;

var app = express()
	,server = require('http').createServer(app)
	,io = io.listen(server);
	
var client = redis.createClient();
redis = {
	redis: redis,
	client: client
};

// Game server part
io.sockets.on('connection', function(socket) {
    socket.on('getServerList', function() {
		var serverList = [];
		var key = "";
		redis.client = redis.redis.createClient();
		redis.client.lrange("sk_serverList", 0, -1, function(err, replies) {
			for(var i = 0 ; i < replies.length ; i++) {
				key = replies[i];
				redis.client.hgetall(key, function(err, result) {
					serverList.push(result);
					if(serverList.length == replies.length) {
						socket.emit('serverList', serverList);
					}
					btg.closeDb(redis);
				});
			}
		});
    });

    socket.on('disconnect', function() {
        io.sockets.emit('disconnected');
    });
});

server.listen(7001);

console.log('server listening on port %s', server.address().port);