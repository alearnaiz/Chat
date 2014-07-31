function Conversation(user, text){
	this.user = user;
	this.text = text;
};

function MyObject(roomPassword, user, text){
	this.roomPassword = roomPassword;
	this.user = user;
	this.text = text;
};

$(document).ready(function(){
	app.start();
	
	// Create conversation
	$("#createR").click(function(){
		app.createConversation();
	});
});

var app = {};

app.start = function(){
	app.getConversations();
	app.reload();
};

app.newConversation = function(conversation){
	$("#resultsR").append("<li class='list-group-item'><b>"+conversation.user + "</b>: " + conversation.text + "</li>");
};

app.getConversations = function(){
	var roomName = localStorage.getItem('roomName');
	var roomPassword = localStorage.getItem('roomPassword');
	
	// Problems with IE with ajax cache:true (it just called the first time)
	$.ajax({
		dataType: "json",
		type: "GET",
		url: "/rooms/"+roomName+"/conversations",
		cache: false,
		data: {roomPassword: roomPassword},
		success: function(data){
			$("#resultsR").empty();
			$.each(data, function(i, v){
				app.newConversation(v);
			});
		}
	}).fail(function(){
		if (window.console){
			console.log("$.getJSON wrong");
		}
	});;
};

app.reload = function(){
	// The function calls getConversation each half second
	setInterval(function(){
		if (window.console){
			console.log("reload");
		}
		app.getConversations();
	}, 500);
};

app.createConversation = function(){
	var user = $("#userR").val();
	var text = $("#textR").val();
	if (user != '' && text != ''){
		var roomName = localStorage.getItem('roomName');
		var roomPassword = localStorage.getItem('roomPassword');
		var object = new MyObject(roomPassword, user, text);
		$.post("/rooms/"+roomName+"/conversations", JSON.stringify(object), function(){
			// Remove error classes if they exist
			if ($("#dUserR").hasClass("has-error")){
				$("#dUserR").removeClass("has-error");
			}
			if ($("#dTextR").hasClass("has-error")){
				$("#dTextR").removeClass("has-error");
			}
			$("#textR").val('');
			$("#textR").focus();
			var conversation = new Conversation(user, text);
			app.newConversation(conversation);
		}).fail(function(){
			if (window.console){
				console.log("$.post wrong");
			}
		});
	}
	else{
		// Check errors
		if (user == '' && text == ''){
			if (!$("#dUserR").hasClass("has-error")){
				$("#dUserR").addClass("has-error");
			}
			if (!$("#dTextR").hasClass("has-error")){
				$("#dTextR").addClass("has-error");
			}
		}
		else{
			if (user == ''){
				if (!$("#dUserR").hasClass("has-error")){
					$("#dUserR").addClass("has-error");
				}
				if ($("#dTextR").hasClass("has-error")){
					$("#dTextR").removeClass("has-error");
				}
			}
			else{
				if (!$("#dTextR").hasClass("has-error")){
					$("#dTextR").addClass("has-error");
				}
				if ($("#dUserR").hasClass("has-error")){
					$("#dUserR").removeClass("has-error");
				}
			}
		}
	}
};