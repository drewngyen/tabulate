chrome.commands.onCommand.addListener(function(command) {
    if (command == "toggle-pin") {
      // Get the currently selected tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Toggle the pinned status
        var current = tabs[0];
        // window.alert("tabs: ", tabs);
        chrome.tabs.update(current.id, {'pinned': !current.pinned});
      });
    }
  });
  