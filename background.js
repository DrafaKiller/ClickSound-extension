let lastClickSound = 0;

async function notifyTabEvent(action) {
	if (lastClickSound + 50 > Date.now()) return;
	lastClickSound = Date.now();
	
	let tabs = await chrome.tabs.query({});
	tabs = tabs.sort((a, b) => a.active ? -1 : 1);
	
	for (const tab of tabs) {
		const response = await chrome.tabs.sendMessage(tab.id, { type: 'tab', action: action }).catch((error) => {
			if (error == 'Error: Could not establish connection. Receiving end does not exist.') return false;
			throw error;
		});
		if (!response) continue;
		return;
	}
}

chrome.tabs.onCreated.addListener(() => notifyTabEvent('open'));
chrome.tabs.onRemoved.addListener(() => notifyTabEvent('close'));
chrome.tabs.onActivated.addListener(() => notifyTabEvent('changed'));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type == 'click') lastClickSound = Date.now();
	sendResponse();
});