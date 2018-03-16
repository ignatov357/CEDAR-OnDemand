
chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript(tab.ib, {
		file: 'load_libraries.js'
	}, function() {
		chrome.tabs.executeScript(tab.ib, {
			file: 'cod.js'
		});
	});
});
//chrome.browserAction.setBadgeBackgroundColor({ color: [225, 0, 0, 0] });
//chrome.browserAction.setBadgeText({text: 'D'});

// Called when the user clicks on the browser action.
/*chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    //code: 'document.body.style.backgroundColor="red"'
	code: 'document.getElementsByTagName("input")[0].style.backgroundColor="red"'
  });
});
*/