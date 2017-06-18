$.fn.selectRange = function (start, end) {
    if (end === undefined) {
        end = start;
    }
    return this.each(function () {
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(this.childNodes[0], this.innerHTML.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        this.focus();
    });
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === 'write-text') {
            var textToWrite = request.payload.text;
            var lettersPerSecond = request.payload.lettersPerSecond;
            var elementToWriteTo = document.activeElement;
            if (!elementToWriteTo) {
                return;
            }


            var wrappedElement = $(elementToWriteTo);

            wrappedElement.focus();
            writeToElement(wrappedElement, '');

            setTimeout(function () {
                writeTextSlowly(wrappedElement, textToWrite, lettersPerSecond);
            }, 2000);
        }
    }
);

function writeTextSlowly(elementToWriteTo, text, lettersPerSecond) {
    var perSiteAction = getPerSiteActions();

    var position = 0;
    var writingRatio = 1000 / lettersPerSecond;

    var $parent = elementToWriteTo.parent();


    var cancelId;

    cancelId = setInterval(function () {
        perSiteAction();

        position++;
        var shortenedText = text.substr(0, position);

        var detached = elementToWriteTo.detach();

        writeToElement(detached, shortenedText);

        detached.appendTo($parent)
            .selectRange(shortenedText.length);

        if (position === text.length) {
            clearInterval(cancelId);
        }
    }, writingRatio)
}

function getPerSiteActions() {
    if (document.location.href.includes('youtube.com')) {
        var $box = $('.comment-simplebox');
        var $submitButton = $('.comment-simplebox-submit');

        return function () {
            $box.addClass('focus');
            $submitButton.removeAttr('disabled');
        }
    }

    return function () { };
}

function writeToElement(element, value) {
    if (element.is('textarea')) {
        element.val(value);
    } else {
        element.text(value);
    }
}