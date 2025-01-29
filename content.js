const services = [
    "rapidgator.net",
    "vikingfiles.com",
    "turbobit.net",
    "dailyuploads.net",
    "mixdrop.co",
    "1fichier.com"
];

function findLinks() {
    const links = [];
    const regex = new RegExp(`https?://(?:www\\.)?(${services.join('|')})/[^"\\s'<>]+`, 'gi');

    const pageText = document.body.innerText;
    let match;
    while ((match = regex.exec(pageText)) !== null) {
        if (!links.includes(match[0])) {
            links.push(match[0]);
        }
    }

    document.querySelectorAll('a').forEach(a => {
        const href = a.href;
        if (href && services.some(service => href.includes(service))) {
            if (!links.includes(href)) {
                links.push(href);
            }
        }
    });

    return links;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "findLinks") {
        const links = findLinks();
        sendResponse({ links: links });
    }
    return true; 
});

console.log("Content script loaded and ready!");