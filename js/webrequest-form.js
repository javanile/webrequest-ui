


const forms = document.querySelectorAll('form[webrequest]');
forms.forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();
        console.log("AAAAA");

        let url = form.getAttribute('action')
        if (!url) {
            url = document.location.origin + document.location.pathname;
        }

        console.log("ACTION:", url)
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