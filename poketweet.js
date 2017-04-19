chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    file: "pokemon.js"
  }, function() {
    chrome.tabs.executeScript({
      file: "background.js"
    });
  })
});
