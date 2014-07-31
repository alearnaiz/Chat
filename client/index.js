function Room(name, password){
	this.name = name;
	this.password = password;
};

$(document).ready(function(){
	// Go to a room
	$("#goI").click(function(){
		var roomName = $("#nameI").val();
		var roomPassword = $("#passwordI").val();
		if (roomName != '' && roomPassword != ''){
			$.get("/rooms", {roomName: roomName, roomPassword: roomPassword}, function(data){
				if (data){
					localStorage.setItem("roomName", roomName);
					localStorage.setItem("roomPassword", roomPassword);
					location.href = "/room.html";
				}
				else{
					// Name and password don't match
					if (!$("#dNameI").hasClass("has-error")){
						$("#dNameI").addClass("has-error");
					}
					if (!$("#dPasswordI").hasClass("has-error")){
						$("#dPasswordI").addClass("has-error");
					}
				}
			}).fail(function(){
				if (window.console){
					console.log("$.get wrong");
				}
			});
		}
		else{
			// Check errors
			if (roomName == '' && roomPassword == ''){
				if (!$("#dNameI").hasClass("has-error")){
					$("#dNameI").addClass("has-error");
				}
				if (!$("#dPasswordI").hasClass("has-error")){
					$("#dPasswordI").addClass("has-error");
				}
			}
			else{
				if (roomName == ''){
					if (!$("#dNameI").hasClass("has-error")){
						$("#dNameI").addClass("has-error");
					}
					if ($("#dPasswordI").hasClass("has-error")){
						$("#dPasswordI").removeClass("has-error");
					}
				}
				else{
					if (!$("#dPasswordI").hasClass("has-error")){
						$("#dPasswordI").addClass("has-error");
					}
					if ($("#dNameI").hasClass("has-error")){
						$("#dNameI").removeClass("has-error");
					}
				}
			}
		}
	});
	
	// Create room
	$("#createI").click(function(){
		var roomName = $("#cNameI").val();
		var roomPassword = $("#cPasswordI").val();
		if (roomName != '' && roomPassword != ''){
			var room = new Room(roomName, roomPassword);
			$.post("/rooms", JSON.stringify(room), function(data){
				if (data){
					localStorage.setItem("roomName", roomName);
					localStorage.setItem("roomPassword", roomPassword);
					location.href = "/room.html";
				}
				else{
					// Name not available
					if (!$("#dcNameI").hasClass("has-error")){
						$("#dcNameI").addClass("has-error");
					}
					if ($("#dcPasswordI").hasClass("has-error")){
						$("#dcPasswordI").removeClass("has-error");
					}
				}
			}).fail(function(){
				if (window.console){
					console.log("$.post wrong");
				}
			});
		}
		else{
			// Check errors
			if (roomName == '' && roomPassword == ''){
				if (!$("#dcNameI").hasClass("has-error")){
					$("#dcNameI").addClass("has-error");
				}
				if (!$("#dcPasswordI").hasClass("has-error")){
					$("#dcPasswordI").addClass("has-error");
				}
			}
			else{
				if (roomName == ''){
					if (!$("#dcNameI").hasClass("has-error")){
						$("#dcNameI").addClass("has-error");
					}
					if ($("#dcPasswordI").hasClass("has-error")){
						$("#dcPasswordI").removeClass("has-error");
					}
				}
				else{
					if (!$("#dcPasswordI").hasClass("has-error")){
						$("#dcPasswordI").addClass("has-error");
					}
					if ($("#dcNameI").hasClass("has-error")){
						$("#dcNameI").removeClass("has-error");
					}
				}
			}
		}
	});
});