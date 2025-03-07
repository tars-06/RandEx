document.getElementById("generateBtn").addEventListener("click", async () => {
    let series = document.getElementById("seriesInput").value.trim();
    if (!series){
        let bookmarksList = await new Promise((resolve)=>{
            chrome.storage.sync.get(["bookmarks"], (data)=>resolve(data.bookmarks || []))
        });

        if(bookmarksList.length==0) {document.getElementById("result").textContent="No bookmarks available"; return;}

        series = bookmarksList[Math.floor(Math.random()* bookmarksList.length)];
        try {
            let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer YOUR_API_KEY"
                },
                body: JSON.stringify({
                    model: "MODEL_PATH",
                    messages: [{role: "user", content: `Give me a season and episode number for ${series}, just answer series name followed by season number followerd by episode number`}],
                    max_tokens: 20
                })
            });
    
            let data = await response.json();
            let episode = data.choices?.[0]?.message?.content || "Error fetching episode";
            document.getElementById("result").textContent = `${episode}`;
        } catch (error) {
            console.error("Fetch error:", error);
            document.getElementById("result").textContent = "Error fetching episode";
        }    
        return;
    }

    try {
        let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_API_KEY"
            },
            body: JSON.stringify({
                model: "MODEL_PATH",
                messages: [{role: "user", content: `Give me a season and episode number for ${series}, just answer season number followed by episode number"`}],
                max_tokens: 20
            })
        });

        let data = await response.json();
        let episode = data.choices?.[0]?.message?.content || "Error fetching episode";
        document.getElementById("result").textContent = `${episode}`;
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById("result").textContent = "Error fetching episode";
    }
});


document.getElementById("bookmarkBtn").addEventListener("click", () => {
    let series = document.getElementById("seriesInput").value.trim();
    if (!series) return;
    
    chrome.runtime.sendMessage({ action: "bookmark", series });
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "getBookmarks" }, (response) => {
        updateBookmarks(response.bookmarks || []);
    });
});

function updateBookmarks(bookmarks) {
    let list = document.getElementById("bookmarkList");
    list.innerHTML = "";
    bookmarks.forEach(series => {
        let li = document.createElement("li");
        li.textContent = series;
        list.appendChild(li);
    });
}