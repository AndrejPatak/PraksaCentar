
function run(){
	const title_input = document.getElementById("title-input");
	const description_input = document.getElementById("description-input");
	const image_preview = document.getElementById("promo-photo");
	const image_input = document.getElementById("image-input");
	const expiry_input = document.getElementById("expiry-date-input");
	const post_type = document.getElementById("post-type");
	const link_box = document.getElementById("links");
	const publish_btn = document.getElementById("publish");
	const giveup_btn = document.getElementById("giveup");
	const add_link = document.getElementById("add-link");

	var links_arr = [{"name": "", "link": "", "id": "id-0"}];
	
	let link_template = "<div class=\"link\" id=\"insertId\">\
				<div class=\"link-element\">\
					<input type=\"text\" name=\"\" value=\"\" placeholder=\"Ime linka\" class=\"link-name\">\
					<input type=\"text\" name=\"\" value=\"\" placeholder=\"Link na stranicu\" class=\"link-value\"></div>\
				<button class=\"remove-link\"> <i class=\"fa-solid fa-xmark\"></i></button>\
			</div>"
	
	let postData = {
		"title": title_input.value,
		"image": image_input.value,
		"expiry_date": expiry_input.value,
		"post_type": post_type.value,
		"links": links,
		"description": description_input.value
	};
	
	links_arr = [{"name": "", "link": "", "id": "id-0"}];

	giveup_btn.addEventListener("click", function(){loadPage("home")});
	publish_btn.addEventListener("click", function(){	
		if(!title_input.value || 
			!description_input.value ||
			!image_input.value ||
			!expiry_input.value ||
			!post_type.value
		){
			notify("Potrebno je unijeti sve podatke!", "error")
			return;
		}else{
			postData = {
				"title": title_input.value,
				"image": image_input.files[0],
				"expiry_date": expiry_input.value,
				"post_type": post_type.value,
				"links": links,
				"description": description_input.value
			};
			sendNewPost(postData);
			}
	});

	image_input.addEventListener('change', function(event){
				if(event.target.files[0]){
					let allowed_extensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
					if(allowed_extensions.exec(image_input.value)){
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
			});

	add_link.addEventListener("click", () => {
    	// Generate the new id based on the current length of the links_arr
    	let id = "id-" + links_arr.length;  // Use links_arr.length directly, no need to subtract 1

		let lastLink = link_box.querySelector(".link:last-child");

    	// Get the latest link input values
    	let link_tag = document.getElementById("id-" + (links_arr.length - 1));  // This will still get the previous link tag correctly
    	let link_name = link_tag.querySelector(".link-name").value;
    	let link_value = link_tag.querySelector(".link-value").value;

    	if(!link_name || !link_value){
        	notify("Potrebno je unijeti sve podatke za link", "error");
        	return;
    	}

    	let link = {"name": link_name, "link": link_value, "id": id};
    	links_arr.push(link);  // Add new link to the array
    	console.log("Adding link");

    // Show remove button and add event listener for the new link
    	link_tag.querySelector(".remove-link").style.display = "block";
    	link_tag.querySelector(".remove-link").addEventListener("click", function(event){
			event.preventDefault();
        	removeLink(link.id);
    	});

    // Insert the new link template
    	link_tag.insertAdjacentHTML("afterend", link_template.replace("insertId", id));
	});

	console.log("New post loaded!")

function removeLink(id){
    // Find the element in the DOM using the ID
    const linkElement = document.getElementById(id);

    // If the element exists, remove it from the DOM
    if(linkElement) {
        linkElement.remove();  // This removes the link from the DOM

        // Optionally, also remove it from the links_arr data structure
        links_arr = links_arr.filter(link => link.id !== id);  // Remove the link from the array
        console.log("Link removed:", id);
    } else {
        console.log("Link with ID " + id + " not found.");
    }
}

}

function sendNewPost(postData){
	
	const formData = new FormData();
	formData.append("tkn", localStorage.getItem("lgntkn"));
	formData.append("title", postData.title);
	formData.append("expiry_date", postData.expiry_date);
	formData.append("post_type", postData.post_type);
	formData.append("links", postData.links);
	formData.append("description", postData.description);
	formData.append("image", postData.image);
	formData.append("editing", editingPost);
	

	postAsync(formData, "/new_post", "new-post")

	console.log(formData);
}
