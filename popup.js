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

    // cache all tab data
    for (let obj of tabs) {
      let lowTitle = obj.title;
      // creates object containing tabID and tab title
      objTabs[obj.id] = [lowTitle.toLowerCase(), obj.url, obj.id, obj.windowId];
      // create object that holds colors
      urlCache[obj.id] = [obj.favIconUrl, obj.title, obj.url];
      urlMetaCache[obj.id] = [obj.selected, obj.highlighted, obj.title];
      // arrayTabs.push(obj["title"]);
    }

    // dynamically append tabslist to search popup.html
    let tabList = document.getElementById("current-tabs");
    for (let el in urlCache) {
      let urlContainer = document.createElement("div");
      urlContainer.setAttribute("class", "url-container");
      let favIcon = document.createElement("img");
      favIcon.setAttribute("class", "fav-icons");
      favIcon.setAttribute("src", `${urlCache[el][0]}`);
      // favIcon.innerHTML = ; // should add image to icon
      urlContainer.appendChild(favIcon);
      let tabUrl = document.createElement("a");
      tabUrl.setAttribute("class", "tab-url");
      tabUrl.setAttribute("href", urlCache[el][2]);
      tabUrl.innerHTML = urlCache[el][1]; // should add title to
      urlContainer.appendChild(tabUrl);
      tabList.appendChild(urlContainer);
    }

    ///
    // ADD SHORTCUT FOR SEARCH.
    // ADDD MORE STYLES

    // Local storage, iterate all elements into storage

    // remove cache

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

    // reduce tabs
    const copy = { ...objTabs };
    let reduceArr = []; // grabs properties of open tabs
    let cacheURL = []; // cache all URLs only
    for (let el in copy) {
      reduceArr.push(copy[el][2]);

      // cacheURL.push(copy[el][1]);
    }
    console.log("this cacheUrl:", cacheURL);
    reduceArr = reduceArr.slice(1);
    // test element
    // saveStorage("test1", "value1");
    let reduceButton = document.getElementById("reduce-submit");
    reduceButton.addEventListener("click", function() {
      for (let url in urlCache) {
        saveStorage(url, urlCache[url][2]);
      }
      chrome.tabs.remove(reduceArr);
    });
    console.log("res", cacheURL);
    //undo reduce
    // console.log("cacheURl in loop ", cacheURL);
    let undoButton = document.getElementById("undo-submit");
    let storage = localStorage;
    console.log("storage: ", storage);
    undoButton.addEventListener("click", function() {
      console.log("urclCache ", urlCache);
      // logic for storage here
      let localStorageKeys = []; // grabs list of keys
      for (let i = 0; i < localStorage.length; i++) {
        localStorageKeys.push(localStorage.key(i));
      }
      console.log("storage keys: ", localStorageKeys);
      for (let value of localStorageKeys) {
        let url = getStorage(value); // value = key, getStorage retrives value from key(value)
        console.log("reduce test: ", url);
        // window.open(ele, "_blank");
        chrome.tabs.create({ url: url });
        // removes key elements test
        removeItem(value);
        localStorageKeys = [];
      }
      // window.localStorage.clear();
    });
  });
});

function filterSearch() {
  let input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("search-input");
  filter = input.value.toLowerCase();
  ul = document.getElementsByClassName("tab-url");
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
  alert("oh well!");
  return false;
}
function saveStorage(key, value) {
  localStorage.setItem(key, value);
}

function getStorage(key) {
  return localStorage.getItem(key);
}
function removeItem(key) {
  localStorage.removeItem(key);
  console.log(`${key} deleted!!`);
}
