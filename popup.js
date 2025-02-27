document.addEventListener("DOMContentLoaded", () => {
  const convertButton = document.getElementById("convertButton");
  const statusText = document.getElementById("statusText");
  
  // Request the current page status from the background script
  chrome.runtime.sendMessage({ action: "getPageInfo" }, (response) => {
    if (response && response.isRecipe) {
      convertButton.style.display = "block";
      statusText.textContent = "Recipe detected!";
      
      convertButton.onclick = () => {
        const newUrl = "https://cooked.wiki/" + response.url;
        chrome.tabs.create({ url: newUrl });
      };
    } else {
      statusText.textContent = "No recipe detected on this page.";
    }
  });
  
  // Link to options page
  document.getElementById("optionsLink").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});
