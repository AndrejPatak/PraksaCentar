let username_str = localStorage.getItem("username");
let profile_image = localStorage.getItem("profile_image");
let school_str = localStorage.getItem("school");
let email_str = localStorage.getItem("email");
let phone_str = localStorage.getItem("phone_num");
let type = localStorage.getItem("account_type");
let last_loaded_post;

let editingPost = -1;

let month_table = {"Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"};

let posts;

let homeTemplate;

get_user_template();

if(type !== "user"){
	document.getElementById("eventButton").innerHTML = "<i class='fa-solid fa-plus'></i>";
}

function get_user_template(){
	if(type === "user"){
		set_template("../templates/home_template.html", (html) => {
			homeTemplate = html;
		}).then(function(){
			try {
				loadPage("home");
			//fetchRecentPosts().then(loadRecentPosts);
			}catch (error){
				console.log("Failed loading home page: ", error);
			}	
		});
	}else{
		set_template("../templates/company_home.html", (html) => {
			homeTemplate = html;
		}).then(function(){
			try {
				loadPage("home");
			//fetchRecentPosts().then(loadRecentPosts);
			}catch (error){
				console.log("Failed loading home page: ", error);
			}
		})
	}
}


async function set_template(which, setter){
	await fetch(which).then((response) => response.text()).then((html) => setter(html));
}

let searchTemplate;
if(type === "user"){
	set_template("../templates/search_template.html", (html) => {
		searchTemplate = html;
	})
}else{
	set_template("../templates/new_post.html", (html) => {
		searchTemplate = html;
	})
}

let userTemplate;
set_template("../templates/settings_template.html", (html) => {
	userTemplate = html;
});

let scrollElement;
if(type === "user"){
	set_template("../templates/scroll-element.html", (html) => {
		scrollElement = html;
	});
}else{
	set_template("../templates/editable_post.html", (html) => {
		scrollElement = html;
	});
	
}

let latestCard = document.getElementById("latest-event");
let latestCardTitle = document.querySelector("#latest-event > #title");
let latestCardDescription= document.querySelector("#latest-event > #event > #info > #description");
let latestCardName= document.querySelector("#latest-event > #event > #info > #name");
let scrollContent = document.getElementById("scroll-content");

let themeToggle = document.getElementById("theme-toggle");
let themeButton = document.getElementById("theme-button");
let theme;
let storedTheme = localStorage.getItem(theme);

let areSettingsOpen = true;

if(storedTheme){
	theme = storedTheme;
}else{
	theme = "dark";
	localStorage.setItem("theme", theme);
}

let remoteServerAddress = "https://cdn.skenda.me"
let errorIcon = "<div class='errorIcon'><svg width='326' height='291' viewBox='0 0 326 291' fill='none' xmlns='http://www.w3.org/2000/svg'>\
<path fill-rule='evenodd' clip-rule='evenodd' d='M132.689 17.4999C146.161 -5.83343 179.839 -5.83336 193.311 17.5L320.617 238C334.088 261.333 317.249 290.5 290.306 290.5H35.6942C8.75122 290.5 -8.08808 261.333 5.38343 238L132.689 17.4999ZM142.379 75.3698C142.171 66.9433 148.945 60 157.375 60H167.626C176.055 60 182.829 66.9433 182.621 75.3698L180.081 178.37C179.88 186.508 173.226 193 165.085 193H159.915C151.774 193 145.12 186.508 144.919 178.37L142.379 75.3698ZM163 258C174.598 258 184 248.15 184 236C184 223.85 174.598 214 163 214C151.402 214 142 223.85 142 236C142 248.15 151.402 258 163 258Z' fill='white'/>\
</svg></div>";

let currentServerAddress = remoteServerAddress;

const screen = document.getElementById("screen");
const header = document.querySelector("header");

let school_label = document.getElementById("school");

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

let homeHeaderTemplate = "<div id=\"pic\"></div>\
		<div id=\"osoba\">\
			<div id=\"ime\">Marko Markovic</div>\
			<div id=\"skola\">ETS \"Nikola Tesla\"</div>\
		</div>";

