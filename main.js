// pins current tab, and keeps focus.
chrome.commands.onCommand.addListener(function(command) {
  if (command == "toggle-pin") {
    // Get the currently selected tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      // Toggle the pinned status
      chrome.tabs.getSelected(null, function(tab) {
        console.log(tab);
      });
      var current = tabs[0];
      chrome.tabs.update(current.id, { pinned: !current.pinned });
    });
  } else if (command == "toggle-browser-action") {

  }
});

chrome.browserAction.onClicked.addListener(function() {
    var w = 440;
    var h = 220;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2); 

    chrome.windows.create({'url': 'redirect.html', 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {
    });
});

// assigns query( assigns first arg to empty obj, second to callback)
chrome.tabs.query({}, function(tabs) {
  // in cb declare new obj
  const objTabs = {};
  const urlCache = {};
  const urlMetaCache = {};
  // loop through obj
  for (let obj of tabs) {
    let lowTitle = obj.title;
    objTabs[obj.id] = lowTitle.toLowerCase();
    urlCache[obj.id] = [obj.favIconUrl, obj.title, obj.url];
    urlMetaCache[obj.id] = [obj.selected, obj.highlighted, obj.title];
    // arrayTabs.push(obj["title"]);
  }

  console.log("begin our loop test");
  for (let el in objTabs) {
    console.log(objTabs[el]);
  }
  console.log("urlCache:", urlCache);
  //   console.log("urlMetaCache:", urlMetaCache);
  //   console.log(objTabs);
  //   console.log(tabs);
});


function doInCurrentTab(tabCallback) {
  chrome.tabs.query(
    // execute code only in current window if properties are true below
    { currentWindow: true, active: true },
    function(tabArray) {
      // added here
      var updateProperties = { active: true };
      chrome.tabs.update(tabId, updateProperties, tab => {});

      tabCallback(tabArray[0]);
    }
  );
}

