const latestCard = document.getElementById("latest-event");
const latestCardTitle = document.querySelector("#latest-event > #title");
const latestCardDescription= document.querySelector("#latest-event > #event > #info > #description");
const latestCardName= document.querySelector("#latest-event > #event > #info > #name");
const scrollContent = document.getElementById("scroll-content");


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
	latestCardTitle.querySelector("#main").innerHTML = "Latest:";
	latestCardTitle.querySelector("#sub").innerHTML = "Your latest event";
	latestCardDescription.innerHTML = latestCardData.description;
	latestCardName.innerHTML = latestCardData.name;
	latestCard.querySelector("#event > #icon > img").src = latestCardData.icon;
}


// function setCordovaData(url) {
//     cordova.plugin.http.get(url, {}, {}, function (response) 
//        // Parse and use the response
//        const data = JSON.parse(response.data);
//        replace.innerHTML = data.data;
//     }, function (error) {
//         // Handle errors
//         console.error("HTTP Error:", error);
//     });
// }


for(i = 0; i < 7; i++){
	scrollContent.innerHTML += "<div class='scroll-element'> scroll-element </div>"
	scrollContent.querySelector(".scroll-element:nth-child(" + (i + 1) + ")").innerHTML += " " + i;
}

updateLatestEvent()

