chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        
        var tabUrl = tab.url

        var regexp =/mail.google.com\/mail\/u\/(\d)/;

        if (regexp.test(tabUrl)) {
            var match = regexp.exec(tabUrl);
            if ("1" === match[1]) {
                chrome.tabs.getSelected(null, function(tab) {
                    chrome.tabs.sendMessage(tab.id, {text: 'g'}, function () {});
                });
            }
            
        }
    }
  })