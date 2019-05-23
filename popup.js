document.addEventListener("DOMContentLoaded", function() {
  // Find the tabId of the current (active) tab. We could just omit the tabId
  // parameter in the function calls below, and they would act on the current
  // tab by default, but for the purposes of this demo we will always use the
  // API with an explicit tabId to demonstrate its use.
  chrome.tabs.query({ active: true }, function(tabs) {
    if (tabs.length > 1)
      console.log(
        "[ZoomDemoExtension] Query unexpectedly returned more than 1 tab."
      );
    tabId = tabs[0].id;

    // document.getElementById('search-submit').onclick = doZoomOut;
  });

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
    }
  });

  chrome.tabs.query({}, function(tabs) {
    console.log("tabs:", tabs);

    const objTabs = {};

    for (let obj of tabs) {
      let lowTitle = obj.title;
      objTabs[obj.id] = lowTitle.toLowerCase();
      // arrayTabs.push(obj["title"]);
    }

    console.log(objTabs);
    console.log(tabs);

    // grab the input
    let searchInput = document.getElementById("search-input");
    let submitButton = document.getElementById("search-submit");
    submitButton.addEventListener("click", function() {
      alert(
        `hello search: ${searchInput.value} result is: ${search(
          searchInput.value,
          objTabs
        )}`
      );
    });
    
  });
});

function search(str, object) {
  for (let el in object) {
    //   alert(object[el]);
    if (object[el].search(str) !== -1) {
      alert(el);
      console.log("object[el]:", object[el]);
      console.log("true");
      return true;
    } else {
      console.log("false");
    }
  }
  alert("oh well!");
  return false;
}
