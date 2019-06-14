let button = document.getElementById("button");
let inputs  = document.getElementsByClassName("input");

button.addEventListener('click', ()=>{
	let message = [];
	for(let i=0; i<inputs.length; i++)
		message[i] = inputs[i].value;

	console.log(message)
	
	chrome.extension.sendMessage({
		type: "alert",
		value: message
	});
}, false)