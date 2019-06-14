chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "alert":
            saveChanges(request.value);
			break;
    }
    return true;
});

function saveChanges(names) {
	let value = [];
	for(let i=0; i<names.length; i++){
		// Check nothing value
		if (!value)
			continue;
		
		value[i] = names[i];
	}

	// Save it using the Chrome extension storage API
	chrome.storage.sync.set({'value': value}, function() {
		// Notify that we saved
		alert('Zapisano wartości');
	});
}

chrome.downloads.onCreated.addListener(function(item){
	chrome.storage.sync.get(['value'], function(items) {
		console.log(items.value)
		
		for(let i=0; i<items.value.length; i++){
			let string = items.value[i];
			let test = item.mime;
			//let test = item.url.slice(-string.length);

			if(test === string)
				chrome.downloads.cancel(item.id, function(){
					// Nuff said
				});
		}
	});
});