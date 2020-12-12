var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'test',
	password : 'test',
	database : 'goweb1',
	dateStrings:'date'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//for loading static files
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));

//actual service pages
/*
SELECT COUNT(*) FROM 테이블;
DESC 테이블;
SELECT * FROM 테이블 WHERE 조건식;
ALTER TABLE 테이블 MODIFY COLUMN 컬럼 자료형 NOT NULL;
select * from 'table_name' where '날짜 컬럼' between date('start_date') and date('end_date')+1;
ALTER TABLE table_name ADD COLUMN ex_column varchar(32) NOT NULL;
*/
app.get('/main', restrict, function(request, response) {
	//response.sendFile(path.join(__dirname + '/service/main.html'));
	/*connection.query('SELECT * FROM post', function (error, results) {
		response.send(ejs.render(data, {
			data: results
		}));
	});*/
	let session = request.session;
	fs.readFile(__dirname + '/service/main.html', 'utf8', function (error, data) {
        connection.query('SELECT * FROM post WHERE author = ?', [request.session.loggedid], function (error, posts) {
            connection.query('SELECT * FROM events WHERE user_id = ?', [request.session.loggedid], function (error, events) {
				response.send(ejs.render(data, {
					post: posts,
					schedule: events,
					session: session
				}));
			});
        });
    });
});

app.post('/main', function (request, response) {
	var body = request.body;
	console.log(body.action)

	if(body.action == '#post' && body.title && body.content) {
		connection.query('INSERT INTO post (title, content, author, init_date, up_date) VALUES (?, ?, ?, NOW(), NOW())', [
			body.title, body.content, request.session.loggedid
		], function () {
			response.redirect('/main');
		});
	} else if (body.action == '#edit' && body.title && body.content) {
		//console.log(body.title + " + " + body.content + " + " + body.postnum + " Editing");
		connection.query('UPDATE post SET title=?, content=?, up_date=NOW() WHERE id=?', [
			body.title, body.content, body.postnum
		], function () {
			response.redirect('/main');
		});
	} else if (body.action == '#new_event' && body.title && body.start && body.end) {
		connection.query('INSERT INTO events (title, start_date, end_date, user_id) VALUES (?, ?, ?, ?)', [
			body.title, body.start, body.end, request.session.loggedid
		], function () {
			response.redirect('/main');
		});
	} else {
		response.redirect('/main');
	}
});

app.get('/main/calendar', function(request, response) {
	response.sendFile(path.join(__dirname + '/service/calendar.html'));
});

// /insertEvents?title=(title)&start=(date)&end=(date)
app.get('/insertEvents', function (request, response) {
	var title = request.query.title;
	var sDate = request.query.start;
	var eDate = request.query.end;
	connection.query('INSERT INTO events (title, start_date, end_date, user_id) VALUES (?, ?, ?, ?)', [
		title, sDate, eDate, request.session.loggedid
	], function () {
        response.redirect('/main');
    });
});
app.get('/deleteEvents/:id', function (request, response) { 
    connection.query('DELETE FROM events WHERE id=?', [request.param('id')], function () {
        response.redirect('/main');
    });
});

app.get('/delete/:id', function (request, response) { 
    connection.query('DELETE FROM post WHERE id=?', [request.param('id')], function () {
        response.redirect('/main');
    });
});


//----------------------------------------------------------------------------------------


function restrict(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.sendFile(path.join(__dirname + '/my/login.html'));
  }
}

app.use('/', function(request, response, next) {
	if ( request.session.loggedin == true || request.url == "/login" || request.url == "/register" ) {
    next();
	}
	else {
    response.sendFile(path.join(__dirname + '/my/login.html'));
	}
});

app.get('/', function(request, response) {
	response.redirect('/main');
});

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/my/login.html'));
});

app.post('/login', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.loggedid = results[0].id;
				response.redirect('/main');
				response.end();
			} else {
				//response.send('Incorrect Username and/or Password!');
				response.sendFile(path.join(__dirname + '/my/loginerror.html'));
			}			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/my/register.html'));
});

app.post('/register', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var password2 = request.body.password2;
	var email = request.body.email;

	if (username && password && email) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ? AND email = ?', [username, password, email], function(error, results, fields) {
			if (error) throw error;
			if (results.length <= 0) {
        connection.query('INSERT INTO user (username, password, email) VALUES(?,?,?)', [username, password, email],
            function (error, data) {
                if (error)
                  console.log(error);
                else
                  console.log(data);
        });
			  response.send(username + ' Registered Successfully!<br><a href="/home">Home</a>');
			} else {
				response.send(username + ' Already exists!<br><a href="/home">Home</a>');
			}			
			response.end();
		});
	} else {
		response.send('Please enter User Information!');
		response.end();
	}
});

app.get('/logout', function(request, response) {
	request.session.loggedin = false;
	response.send('<center><H1>Logged Out.</H1><H1><a href="/">Goto Home</a></H1></center>');
	response.end();
});

app.listen(3000, function () {
    console.log('Server Running at http://127.0.0.1:3000');
});