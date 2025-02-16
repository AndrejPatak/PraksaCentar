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
			console.log("erm: ", loggedIn);
			if (loggedIn){
				localStorage.setItem("username", sessionInfo[1]);
				localStorage.setItem("email", sessionInfo[2]);
				localStorage.setItem("account_type", sessionInfo[3]);
				localStorage.setItem("phone_num", sessionInfo[4]);
				localStorage.setItem("profile_image", null);
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

var next = document.getElementById("continue-container");
var screen = document.getElementById("screen");
var back = document.getElementById("back");
var register = document.getElementById("register");

var pwd_field = document.getElementById("pwd");
var pwdRepeat_field = document.getElementById("pwdRepeat");

var notification = document.getElementById("notification");

let pageIndex = 0;
// page templates
let registerTemplate = "\
			<div id='login'>\
				<div class='label'> Ime i prezime: </div>\
				<div class='field'><input type='text' name='userName' value='' placeholder='Ime Prezime'><i class='fa-solid fa-user'></i></div>\
				<div class='label'> E-mail adresa: </div>\
				<div class='field'><input type='email' name='email' value='' placeholder='example@mail.com'><i class='fa-solid fa-envelope'></i></div>\
				<div class='label'> Broj telefona: </div>\
				<div class='field'><input type='text' name='phoneNumber' value='' placeholder='+387123456789'><i class='fa-solid fa-phone'></i></div>\
			</div>\
			<div id='button-panel'>\
				<button id='login-link'>Vec imate profil?</button>\
				<div id='continue-container' class='button'>\
					<button type='button' id='continue'>Dalje</button>\
					<div class='indicator button'><i class='fa-solid fa-arrow-right hover'></i></div>\
				</div>\
			</div>\
";
let passwdTemplate = "<div id='login' class='pwd'>\
				<div class='label'> Sifra: </div>\
				<div class='field'><input type='password' name='password' placeholder='!#$%*@' id='pwd'>\
					<button class='showHidePwd'><i class='fa-solid fa-eye-slash'></i></button>\
				</div>\
				<div class='label'> Potvrda sifre: </div>\
				<div class='field'><input type='password' name='passwordRepeat' placeholder='!#$%*@' id='pwdRepeat'>\
					<button class='showHidePwd'><i class='fa-solid fa-eye-slash'></i></button>\
				</div>\
		</div>\
		<div id='button-panel'>\
			<div id='continue-container' class='register-button'>\
				<button id='back'><i class='fa-solid fa-arrow-left'></i></button>\
				<button type='submit' id='register'>Registruj se</button>\
			</div>\
		</div>";
// end page templates

// Login vars
let username_str = "";
let email_str = "";
let phone_str = "";
let pwd_str = "";

let name_field = document.getElementsByName("userName")[0];
let email_field = document.getElementsByName("email")[0];
let phone_field = document.getElementsByName("phoneNumber")[0];

let name_entered = false;
let email_entered = false;
let phone_entered = false;

let passwd_entered = false;
let show_pwd_buttons = document.getElementsByClassName("showHidePwd");

let pwd_hidden_icon = "<i class='fa-solid fa-eye'></i>";
let pwd_shown_icon = "<i class='fa-solid fa-eye-slash'></i>";
// end Login vars

let notif_hidden = true;

loadPage(pageIndex);

function nextPage(){
	if(name_entered && email_entered && phone_entered){
		if(pageIndex < 1){
			pageIndex += 1;
		
		}else{
			pageIndex = 0;
		}
		loadPage(pageIndex);
		console.log("next page. index: ", pageIndex);
	}else{
		notify("Potrebno je da unesete sve informacije.")
	}
}

function checkUser(){
	// TODO:
	// function to validate users credentials, then send them to a server
	// should also handle a user trying to register with an acount that already exists
	if(pwd_field.value === ""){
		notify("Potrebno je unijeti sifru.");
		return false
	}else{
		if(pwd_field.value !== pwdRepeat_field.value){
			notify("Sifra se ne slaze u oba polja!");
			return false
		}else{
			// the password should contain at least one special character and at least one number
			// special characters = !@#$%^&*()_/*+-=.,?<|>
			// numbers = 1234567890
			min_length = 8;
				
			if(pwd_field.value.length < min_length){
				notify("Sifra mora da bude duza od 8 karaktera.")
				return false
			}else{
				pwd_regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&/])[A-Za-z\d@$!%*?&/]{8,}$/;

				if(pwd_regex.test(pwd_field.value)){
					pwd_str = pwd_field.value;
					return true
				}else{
					notify("Sifra mora da sadrzi bar jedno malo slovo, bar jedan broj i bar jedan specijalan karakter (npr: @$!%*?&/)");
					return false
				}
			}
		}
	}
}

