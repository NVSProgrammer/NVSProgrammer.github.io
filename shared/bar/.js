let window_l = window.parent.location

function bar_button(value_) {
    switch (value_) {
        case "home":
            window_l.href = "../../index.html";
            break;
        case "blog-nwt":
            window_l.href = "https://nwt-project.blogspot.com/";
            break;
        case "blog-nvsp":
            window_l.href = "https://nvsprogrammer.blogspot.com/";
            break;
        case "vote":
            window_l.href = "../../vote.html";
            break;
        case "pref-soft":
            window_l.href= "../../pref_soft.html";
            break;
    }
}