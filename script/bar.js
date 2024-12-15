let page_html = document.getElementById("page");

function bar_button(value_) {
    switch (value_) {
        case "home":
            page_html.src = "./home.html";
            break;
        case "blog-nwt":
            window.location.href = "https://nwt-project.blogspot.com/";
            break;
        case "blog-nvsp":
            window.location.href = "https://nvsprogrammer.blogspot.com/";
            break;
        case "vote":
            page_html.src = "./vote.html";
            break;
        case "pref-soft":
            page_html.src= "./pref_soft.html";
            break;
    }
}