function registerUser(){
	fetch("https://cdn.skenda.me/reg_usr", {
        method: "POST",
        body: JSON.stringify({username: username_str, email: email_str, password: pwd_str, phone_num: phone_str}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then((response) => response.json()).then((json) => check_registration(json));
}

async function checkLoginStatus(){
	let localToken = localStorage.getItem("lgntkn");
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

function loadPage(index){
	console.log("loadPage triggered;")
	pageIndex = index;	

	screen.style.animation = 'none';
	screen.offsetHeight;
	if(index === 0){
		screen.style.animation = "slideOutRight .1s ease-out forwards";
	}else{
		screen.style.animation = "slideOutLeft .1s ease-out forwards";
	}	
	
	setTimeout(function(){

		if(index === 0){
			screen.innerHTML = registerTemplate;
		}else{
			screen.innerHTML = passwdTemplate;
		}
		updateReferences();
		updateEventListeners();

		screen.style.animation = 'none';
		screen.offsetHeight;
		if(index === 0){
			screen.style.animation = "slideInLeft .1s ease-in forwards";
		}else{
			screen.style.animation = "slideInRight .1s ease-in forwards";
		}
	}, 210);	
}

function updateReferences(){
	next = document.getElementById("continue-container");
	back = document.getElementById("back");
	register = document.getElementById("register");

	name_field = document.getElementsByName("userName")[0];
	email_field = document.getElementsByName("email")[0];
	phone_field = document.getElementsByName("phoneNumber")[0];	

	pwd_field = document.getElementById("pwd");
	pwdRepeat_field = document.getElementById("pwdRepeat");
	show_pwd_buttons = document.getElementsByClassName("showHidePwd");

	let login_link = document.getElementById("login-link");
	if(login_link){
			login_link.addEventListener("click", function(){
			redirect("login.html");
		})
	}

}

function updateEventListeners(){
	if(pageIndex === 0){
		
		name_field.value = username_str;
		email_field.value = email_str;
		phone_field.value = phone_str;
		
		next.addEventListener('click' , nextPage);
		email_field.addEventListener('blur', function(){checkEmail(email_field.value)});
		phone_field.addEventListener('blur', function(){checkPhone(phone_field.value)});
		name_field.addEventListener('blur', function(){
			console.log("check name:", name_field.value)
			if(name_field.value !== ''){
				name_entered = true;
				username_str = name_field.value;
			}else{
				name_entered = false;
				notify("Ime i prezime je obavezno.");
			}
		})
	}else{
		back.addEventListener('click', function(){loadPage(0)});
		register.addEventListener('click', function(){
			if(checkUser()){
				registerUser();
			}else{
				console.log("Registartion failed.")
			}

		});
		show_pwd_buttons[0].addEventListener("click", togglePassword);
	}
}

/*function register_user(uName, eMail, pWd){
	fetch("https://cdn.skenda.me/reg_usr", {
		method: "POST",
		body: JSON.stringify({username: uName, email: eMail, password_hash: pWd}),
		headers: {"Content-type": "application/json; charset=UTF-8"}
	}).then((response) => response.json()).then((json) => document.getElementById("text").innerHTML += json + "<br>");
}*/

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
		show_pwd_buttons[0].innerHTML = pwd_hidden_icon;
		show_pwd_buttons[1].innerHTML = pwd_hidden_icon;
		pwdRepeat_field.type = "text";
	}else{
		pwd_field.type = "password";
		show_pwd_buttons[0].innerHTML = pwd_shown_icon;
		show_pwd_buttons[1].innerHTML = pwd_shown_icon;
		pwdRepeat_field.type = "password";	
	}
}

function saveToken(token){ // this function does nothing for now
	console.log("token", token);
}
