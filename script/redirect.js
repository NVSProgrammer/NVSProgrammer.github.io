const ref = {
    "ABRaceLatch-Code": "#MY_REPO#/School-Projects/blob/main/Arduino/ABRaceLatch/ABRaceLatch.ino",
    "ABRaceLatch": "#MY_REPO#/School-Projects",
    "Portfolio": "https://sites.google.com/view/nvsprogrammer-portfolio",
    "OFL_Project": "/pbrand.html"
}

const urln = new URLSearchParams(window.location.search).get("r");
if (urln && urln in ref) window.location.href = ref[urln]
    .replace("#MY_REPO#", "https://github.com/NVSProgrammer");
