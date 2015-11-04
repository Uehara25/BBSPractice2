var http 		= require("http"),
	qs 			= require("querystring"),
	fs 			= require("fs"),
	readline 	= require("readline"),
	usermanager = require('./usermanager.js');

var ADRESS = 'localhost'
	,PORT = '5000';

var NGWords = removeBOM(fs.readFileSync("./resources/NGWords.txt", 'utf8')).split(",");

var server = http.createServer(onRequest);

function onRequest(request, response)
{
	switch (request.url) {
	case '/':

		if(request.method == 'POST'){

			usermanager.checkClientLoggedin(request, response, function(err, ret){
				if (err) {
					console.log(err);
				}

				if (ret) {
					postData(function(){
						sendMainHTML();
					});
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

 	    	request.data = '';
            request.on('data', function(chunk){
 	           	request.data += chunk;
 	           	usermanager.login(request, response, function(err, success, id) {
					if (err) {
						console.log(err);
					}
	
					if (success) {
						response.setHeader('Set-Cookie', ['id = ' + id]);
						redirect('/');
					} else {
						redirect("/login");
					}
				});
			});

		}else{
			sendLoginHTML();
		}
		break;

	case '/register':

		if(request.method == 'POST') {

 	        request.data = '';
    	    request.on('data', function(chunk) {
                request.data += chunk;
				usermanager.register(request, response, function(err, succeed) {
					if(err) {
						console.log(err);
					}
	
					if (succeed) {
						redirect("/");
					} else {
						redirect("/register");
					}
				});
			});

		} else {

			sendRegisterHTML();

		}

		break;

	case '/logout':

		response.setHeader('Set-Cookie', ['id = logout']);
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

	function postData(callback)
	{
		console.log("ポストは実装中");
	    request.data = '';
        request.on('data', function(chunk){
           	request.data += chunk;
        });
        request.on('end',function(){
           	var query = qs.parse(request.data);
           	var id = usermanager.getIdFromCookie(request ,response)
           	usermanager.getNameFromId(id, function(err, name){
	          	var author = trimAuthor(name);
	          	var maintext = trimMaintext(query.maintext);
	          	data = author + '\n' + maintext + '\n';
	          	fs.appendFile('./resources/data.txt', data, 'utf8', function(err){
	          		if (err) {
	          			console.log(err);
	          			return callback(err);
	          		}
	          		return callback();
	          	});
           	});
        });
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

		sendMainContent(null, function(){

			var footer = fs.readFileSync("./resources/footer.txt", 'utf-8');
			response.write(footer);

			response.end();
		});

	}

	function sendMainContent(err, callback){

        postCounter = 0;
        // 読み込んだ行が名前なのか本文なのか判定するため。毎回+1して偶奇で判断
        tempCnt = 0;

		var rl = readline.createInterface({
            input: fs.createReadStream('./resources/data.txt')
        });

        rl.on('line', function(line){
            if(tempCnt % 2 == 0){
                // 名前
                response.write("<dt>" + postCounter + " 名前:<b>" + line + "</b>");
                postCounter += 1;
            }else{
                // 本文
                response.write("<dd> " + line + "<br><br>");
            }
            tempCnt += 1;
        })

        rl.on('close', function(){
            callback();
        })
	}

	function trimAuthor(author){
        author = escapeHtmlSpecialChar(author);
        author = replaceNGWords(author);
        return author
    }

    function trimMaintext(maintext){
        maintext = escapeHtmlSpecialChar(maintext);
        maintext = maintext.replace(/(\r\n|\n|\r)/g,'<br>');
        maintext = replaceNGWords(maintext);
        return maintext;
    }

    function escapeHtmlSpecialChar(text)
    {
        if(text === undefined){
            return '';
        }else{
            text = text.replace(/&/g, '&amp;');
            text = text.replace(/</g, '&lt');
            text = text.replace(/>/g, '&gt;');
            return text;
        }
    }

    function replaceNGWords(text)
    {
        for(word in NGWords){
            text = text.replace(NGWords[word], Array(NGWords[word].length + 1).join("*"));
        }
        return text;
    }

}

function removeBOM(text){
    text = text.replace(/^\uFEFF/, '');
    return text;
}

server.listen(PORT, ADRESS);

console.log("server is running now...");