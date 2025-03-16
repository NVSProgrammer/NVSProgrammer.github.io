const page_html = document.getElementById("page");
const share_button = document.getElementById("share");
const wl = window.location;

const bar_button_list = [
    document.getElementById("bar-button_home"),
    document.getElementById("bar-button_votes"),
    document.getElementById("bar-button_ps"),
    document.getElementById("bar-button_downloads"),
    document.getElementById("bar-button_guides"),
    document.getElementById("bar-button_anwt")
];

const normal_color = "#00000000";
const selected_color = "#00aa0047";

var last_index = 0;
var lastRef;

window.onload = function () {
    const URLArgs = new URLSearchParams(window.location.search);
    const page = URLArgs.get("page");
    if (page) bar_button(page);
    else bar_button("home");
}

share_button.onclick = async function () {
    const link = "https://nvsprogrammer.github.io/index.html?page=" + lastRef;
    try {
        await navigator.clipboard.writeText(link);
        share_button.style.backgroundImage = "url('./img/icons/success.png')";
        share_button.innerText = "Codied";
    } catch (e) {
        share_button.style.backgroundImage = "url('./img/icons/fail.png')";
        console.error(e);
    }
    setTimeout(function () {
        share_button.style.backgroundImage = "url('./img/icons/share.png')";
        share_button.innerText = "";
    }, 500);
}

function select(i) {
    bar_button_list[last_index].style.backgroundColor = normal_color;
    bar_button_list[i].style.backgroundColor = selected_color;
    last_index = i;
}

function bar_button(value_) {
    lastRef = value_;
    switch (value_) {
        case "home":
            page_html.src = "./home.html";
            select(0);
            break;
        case "votes":
            page_html.src = "./votes.html";
            select(1);
            break;
        case "pref-soft":
            page_html.src = "./pref_soft.html";
            select(2);
            break;
        case "downloads":
            page_html.src = "./downloads.html";
            select(3);
            break;
        case "guides":
            page_html.src = "./guides.html";
            select(4);
            break;
        case "about-nwt":
            page_html.src = "./about_nwt.html";
            select(5);
            break;
        case "blog-nwt":
            wl.href = "https://nwt-project.blogspot.com/";
            break;
        case "blog-nvsp":
            wl.href = "https://nvsprogrammer.blogspot.com/";
            break;
        case "pghr":
            wl.href = "https://github.com/NVSProgrammer/NVSProgrammer.github.io";
            break;
    }
}