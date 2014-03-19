/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Zhang
 * Date: 2013-02-17
 * Description: 通用方法
 */
var config = require("../config");

var mongodb = config.mongodb
	,mysql = config.mysql
	,redis = config.redis
	,seaking_config = config.seaking_config;

var btg = {
	
};

(function(btg) {
	btg.initUcUser = function(mongodb, mysql) {
		mongodb.collection("uc_user").remove({}, function(err, reply) {
			console.log(reply);
		});
		var uc_users = [];
		mysql.query('SELECT id,loginName,password,nickname,registerType,email,phoneNum,country,province,city,birthdate,registerDate,date,bz,updateBz FROM uc_user where bz=1 and updateBz=1', function(err, rows, fields) {
			if(err)
				throw err;

			uc_users = rows;
			for(var i = 0 ; i < uc_users.length ; i++) {
				mongodb.collection('uc_user').insert(uc_users[i], function(err, result) {
					if(!err) {
						console.log('mongodb has open');
						console.log(result);
					}
				});
			}
		});
		mongodb.collection("uc_user").find().toArray(function(err, items) {
			console.dir(items);
		});
	};
	
	/**
	 * 初始化服務器列表，從mysql讀取數據寫入到mongodb和redis
	 * redis中key規則：SL_SK_{serverId}
	 */
	btg.initServerList = function(mongodb, mysql, redis) {
		mongodb.collection("sk_serverList").remove({}, function(err, reply) {
			console.log(reply);
		});
		var serverList = [];
		var key = "";
		mysql.query('SELECT id,name,ip,port,connectNumber,date,showName,bz FROM sk_serverList where bz=1', function(err, rows, fields) {
			if(err)
				throw err;

			serverList = rows;
			console.log(serverList);
			redis.client.select(0, function() {
				
			});
			redis.client.del("sk_serverList");
			for(var i = 0 ; i < serverList.length ; i++) {
				mongodb.collection('sk_serverList').insert(serverList[i], function(err, result) {
					if(!err) {
						console.log('mongodb has open');
						console.log(result);
					}
				});
				key = "SL_SK_" + serverList[i].id;
				redis.client.rpush("sk_serverList", key);
				for(var o in serverList[i]) {
					if(o && o != "id" && o != "parse" && o.substr(0, 1) != "_") {
						redis.client.hset(key, o, serverList[i][o]);
					}
				}
				redis.client.hgetall(key, function(err, replies) {
					console.log(replies);
				});
			}
			redis.client.lrange("sk_serverList", 0, -1, function(err, replies) {
				console.log(replies);
			});
		});
		mongodb.collection("sk_serverList").find().toArray(function(err, items) {
			console.dir(items);
		});
	};
	
	/**
	 * 初始化任务列表，從mysql讀取數據寫入到mongodb和redis
	 * redis中key規則：TASK_{taskId}
	 */
	btg.initTaskList = function(mongodb, mysql, redis) {
		mongodb.collection("sk_taskList").remove({}, function(err, reply) {
			console.log(reply);
		});
		var taskList = [];
		var key = "";
		mysql.query('SELECT id,taskId,imgId,`type`,taskName,taskBeginTime,taskEndTime,taskExpireTime,minLevel,maxLevel,needSociaty,sociatyValue,questNpcId,completeNpcId,taskProp,taskGoal,taskDescription,taskTalkNum,taskTalk,notCompleteText,completeText,getExp,getMoney,rewardName,rewardItems,isBroadcast,nextTaskId,`date`,bz FROM seaking_task where bz=1', function(err, rows, fields) {
			if(err)
				throw err;

			taskList = rows;
			console.log(taskList);
			redis.client.select(1, function() {
				
			});
			for(var i = 0 ; i < taskList.length ; i++) {
				key = "TASK_" + taskList[i].taskId;
				redis.client.del(key);
				mongodb.collection('sk_taskList').insert(taskList[i], function(err, result) {
					if(!err) {
						console.log('mongodb has open');
						console.log(result);
					}
				});
				for(var o in taskList[i]) {
					if(o && o != "id" && o != "parse" && o.substr(0, 1) != "_") {
						redis.client.hset(key, o, taskList[i][o], function(err, replies) {
							
						});
					}
				}
				redis.client.hgetall(key, function(err, replies) {
					console.log(replies);
				});
			}
		});
		mongodb.collection("sk_taskList").find().toArray(function(err, items) {
			console.dir(items);
		});
	};
	
	/**
	 * 初始化副本列表，從mysql讀取數據寫入到mongodb和redis
	 * redis中key規則：INDU_{id}
	 */
	btg.initInduList = function(mongodb, mysql, redis) {
		mongodb.collection("seaking_instanceDungeon").remove({}, function(err, reply) {
			console.log(reply);
		});
		var induList = [];
		var key = "";
		mysql.query('SELECT id,cityId,induId,maxIndex,`enemyData`,`date`,bz FROM seaking_instanceDungeon where bz=1', function(err, rows, fields) {
			if(err)
				throw err;

			induList = rows;
			console.log(induList);
			redis.client.select(1, function() {
				
			});
			for(var i = 0 ; i < induList.length ; i++) {
				key = "INDU_" + induList[i].induId;
				redis.client.del(key);
				mongodb.collection('seaking_instanceDungeon').insert(induList[i], function(err, result) {
					if(!err) {
						console.log('mongodb has open');
						console.log(result);
					}
				});
				for(var o in induList[i]) {
					if(o && o != "id" && o != "parse" && o.substr(0, 1) != "_") {
						redis.client.hset(key, o, induList[i][o], function(err, replies) {
							
						});
					}
				}
				redis.client.hgetall(key, function(err, replies) {
					console.log(replies);
					key = "S1_T1_wozlla_INDU_" + replies.induId;
					for(var o in replies) {
						redis.client.hset(key, o, replies[o], redis.print);
					}
				});
			}
		});
		mongodb.collection("seaking_instanceDungeon").find().toArray(function(err, items) {
			console.dir(items);
		});
	};
	
	/**
	 * 初始化用户副本信息
	 */
	btg.initUserInduInfo = function(redis) {
		
	};
	
	/**
	 * 初始化用户背包数据
	 */
	btg.initUserPackage = function(mongodb, mysql, redis) {
		var key = "S1_T1_wozlla_C4";
		var packageInfo = '{"package":[{"itemId":1000,"itemNum":99}]}';
		console.log(packageInfo);
		redis.client.select(1, function() {
			
		});
		redis.client.hset(key, "package", packageInfo, function(err, replies) {
			console.log(replies);
		});
		redis.client.hget(key, "package", function(err, replies) {
			console.log(replies);
			btg.closeDb(redis);
		});
	};
	
	btg.initUserId = function(redis) {
		btg.selectDb(redis);
		var key = "userId";
		redis.client.setnx(key, 100000);
	}
	
	/**
	 * 獲得redisClient
	 */
	btg.getRedisClient = function(redis) {
		redis.client = redis.redis.createClient();
	}
	
	/**
	 * 選擇數據庫
	 */
	btg.selectDb = function(redis) {
		redis.client.select(seaking_config.UC_USER_REDIS_DB, function() {
			
		});
	}
	
	btg.selectSeakingDb = function(redis) {
		redis.client.select(seaking_config.SEAKING_REDIS_DB, function() {
			
		});
	}
	
	btg.random = function(lower, higher) {
		return Math.floor(Math.random() * (higher + 1 - lower)) + lower;
		//return Math.floor(Math.random() * higher+1) + lower;
	};
	
	btg.closeDb = function(redis) {
		//redis.client.quit();
		redis.client.end();
	}
})(btg);

(function(btg) {
	
})(btg);

exports.btg = btg;