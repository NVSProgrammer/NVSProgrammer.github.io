const ref = {
    "ABRaceLatch-Code": "#MY_REPO#/School-Projects/blob/main/Arduino/ABRaceLatch/ABRaceLatch.ino"
}

window.onload = function(){
    const urln = new URLSearchParams(window.location.search).get("r");
    console.log(urln)
    if(urln) window.location.href = ref[urln].replace("#MY_REPO#", "https://github.com/NVSProgrammer");
}