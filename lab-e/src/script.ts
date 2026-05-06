const styles: Record<string, string> = {
    "Stylowy Mars": "style-1.css",
    "Futurystyczny Mars": "style-2.css",
    "Tylko Tło": "style-3.css"
};

let currentLink: HTMLLinkElement | null = null;

function changeStyle(styleName: string): void {
    const fileName = styles[styleName];

    if (!fileName) return;

    if (currentLink !== null) {
        currentLink.remove();
    }

    currentLink = document.createElement("link");
    currentLink.rel = "stylesheet";
    

    currentLink.href = `/${fileName}`; 

    document.head.appendChild(currentLink);
    console.log(`[Vite] Styl zmieniony na: ${styleName}`);
}

function createStyleMenu(): void {
    const menuContainer = document.createElement("div");
    
    
    menuContainer.style.padding = "20px";
    menuContainer.style.textAlign = "center";

    Object.keys(styles).forEach(styleName => {
        const button = document.createElement("button");

        button.textContent = styleName;
        button.style.margin = "0 10px";
        button.style.padding = "10px 20px";
        button.style.cursor = "pointer";

        button.addEventListener("click", () => {
            changeStyle(styleName);
        });

        menuContainer.appendChild(button);
    });

    document.body.prepend(menuContainer);
}

// Запуск
createStyleMenu();
changeStyle(Object.keys(styles)[0]);