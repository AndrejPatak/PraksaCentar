let latestCard = document.getElementById("latest-event");
let latestCardTitle = document.querySelector("#latest-event > #title");
let latestCardDescription= document.querySelector("#latest-event > #event > #info > #description");
let latestCardName= document.querySelector("#latest-event > #event > #info > #name");
let scrollContent = document.getElementById("scroll-content");

const screen = document.getElementById("screen");
const header = document.querySelector("header");

const homeButton = document.getElementById("homeButton");
const eventButton = document.getElementById("eventButton");
const userButton = document.getElementById("userButton");

homeButton.addEventListener("click", function(){loadPage("home");});
eventButton.addEventListener("click", function(){loadPage("events");});
userButton.addEventListener("click", function(){loadPage("user");});

var latestEventsArr = [];
var latestEventInfo;

let currentScreen = "home";

let homeTemplate = "<div id='latest-event'>\
			<div id='title'>\
				<div id='main'>Latest</div>\
				<div id='sub'>Your latest event</div>\
			</div>\
			<div id='event'>\
				<div id='icon'><img src='https://cdn.skenda.me/mtel-ikona.png' alt='event_logo.jpg'></div>\
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
		</div>";
let homeHeaderTemplate = "<div id=\"pic\"><img src=\"../icons/default-user.png\" alt=\"Slika\"></div>\
		<div id=\"osoba\">\
			<div id=\"ime\">Marko Markovic</div>\
			<div id=\"skola\">ETS \"Nikola Tesla\"</div>\
			<button id=\"view-profile\">View Profile</button>\
		</div>";

let eventsTemplate = "<div id='scroll-content'></div>";
let eventsHeaderTemplate = "<div id='events'><div class='title'>Dogadjaji</div><input type='search' name='search' value=''></div>"

let userTemplate = "This page is under construction.";
let userHeaderTemplate = "User page";

fetchRecentPosts().then(loadRecentPosts);
loadPage("home");

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
	of.querySelector("#title").innerHTML = data.data;
}

async function updateLatestEvent(){
	const latestCardData = await fetchAsync("https://cdn.skenda.me/latest-event");
	
	latestCardDescription.innerHTML = latestCardData.description;
	latestCardName.innerHTML = latestCardData.name;
	latestCard.querySelector("#event > #icon > img").src = latestCardData.icon;
}



async function fetchRecentPosts(){
	for(let i = 0; i < 7; i++){
			latestEventsArr[i] = await fetchAsync("https://cdn.skenda.me/latest-event");
			console.log("Stuff: ", latestEventsArr[i]);
		}
}

async function loadRecentPosts(){
	if(currentScreen === "home"){
		
		for(let i = 0; i < latestEventsArr.length; i++){
		//scrollContent.innerHTML += "<div class='scroll-element'> scroll-element </div>"
			scrollContent.innerHTML += scrollElement;
			let scrollElementData = scrollContent.querySelectorAll(".scroll-element")[i];
			let event = latestEventsArr[i];

			scrollElementData.querySelector("#image > #picture").style.backgroundImage = "url(" + event.icon + ")";
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
	}
}

try {
	fetchRecentPosts();
} catch(error) {
	console.log(error);
}
updateLatestEvent();
//TODO: Cache first 5 loaded posts for home page, in an array; //DONE


function loadPage(page){
	switch (page) {
		case "home":
			screen.innerHTML = homeTemplate;
			header.innerHTML = homeHeaderTemplate;
			currentScreen = "home";
			homeButton.classList.add("highlight");
			eventButton.classList.remove("highlight");
			userButton.classList.remove("highlight");
			updateReferences();
			loadRecentPosts();
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

}

function loadEvents(){
	// TODO: write filter code for searching
}


