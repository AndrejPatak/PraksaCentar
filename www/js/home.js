let latestCard = document.getElementById("latest-event");
let latestCardTitle = document.querySelector("#latest-event > #title");
let latestCardDescription= document.querySelector("#latest-event > #event > #info > #description");
let latestCardName= document.querySelector("#latest-event > #event > #info > #name");
let scrollContent = document.getElementById("scroll-content");

let localServerAddress = "http://127.0.0.1:5050";
let remoteServerAddress = "https://cdn.skenda.me"
let devMode = false;
let errorIcon = "<div class='errorIcon'><svg width='326' height='291' viewBox='0 0 326 291' fill='none' xmlns='http://www.w3.org/2000/svg'>\
<path fill-rule='evenodd' clip-rule='evenodd' d='M132.689 17.4999C146.161 -5.83343 179.839 -5.83336 193.311 17.5L320.617 238C334.088 261.333 317.249 290.5 290.306 290.5H35.6942C8.75122 290.5 -8.08808 261.333 5.38343 238L132.689 17.4999ZM142.379 75.3698C142.171 66.9433 148.945 60 157.375 60H167.626C176.055 60 182.829 66.9433 182.621 75.3698L180.081 178.37C179.88 186.508 173.226 193 165.085 193H159.915C151.774 193 145.12 186.508 144.919 178.37L142.379 75.3698ZM163 258C174.598 258 184 248.15 184 236C184 223.85 174.598 214 163 214C151.402 214 142 223.85 142 236C142 248.15 151.402 258 163 258Z' fill='white'/>\
</svg></div>";

let currentServerAddress = remoteServerAddress;

const screen = document.getElementById("screen");
const header = document.querySelector("header");

const homeButton = document.getElementById("homeButton");
const eventButton = document.getElementById("eventButton");
const userButton = document.getElementById("userButton");

homeButton.addEventListener("click", function(){loadPage("home");});
eventButton.addEventListener("click", function(){loadPage("events");});
userButton.addEventListener("click", function(){loadPage("user");});

var loader = document.getElementById("loading");

var latestEventsArr = [];
var latestEventInfo;

let eventDescriptionLimit = 54;

let currentScreen = "home";

let refreshSvg = "<div class='eventLoadingIcon'><svg width='100px' height='100px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>\
<path d='m17.6569,6.34315c-3.1242,-3.1242 -8.18956,-3.1242 -11.31375,0c-3.1242,3.12419 -3.1242,8.18955 0,11.31375c3.12419,3.1241 8.18955,3.1241 11.31375,0c0.7838,-0.7839 1.371,-1.69 1.7615,-2.6569' stroke='#000000' stroke-width='2' stroke-linecap='straight' stroke-linejoin='round'/>\
</svg></div>";

let homeTemplate = "<div id='latest-event'>\
			<div id='title'>\
				<div id='main'>Latest:</div>\
				<div id='sub'>Your latest event</div>\
			</div>\
			<div id='event'>\
				<div id='icon'>" + refreshSvg + "<img src='https://cdn.skenda.me/images/mtel-ikona.png'></div>\
				<div id='info'>\
					<div id='name'>\
						M:tel app\
					</div>	\
					<div id='description'>\
						Mtel app takmicenje je godisnji dogadjaj...\
					</div>\
				</div>\
			</div>\
		</div>\
		<div id='recently-posted'>\
			<div id='main'>\
				Recently posted:		\
			</div>\
			<div id='sub'>\
			</div>\
		</div>\
		<div id='scroll-content'>\
			<div id='loading'>\
				<div id='spinner'>\
			</div>\
		</div>";
let homeHeaderTemplate = "<div id=\"pic\"><img src=\"../icons/default-user.png\" alt=\"Slika\"></div>\
		<div id=\"osoba\">\
			<div id=\"ime\">Marko Markovic</div>\
			<div id=\"skola\">ETS \"Nikola Tesla\"</div>\
			<button id=\"view-profile\">View Profile</button>\
		</div>";

let eventsTemplate = "<div id='scroll-content'><div id='loading'><i class='fa-solid fa-spinner'></i></div></div>";
let eventsHeaderTemplate = "<div id='events'><div class='title'>Dogadjaji</div><input type='search' name='search' value='' id='search' placeholder='Pretrazi dogadjaje'></div>"

let userTemplate = "This page is under construction. <br> <div id='devToggle'><input type='checkbox' id='devModeToggle'> Debug Mode </div>";
let userHeaderTemplate = "User page";

try {
	loadPage("home");
	//fetchRecentPosts().then(loadRecentPosts);
	}catch (error){
	console.log("Failed loading home page: ", error);
}


const scrollElement = "\
	<div class='scroll-element'>\
		<div id='image'><div id='picture'></div></div>\
		<div id='chin'>\
			<div id='info'>\
				<div id='name' class='title'>M:tel app</div>\
				<div id='deadline' class='subtitle'>29.01.2025.</div>\
			</div>\
			<div id='type'></div>\
		</div>\
	</div>"
; 


