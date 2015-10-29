var http = require("http")
	,qs = require("querystring")
	,fs = require("fs")
	,usermanager = require('./usermanager.js');

var ADRESS = 'localhost'
	,PORT = '5000';

var server = http.createServer(onRequest);

function onRequest(request, response)
{
	switch (request.url) {
	case '/':

		if(request.method == 'POST'){
			
			usermanager.isLoggedin(request, response, function(err, ret){
				if (err) {
					console.log(err);
				}

				if (ret) {
					postData();
					sendMainHTML();
				} else {
					sendRegisterHTML();
				}
			});

		}else{
			sendMainHTML();
		}
		break;

	case '/login':

		if(request.method == 'POST'){
			usermanager.login();
			redirect("/");
		}else{
			sendLoginHTML();
		}
		break;

	case '/register':

		if(request.method == 'POST'){

 	        	request.data = '';
    	        request.on('data', function(chunk){
                request.data += chunk;
                try{
					usermanager.register(request, response);
					redirect("/login");
				} catch(e) {
					console.log(e.message);
					if (e.message === undefined){
						redirect("/");
					}else if (e.message == "名前が入力されていません"){
						redirect("/register");
					}else if (e.message == "パスワードが設定されていません"){
						redirect("/register");
					}else if (e.message == "同じ名前のユーザーがすでに存在しています"){
						redirect("/register");
					}else if (e.message == "パスワードの強度が弱すぎます"){
						redirect("/register");
					}else{
						console.log("なんだこれ");
						redirect("/");
					}
				}
            });

		}else{

			sendRegisterHTML();

		}

		break;

	case '/logout':

		usermanager.logout();
		sendLogoutHTML();
		break;

	case '/404':
		send404HTML();
		break;

	default:
		redirect('/404');

	}

	function redirect(location)
	{
		response.writeHead(302, {'Location': location});
		response.end();
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

	function sendLogoutHTML()
	{
		fs.readFile("./resources/logout.html", 'utf-8', function(err, chunk){
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