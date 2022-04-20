
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
            if (window.location.host != 'localhost:8080') {
                const html
                    = '<div class="modal-backdrop"></div>'
                    + '<div id="modalWindow" class="modal show fade in">'
                    +   '<div class="modal-dialog modal-dialog-centered">'
                    +     '<div class="modal-content">'
                    +       '<div class="modal-header">'
                    +         '<a class="close" data-dismiss="modal">×</a>'
                    +         '<h4>webrequest</h4>'
                    +       '</div>'
                    +       '<div class="modal-body">'
                    +         '<p>'
                    +           'AAA'
                    +         '</p>'
                    +       '</div>'
                    +       '<div class="modal-footer">'
                    +         '<span class="btn" data-dismiss="modal">'
                    +           'Close'
                    +         '</span>'
                    +       '</div>'
                    +     '</div>'
                    +   '</div>'
                    + '</div>';
                var modal = document.createElement('div');
                modal.innerHTML = html;
                document.body.appendChild(modal);
                document.getElementById("backdrop").style.display = "block"
                document.getElementById("modalWindow").style.display = "block";
                document.getElementById("modalWindow").classList.remove("hide");
                document.getElementById("modalWindow").classList.add("show");
            } else {
                file.click();
            }
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
    let uiData = {
        submitterText: event.submitter.innerHTML,
        submitterWidth: event.submitter.clientWidth
    };
    event.submitter.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    event.submitter.style.width = uiData.submitterWidth+'px';

    if (file.files.length != 0) {
        loadFileContent(file, (content) => {
            fetchResult(event, form, file, uiData, content)
        })
    } else {
        fetchResult(event, form, file, uiData,)
    }
}

function fetchResult(event, form, file, uiData, phpInput) {

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
                    event.submitter.innerHTML = uiData.submitterText;
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
                event.submitter.innerHTML = uiData.submitterText;
            });
        }
    }).catch(() => {
        event.submitter.innerHTML = uiData.submitterText;
    });
}

function applyFormBehaviour(form) {
    const file = appendInputHiddenFile(form);

    form.addEventListener('submit', event => {
        event.preventDefault();
        handleFormSubmit(event, form, file)
    }, false);
}

