/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Zhang
 * Date: 2013-02-17
 * Description: 配置文件
 */
var mongoskin = require('mongoskin');
exports.mongodb = mongoskin.db('localhost:27017?auto_reconnect=true', {
	database: "seaking",
	safe: true
});

var mysql = require('mysql');
exports.mysql = mysql.createConnection({
	host     : 'localhost',
	user     : 'seaking',
	password : 'seaking',
	database: "seaking"
});

var redis = require("redis");
exports.redis = redis;

var seaking_config = {
	UC_USER_REDIS_DB: 0,
	SEAKING_REDIS_DB: 1,
	SESSION_REDIS_DB: 2
};
exports.seaking_config = seaking_config;