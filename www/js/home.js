const replace = document.getElementById("replace")

document.addEventListener("deviceready", function () {
    // Now the plugin is available
    cordova.plugin.http.setServerTrustMode('nocheck'); // Optional for ignoring SSL cert validation (not recommended for production)
}, false);


async function fetchAsync (url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

async function setData (of, url){
	const data = await fetchAsync(url);
	of.innerHTML = 	data.data;
}

try {
	setData(replace, "https://cdn.skenda.me:443")
} catch (error) {
	console.log("Unable to fetch data for replacement: ", error);
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



