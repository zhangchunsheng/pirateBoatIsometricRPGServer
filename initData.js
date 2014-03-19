/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Zhang
 * Date: 2013-02-17
 * Description: 初始化數據
 */
var express = require('express'),
	stylus = require('stylus'),
	nib = require('nib'),
	io = require('socket.io'),
	mongodb = require("./config").mongodb,
	mysql = require("./config").mysql,
	redis = require("./config").redis,
	seaking_config = require("./config").seaking_config,
	btg = require("./c/btg.js").btg,
	exec = require('child_process').exec,
	child;

var client = redis.createClient();
redis = {
	redis: redis,
	client: client
};

mysql.connect();
redis.client.select(15, function() {

});
redis.client.on("error", function(err) {
	console.log("Error " + err);
});

redis.client.set("foo", "test", redis.redis.print);
redis.client.get("foo", function(err, reply) {
	console.log(reply);
});

var app = express(),
	server = require('http').createServer(app),
	io = io.listen(server);

server.listen(9000);

function init() {
	btg.initServerList(mongodb, mysql, redis);
	//btg.initUserId(redis);
	btg.initUcUser(mongodb, mysql, redis);
	btg.initTaskList(mongodb, mysql, redis);
	btg.initInduList(mongodb, mysql, redis);
	btg.initUserPackage(mongodb, mysql, redis);

	// add by gaoxiaochen 2013-3-25 汉字无法使用
	/*child = exec('node redis_proto.js | redis-cli -n 1 --pipe', function(error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});*/
}
//collection.findOne({_id, ObjectID.createFromHexString(id)}, ..., callback);
init();
mysql.end();

function handleDisconnect(connection) {
	connection.on('error', function(err) {
		if (!err.fatal) {
			return;
		}

		if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
			throw err;
		}

		console.log('Re-connecting lost connection: ' + err.stack);

		connection = mysql.createConnection(connection.config);
		handleDisconnect(connection);
		connection.connect();
	});
}