let eventsHeaderTemplate = "<div id='search-title' class='title'>Pretraga</div>"

if(type !== "user"){
	eventsHeaderTemplate = "<div id='search-title' class='title'>Nova objava</div>"
}

let userHeaderTemplate = "<div id='info_display'>\
	<div id='profile_image'><img src='' id='image'>\
		<div id='upload_new' class='button'>\
			<i class='fa-solid fa-camera'></i>\
		</div>\
	</div><div id='info_strings'>\
	<div id='username'><input type='text' id='username-edit'>\
	</div>\
	<div id='school'><input type='text' id='school-edit'>\
	</div></div>\
</div>";

let homeMainCacheTemplate;
let homeHeaderCacheTemplate;
let eventsMainCacheTemplate;
let eventsHeaderCacheTemplate;
let userMainCacheTemplate;
let userHeaderCacheTemplate;

try {
	loadUserInfo(localStorage.getItem("lgntkn"));
} catch (error){
	console.log("Failed to load user info:", error)
}

function loadUserInfo(tkn){
	let user_info;
	try{
	//	user_info = fetchAsync("https://cdn.skenda.me/get_user_by_token/" + tkn); //TODO: Handle this in the server to return the appropriate users info.
	} catch (error){
		console.log(error, "You probably didnt implement the server endpoint to get user info with a GET request.")
	} finally {
		console.log("Got user info: ", user_info);
	}
}

