var mysql 		= require('mysql'),
	crypto 		= require('crypto'),
	querystring = require("querystring"),
	cookie		= require("cookie");


function getId(name, callback)
{
	var connection = mysql.createConnection({
		user: 'bbs',
		password: 'bbs',
		database: 'bbspractice2'
	});

	var query = connection.query("select id from users where name=?", name, function(err, result, fields){

		connection.end();
		if (err) {
			return callback(err);
		}
		var id = "";
		id = result[0].id;
		callback(null, id);
	});
}

exports.login = function(request, response, callback)
{
	var query = querystring.parse(request.data);
	var name = query.author;
	var pass = query.password;

	console.log(name + ":" + pass + "を検証します");

	checkNameExist(name, function(err, exist){
		if (err) {
			callback(err);
		}

		if (exist) {
			console.log("名前は存在しました");
			checkPassCorrect(name, pass, function(err, correct){
				if (err) {
					callback(err);
				}

				if (correct) {
					console.log("パスワードが一致しました");

					getId(name, function(err, id){
						if (err) {
							console.log(err);
						}
						callback(err, correct, id)
					});
				} else {
					console.log("パスワードは一致しませんでした");
					callback(err);
				}
			});
		} else {
			console.log("名前" + name +"は存在しませんでした");
			callback(err);
		}
	});
}


function checkPassCorrect(name, pass, callback)
{
	var connection = mysql.createConnection({
		user: 'bbs',
		password: 'bbs',
		database: 'bbspractice2'
	});

	var query = connection.query("select pass from users where name=?", name, function(err, result, fields){

		connection.end();
		if (err) {
			return callback(err);
		}
		// todo: とりあえずそのままにしてあるfor文を取り除く。
		var ret = false;
		for (var i in result) {
			console.log(result[i]);
			if(result[i].pass == pass) {
				ret = true;
			}
		}
		callback(null, ret);
	});
}

/*
*/
exports.logout = function(request, response)
{
	console.log("ログアウトはまだ未対応");
}

/*
*/


/*
	非同期ゆえ、実装は少し特殊
	checkIdExists(name, function(e, ret){
		if (ret) {
			// true
		} else {
			// false
		}
	});

*/ 
function isIdExist(id, callback)
{
	var connection = mysql.createConnection({
		user: 'bbs',
		password: 'bbs',
		database: 'bbspractice2'
	});

	var query = connection.query("select id from users", function(err, result, fields){
		var ret = false;
		if (err) {
			return callback(err);
		}
		for (var i in result) {
			console.log(result[i].id);
			if(result[i].id == id) {
				ret = true;
			}
		}
		callback(null, ret);
		connection.end();
	});
}

/*	実装
	isLoggedin(req, res, function(err, ret){
		if(err){
			return;
		}

		if(ret){
			// true
		}else{
			// false
		}
	})
*/
exports.isLoggedin = function(request, response, callback)
{
	var cookieValues = cookie.parse(request.headers.cookie);
	var id = cookieValues.id;

	isIdExist(id, function(err, exist){
		if (err) {
			callback(err);
		} else {
			callback(null, exist);
		}
	});

}

/*
request から情報を読み取って照合。
登録可能なら登録し、登録不可能なら理由を添えて例外を返す。
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

	if(!checkPassStrong(pass)){
		err.message = "パスワードの強度が弱すぎます";
		throw err;
	}

	checkNameExist(name, function(e, ret){
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
				if(err){
					console.log("登録に失敗しました");
					throw err;
				}else{
					console.log("登録に成功しました");
				}
				connection.end();
			});
			
		}
	});


	return;
}

function isContainNotAlphabet(text)
{
	var notazAZ = /^[A-Za-z]+$/;
	return !notazAZ.test(text)
}

function checkPassStrong(pass)
{
	if(isContainNotAlphabet(pass) && pass.length >= 5){
		return true;
	}
	return false;
}

function checkNameExist(name, callback)
{
	var connection = mysql.createConnection({
		user: 'bbs',
		password: 'bbs',
		database: 'bbspractice2'
	});

	var query = connection.query("select name from users", function(err, result, fields){
	connection.end();
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
	});
}

function createHash(str)
{
	var hash = crypto.createHash('md5');
	hash.update(str);
	return hash.digest('hex');
}
