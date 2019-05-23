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
///
    const objTabs = {};
    const urlCache = {};
    const urlMetaCache = {};

    for (let obj of tabs) {
      let lowTitle = obj.title;
      objTabs[obj.id] = [lowTitle.toLowerCase(), obj.url, obj.id];
      urlCache[obj.id] = [obj.favIconUrl, obj.title, obj.url];
      urlMetaCache[obj.id] = [obj.selected, obj.highlighted, obj.title];
      // arrayTabs.push(obj["title"]);
    }

    // append tabslist to search
    let tabList = document.getElementById("current-tabs");
    for (let el in urlCache) {
        let urlContainer = document.createElement('div');
        urlContainer.setAttribute("class", "url-container");
        let favIcon = document.createElement('img');
        favIcon.setAttribute("class", "fav-icons");
        favIcon.setAttribute("src", `${urlCache[el][0]}`);
        // favIcon.innerHTML = ; // should add image to icon
        urlContainer.appendChild(favIcon);
        let tabUrl = document.createElement('a');
        tabUrl.setAttribute("class", "tab-url");
        tabUrl.setAttribute("href", urlCache[el][2]);
        tabUrl.innerHTML = urlCache[el][1]; // should add title to
        urlContainer.appendChild(tabUrl);
        tabList.appendChild(urlContainer);

    }

    ///

    // grab the input
    let searchInput = document.getElementById("search-input");
    let submitButton = document.getElementById("search-submit");
    submitButton.addEventListener("click", function() {
      if (search(searchInput.value, objTabs) !== false) {
        const urlAndID = search(searchInput.value, objTabs);
        console.log(urlAndID);
        // var current = tabs[0];
        // chrome.tabs.update(current.id, { pinned: !current.pinned });
        var newURL = urlAndID[1];
        chrome.tabs.remove(urlAndID[2]);
        chrome.tabs.create({ url: urlAndID[1] });
      }
    });
  });
});

function search(str, object) {
  for (let el in object) {
    //   alert(object[el]);
    if (object[el][0].search(str) !== -1) {
      // alert(el);
      // console.log("object[el]:", object[el]);
      // console.log("true");
      return object[el];
    } else {
      // console.log("false");
    }
  }
  alert("oh well!");
  return false;
}
