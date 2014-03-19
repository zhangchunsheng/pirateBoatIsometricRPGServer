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

var seaking_user = {
	
};

(function(seaking_user) {
	seaking_user.login = function(pos) {
		var server = require("../server");
		var players = server.players;
		var player = server.player;
		var socket = server.socket;
		var nextId = server.nextId;
        // Create the player
        player = { id: nextId++, x: pos.x, y: pos.y };

        // Send existing players to client
        socket.emit('players', players);

        // Send the new player to other clients
        socket.broadcast.emit('connected', player);

        // Add client to list of players
        players.push(player);
    };
	
	/**
	 * 創建角色
	 * 角色屬性
	id: 0,							//角色Id
	cId: 0,							//所选角色
	level: 1,						//角色等级
	nickname: "水神",				//角色名称
	maxEnergy: 0,					//精力上限
	energy: 0,						//当前精力值
	getEnergySpeed: 0,				//精力回复速度,表示每小时回复的精力数目
	speed: 0,						//移动速度
	lucky: 0,						//幸运
	life: 100,						//耐久,生命值
	powerful: 0,					//影响攻击出手先后
	attack: 0,						//普通攻击伤害
	skillHurt: 0,					//技能攻击伤害
	weaponDef: 0,					//物理防御,对物理类型攻击的减免
	fireDef: 0,						//火焰防御,对火焰类型攻击的减免
	crit: 0,						//暴击,暴击几率和暴击之后造成的额外伤害
	parry: 0,						//格挡,格挡几率和格挡之后减免的额外伤害
	hit: 0,							//命中,命中和暴击的几率
	dodge: 0,						//闪避,闪避和格挡的几率
	currentExp: 100,				//玩家在当前等级获取的经验值
	needExp: 100,					//玩家升到下一级所需要的经验值
	photo: './res/ui/ci/0/0_photo.png',
	money: 0,
	gameCurrency: 0
	 */
	seaking_user.createCharacter = function(data) {
		var socket = require("../server").socket;
		session.getSession(data, function(err, reply) {
			var validKey = "T" + data.registerType + "_" + data.loginName;
			if(validKey == reply) {
				redis.client = redis.redis.createClient();
				btg.selectSeakingDb(redis);
				seaking_user.getCharacterId(redis, function(err, characterId) {
					var key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName;
					redis.client.hset(key, "characters", characterId, redis.print);
					
					key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName + "_C" + characterId;
					redis.client.hset(key, "userId", data.userId, redis.print);
					redis.client.hset(key, "cId", data.characterId, redis.print);
					redis.client.hset(key, "nickname", data.nickname, redis.print);
					redis.client.hset(key, "currentCity", 1, redis.print);
					redis.client.hset(key, "positionX", 1000, redis.print);
					redis.client.hset(key, "positionY", 1000, redis.print);
					redis.client.hset(key, "experience", 100, redis.print);
					redis.client.hset(key, "gameCurrency", 100, redis.print);
					redis.client.hset(key, "money", 100, redis.print);
					redis.client.hset(key, "pirateBoats", '{"pirateBoats":[]}', redis.print);
					redis.client.hset(key, "partners", '{"partners":[]}', redis.print);
					redis.client.hset(key, "equipments", '{"equipments":[]}', redis.print);
					redis.client.hset(key, "package", '{"package":[]}', redis.print);
					redis.client.hset(key, "skills", '{"skills":[]}', redis.print);
					redis.client.hset(key, "gift", '{"gift":[]}', redis.print);
					redis.client.hset(key, "currentMainTask", '{"taskId": 10100, "status": 0}', redis.print);
					redis.client.hset(key, "currentBranchTask", '{"taskId": 20201, "status": 1}', redis.print);
					redis.client.hset(key, "currentDayTask", '[{"taskId": 30201,"status": 2},30202,30203]', redis.print);
					redis.client.hset(key, "currentExerciseTask", '{"taskId": 40201, "status": 3}', redis.print);
					var taskInfo = {
						currentMainTask: {
							taskId: 10101,
							status: 0
						},
						currentBranchTask: {
							taskId: 20201,
							status: 1
						},
						currentDayTask: {
							taskId: 30201,
							status: 2
						},
						currentExerciseTask: {
							taskId: 40201,
							status: 3
						}
					};
					redis.client.hgetall("TASK_" + taskInfo.currentMainTask.taskId, function(err, task) {
						console.log(task);
						for(var o in task) {
							taskInfo.currentMainTask[o] = task[o];
						}
					});
					redis.client.hgetall("TASK_" + taskInfo.currentBranchTask.taskId, function(err, task) {
						for(var o in task) {
							taskInfo.currentBranchTask[o] = task[o];
						}
					});
					redis.client.hgetall("TASK_" + taskInfo.currentDayTask.taskId, function(err, task) {
						for(var o in task) {
							taskInfo.currentDayTask[o] = task[o];
						}
					});
					redis.client.hgetall("TASK_" + taskInfo.currentExerciseTask.taskId, function(err, task) {
						for(var o in task) {
							taskInfo.currentExerciseTask[o] = task[o];
						}
						socket.emit("1008", result);
					});
					var result = {
						status: 200,
						currentCity: 1,
						positionX: 1000,
						positionY: 100,
						experience: 100,
						gameCurrency: 100,
						money: 100,
						pirateBoats: [{pId: 0},{pId: 0},{pId: 0}],
						equipment: [],
						"package": [{"itemId":1000,"itemNum":99}],
						skills: [],
						formation: [{cId:0},{cId:0},{cId:0}],
						partners: [{cId: 0},{cId: 0}],
						gift: [],
						mainBoatId: 0,
						currentMainTask: taskInfo.currentMainTask,
						currentBranchTask: taskInfo.currentBranchTask,
						currentDayTask: taskInfo.currentDayTask,
						currentExerciseTask: taskInfo.currentExerciseTask
					};
				});
			} else {
				var result = {
					status: "101",
					message: message.session_expire
				};
				socket.emit("1008", result);
				return;
			}
		});
	};
	
	/**
	 * 获得characterId
	 */
	seaking_user.getCharacterId = function(redis, callback) {
		var key = "characterId";
		redis.client.incr(key, function(err, reply) {
			callback.call(this, err, reply);
		});
	}
	
	/**
	 * 获得角色信息
	 */
	seaking_user.getCharacterInfo = function(data) {
		var socket = require("../server").socket;
		session.getSession(data, function(err, reply) {
			var validKey = "T" + data.registerType + "_" + data.loginName;
			if(validKey == reply) {
				redis.client = redis.redis.createClient();
				btg.selectSeakingDb(redis);
				var key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName;
				redis.client.hget(key, "characters", function(err, reply) {
					key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName + "_C" + reply;
					redis.client.hgetall(key, function(err, replies) {
						console.log(replies);
						if(!replies.money) {
							replies.money = 0;
						}
						if(!replies.gameCurrency) {
							replies.gameCurrency = 0;
						}
						var taskInfo = {
							currentMainTask: {
								taskId: 10101,
								status: 0
							},
							currentBranchTask: {
								taskId: 20201,
								status: 1
							},
							currentDayTask: {
								taskId: 30201,
								status: 2
							},
							currentExerciseTask: {
								taskId: 40201,
								status: 3
							}
						};
						redis.client.hgetall("TASK_" + taskInfo.currentMainTask.taskId, function(err, task) {
							console.log(task);
							for(var o in task) {
								taskInfo.currentMainTask[o] = task[o];
							}
						});
						redis.client.hgetall("TASK_" + taskInfo.currentBranchTask.taskId, function(err, task) {
							for(var o in task) {
								taskInfo.currentBranchTask[o] = task[o];
							}
						});
						redis.client.hgetall("TASK_" + taskInfo.currentDayTask.taskId, function(err, task) {
							for(var o in task) {
								taskInfo.currentDayTask[o] = task[o];
							}
						});
						redis.client.hgetall("TASK_" + taskInfo.currentExerciseTask.taskId, function(err, task) {
							for(var o in task) {
								taskInfo.currentExerciseTask[o] = task[o];
							}
							socket.emit("1010", result);
						});
						var cId = 0;
						var level = Math.floor(replies.experience / 200);
						var result = {
							status: 200,
							id: 0,							//角色Id
							cId: cId,						//所选角色
							level: level,						//角色等级
							nickname: "水神",				//角色名称
							maxEnergy: 100,					//精力上限
							energy: 100,					//当前精力值
							getEnergySpeed: 10,				//精力回复速度,表示每小时回复的精力数目
							speed: 100,						//移动速度
							lucky: 100,						//幸运
							life: 100,						//耐久,生命值
							powerful: 10,					//影响攻击出手先后
							attack: 100,					//普通攻击伤害
							skillHurt: 100,					//技能攻击伤害
							weaponDef: 50,					//物理防御,对物理类型攻击的减免
							fireDef: 50,					//火焰防御,对火焰类型攻击的减免
							crit: 10,						//暴击,暴击几率和暴击之后造成的额外伤害
							parry: 10,						//格挡,格挡几率和格挡之后减免的额外伤害
							hit: 10,						//命中,命中和暴击的几率
							dodge: 10,						//闪避,闪避和格挡的几率
							currentExp: replies.experience,	//玩家在当前等级获取的经验值
							needExp: 200 * (level + 1),					//玩家升到下一级所需要的经验值
							photo: './res/ui/ci/' + cId + '/' + cId + '_photo.png',
							currentCity: 1,
							positionX: 1000,
							positionY: 100,
							gameCurrency: replies.gameCurrency,
							money: replies.money,
							pirateBoats: [{pId: 0},{pId: 0},{pId: 0}],
							equipment: [],
							"package": [],
							skills: [],
							formation: [{cId:0},{cId:0},{cId:0}],
							partners: [{cId: 0},{cId: 0}],
							gift: [],
							mainBoatId: 0,
							currentMainTask: taskInfo.currentMainTask,
							currentBranchTask: taskInfo.currentBranchTask,
							currentDayTask: taskInfo.currentDayTask,
							currentExerciseTask: taskInfo.currentExerciseTask
						};
					});
				});
			} else {
				var result = {
					status: "101",
					message: message.session_expire
				};
				socket.emit("1010", result);
				return;
			}
		});
	};
	
	/**
	 * 更新角色金钱和经验
	 */
	seaking_user.updateMoneyAndExp = function(data) {
		var socket = require("../server").socket;
		session.getSession(data, function(err, reply) {
			var validKey = "T" + data.registerType + "_" + data.loginName;
			if(validKey == reply) {
				redis.client = redis.redis.createClient();
				btg.selectSeakingDb(redis);
				var key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName;
				redis.client.hget(key, "characters", function(err, reply) {
					key = "S" + data.serverId + "_T" + data.registerType + "_" + data.loginName + "_C" + reply;
					redis.client.hgetall(key, function(err, replies) {
						var money = replies.money;
						var experience = replies.experience;
						var currentLevel = Math.floor(replies.experience / 200);
						if(money) {
							money = parseInt(money) + parseInt(data.money);
						} else {
							money = parseInt(data.money);
						}
						if(experience) {
							experience = parseInt(experience) + parseInt(data.experience);
						} else {
							experience = parseInt(data.experience);
						}
						var level = Math.floor(experience / 200);
						var isLevelUp = 0;
						if(level > currentLevel) {
							isLevelUp = 1;
							/*var result = {
								status: "200",
								loginName: "wozlla",
								message: "恭喜您升到" + level + "级了"
							};
							socket.emit("1606", result);
							socket.broadcast.emit("1606", result);*/
						}
						redis.client.hset(key, "money", money, redis.print);
						redis.client.hset(key, "experience", experience, redis.print);
						var result = {
							status: "200",
							money: money,
							experience: experience,
							isLevelUp: isLevelUp,
							level: level,
							needExp: 200 * (level + 1)
						};
						socket.emit("1016", result);
					});
				});
			} else {
				var result = {
					status: "101",
					message: message.session_expire
				};
				socket.emit("1016", result);
				return;
			}
		});
	};
})(seaking_user);

exports.seaking_user = seaking_user;