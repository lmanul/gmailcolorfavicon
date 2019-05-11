function getColorFromLocalStorage() {

    var regexp =/mail.google.com\/mail\/u\/(\d)/;
    var match = regexp.exec(window.location.href);
    var userId = match[1];

    var colorChar = localStorage.getItem("ronhks.gmail.favicon.color."+userId);
    if (colorChar == null){
      colorChar = 'r';
    }
    return colorChar;
};

chrome.tabs.onUpdated.addListener( function listener (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
        var tabUrl = tab.url
        var regexp =/mail.google.com\/mail\/u\/(\d)/;

        if (regexp.test(tabUrl)) {
                chrome.tabs.getSelected(null, function sendMessage(tab) {
                    var match = regexp.exec(tabUrl);
                    var userId = match[1];
                    var colorChar = getColorFromLocalStorage();
                    chrome.tabs.sendMessage(tab.id, {id: userId, color: colorChar, caller:"background.js"}, function callback () {});
                });
            
            
        }
    }
  });