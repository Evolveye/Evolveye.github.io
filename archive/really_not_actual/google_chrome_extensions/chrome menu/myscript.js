let newMenu = document.createElement('div')
newMenu.id = 'chromeMenu'; 

document.body.appendChild(newMenu)

let buttons = newMenu.getElementsByTagName('button')

chrome.runtime.onMessage.addListener(
	function(request, sender) {
		let msg = request.message;
		alert('ZMIANA!');
		
		newMenu.innerHTML = '';
		
		for(i in msg)
			newMenu.innerHTML += '<button onclick="test()">'+ msg[i].id +'</button>';
		for(i of buttons)
			console.log(i)
			//buttons[i].addEventListener('click', ()=>{alert('test')}, false);
});

function test(){
	alert('test')
}
/*
	chrome.extension.sendMessage({
		type: "alert",
		value: message
	});
*/
