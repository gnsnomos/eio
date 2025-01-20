function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function getCompanyData() {
    let innerContent = '';
    const allCompanies = document.querySelectorAll("#showresults > div > div.records.round > div");

    allCompanies.forEach(company => {
        innerContent += company.querySelector('div.top > div > div > div > h3 > a').innerText + "\n";
        innerContent += company.querySelector('div.top > div > div > div > p').innerText + "\n";
        innerContent += company.querySelector('div.bottom').innerText + "\n";
        innerContent += company.querySelector("div.top > div > div > figure > div").innerText + "\n\n";
    });
    return innerContent;
}

let content = '';
async function goThroughPages() {
    var i = 0;
    let paginationLi = document.querySelectorAll("#pagination_div2 > ul > li > a");
    let nextButton = paginationLi[paginationLi.length - 2];
    do {
        content += printDetails();

        nextButton.click();
    } while (await new Promise(resolve => setTimeout(() => {
        paginationLi = document.querySelectorAll("#pagination_div2 > ul > li > a");
        nextButton = paginationLi[paginationLi.length - 2];

        resolve(nextButton.title)
    }, 1000)) !== 'current')
    content += printDetails();

    console.log(content);
    copyTextToClipboard(content);
}

let button = document.getElementById('myButton');

if (!button) {
    // Create a button element if it doesn't exist
    button = document.createElement('button');

    // Set button text and id
    button.innerText = 'Click me';
    button.id = 'myButton'; // Add an id to the button
    button.style.width = '100%';
    button.style.backgroundColor = '#5cd639';

    // Append the button to the body
    document.body.prepend(button);

    // Add event listener to button to trigger getData function on click
    button.addEventListener('click', goThroughPages);
}