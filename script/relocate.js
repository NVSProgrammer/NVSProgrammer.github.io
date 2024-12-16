const wl = window.location;
const page_html = document.getElementById("page");

function relocate(path, p){
    let target = window;
    for(p < 1; p--;){
        target = target.parent;
    }
    target.location.href = path;
}
function bar_button(value_) {
    switch (value_) {
        case "home":
            page_html.src = "./home.html";
            break;
        case "blog-nwt":
            wl.href = "https://nwt-project.blogspot.com/";
            break;
        case "blog-nvsp":
            wl.href = "https://nvsprogrammer.blogspot.com/";
            break;
        case "vote":
            page_html.src = "./vote.html";
            break;
        case "pref-soft":
            page_html.src= "./pref_soft.html";
            break;
        case "pghr":
            wl.href = "https://github.com/NVSProgrammer/NVSProgrammer.github.io";
            break;
    }
}