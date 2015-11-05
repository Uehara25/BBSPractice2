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
		return callback(null, id);
	});
}

exports.login = function(request, response, callback)
{
	var query = querystring.parse(request.data);
	var name = query.author;
	var pass = query.password;

	checkNameExist(name, function(err, exist){
		if (err) {
			return callback(err);
		}

		if (exist) {
			checkPassCorrect(name, pass, function(err, correct){
				if (err) {
					return callback(err);
				}

				if (correct) {

					getId(name, function(err, id){
						if (err) {
							console.log(err);
						}
						return callback(err, correct, id)
					});
				} else {
					return callback(err);
				}
			});
		} else {
			return callback(err);
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
		if(result[0].pass == pass) {
			ret = true;
		}
		return callback(null, ret);
	});
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
function checkIdExist(id, callback)
{
	var connection = mysql.createConnection({
		user: 'bbs',
		password: 'bbs',
		database: 'bbspractice2'
	});

	var query = connection.query("select * from users where id=?", id, function(err, result, fields){
		connection.end();
		if (err) {
			return callback(err);
		}

		var ret = false;
		if (result[0] !== undefined) {
			ret = true;
		}

		return callback(null, ret);
	});
}

/*	実装
	checkClientLoggedin(req, res, function(err, ret){
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
exports.checkClientLoggedin = function(request, response, callback)
{
	if (request.headers.cookie === undefined) {
		return callback(null, false);
	}

	var cookieValues = cookie.parse(request.headers.cookie);
	var id = cookieValues.id;

	checkIdExist(id, function(err, exist){
		if (err) {
			return callback(err);
		} else {
			return callback(null, exist);
		}
	});

}

exports.getIdFromCookie = function(request, response)
{
	if (request.headers.cookie === undefined) {
		return null;
	}

	var cookieValues = cookie.parse(request.headers.cookie);
	return cookieValues.id;
}

exports.getNameFromId = function(id, callback)
{

	var connection = mysql.createConnection({
		user: 'bbs',
		password: 'bbs',
		database: 'bbspractice2'
	});

	var query = connection.query("select name from users where id=?", id, function(err, result, fields){
		var ret = false;
		if (err) {
			return callback(err);
		}
		if(result[0] === undefined) {
			return callback(new Error());
		}
		return callback(null, result[0].name);
	});

}

/*
request から情報を読み取って照合。
登録可能なら登録し、登録不可能なら理由を添えて例外を返す。
*/
exports.register = function(request, response, callback)
{
	var query = querystring.parse(request.data);

	var name = query.author;
	var pass = query.password;


	checkNameExist(name, function(err, ret){
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

			if(!checkPassStrong(pass)) {
				return callback(null, false);
			}

			connection.query('INSERT INTO users SET ?', values, function(err, result){
				connection.end();
				if(err){
					return callback(null, false);
				}else{
					return callback(null, true);
				}
			});	
		} else {
			return callback(null, false);
		}
	});


	return;
}

function checkContainNotAlphabet(text)
{
	var notazAZ = /^[A-Za-z]+$/;
	return !notazAZ.test(text)
}

function checkPassStrong(pass)
{
	if(checkContainNotAlphabet(pass) && pass.length >= 5){
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

	var query = connection.query("select id from users where name=?", name, function(err, result, fields){
	connection.end();
		var ret = false;
		if (err) {
			return callback(err);
		}
		if(result[0] !== undefined) {
			ret = true;
		}
		return callback(null, ret);
	});
}

function createHash(str)
{
	var hash = crypto.createHash('md5');
	hash.update(str);
	return hash.digest('hex');
}
