document.addEventListener('deviceready', function () {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true); // Hides accessory bar if you don't need it
    cordova.plugins.Keyboard.disableScroll(true); // Disables page scroll while keyboard is open
}, false);


var next = document.getElementById("continue");
var screen = document.getElementById("screen");
var back = document.getElementById("back");
var register = document.getElementById("register");

var pwdField = document.getElementById("pwd");
var pwdRepeatField = document.getElementById("pwdRepeat");
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
				<div id='continue-container'>\
					<button type='button' id='continue'>Dalje</button>\
					<div class='indicator'><i class='fa-solid fa-arrow-right'></i></div>\
				</div>\
			</div>\
";
let passwdTemplate = "<div id='login' class='passwd'>\
				<div class='label'> Sifra: </div>\
				<div class='field'><input type='password' name='password' placeholder='!#$%*@' id='pwd'>\
					<button class='showHidePasswd'><i class='fa-solid fa-eye-slash'></i></button>\
				</div>\
				<div class='label'> Potvrda sifre: </div>\
				<div class='field'><input type='password' name='passwordRepeat' placeholder='!#$%*@' id='pwdRepeat'>\
					<button class='showHidePasswd'><i class='fa-solid fa-eye-slash'></i></button>\
				</div>\
		</div>\
		<div id='button-panel'>\
			<div id='continue-container' class='register-button'>\
				<button id='back'><i class='fa-solid fa-arrow-left'></i></button>\
				<button type='button' id='register'>Registruj se</button>\
			</div>\
		</div>";
// end page templates

// Login vars
let username_str = "";
let email_str = "";
let phone_str = "";

let name_field = document.getElementsByName("userName")[0];
let email_field = document.getElementsByName("email")[0];
let phone_field = document.getElementsByName("phoneNumber")[0];


let name_entered = false;
let email_entered = false;
let phone_entered = false;


let passwd_entered = false;
let passwd_hash = "";
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
		notfiy("Potrebno je da unesete sve informacije.")
	}
}

function submitUser(){
	// TODO:
	// function to validate users credentials, then send them to a server
	// should also handle a user trying to register with an acount that already exists
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
	next = document.getElementById("continue");
	back = document.getElementById("back");
	register = document.getElementById("register");

	name_field = document.getElementsByName("userName")[0];
	email_field = document.getElementsByName("email")[0];
	phone_field = document.getElementsByName("phoneNumber")[0];

	
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
				notfiy("Ime i prezime je obavezno.");
			}
		})
	}else{
		back.addEventListener('click', function(){loadPage(0)});
		register.addEventListener('click', function(){check_userInfo();});
	}
}


function register_user(uName, eMail, pWd){
	fetch("https://cdn.skenda.me/reg_usr", {
		method: "POST",
		body: JSON.stringify({username: uName, email: eMail, password_hash: pWd}),
		headers: {"Content-type": "application/json; charset=UTF-8"}
	}).then((response) => response.json()).then((json) => document.getElementById("text").innerHTML += json + "<br>");
}

function checkEmail(email){
	const mail_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if(mail_regex.test(email)){
		email_entered = true;
		email_str = email;
		return true
	}
	notfiy("Unesena mail adresa nije validna.");
	return false
}

function checkPhone(number){
	const phone_regex = /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
	if(phone_regex.test(number)){
		phone_entered = true;
		phone_str = number;
		return true
	}
	notfiy("Uneseni broj telefona nije validan.");
	return false
}

let timeoutId;

function notfiy(message){
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

		

}
