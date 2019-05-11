var sendMessageToActiveTab = function a(message, callback) {
  chrome.tabs.getSelected(null, function f(tab) {
    chrome.tabs.sendMessage(tab.id, {text: message}, callback || function g() {});
  });
};

var onButtonClicked = function b(e) {
  sendMessageToActiveTab(e.target.id);
};

var onPopupLoaded = function h(e) {
  sendMessageToActiveTab('email', function c(response) {
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
  chrome.tabs.getSelected(null, function d(tab) {
    if (!/mail.google.com/.test(tab.url)) {
      document.body.innerHTML = '<div style="width: 100px;">' +
          '<p align="center"><font size="3">I am only useful on a Gmail tab</font> </p>'+
          '<p align="center"><font size="5">&#9786;</font></p>' +
          '<p align="center"><font size="3"><a href="#" id="gmail">Go to Gmail</a></font></p></div>';
      document.getElementById('gmail').onclick = function e (e) {
        chrome.tabs.create({'url': 'http://www.gmail.com'});
      }
    }
  });
};

window.addEventListener('load', onPopupLoaded);

