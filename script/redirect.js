const ref = {
    "ABRace_Latch": "https://github.com/NVSProgrammer/School-Projects/blob/main/Arduino/ABRaceLatch/ABRaceLatch.ino"
}

window.onload = function(){
    const urln = new URLSearchParams(window.location.search).get("r");
    if(urln) window.location.href = ref[urln]
}