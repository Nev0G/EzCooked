const recipeKeywords = ["ingrédients", "recette", "cuisson", "préparation", "ingredients", "recipe", "cooking"];

// Style pour la notification popup
const popupStyle = `
.cooked-wiki-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: url('https://www.transparenttextures.com/patterns/aged-paper.png'), #fdf6e3;
  border: 2px solid #c49a6c;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  font-family: 'Georgia', serif;
  max-width: 320px;
  animation: slideIn 0.4s ease-out;
  display: flex;
  flex-direction: column;
  text-align: center;
}

@keyframes slideIn {
  from { transform: translateX(120px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.cooked-wiki-popup-title {
  font-weight: bold;
  margin-bottom: 12px;
  color: #8b4513;
  font-size: 16px;
}

.cooked-wiki-popup-button {
  margin-top: 12px;
  padding: 10px;
  background-color: #d2691e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  transition: 0.3s;
}

.cooked-wiki-popup-button:hover {
  background-color: #a0522d;
}

.cooked-wiki-popup-close {
  position: absolute;
  top: 6px;
  right: 10px;
  cursor: pointer;
  font-size: 18px;
  color: #8b4513;
  font-weight: bold;
  transition: 0.3s;
}

.cooked-wiki-popup-close:hover {
  color: #d2691e;
}
`;

function isRecipePage() {
  const pageContent = document.body.innerText.toLowerCase();
  
  // Récupérer les mots-clés personnalisés s'ils existent
  return new Promise((resolve) => {
    chrome.storage.sync.get("keywords", (data) => {
      let keywordsToUse = recipeKeywords;
      
      if (data.keywords && data.keywords.length > 0) {
        keywordsToUse = data.keywords;
      }
      
      const isRecipe = keywordsToUse.some(keyword => pageContent.includes(keyword.toLowerCase()));
      resolve(isRecipe);
    });
  });
}

function createPopupNotification() {
  // Créer un élément style pour les CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = popupStyle;
  document.head.appendChild(styleElement);
  
  // Créer la popup
  const popup = document.createElement('div');
  popup.className = 'cooked-wiki-popup';
  
// Popup content
popup.innerHTML = `
    <span class="cooked-wiki-popup-close">&times;</span>
    <div class="cooked-wiki-popup-title">👨‍🍳 Recipe detected!</div>
    <div>Would you like to see an improved version of this recipe ?</div>
    <div class="cooked-wiki-popup-button">Let’s cook !</div>
`;
  
  // Ajouter au document
  document.body.appendChild(popup);
  
  // Gérer les événements
  const closeButton = popup.querySelector('.cooked-wiki-popup-close');
  closeButton.addEventListener('click', () => {
    popup.remove();
  });
  
  const actionButton = popup.querySelector('.cooked-wiki-popup-button');
  actionButton.addEventListener('click', () => {
    const newUrl = "https://cooked.wiki/" + window.location.href;
    window.location.href = newUrl;
  });
  
  // Auto-fermeture après 10 secondes
  setTimeout(() => {
    if (document.body.contains(popup)) {
      popup.style.animation = 'slideIn 0.3s reverse forwards';
      setTimeout(() => popup.remove(), 300);
    }
  }, 10000);
}

// Fonction pour vérifier si l'URL actuelle contient déjà cooked.wiki
function isAlreadyOnCookedWiki() {
  return window.location.hostname.includes('cooked.wiki') || 
         window.location.href.startsWith('https://cooked.wiki/') ||
         window.location.href.indexOf('://cooked.wiki/') !== -1;
}

// Fonction principale
async function init() {
  // Vérifier d'abord si nous sommes déjà sur cooked.wiki
  if (isAlreadyOnCookedWiki()) {
    console.log('Déjà sur Cooked Wiki - pas de popup nécessaire');
    return; // Ne pas continuer si déjà sur cooked.wiki
  }
  
  // Vérifier les options de l'utilisateur
  chrome.storage.sync.get(["autoDetect", "showPopup"], async (data) => {
    const autoDetect = data.autoDetect !== false; // Par défaut : activé
    const showPopup = data.showPopup !== false; // Par défaut : activé
    
    if (autoDetect) {
      const isRecipe = await isRecipePage();
      
      // Informer le background script
      chrome.runtime.sendMessage({
        isRecipe: isRecipe,
        currentUrl: window.location.href
      });
      
      // Afficher la popup si c'est une recette et l'option est activée
      if (isRecipe && showPopup) {
        // Petite temporisation pour permettre au reste de la page de charger
        setTimeout(createPopupNotification, 1500);
      }
    }
  });
}

// Exécuter l'initialisation
init();