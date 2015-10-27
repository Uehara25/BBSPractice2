var http = require("http")
	,qs = require("querystring")
	,fs = require("fs");

var ADRESS = 'localhost'
	,PORT = '5000';

var server = http.createServer(onRequest);

function onRequest(request, response)
{
	if(request.url == '/'){
		if(request.method == 'POST'){
			
			if(isLoggedin()){
				postData();
				sendMainHTML();
			}else{
				sendRegisterHTML();
			}

		}else{
			sendMainHTML();
		}

	}else if(request.url == '/login'){

		if(request.method == 'POST'){
			login();
		}else{
			sendLoginHTML();
		}

	}else if(request.url == '/register'){

		if(request.method == 'POST'){
			register();
		}else{
			sendRegisterHTML();
		}

	}else if(request.url == '/404'){
		send404HTML();
	}else{
		redirect('/404');
	}

	function redirect(location)
	{
		response.writeHead(302, {'Location': location});
		response.end();
	}

	function login()
	{
		console.log("ログインは未対応。　何もせずメインにリダイレクトします");
		redirect("/");
	}

	function isLoggedin()
	{
		return true;
	}

	function register()
	{
		console.log("登録は未対応。　何もせずログインにリダイレクトします");
		redirect("/login");
	}

	function postData()
	{
		console.log("ポストは未作成");
	}

	function send404HTML()
	{
		fs.readFile("./resources/404.html", 'utf-8', function(err, chunk){
			response.writeHeader(200, {'Content-Type': 'text/html; charset=utf8'});
			response.write(chunk);
			response.end();
		});
	}

	function sendRegisterHTML()
	{
		fs.readFile("./resources/register.html", function(err, chunk){
			response.writeHeader(200, {'Content-Type': 'text/html; charset=utf8'});
			response.write(chunk);
			response.end();
		});
	}

	function sendLoginHTML(){
		fs.readFile("./resources/login.html", 'utf-8', function(err, chunk){
			response.writeHeader(200, {'Content-Type': 'text/html; charset=utf8'});
			response.write(chunk);
			response.end();
		});
	}

	function sendMainHTML(){
		response.writeHeader(200, {'Content-Type': 'text/html; charset=utf8'});

		var header = fs.readFileSync("./resources/header.txt", 'utf-8');
		response.write(header);

		sendMainContent();

		var footer = fs.readFileSync("./resources/footer.txt", 'utf-8');
		response.write(footer);

		response.end();
	}

	function sendMainContent(){
		response.write("<br><br><h1>本体テキスト</h1><br><br>")
	}

}

server.listen(PORT, ADRESS);

console.log("server is running now...");