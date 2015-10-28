var mysql = require('mysql');

var connection = mysql.createConnection({
	user: 'bbs',
	password: 'bbs',
	database: 'bbspractice2'
});

/*
name, pass, id
*/
// 仕様を確定する元気がないので明日頑張る。

exports.login = function(request, response)
{
	console.log("ログインは未対応。");
}

exports.logout = function(request, response)
{
	console.log("ログアウトはまだ未対応");
}

exports.isLoggedin = function(request, response)
{
	return true;
}

exports.register = function(request, response)
{
	console.log("登録は未対応。");
}