async function fetchAsync (url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

async function postAsync (what, endpoint, type) {
	let response;
	if(type === "file"){
		response = await fetch("https://cdn.skenda.me/" + endpoint, {
        	method: "POST",
        	body: what,
		})
	}else if(type === "new-post"){
		response = await fetch("https://cdn.skenda.me/" + endpoint, {
			method: "POST",
			body: what,	
		})	
	}else{
		response = await fetch("https://cdn.skenda.me/" + endpoint, {
        	method: "POST",
        	headers: {
    			'Content-Type': 'application/json'
    		},
			body: JSON.stringify(what),
			})
	}

	if(response.ok){
		const result = await response.json();
		console.log("Sent POST reuqest! ", result);
		return result;
	}else{
		console.log("Faield to upload profile image", response.status, await response.text());
	}
}

async function setDataAsString (of, url){
	const data = await fetchAsync(url);
	of.innerHTML = data.data;
}

async function updateLatestEvent(){
	if(type === "user"){
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
		
}

async function fetchRecentPosts(){
	if(loader && latestEventsArr){
		showLoadingSpinner();
	}
	//console.log("fetch recents called");
	for(let i = 0; i < 7; i++){
		try{
			latestEventsArr[i] = await fetchAsync(currentServerAddress + "/latest-event");
			//console.log(currentServerAddress + "/latest-event");
			
		}catch (error){
			console.log(error);
			latestEventsArr[i] = {"name":"Network error", "description":"Pojavio so problem pri komunakiciji sa serverom. Provjerite svoju knekciju i pokusajte ponovo.", "event":"", "icon":errorIcon};
			break;
		}
	}
	//console.log("Event info: ", latestEventsArr[0]);
}

async function loadRecentPosts(viewAll){
	//console.log("load recents called");
	
	if(viewAll){
		scrollContent = document.getElementById("scroll-content-all");
	}

	if(currentScreen === "home"){
		scrollContent.innerHTML = "<div id='loading'><div id='spinner'></div></div>";
		loader = document.getElementById("loading");
		for(let i = 0; i < latestEventsArr.length; i++){
				//scrollContent.innerHTML += "<div class='scroll-element'> scroll-element </div>"
			console.log("Length: ", latestEventsArr.length);
			scrollContent.insertAdjacentHTML("beforeend", scrollElement);
			
			let event = latestEventsArr[i];
			if(type === "user"){
				let scrollElementData = scrollContent.querySelectorAll(".scroll-element")[i];
				if(event.image.includes("https:/")){
					scrollElementData.querySelector("#image > #picture").style.backgroundImage = "url(" + event.image + ")";
				}else{
					scrollElementData.querySelector("#image > #picture").innerHTML = errorIcon;				
				}
	
				scrollElementData.querySelector("#title").innerHTML = event.title;
				switch (event.type){
					case "competition":
							scrollElementData.querySelector("#chin > #content > #left > #type").innerHTML = "Takmičenje";
					break;	
					case "internship":
						scrollElementData.querySelector("#chin > #content > #left > #type").innerHTML = "Praksa";
					break;
				}
				scrollElementData.querySelector("#chin > #content > #left > #posted-on > #date").innerHTML = event.posted_date.slice(5, 16);
				scrollElementData.querySelector("#chin > #content > #left > #length > #time").innerHTML = event.expiry_date.slice(5, 16);
				
				scrollElementData.querySelector("#chin > #content > #right > #open").addEventListener("click", () => {openPost(i)});
		//scrollContent.querySelector(".scroll-element:nth-child(" + (i + 0) + ")").innerHTML += " " + i;
			}else{
				let scrollElementData = scrollContent.querySelectorAll(".comapny_scroll")[i];
				if(event.image.includes("/images")){
					scrollElementData.querySelector("#info> #image").style.backgroundImage = "url(" + "https://cdn.skenda.me" + event.image.replace("files", "") + ")";
				}else{
					scrollElementData.querySelector("#info > #image").innerHTML = errorIcon;				
				}
	
				scrollElementData.querySelector("#info > #title").innerHTML = event.title;
								
				scrollElementData.querySelector("#buttons > #open-post").addEventListener("click", () => {openPost(i)});
				scrollElementData.querySelector("#buttons > #delete-post").addEventListener("click", () => {
					deletePost(event.id);
				} )
				scrollElementData.querySelector("#buttons > #edit-post").addEventListener("click", () => {
					editPost(event.id);
				})
			}
		}
		scrollContent = document.getElementById("scroll-content");
	}	
		if(loader){
			hideLoadingSpinner();
		}
	}
function editPost(post_index){
	editingPost = post_index;
	loadPage('events');
}


function deletePost(post_id){
	postAsync({"post_id": post_id, "tkn": localStorage.getItem("lgntkn")}, "delete_post", "json");
}

function openPost(post_index){
	let opened_post = latestEventsArr[post_index];
	//console.log("Opened post: ", opened_post);
	let post_view = document.getElementById("post-view");

	fetch("../templates/post_view.html").then((template) => {
		template.text().then((html) => {
			post_view.innerHTML = html; 
			handleClosePost(post_view);
		}).then(function(){
			document.getElementById("post-title").innerHTML = opened_post.title;	
			document.getElementById("description-text").innerHTML = opened_post.description.replace(/\n/g, "<br>");	
			document.getElementById("poster").innerHTML = opened_post.poster;
			document.getElementById("post-image").src = "https://cdn.skenda.me/" + opened_post.image.replace("files", "");

			document.getElementById("expand").addEventListener("click", function(){
				let height = document.getElementById("post-description").style.height;
				if(height === "90%"){
					document.getElementById("post-description").style.height = "45%";		
				} else {
					document.getElementById("post-description").style.height = "90%";
				}
			});
		}) // hook the post closing handler to the close button 
	});

	post_view.style.display = "block";
}

function handleClosePost(post_view){
	document.getElementById("back").addEventListener("click", () => {
		post_view.style.display = "none";
	})
}

async function loadPage(page){
	switch (page) {
		case "home":
			
			//console.log("loading home")
			if(homeHeaderCacheTemplate !== "" && homeHeaderCacheTemplate){
				header.innerHTML = homeHeaderCacheTemplate;
			}else{
				header.innerHTML = homeHeaderTemplate;
			}
			if(homeMainCacheTemplate !== "" && homeMainCacheTemplate){
				screen.innerHTML = homeMainCacheTemplate;
			}else{	
				screen.innerHTML = homeTemplate;
			}
					
			currentScreen = "home";
			homeButton.classList.add("highlight");
			eventButton.classList.remove("highlight");
			userButton.classList.remove("highlight");

			updateReferences();
			
			let usernameLabel = document.getElementById("ime");
			usernameLabel.innerHTML = username_str;
			document.getElementById("pic").style.backgroundImage = "url(\"https://cdn.skenda.me/" + profile_image + "\")";
			document.getElementById("skola").innerHTML = school_str;
			homeMainCacheTemplate = screen.innerHTML;
			homeHeaderCacheTemplate = header.innerHTML;

			updateLatestEvent();

			await loadRecentPosts();
			
			try{
				//await fetchRecentPosts().then(loadRecentPosts);
				if(type === "user"){
					await fetch_n_events().then(loadRecentPosts);
				}else{
					document.getElementById("open-all").addEventListener("click", open_all_posts);
					await fetch_posted_events().then(loadRecentPosts);
				}
			}finally{
				hideLoadingSpinner();
			}
				break;	
			
//---------------
		case "events":
			if(eventsHeaderCacheTemplate && eventsHeaderCacheTemplate !== ""){
				
				header.innerHTML = eventsHeaderCacheTemplate;

			}else{
				header.innerHTML = eventsHeaderTemplate;	
			}

			if(eventsMainCacheTemplate && eventsMainCacheTemplate !== ""){
				screen.innerHTML = eventsMainCacheTemplate;
			}else{
				screen.innerHTML = searchTemplate;
			}
			
			currentScreen = "events";
	
			homeButton.classList.remove("highlight");
			eventButton.classList.add("highlight");
			userButton.classList.remove("highlight");

			run();

			updateReferences();
		break;
//---------------
		case "user":
			header.innerHTML = userHeaderTemplate;
			document.getElementById("image").src = "https://cdn.skenda.me/" + profile_image;
			document.getElementById("username").innerHTML = username_str;
			screen.innerHTML = userTemplate;
			currentScreen = "user";

			homeButton.classList.remove("highlight");
			eventButton.classList.remove("highlight");
			userButton.classList.add("highlight");	
			
			updateReferences();
			
			console.log("Skola: ", school_str);
			school_label.innerHTML = school_str;

			let emailField = document.getElementById("email-field");
			let phoneField = document.getElementById("phone-field");

			document.getElementById("profile_image").addEventListener("click", handlePfpChange);
			emailField.value = email_str;
			phoneField.value = phone_str;

			emailField.addEventListener("blur", editEmail);
			phoneField.addEventListener("blur", editPhone);

			document.getElementById("edit-email").addEventListener("click", function(){emailField.focus()});
			document.getElementById("edit-phone").addEventListener("click", function(){phoneField.focus()});

			document.getElementById("upload-cv").addEventListener("click", uploadCV);
			document.getElementById("edit-diplomas").addEventListener("click", uploadDiploma);

			

			document.getElementById("hide_settings").addEventListener("click", function(){
				if(areSettingsOpen){
					document.getElementById("user_settings").style.animation = ".2s slideClosed forwards ease-in-out";
					document.getElementById("hide_settings").innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
					areSettingsOpen = false;
				}else{
					document.getElementById("user_settings").style.animation = ".2s slideOpen forwards ease-in-out";
					document.getElementById("hide_settings").innerHTML = '<i class="fa-solid fa-chevron-down"></i>'
					areSettingsOpen = true;
				}	
				
			})
		break;
//---------------
		default:
		
			break;
	}	
}

function open_all_posts(){
	document.getElementById("view-all").style.display = "block";
	document.getElementById("close-all").addEventListener("click", close_all_posts);
	loadRecentPosts("all");
}

function close_all_posts(){
	document.getElementById("view-all").style.display = "none";
	hideLoadingSpinner();
}

function uploadCV(){
	console.log("Upload CV");	
}

function editEmail(){
	let newEmail = document.getElementById("email-field").value;
	if(localStorage.getItem("email") !== newEmail){
		const mail_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if(!mail_regex.test(newEmail)){
			console.log("email regex failed");
			notify("Unesena mail adresa nije validna.", "error");
			return false;
		}
		if(newEmail !== ""){	
			postAsync({"tkn": localStorage.getItem("lgntkn"), "email": newEmail}, "/update_user", "email").then(response => {
				notify(response["message"], "success");
				localStorage.setItem("email", newEmail);
				email_str = newEmail;
			})
		}
	}
	return true;
}

function editPhone(){
	let newPhone = document.getElementById("phone-field").value;
	
	if(localStorage.getItem("phone_num") !== newPhone){
		const phone_regex = /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
		if(!phone_regex.test(newPhone)){
			console.log("phone regex failed");
			notify("Uneseni broj telefona nije validan.", "error");
			return false;
		}
		if(newPhone !== ""){	
			postAsync({"tkn": localStorage.getItem("lgntkn"), "phone": newPhone}, "/update_user", "phone").then(response => {
				notify(response["message"], "success");
				localStorage.setItem("phone_num", newPhone);
				phone_str = newPhone;
			})
		}
	}
	return true;
}

function uploadDiploma(){
	console.log("Upload diploma");
}


/* function handleThemeToggle(){	
	if(switching === false){
		if(theme === "dark"){
			switching = true;
			theme = "light";
			themeButton.style.animation = "toggleOff ease-out .2s forwards";			
		}else if(theme === "light"){
			switching = true;
			theme = "dark";
			themeButton.style.animation = "toggleOn ease-out .2s forwards";
		}
	}
	toggleTimeoutId = setTimeout(function(){
		switching = false;
		console.log("set timeout off", switching);
		clearTimeout(toggleTimeoutId);
	}, 200);

	localStorage.setItem("theme", theme);
	//console.log("set theme to:", theme, "switching: ", switching)
} */


function updateReferences(){
	latestCard = document.getElementById("latest-event");
	latestCardTitle = document.querySelector("#latest-event > #title");
	latestCardDescription= document.querySelector("#latest-event > #event > #info > #description");
	latestCardName= document.querySelector("#latest-event > #event > #info > #name");
	scrollContent = document.getElementById("scroll-content");
	loader = document.getElementById("loading");
	themeButton = document.getElementById("theme-button");
	themeToggle = document.getElementById("theme-toggle");
	school_label = document.getElementById("school");
}

let toggleTimeoutId;
let switching = false;

function loadEvents(){
	// TODO: write filter code for searching
}

function hideLoadingSpinner(){	
	//console.log("hidden the spidden");
	document.getElementById("loading").style.display = "none";
	//console.log(loader);
	}
function showLoadingSpinner(){
	//console.log("showdden the spidden");
	document.getElementById("loading").style.display = "flex";
}

async function handlePfpChange(){
	let popup = document.getElementById("upload-photo");
	let file_input = document.getElementById("file-input");
	let image_preview = popup.querySelector("#content > #image-preview > img");
	let image_file;
	image_preview.src = "https://cdn.skenda.me/" + profile_image;

	popup.style.display = "flex";
	popup.style.animation = "slideUp .2s ease-in-out forwards";
	let close_popup = popup.querySelector("#content > #title > #popup-close");
	close_popup.addEventListener("click", function(){
		popup.style.animation = "slideDown .1s ease-in-out forwards"
		setTimeout(function(){popup.style.display = "none"}, 100)
	});

	file_input.addEventListener('change', function(event){
		if(event.target.files[0]){
			let allowed_extensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
			if(allowed_extensions.exec(file_input.value)){
				image_file = event.target.files[0];
				if (!image_file) {
     			   notify("Niste odabrali sliku za upload.");
        		return;
    			}
				image_preview.src = URL.createObjectURL(event.target.files[0]);	
			}else{
				notify("Podrzani formati su jpg, jpeg, png, gif.");
			}
		}

	})

	document.getElementById("upload-to-server").addEventListener("click", async function(){
		const formData = new FormData();
		formData.append("file", image_file);
		formData.append("tkn", localStorage.getItem("lgntkn"));
		await postAsync(formData, "/upload/profile_image", "file").then(function(value){update_profile_image(value);});
		
		
	})
}
var notif_hidden = true;
let timeoutId;

function notify(message, type){
	notif_hidden = false;
	if(timeoutId){
		clearTimeout(timeoutId);
	}
	
	let notifMessage = document.querySelector("#notification > #content > #message");
	notifMessage.innerHTML = message;
	if(type === "error"){
		document.querySelector("#notification > #content").style.backgroundColor = "var(--error-red)";
	}else{
		document.querySelector("#notification > #content").style.backgroundColor = "var(--success-green)";
	}
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

function showPupup(type){
	switch (type){ 
		case "email":	
			break;
		case "picute":
			break;
		default:
			console.log("Unknown popup type: ", type);
			break;
	}
}

async function fetch_posted_events(){
	let posts_response;
	posts_response = await postAsync({"token": localStorage.getItem("lgntkn"), "from": localStorage.getItem("lgntkn")}, "get_n_posts", "posts");
	
	let posts_arr = posts_response.posts;
	let last_loaded_index = 0;
	for(let index in posts_arr){
		if(index >= last_loaded_index){
			latestEventsArr.push(posts_arr[index]);	
			if(index === posts_arr.length - 1){
				last_loaded_index = index;
			}
		}
	}
	
	last_loaded_post = latestEventsArr[last_loaded_index];
	console.log(last_loaded_post);

}



async function fetch_n_events() {
    let posts_response;
    let loaded_date = "";
    let parsed_date = "";
    let offset = 0; // Start at the first post
    const limit = 20; // Number of posts per request

    // Check if there is a last loaded post to determine the loaded_date
    if (last_loaded_post) {
        loaded_date = last_loaded_post.posted_date;
        let sliced_date = loaded_date.slice(5, 16);

        let day = sliced_date.slice(0, 2);
        let month = month_table[sliced_date.slice(3, 6)];
        let year = sliced_date.slice(7, 11);
        console.log("day: ", day, "month: ", month, "year: ", year);

        parsed_date = year + "-" + month + "-" + day;
        console.log(parsed_date);
    }

    console.log("Loaded date: ", loaded_date);

    // Making the API call with pagination parameters (offset and limit)
    posts_response = await postAsync(
        {
            "token": localStorage.getItem("lgntkn"),
            "loaded-date": parsed_date,
            "offset": offset,  // Add offset
            "limit": limit     // Add limit
        },
        "get_n_posts",
        "posts"
    );

    let posts_arr = posts_response.posts;
    let last_loaded_index = 0;

    // Add the posts to the latestEventsArr
    for (let index in posts_arr) {
		console.log("loaded post: ", index);
        latestEventsArr.push(posts_arr[index]);

        // Track the index of the last loaded post
        if (index === posts_arr.length - 1) {
            last_loaded_index = index;
        }
    }

    // Update the last loaded post
    last_loaded_post = latestEventsArr[last_loaded_index];
    console.log(last_loaded_post);

    // Optionally, you can now update the offset for the next load (e.g., when loading more posts)
    offset += limit;

    // For demonstration, print the updated offset to ensure it increments correctly
    console.log("Updated offset: ", offset);
}

function update_profile_image(obj){
	profile_image = obj.url;
	localStorage.setItem("profile_image", "https://cdn.skenda.me/" + obj.url);
	document.getElementById("image").src = "https://cdn.skenda.me/" + obj.url;
}

function update_profile_image_url(url){
	try{
		profile_image = url;
		document.getElementById("pic").style.backgroundImage = "url('https://cdn.skenda.me/" + profile_image + "')";
		document.getElementById("image").src = "https://cdn.skenda.me/" + url;
		console.log(document.getElementById("image"), ".src = ", document.getElementById("image").src)
	} catch (error) {
		console.log("Error: ", error);
	}
}

/*function get_post_age(date){
	let current_date = new Date();

	let numbers = date.split("-");
	let post_year =Number(numbers[0]);
	let post_month = Number(numbers[1]);
	let post_day = Number(numbers[2]);

	let current_year = current_date.getFullYear();
	let current_month = current_date.getMonth() + 1;
	let current_day = current_date.getDate();

	console.log("Numbers: ", numbers);

	console.log("Current day", current_day, "Current month", current_month, "Current year", current_year);
	console.log("Post day", post_day, "Post month", post_month, "Post year", post_year);

	let distance_year = current_year - post_year;
	let distance_month = current_month - post_month;
	let distance_day = current_day - post_day;
	
}*/
