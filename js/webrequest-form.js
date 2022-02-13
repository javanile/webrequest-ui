
const forms = document.querySelectorAll('form[webrequest]');
const isHtml = input => /<[a-z]+\d?(\s+[\w-]+=("[^"]*"|'[^']*'))*\s*\/?>|&#?\w+;/i.test(input);

forms.forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();
        const url = form.getAttribute('action') || document.location.origin + document.location.pathname;
        const outputId = form.getAttribute('webrequest') || 'webrequest-output';
        let output = document.getElementById(outputId)
        if (!output) {
            output = document.createElement('div');
            output.setAttribute('id', outputId);
            form.appendChild(output);
        }
        fetch(url, {
            method: 'POST',
            mode: 'no-cors',
        }).then(response => {
            output.parentElement.style.display = 'block';
            //document.getElementById('webrequest-submit-label').style.display = 'inline';
            //document.getElementById('webrequest-submit-spinner').style.display = 'none';
            if (response.headers.get("content-type").startsWith('image/')) {
                return response.blob().then(blob => {
                    let reader = new FileReader();
                    reader.onload = () => {
                        output.innerHTML = '<div class="form-control image-output" id="'+outputId+'-image"></div>';
                        let img = document.createElement('img');
                        img.src = reader.result;
                        document.getElementById(outputId+'-image').appendChild(img);
                    };
                    reader.readAsDataURL(blob);
                });
            } else {
                return response.text().then(text => {
                    if (isHtml(text)) {
                        output.innerHTML = '<div class="form-control html-output" id="'+outputId+'-html"></div>';
                        document.getElementById(outputId+'-html').innerHTML = text;
                    } else {
                        output.innerHTML = '<textarea class="form-control text-output" id="'+outputId+'-textarea" rows="4" readonly></textarea>';
                        document.getElementById(outputId+'-textarea').value = text;
                    }
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