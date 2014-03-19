/**
 * Copyright(c)2013,Wozlla,www.wozlla.com
 * Version: 1.0
 * Author: Peter Gao
 * Date: 2013-03-25
 * Description: 创建redis批量数据协议
 */
var fs = require("fs"),
	path = require("path"),
	connection = require("./config").mysql,
	sql = "SELECT * FROM seaking_task",
	//output = "*1\r\f$7\r\fFLUSHDB\r\f",
	output = "",
	hasOwnProperty = Object.prototype.hasOwnProperty;

connection.query(sql, function(err, rows) {
	// TODO: be able to customize
	rows.forEach(function(row) {
		var redis_key = "TASK_" + row["taskId"],
			tpl = "*4\r\f$4\r\fHSET\r\f$" + redis_key.length + "\r\f" + redis_key + "\r\f",
			hvalue;

		for (var hkey in row) {
			if (hkey == "taskId" || !hasOwnProperty.call(row, hkey)) continue;
			hvalue = row[hkey] + "";
			output += tpl + "$" + hkey.length + "\r\f" + hkey + "\r\f" + "$" + Buffer.byteLength(hvalue) + "\r\f" + hvalue + "\r\f";
		}
	});

	process.stdout.write(output);

	connection.end(function(err) {
		process.exit();
	});
});