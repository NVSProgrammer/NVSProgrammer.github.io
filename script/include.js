function loadHTML(target, path){
    console.log("load "+path);
    fetch(path).then(res => {
        if(res.ok){
            return res.text;
        } else {
            console.log("load error")
        }
    }).then(htmlPgae => {
        target.innerHTML = htmlPgae;
    });
}