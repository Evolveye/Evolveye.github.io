let tabs = {};


//---# Create array of open tabs, and update that
//----------------------------------------------------------------------------
chrome.windows.get(-2, {populate:true, windowTypes:["normal"]}, (window)=>{
	for(i of window.tabs)
		tabs[i.id] = i
	sendMessage()
});
chrome.tabs.onCreated.addListener( (newTab)=>{
	tabs[newTab.id] = newTab

	sendMessage()
});
chrome.tabs.onRemoved.addListener( (tabId, removeInfo)=>{
	delete tabs[tabId]
	sendMessage()
});


//---# Send array of tabs to "content script"
//-----------------------------------------------------------
function sendMessage(){
	console.log(tabs)
	chrome.tabs.getSelected(null, (tab)=>{
		chrome.tabs.sendMessage(tab.id, {message: tabs});
	});
}