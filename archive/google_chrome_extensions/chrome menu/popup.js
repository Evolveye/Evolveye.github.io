let button = document.getElementById("button");

button.addEventListener('click', ()=>{
	chrome.extension.sendMessage({
		type: "alert",
	});
}, false)