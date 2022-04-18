
const forms = document.querySelectorAll('form[webrequest]');
const isHtml = input => /<[a-z]+\d?(\s+[\w-]+=("[^"]*"|'[^']*'))*\s*\/?>|&#?\w+;/i.test(input);

forms.forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();
        const submitterText = event.submitter.innerHTML;
        const submitterWidth = event.submitter.clientWidth;
        console.log("TEST!");
        event.submitter.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        event.submitter.style.width = submitterWidth+'px';
        const url = form.getAttribute('action') || document.location.origin;
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
    }, false);
});

//const paragraphs = document.querySelectorAll('p');
/*
document.getElementById('webrequest-submit').addEventListener('click', event => {
    event.preventDefault();
    let url = location.origin + location.pathname;
    //document.getElementById('webrequest-result').value = 'Loading...';
    document.getElementById('webrequest-submit-label').style.display = 'none';
    document.getElementById('webrequest-submit-spinner').style.display = 'inline-block';
    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
    }).then(response => {
        document.getElementById('webrequest-result-panel').style.display = 'block';
        document.getElementById('webrequest-submit-label').style.display = 'inline';
        document.getElementById('webrequest-submit-spinner').style.display = 'none';
        if (response.headers.get("content-type").startsWith('image/')) {
            return response.blob().then(blob => {
                let reader = new FileReader();
                reader.onload = () => {
                    document.getElementById('webrequest-result-output').innerHTML = '<div class="form-control image-output" id="webrequest-result"></div>';
                    let img = document.createElement('img');
                    img.src = reader.result;
                    document.getElementById('webrequest-result').appendChild(img);
                };
                reader.readAsDataURL(blob);
            });
        } else {
            return response.text().then(text => {
                if (isHtml(text)) {
                    document.getElementById('webrequest-result-output').innerHTML = '<div class="form-control html-output" id="webrequest-result"></div>';
                    document.getElementById('webrequest-result').innerHTML = text;
                } else {
                    document.getElementById('webrequest-result-output').innerHTML = '<textarea class="form-control text-output" id="webrequest-result" rows="4" readonly></textarea>';
                    document.getElementById('webrequest-result').value = text;
                }
            });
        }
    });
}, false);
*/