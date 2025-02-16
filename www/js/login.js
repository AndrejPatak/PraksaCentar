document.addEventListener('deviceready', function () {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true); // Hides accessory bar if you don't need it
    cordova.plugins.Keyboard.disableScroll(true); // Disables page scroll while keyboard is open
}, false);

var localToken = localStorage.getItem("lgntkn");
var sessionInfo;

doLogin();
async function doLogin(){
	try{
		if(localToken){
			let loggedIn = await checkLoginStatus();
			console.log("Login status: ", loggedIn);
			if (loggedIn){
				localStorage.setItem("username", sessionInfo[1]);
				localStorage.setItem("email", sessionInfo[2]);
				localStorage.setItem("account_type", sessionInfo[3]);
				localStorage.setItem("phone_num", sessionInfo[4]);
				localStorage.setItem("profile_image", sessionInfo[5]);
				localStorage.setItem("school", sessionInfo[6]);
				redirect("home.html");
			}else{
				console.log("failed to log in");
			}
		}
	} catch(error){
		console.log("Erorr checking for login: ", error);
	}
}

console.log("Session info: ", sessionInfo);


var login = document.getElementById("login-button");
var pwd_field = document.getElementById("pwd");
var notification = document.getElementById("notification");

login.addEventListener("click", loginUser);

// Login vars
let email_str = "";
let pwd_str = "";

let email_field = document.getElementsByName("email")[0];

let name_entered = false;
let email_entered = false;
let phone_entered = false;

let passwd_entered = false;
let show_pwd_button = document.getElementById("showHidePwd");

let pwd_hidden_icon = "<i class='fa-solid fa-eye'></i>";
let pwd_shown_icon = "<i class='fa-solid fa-eye-slash'></i>";
// end Login vars

let notif_hidden = true;

email_field.addEventListener("blur", function(){
	checkEmail(email_field.value);
})

pwd_field.addEventListener("blur", function(){
	checkPwd(pwd_field.value);
})


function checkPwd(pwd){
	// TODO:
	// function to validate users credentials, then send them to a server
	// should also handle a user trying to register with an acount that already exists
	if(pwd === ""){
		notify("Potrebno je unijeti sifru.");
		return false
	}else{
			// the password should contain at least one special character and at least one number
			// special characters = !@#$%^&*()_/*+-=.,?<|>
			// numbers = 1234567890
			min_length = 8;
				
			if(pwd.length < min_length){
				notify("Sifra mora da bude duza od 8 karaktera.")
				return false
			}else{
				pwd_regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&/])[A-Za-z\d@$!%*?&/]{8,}$/;

				if(pwd_regex.test(pwd)){
					pwd_str = pwd;
					return true
				}else{
					notify("Sifra mora da sadrzi bar jedno malo slovo, bar jedan broj i bar jedan specijalan karakter (npr: @$!%*?&/)");
					return false
				}
			}
		}
	}

function loginUser(){

	console.log("email: ", email_str);
	console.log("password: ", pwd_str);
	fetch("https://cdn.skenda.me/login", {
        method: "POST",
        body: JSON.stringify({email: email_str, password: pwd_str}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then((response) => response.json()).then((json) => check_login(json));
}

function check_login(json){
	console.log("json: ", json)
	if(json["token"]){
		//localStorage.setItem("lgntkn", json["token"])
		localStorage.setItem("lgntkn", json["token"]);
		checkLoginStatus().then(function(){
			doLogin();	
		})

	}else{
		notify("Login je neuspjesan, provjerite unesenu sifru i mejl adresu i pokusajte ponovo", "error")
	}
}

doLogin();
async function doLogin(){
	try{
		if(localToken){
			let loggedIn = await checkLoginStatus();
			console.log("erm: ", loggedIn);
			if (loggedIn){
				localStorage.setItem("username", sessionInfo[1]);
				localStorage.setItem("email", sessionInfo[2]);
				localStorage.setItem("account_type", sessionInfo[3]);
				localStorage.setItem("phone_num", sessionInfo[4]);
				localStorage.setItem("profile_image", sessionInfo[5]);
				localStorage.setItem("school", sessionInfo[6]);
				redirect("home.html");
			}else{
				console.log("failed to log in");
			}
		}
	} catch(error){
		console.log("Erorr checking for login: ", error);
	}
}

async function checkLoginStatus(){
	localToken = localStorage.getItem("lgntkn");
	if(localToken){
		console.log("Found token: ", localToken);
		try{
			let status = false;
			await fetch("https://cdn.skenda.me/login/token", {
        		method: "POST",
        		body: JSON.stringify({token: localToken}),
        		headers: {"Content-type": "application/json; charset=UTF-8"}
    		}).then((response) => response.json()).then((json) => {
					console.log("Server gave me this: ", json);
					sessionInfo = json; 
					status = true;
						
				});
			console.log("Status after fetch: ", status);
			return status;
		} catch(error){
			console.log("Couldn't log in.", error);
			return false;
		}
	}else {
		console.log("No token found.");
		return false;
	}
}

function check_registration(login_json){
	if(login_json.token){
		localStorage.setItem("lgntkn", login_json.token);
	}
	doLogin();
}


show_pwd_button.addEventListener("click", togglePassword);


function checkEmail(email){
	const mail_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if(mail_regex.test(email)){
		email_entered = true;
		email_str = email;
		return true
	}
	notify("Unesena mail adresa nije validna.");
	return false
}

function checkPhone(number){
	const phone_regex = /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
	if(phone_regex.test(number)){
		phone_entered = true;
		phone_str = number;
		return true
	}
	notify("Uneseni broj telefona nije validan.");
	return false
}

let timeoutId;

function notify(message){
	notif_hidden = false;
	if(timeoutId){
		clearTimeout(timeoutId);
	}
	document.querySelector("#notification > #content > #message").innerHTML = message;
	notification.style.display = "none";
	notification.style.display = "flex";
	notification.style.animation = "showNotif .2s forwards linear";
	document.querySelector("#notification > #content > #close").addEventListener('click', hideNotification);
	
	timeoutId = setTimeout(function(){ // sets the lifetime of the notification to 5 seconds
		if(!notif_hidden){
hideNotification();
			notif_hidden = true;
		}
	}, 5000);
}

function hideNotification(){
	if(timeoutId){
		clearTimeout(timeoutId);
	}
	if(notification.style.display === "flex"){ // make sure the notification wasn't already closed by the user
		notification.style.animation = "hideNotif .2s forwards linear";
		setTimeout(function(){ // hides the notification after the animation finishes
			notification.style.display = "none";
		}, 200);
	}

}

function togglePassword(){
	if(pwd_field.type === "password"){
		pwd_field.type = "text";
		show_pwd_button.innerHTML = pwd_hidden_icon;
		
	}else{
		pwd_field.type = "password";
		show_pwd_button.innerHTML = pwd_shown_icon;
			
	}
}

function saveToken(token){
	console.log("token");
}
