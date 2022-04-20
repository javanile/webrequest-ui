
const forms = document.querySelectorAll('form[webrequest]');
const isHtml = input => /<[a-z]+\d?(\s+[\w-]+=("[^"]*"|'[^']*'))*\s*\/?>|&#?\w+;/i.test(input);

forms.forEach(applyFormBehaviour);

function appendInputHiddenFile(form) {
    const file = document.createElement('input');
    file.style.display = 'none';
    file.setAttribute('type', 'file');
    file.addEventListener('change', event => {
        const filePath = file.files[0].name;
        const inputUrl = form.querySelector('input[type=text]');
        inputUrl.value = filePath;
        inputUrl.setAttribute("readonly", true);
    }, false)

    form.querySelectorAll('button[type=button]').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            file.click();
        }, false)
    });

    form.appendChild(file);

    return file;
}

function loadFileContent(inputFile, callback) {
    const file = inputFile.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        callback(contents);
    };
    reader.readAsText(file);
}

function handleFormSubmit(event, form, file) {
    const submitterText = event.submitter.innerHTML;
    const submitterWidth = event.submitter.clientWidth;
    event.submitter.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    event.submitter.style.width = submitterWidth+'px';

    if (file.files.length != 0) {
        loadFileContent(file, (content) => {
            fetchResult(event, form, file, content)
        })
    } else {
        fetchResult(event, form, file)
    }
}

function fetchResult(event, form, file, phpInput) {
    const runLocal = file.files.length != 0

    let url = form.getAttribute('action') || document.location.origin;
    if (runLocal) {
        url = 'http://localhost:8080/run';
    }

    //const url = form.getAttribute('action') || document.location.origin + document.location.pathname;
    const outputId = form.getAttribute('webrequest') || 'webrequest-output';
    const body = new URLSearchParams();
    const headers = {};
    const formData = new FormData(form);
    for (const pair of formData) {
        if (pair[0] != 'Authorization') {
            body.append(pair[0], pair[1]+"");
        } else {
            headers[pair[0]] = pair[1]+"";
        }
    }
    if (runLocal) {
        body.append('_php_input', phpInput);
    }
    let output = document.getElementById(outputId)
    if (!output) {
        output = document.createElement('div');
        output.setAttribute('id', outputId);
        form.appendChild(output);
    }
    console.log("POST", url, formData);
    fetch(url, {
        headers: headers,
        method: 'POST',
        body: body,
        mode: 'cors',
    }).then(response => {
        //output.parentElement.style.display = 'block';
        //document.getElementById('webrequest-submit-label').style.display = 'inline';
        //document.getElementById('webrequest-submit-spinner').style.display = 'none';
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.startsWith('image/')) {
            return response.blob().then(blob => {
                let reader = new FileReader();
                reader.onload = () => {
                    output.innerHTML = '<div class="output-image d-flex flex-grow-1 flex-column"><div id="'+outputId+'-image"></div></div>';
                    let img = document.createElement('img');
                    img.src = reader.result;
                    document.getElementById(outputId+'-image').appendChild(img);
                    event.submitter.innerHTML = submitterText;
                };
                reader.readAsDataURL(blob);
            });
        } else {
            return response.text().then(text => {
                if (isHtml(text)) {
                    output.innerHTML = '<div class="output-html form-control d-flex flex-grow-1 flex-column" id="'+outputId+'-html"></div>';
                    document.getElementById(outputId+'-html').innerHTML = text;
                } else {
                    output.innerHTML = '<textarea class="output-text form-control d-flex flex-grow-1 flex-column" id="'+outputId+'-text" rows="4" readonly></textarea>';
                    document.getElementById(outputId+'-text').value = text;
                }
                event.submitter.innerHTML = submitterText;
            });
        }
    });
}

function applyFormBehaviour(form) {
    const file = appendInputHiddenFile(form);

    form.addEventListener('submit', event => {
        event.preventDefault();
        handleFormSubmit(event, form, file)
    }, false);
}

