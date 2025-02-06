const page_html = document.getElementById("page");
const wl = window.location;

const bar_button_list = [
    document.getElementById("bar-button_home"),
    document.getElementById("bar-button_votes"),
    document.getElementById("bar-button_ps"),
    document.getElementById("bar-button_downloads"),
    document.getElementById("bar-button_guides")
];

const normal_color = "transparent";
const selected_color = "#00aa0045";

var last_index = 0;

function select(i) {
    bar_button_list[last_index].style.backgroundColor = normal_color;
    bar_button_list[i].style.backgroundColor = selected_color;
    last_index = i;
}

select(0);

function bar_button(value_) {
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