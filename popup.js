
function getMessage(messageKey) {
    return chrome.i18n.getMessage(messageKey);
}

document.addEventListener('DOMContentLoaded', () => {
    const linksContainer = document.getElementById('links-container');
    const copyAllButton = document.getElementById('copy-all');
    const status = document.getElementById('status');
    const foundLinksTitle = document.getElementById('found-links-title');

    foundLinksTitle.textContent = getMessage('foundLinksTitle');


    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) {
            status.textContent = getMessage('errorNoTab');
            return;
        }

        chrome.tabs.sendMessage(tabs[0].id, { action: "findLinks" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error:', chrome.runtime.lastError);
                status.textContent = getMessage('errorCommunication');
                return;
            }

            if (response && response.links && response.links.length > 0) {
                response.links.forEach(link => {
                    const linkItem = document.createElement('div');
                    linkItem.className = 'link-item';
                    
                    const linkText = document.createElement('a');
                    linkText.href = link;
                    linkText.textContent = link;
                    linkText.target = "_blank";
                    
                    const copyButton = document.createElement('button');
                    copyButton.textContent = getMessage('copyButton');
                    copyButton.className = 'copy-button';
                    copyButton.addEventListener('click', () => {
                        navigator.clipboard.writeText(link).then(() => {
                            status.textContent = getMessage('copiedMessage');
                            setTimeout(() => status.textContent = '', 2000);
                        });
                    });

                    linkItem.appendChild(linkText);
                    linkItem.appendChild(copyButton);
                    linksContainer.appendChild(linkItem);
                });
            } else {
                linksContainer.textContent = getMessage('noLinksFound');
                copyAllButton.disabled = true;
            }
        });
    });

    copyAllButton.textContent = getMessage('copyAllButton');
    copyAllButton.addEventListener('click', () => {
        const links = Array.from(linksContainer.querySelectorAll('a'))
            .map(a => a.href)
            .join('\n');
        
        navigator.clipboard.writeText(links).then(() => {
            status.textContent = getMessage('allCopiedMessage');
            setTimeout(() => status.textContent = '', 2000);
        });
    });
});