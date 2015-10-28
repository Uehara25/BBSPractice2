var mysql = require('mysql')
	,crypto = require('crypto')
	,querystring = require("querystring");

var connection = mysql.createConnection({
	user: 'bbs',
	password: 'bbs',
	database: 'bbspractice2'
});

/*
name, pass, id
*/
// 仕様を確定する元気がないので明日頑張る。


/*
まず名前が存在しなければ
*/
exports.login = function(request, response)
{
	console.log("ログインは未対応。");
}

/*
exports.logind = function()
{
	connection.query ('SELECT * FROM users;', function(err, results, fields){
		console.log('---results---');
		console.log(results);
		console.log('---fields---');
		console.log(fields);
		console.log('---end---');
	});
}
*/

/*
*/
exports.logout = function(request, response)
{
	console.log("ログアウトはまだ未対応");
}

/*
*/
exports.isLoggedin = function(request, response)
{
	var cookie = request.headers.cookie;
	var id = cookie.id;
	if(id === undefined){
		return false;
	}
	return true;
}

/*
request から情報を読み取って照合。
登録可能なら登録し、登録不可能なら理由の文字列で例外を返す。
*/
exports.register = function(request, response)
{
	var query = querystring.parse(request.data);

	var name = query.author;
	var pass = query.password;

	console.log(query);

	var err = new Error();
	if(name === ""){
		err.message = "名前が入力されていません";
		throw err;
	}

	if(pass === ""){
		err.message = "パスワードが設定されていません";
		throw err;
	}

/*
	if(checkNameExists(name)) {
		err.message = "同じ名前のユーザーがすでに存在します";
		throw err;
	}
*/

	if(!checkPassStrong(pass)){
		err.message = "パスワードの強度が弱すぎます";
		throw err;
	}

	checkNameExists(name, function(e, ret){
		console.log(ret);
		if(!ret){
			var id = createHash(name + pass);
		
			var values = {
				name: name,
				pass: pass,
				id: id
			};
			var connection = mysql.createConnection({
				user: 'bbs',
				password: 'bbs',
				database: 'bbspractice2'
			});
			connection.query('INSERT INTO users SET ?', values, function(err, result){
				connection.end();
				if(err){
					console.log("登録に失敗しました");
					throw err;
				}else{
					console.log("登録に成功しました");
				}
			});
			
		}
	});


	return;
}

function isContainNumber(text)
{
	// 特殊文字なんかも数字と判定されてしまう。今はこれで、そのうち修正すること
	var notazAZ = /^[A-Za-z]+$/;
	return !notazAZ.test(text)
}

function checkPassStrong(pass)
{
	if(isContainNumber(pass) && pass.length >= 5){
		return true;
	}
	return false;
}

function checkNameExists(name, callback)
{
	var connection = mysql.createConnection({
		user: 'bbs',
		password: 'bbs',
		database: 'bbspractice2'
	});

	var query = connection.query("select name from users", function(err, result, fields){
		var ret = false;
		if (err) {
			return callback(err);
		}
		for (var i in result) {
			console.log(result[i].name);
			if(result[i].name == name) {
				ret = true;
			}
		}
		callback(null, ret);
		connection.end();
	});
}

function createHash(str)
{
	var hash = crypto.createHash('md5');
	hash.update(str);
	return hash.digest('hex');
}
