function loadHTML(target, path) {
    console.log("load " + path);
    fetch(path)
        .then(res => {
            if (res.ok) {
                return res.text();
            } else {
                throw new Error("Load error");
            }
        })
        .then(htmlContent => {
            target.innerHTML = htmlContent;
        })
        .catch(err => console.error(err));
}
