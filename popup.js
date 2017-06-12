$(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        $("#submitButton").click(function () {
            var content = $("#content").val();
            var lettersPerSecond = $("#letters-per-second").val();
            console.log(content);
            chrome.tabs.sendMessage(activeTab.id, { type: "write-text", payload: { text: content, lettersPerSecond: lettersPerSecond } });
            window.close();
        });
    });
});