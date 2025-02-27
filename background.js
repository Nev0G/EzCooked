// Stocke l'état de la dernière page visitée
let currentPageInfo = {
    isRecipe: false,
    url: ""
  };
  
  // Écoute les messages du content script
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.isRecipe !== undefined) {
      currentPageInfo = {
        isRecipe: message.isRecipe,
        url: message.currentUrl
      };
      
      // Mettre à jour l'icône si c'est une recette
      if (message.isRecipe) {
        chrome.action.setBadgeText({ text: "✓" });
        chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
      } else {
        chrome.action.setBadgeText({ text: "" });
      }
    }
  });
  
  // Quand le popup demande l'état actuel
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getPageInfo") {
      sendResponse(currentPageInfo);
      return true; // important pour les réponses asynchrones
    }
  });