document.addEventListener("DOMContentLoaded", () => {
  const autoDetectCheckbox = document.getElementById("autoDetect");
  const showPopupCheckbox = document.getElementById("showPopup");
  const keywordsInput = document.getElementById("keywords");
  const saveButton = document.getElementById("saveButton");
  const statusMessage = document.getElementById("statusMessage");

  // Charger les préférences existantes
  chrome.storage.sync.get(["autoDetect", "showPopup", "keywords"], (data) => {
    autoDetectCheckbox.checked = data.autoDetect !== false; // Par défaut : activé
    showPopupCheckbox.checked = data.showPopup !== false; // Par défaut : activé
    
    // Charger les mots-clés personnalisés ou utiliser les valeurs par défaut
    if (data.keywords && data.keywords.length > 0) {
      keywordsInput.value = data.keywords.join(", ");
    } else {
      keywordsInput.value = "ingrédients, recette, cuisson, préparation, ingredients, recipe, cooking";
    }
  });

  // Sauvegarder les préférences
  saveButton.addEventListener("click", () => {
    const autoDetect = autoDetectCheckbox.checked;
    const showPopup = showPopupCheckbox.checked;
    
    // Traiter les mots-clés
    const keywordsRaw = keywordsInput.value;
    const keywords = keywordsRaw
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    
    chrome.storage.sync.set({ 
      autoDetect: autoDetect,
      showPopup: showPopup,
      keywords: keywords
    }, () => {
      statusMessage.textContent = "Saved preferences !";
      statusMessage.style.display = "block";
      
      setTimeout(() => {
        statusMessage.style.display = "none";
      }, 3000);
    });
  });
});