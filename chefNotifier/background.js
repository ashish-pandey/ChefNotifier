options = {
type : "basic" , 
title : "ChefNotifier" , 
message : "",  
iconUrl : "images/icon.png" , 
buttons : [{
	title : "ChefNotification"
}]
};

function callback(){
	console.log("Notification Done");
}

function getTimestampAndProbName(s){
	words = s.split(" ");
	hourMin = words[0].split(":");
	hour = parseInt(hourMin[0]);
	min = parseInt(hourMin[1]);
	if(words[1]=='PM') hour += 12;
	dateStr = words[2].substring(0 , 8);
	probname = words[2].substring(8 , 14);
	dateItem = dateStr.split('/');
	day = parseInt(dateItem[0]);
	month = parseInt(dateItem[1]);
	year = parseInt('20' + dateItem[2]);
	//console.log(dateStr + " " + words[0] + " " + probname + " " + hour + " " + min + " " + day + " " + month + " " + year);
	timest = new Date(year , month , day , hour , min);
	return [timest.getTime() , probname];
}


function checkNotification(username , storedTime){
	console.log('checkNotification called with username: ' + username + " and stored time of: " + storedTime);
	$.ajax({
		url : "https://www.codechef.com/recent/user?user_handle=" + username , 
		type : "GET" , 
		dataType : "text" , 
		success : function(result){
			//console.log("online");
			var tresult = JSON.parse(result);
			var mresult = tresult['content'];
			//console.log(mresult);
			$mtable = $(mresult).find('table').eq(0);
			$allRows = $($mtable).find('tr');
			var problemSet;
			for(i = 1;i<$allRows.length;i++){
				s = $($allRows[i]).text();
				timest_prob = getTimestampAndProbName(s);
				timeOfProb = timest_prob[0];
				probName = timest_prob[1];
				console.log(probName , timeOfProb);
				if(timeOfProb < storedTime) break; //already notified
				if(problemSet[probName]) continue; //more than one attempt for the probem
				problemSet[probName] = true;
			}
			if(problemSet){
				msg = problemSet.length + " new problems attempted by " + username;
				options['message'] = msg;
				chrome.notifications.create(options , callback);
				chrome.notifications.onButtonClicked.addListener(function(){
					window.open("https://www.codechef.com/users/" + username);
				});
				chrome.storage.sync.get('chefUser' , function(data){
					var tlist = data.chefUser;
					tlist[username] = new Date().getTime();
					chrome.storage.sync.set({'chefUser' : tlist});
				});
			}


			//text = getChange(result);
			/*
			s = "";
			var elements = $("<table>").html(mresult)[0].getElementsByTagName("tr")[0].getElementsByTagName("tr");
			for(i=0;i<elements.length;i++)
				s+=elements[i] + "\n";
			console.log(s);
			*/
			//notify(text);
		} , 
		error : function(){
			console.log("Some error ocurred");
		}
	});
	
}


function userCheck(){
	console.log("userCheck called");
	//checks for all the user if there is an activity
	//first get the value of the current list 
	//let the list be  = current_users
	//let the current user to add be new_user
	//current_users += new_user
	// for setting the values chrome.storage.sync.set({'chefUser' : current_users });
	chrome.storage.sync.get('chefUser' , function(data){
		console.log(allUsers);
		var allUsers = data.chefUser
		console.log(allUsers)
		if(allUsers){
			//checkNotification(allUsers)
			for(i in allUsers){
				checkNotification(i ,allUsers[i]);
			}
		}
	});
	
	//setTimeout(userCheck , 10000);
}
userCheck();
