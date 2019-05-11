MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var FULL_COLOR_NAMES = {
  'r': 'red',
  'b': 'blue',
  'g': 'green',
  'y': 'yellow'
};

var currentColor = 'r';
var labIsOn;
var favicon = document.querySelector('link[rel$=icon]');

var observer = new MutationObserver(function(mutations, observer) {
  if (shouldReactToMutationSet(mutations)) {
    changeFavicon(currentColor);
  }
});

observer.observe(document.head, {
  childList: true,
  subtree: true,
  attributes: true
});

function scrapeEmailAddressFromPage() {
  var accountElement = document.querySelector(".gb_b.gb_Ra.gb_R");
  if (accountElement) {
    var accountText = accountElement.title;
    var email = /\((.*)\)/.exec(accountText)[1];
    return email;
  }
}

function elIsFavicon(el) {
  return el.tagName.toLowerCase() == 'link' &&
      el.getAttribute('rel').indexOf('icon') != -1;
}

function getFavicon() {
  var links = document.getElementsByTagName('link');
  for (var i = 0, link; link = links[i]; i++) {
    if (link.getAttribute('rel').indexOf('icon') != -1) {
      favicon = link;
      break;
    }
  }
  if (!favicon && !!window.console) {
    window.console.log('Warning: could not find the favicon element.');
  }
  return favicon;
}

function shouldReactToMutationSet(mutations) {
  for (var i = 0, record; record = mutations[i]; i++) {
    var target = record.target;
    if (target.tagName.toLowerCase() == 'head' && record.addedNodes) {
      for (var j = 0, addedNode; addedNode = record.addedNodes[j]; j++) {
        if (elIsFavicon(addedNode)) {
          return true;
        }
      }
    }
  }
  var faviconRecords = [];
  for (var i = 0, record; record = mutations[i]; i++) {
    var target = record.target;
    if (elIsFavicon(target)) {
      faviconRecords.push(record);
    }
  }
  if (!faviconRecords.length) {
    return false;
  }
  var isManualChange = false;
  for (var i = 0, record; record = faviconRecords[i]; i++) {
    if (record.attributeName && record.attributeName == 'manual') {
      isManualChange = true;
    }
  }
  return !isManualChange;
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text == 'email') {
    sendResponse(scrapeEmailAddressFromPage());
  } else {
    changeFavicon(msg.text);
  }
  //sendResponse(document.all[0].outerHTML);
});

function setNewFaviconUrl(favicon, url) {
  var favicon = getFavicon();
  favicon.href = url;
  favicon.setAttribute('manual', '1');
}

function changeFavicon(color) {
  currentColor = color;
  var colorSuffix = (color == 'r') ? '' : '-' + color;
  var shouldReturn = 0;
  var favicon = getFavicon();
  if (favicon) {
    var oldUrl = favicon.href;
    if (typeof labIsOn == 'undefined') {
      // We only need to set this once. The page will be reloaded when labs
      // configuration changes.
      labIsOn = oldUrl.indexOf('unreadcountfavicon') != -1;
    }
    var newUrl;
    if (!labIsOn) {
      var fullColorName = FULL_COLOR_NAMES[color] || 'red';
      newUrl = 'https://ssl.gstatic.com/ui/v1/icons/mail/images/2/' +
          'unreadcountfavicon/' + fullColorName + '.ico';
    } else {
      // The lab is on.
      // Strip off the already existing color suffix.
      var indexOfHyphen = oldUrl.indexOf('-');
      if (indexOfHyphen != -1) {
        oldUrl = oldUrl.substring(0, indexOfHyphen) +
            oldUrl.substring(indexOfHyphen + 2);
      }

      if (oldUrl.indexOf('_2x.png') == -1) {
        newUrl = oldUrl.replace('.png', colorSuffix + '.png');
      } else {
        newUrl = oldUrl.replace('_2x.png', colorSuffix + '_2x.png');
      }
    }
    setNewFaviconUrl(favicon, newUrl);  
  }
}