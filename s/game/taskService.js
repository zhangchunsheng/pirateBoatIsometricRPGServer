/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Gao
 * Date: 2013-03-25
 * Description: 任务系统服务
 */
var config = require("../../config"),
	client = config.redis.createClient(),
	session = require("../../c/session").session,
	message = require("../../i18n/zh_TW.js").message,
	taskService = {};

exports = module.exports = taskService;

client.select(config.seaking_config.SEAKING_REDIS_DB, function() {
	
});

/**
 * 获取任务详情
 */
taskService.getTaskInfo = function(req, callback) {
	var type = req.type,
		taskId = req.taskId;
	session.getSession(req, function(err, reply) {
		var validKey = "T" + req.registerType + "_" + req.loginName,
			err;
		if (validKey != reply) {
			err = new Error(message.session_expire);
			err.code = 101;
			callback(err);
			return;
		}

		if (type == 1 && taskId != null) {
			console.log("taskId: " + taskId);
			client.hgetall("TASK_" + taskId, function(err, task) {
				console.log(task);
				callback(err, [task], type);
			});
		} else if (type == 2) {
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
			client.hgetall("TASK_" + currentMainTask.taskId, function(err, task) {
				for(var o in task) {
					taskInfo.currentMainTask[o] = task[o];
				}
			});
			client.hgetall("TASK_" + currentBranchTask.taskId, function(err, task) {
				for(var o in task) {
					taskInfo.currentBranchTask[o] = task[o];
				}
			});
			client.hgetall("TASK_" + currentDayTask.taskId, function(err, task) {
				for(var o in task) {
					taskInfo.currentDayTask[o] = task[o];
				}
			});
			client.hgetall("TASK_" + currentExerciseTask.taskId, function(err, task) {
				for(var o in task) {
					taskInfo.currentExerciseTask[o] = task[o];
				}
				callback(err, taskInfo, type);
			});
		} else {
			err = new Error(message.Illegalargument_exception);
			err.code = 100;
			callback(err);
		}
	});
};