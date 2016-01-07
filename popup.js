var sendMessageToActiveTab = function(message, callback) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {text: message}, callback || function() {});
  });
};

var onButtonClicked = function(e) {
  sendMessageToActiveTab(e.target.id);
};

var onPopupLoaded = function(e) {
  sendMessageToActiveTab('email', function(response) {
    if (response) {
      var emailElement = document.createElement('div');
      emailElement.textContent = response;
      emailElement.classList.add('email-address');
      document.body.insertBefore(emailElement, document.body.firstChild);
    }
  });
  var buttons = document.getElementsByClassName('color-button');
  for (var i = 0, button; button = buttons[i]; i++) {
    button.addEventListener('click', onButtonClicked);
  }
  chrome.tabs.getSelected(null, function(tab) {
    if (!/mail.google.com/.test(tab.url)) {
      document.body.innerHTML = '<div style="width: 150px;">' +
          '<p>I am only useful on a Gmail tab &#9786;</p>' +
          '<p><a href="#" id="gmail">Go to Gmail</a></p></div>';
      document.getElementById('gmail').onclick = function(e) {
        chrome.tabs.create({'url': 'http://www.gmail.com'});
      }
    }
  });
};

window.addEventListener('load', onPopupLoaded);

