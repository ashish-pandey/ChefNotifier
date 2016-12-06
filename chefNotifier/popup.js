function getStoredUsers(){
	var allUsers;
	chrome.storage.sync.get({chefUser : {}} , function(data){
		console.log("Users might be present");
		allUsers = data.chefUser;
		console.log(allUsers);
		return allUsers;
	});
}


function addUser(){
	username = $('#username').val();
	if(username =="")
		return;
	/*
	chrome.storage.sync.clear(function(){
		console.log("clearing the cache");
	});

	*/
	chrome.storage.sync.get({chefUser : {}} , function(data){
		allUsers = data.chefUser;
		console.log(allUsers);
		if(!(username in allUsers)){
			if(allUsers){
				console.log("users present");
				allUsers[username] = new Date().getTime();
			}
			else{
				console.log("Adding the first user");
				allUsers[username] = new Date().getTime();
			}
			//username = $('#username').val();
			chrome.storage.sync.set({'chefUser' : allUsers} , function(){
				printUsers();
			});
		}
	});
}


function printUsers(){
	selectedUsers = $('#users');
	chrome.storage.sync.get({chefUser : {}} , function(data){
		userlist = data.chefUser;
		if(userlist){
			s = "<table><tr><th>Username</th><th>Actions</th></tr>";
			for(i in userlist){
				s+= "<tr><td>" + "<a href='https://www.codechef.com/users/" + i + " '>" + i + "</a>" + "</td><td><button class='chefusers' usern ='" +  i + "' >Delete</button></td></tr>";
			}
			s+= "</table>";
			selectedUsers.html(s);
		}
	});

}

function removeUser(username){
	chrome.storage.sync.get('chefUser' , function(data){
		userlist = data.chefUser;
		delete userlist[username];
		chrome.storage.sync.set({'chefUser' : userlist} , function(){
			printUsers();
		});

	})
}

$(document).ready(function(){
	//to print the already selected users
	printUsers();
	//to add new users
	$('#userAdd').click(function(){
		console.log("button clicked");
		addUser();
	});
	//since .chefusers is created dynamically we have to link this first to an already present element in DOM 
	//and then check for dynamically added button in that
	$('#users').on('click' , '.chefusers' ,  function(){
		removeUser($(this).attr('usern'));
		console.log("The user " + $(this).attr('usern') +  " is going to be deleted");	
	});

});

