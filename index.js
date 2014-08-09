var express = require("express");
var app = express();

// Class PrivateRoom
function PrivateRoom(password){
	this.password = password;
	this.conversations = [];
	
	this.addConversation = function(conversation){
		this.conversations.push(conversation);
	};
};

// Class Conversation
function Conversation(user, text){
	this.user = user;
	this.text = text;
};

// Rooms data
var privateRooms = [];

// Simple logger
app.use(function(request, response, next){
	console.log('%s %s', request.method, request.url);
	next();
});

// /rooms
app.route('/rooms')
.get(function(request, response){
	response.set('Access-Control-Allow-Origin', '*');
	var roomName = request.param('roomName');
	var roomPassword = request.param('roomPassword');
	if (privateRooms[roomName] && privateRooms[roomName].password == roomPassword){
		response.status(200).send(true);
	}else{
		response.status(200).send(false);
	}
})
.post(function(request, response){
	response.set('Access-Control-Allow-Origin', '*');
	var body = "";
	request.on('data', function(data){
		body = body+data;
	});
	request.on('end', function(){
		try {
			var room = JSON.parse(body);
			if (!privateRooms[room.name]){
				var privateRoom = new PrivateRoom(room.password);
				privateRooms[room.name] = privateRoom;
				response.status(201).send(true);
			}else{
				response.status(200).send(false);
			}
		} catch (e) {
			console.error("Parsing error:", e); 
		}
	});
});

// /rooms/:name/conversations
app.route('/rooms/:name/conversations')
.get(function(request, response){
	response.set('Access-Control-Allow-Origin', '*');
	var roomName = request.params.name;
	var roomPassword = request.param('roomPassword');
	if (privateRooms[roomName] && privateRooms[roomName].password === roomPassword){
		response.status(200).send(privateRooms[roomName].conversations);
	}else{
		response.status(401).end();
	}
})
.post(function(request, response){
	response.set('Access-Control-Allow-Origin', '*');
	var body = "";
	request.on('data', function(data){
		body = body+data;
	});
	request.on('end', function(){
		try {
			var roomName = request.params.name;
			var object = JSON.parse(body);
			if (privateRooms[roomName] && privateRooms[roomName].password === object.roomPassword){
				var user = object.user;
				var text = object.text;
				var conversation = new Conversation(user, text);
				privateRooms[roomName].addConversation(conversation);
				response.status(201).end();
			}else{
				response.status(401).end();
			}
		} catch (e) {
			console.error("Parsing error:", e); 
		}
	});
});

// GET /index.html
app.get('/index.html', function(request, response){
	response.status(200).sendfile('./client/index.html');
});

// GET /room.html
app.get('/room.html', function(request, response){
	response.status(200).sendfile('./client/room.html');
});

// GET /index.js
app.get('/index.js', function(request, response){
	response.status(200).sendfile('./client/index.js');
});

// GET /room.js
app.get('/room.js', function(request, response){
	response.status(200).sendfile('./client/room.js');
});

app.listen(8888, '127.0.0.1');

console.log('Server running at 127.0.0.1:8888');