async function fetchAsync (url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

async function setDataAsString (of, url){
	const data = await fetchAsync(url);
	of.innerHTML = data.data;
}

async function updateLatestEvent(){
	try{
		const latestEventData = await fetchAsync(currentServerAddress + "/latest-event");
		
		let shortenedDescription = latestEventData.description.substring(0, eventDescriptionLimit);

		latestCardDescription.innerHTML = shortenedDescription + "...";
		latestCardName.innerHTML = latestEventData.name;
		latestCard.querySelector("#event > #icon > img").src = latestEventData.icon;

	}catch (error){
		console.log(error);

		latestCardDescription.innerHTML = "Greska pri komunikaciji sa serverom.";
		latestCardName.innerHTML = "Greska:";
		latestCard.querySelector("#event > #icon > img").src = errorIcon;
	}
		
}



async function fetchRecentPosts(){
	if(loader && latestEventsArr.length === 0){
		showLoadingSpinner();
	}
	console.log("fetch recents called");
	for(let i = 0; i < 7; i++){
			try{
				latestEventsArr[i] = await fetchAsync(currentServerAddress + "/latest-event");
				//console.log(currentServerAddress + "/latest-event");
				//console.log("Stuff: ", latestEventsArr[i]);
			}catch (error){
				console.log(error);
				latestEventsArr[i] = {"name":"Network error", "description":"Pojavio so problem pri komunakiciji sa serverom. Provjerite svoju knekciju i pokusajte ponovo.", "event":"", "icon":errorIcon};
				break;
			}
		}
}

async function loadRecentPosts(){
	console.log("load recents called");
	if(currentScreen === "home"){
		scrollContent.innerHTML = "<div id='loading'><div id='spinner'></div></div>";	
		for(let i = 0; i < latestEventsArr.length; i++){
		//scrollContent.innerHTML += "<div class='scroll-element'> scroll-element </div>"
			scrollContent.innerHTML += scrollElement;
			let scrollElementData = scrollContent.querySelectorAll(".scroll-element")[i];
			let event = latestEventsArr[i];
			
			if(latestEventsArr[i].icon.includes("https://")){
				scrollElementData.querySelector("#image > #picture").style.backgroundImage = "url(" + event.icon + ")";
			}else{
				scrollElementData.querySelector("#image > #picture").innerHTML = errorIcon;
				
			}

			
			scrollElementData.querySelector("#chin > #info > #name").innerHTML = latestEventsArr[i].name;
			switch (event.event){
				case "competition":
						scrollElementData.querySelector("#chin > #type").innerHTML = "<i class='fa-solid fa-award'>";
				break;	
				case "internship":
					scrollElementData.querySelector("#chin > #type").innerHTML = "<i class='fa-solid fa-book'>";
				break;
			} 
		//scrollContent.querySelector(".scroll-element:nth-child(" + (i + 0) + ")").innerHTML += " " + i;
		}
	
		if(loader){
			hideLoadingSpinner();
		}
	}
}



async function loadPage(page){
	switch (page) {
		case "home":
			console.log("loading home")

			screen.innerHTML = homeTemplate;
			header.innerHTML = homeHeaderTemplate;
			currentScreen = "home";
			homeButton.classList.add("highlight");
			eventButton.classList.remove("highlight");
			userButton.classList.remove("highlight");
			updateReferences();
			updateLatestEvent();
			await loadRecentPosts();
			try{
				await fetchRecentPosts().then(loadRecentPosts);
			}finally{
				hideLoadingSpinner();
			}
			break;		
//---------------
		case "events":
			screen.innerHTML = eventsTemplate;
			header.innerHTML = eventsHeaderTemplate;
			currentScreen = "events";
	
			homeButton.classList.remove("highlight");
			eventButton.classList.add("highlight");
			userButton.classList.remove("highlight");

			updateReferences();
		break;
//---------------
		case "user":
			header.innerHTML = userHeaderTemplate;
			screen.innerHTML = userTemplate;
			currentScreen = "user";

			homeButton.classList.remove("highlight");
			eventButton.classList.remove("highlight");
			userButton.classList.add("highlight");
			
			let checkbox = document.getElementById("devModeToggle");
			checkbox.checked = devMode;
			checkbox.addEventListener("change", toggleDevMode);

			updateReferences();
		break;
//---------------
		default:
		
		break;
	}
}

function updateReferences(){
	latestCard = document.getElementById("latest-event");
	latestCardTitle = document.querySelector("#latest-event > #title");
	latestCardDescription= document.querySelector("#latest-event > #event > #info > #description");
	latestCardName= document.querySelector("#latest-event > #event > #info > #name");
	scrollContent = document.getElementById("scroll-content");
	loader = document.getElementById("loading");

}

function loadEvents(){
	// TODO: write filter code for searching
}

function toggleDevMode(){
	if(devMode){
		devMode = false;
		currentServerAddress = remoteServerAddress;
		console.log("Dev mode: ", devMode);
	}else{
		devMode = true;
		currentServerAddress = localServerAddress;
		console.log("Dev mode: ", devMode);
	}
	fetchRecentPosts();
}

function hideLoadingSpinner(){
	
	console.log("hidden the spidden");
	document.getElementById("loading").style.display = "none";
	loader.style.backgroundColor = "red";
	console.log(loader);
	
}
function showLoadingSpinner(){
	console.log("showdden the spidden");
	document.getElementById("loading").style.display = "flex";
}
