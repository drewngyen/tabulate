document.addEventListener("DOMContentLoaded", function() {
  // Find the tabId of the current (active) tab. We could just omit the tabId
  // parameter in the function calls below, and they would act on the current
  // tab by default, but for the purposes of this demo we will always use the
  // API with an explicit tabId to demonstrate its use.
  chrome.tabs.query({ active: true }, function(tabs) {
    if (tabs.length > 1)
      console.log(
        "tabulate old chrome boilerplate"
      );
    tabId = tabs[0].id;
  });
  // boiler plate functionality
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
/// cache data 
    const objTabs = {};
    const urlCache = {};
    const urlMetaCache = {};

    // cache all tab data
    for (let obj of tabs) {
      let lowTitle = obj.title;
      // creates object containing tabID and tab title
      objTabs[obj.id] = [lowTitle.toLowerCase(), obj.url, obj.id];
      // create object that holds colors 
      urlCache[obj.id] = [obj.favIconUrl, obj.title, obj.url];
      // create object of meta data properties of obj
      urlMetaCache[obj.id] = [obj.selected, obj.highlighted, obj.title];
      // arrayTabs.push(obj["title"]);
    }

    // dynamically append tabslist to search popup.html
    let tabList = document.getElementById("current-tabs");
    for (let el in urlCache) {
        // creates a new url link in tablist in popup html
        let urlContainer = document.createElement('div');
        urlContainer.setAttribute("class", "url-container");

        // adds an icon of url tab to url container 
        let favIcon = document.createElement('img');
        favIcon.setAttribute("class", "fav-icons");
        favIcon.setAttribute("src", `${urlCache[el][0]}`);
        urlContainer.appendChild(favIcon);

        // adds url to each title link
        let tabUrl = document.createElement('a');
        tabUrl.setAttribute("class", "tab-url");
        tabUrl.setAttribute("href", urlCache[el][2]);
        tabUrl.innerHTML = urlCache[el][1]; // should add title to
        urlContainer.appendChild(tabUrl);
        tabList.appendChild(urlContainer);

    }

    /// TO-DO
        // [x] ADD SHORTCUT FOR SEARCH.
        // [x] ADDD MORE STYLES

        // [ ] FILTER BY SEARCH

        // [x] remove cache

    // grab the reference to search input
    let searchInput = document.getElementById("search-input");
    let submitButton = document.getElementById("search-submit");
    submitButton.addEventListener("click", function() {
      if (search(searchInput.value, objTabs) !== false) {
        const urlAndID = search(searchInput.value, objTabs);
        console.log(urlAndID);
        // var newURL = urlAndID[1];
        chrome.tabs.remove(urlAndID[2]);
        chrome.tabs.create({ url: urlAndID[1] });
      }
    });
  });
});

function filterSearch() {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('search-input');
    filter = input.value.toLowerCase();
    ul = document.getElementsByClassName('tab-url');
}

// searches for string and returns bool
function search(str, object) {
  for (let el in object) {
    //   alert(object[el]);
    if (object[el][0].search(str) !== -1) {
      return object[el];
    } else {
      // console.log("false");
    }
  }
  alert("Sorry, tab not found! :sad:");
  return false;
}
