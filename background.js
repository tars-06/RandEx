chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "bookmark") {
        chrome.storage.sync.get(["bookmarks"], (data) => {
            let bookmarks = data.bookmarks || [];
            if (!bookmarks.includes(request.series)) {
                bookmarks.push(request.series);
                chrome.storage.sync.set({ bookmarks }, () => {
                    sendResponse({ success: true });
                });
            } else {
                sendResponse({ success: false, message: "Already bookmarked" });
            }
        });
        return true;
    } else if (request.action === "getBookmarks") {
        chrome.storage.sync.get(["bookmarks"], (data) => {
            sendResponse({ bookmarks: data.bookmarks || [] });
        });
        return true;
    }
});
