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
    const allCompanies = document.querySelectorAll('#content > div.cells.three > section .cell-data');
    let output = '';
    allCompanies.forEach(company => {
        if (output !== '') {
            output += "\n\n";
        }
        output += company.querySelector('[itemprop="name"]').innerText + "\n";
        output += company.querySelector('address').innerText.replace("\n\n", "\n") + "\n";
        output += Array.from(company.querySelectorAll('[itemprop="telephone"]')).filter(tel => tel.innerText !== '').map(tel => tel.innerText) + "\n";

        const ps = company.querySelectorAll('p');
        output += ps[ps.length - 1].innerText;
    });

    console.log(output);
    copyTextToClipboard(output);
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
    button.addEventListener('click', getCompanyData);
}