var pxon = "#ffffff30";
var pxoff = "#00000000";

const GameMap = {
    Grid: document.getElementById('Grid'),
    Score: null,
    Size: {
        x: 5,
        y: 5
    },
    Colors: {
        "snake": "#aaaaaa",
        "apple": "#00ff00",
        "kill": "#ff0000",
        "wall": "#555555",
        "jump": "#0000ff"
    },
    update: function () {
        // This is from StackOverflow https://stackoverflow.com/questions/55204205/a-way-to-count-columns-in-a-responsive-grid
        const gridComputedStyle = window.getComputedStyle(this.Grid);

        // get number of grid rows
        const gridRowCount = gridComputedStyle.getPropertyValue("grid-template-rows").split(" ").length;

        // get number of grid columns
        const gridColumnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;

        this.Size.x = gridColumnCount;
        this.Size.y = gridRowCount;

        debug.gx.innerText = this.Size.x;
        debug.gy.innerText = this.Size.y;
    }
};

const Snake = {
    status: 0,
    jumpCount: 0,

    Head: {
        e: document.getElementById("Head"),
        x: 1,
        y: 1,
        d: "right",
        px: 1,
        py: 1
    },

    Body: [],

    move: function () {
        debug.sm.style.backgroundColor = pxon;
        setTimeout(function () { debug.sm.style.backgroundColor = pxoff; }, Settings.so);
        this.status = 0;
        const px = this.Head.x;
        const py = this.Head.y;
        let newXY = newLocation(this.Head.x, this.Head.y, this.Head.d);
        this.Head.x = newXY.x;
        this.Head.y = newXY.y;
        let object = getObject(this.Head.x, this.Head.y);
        if (object) {
            if (object.className == "wall") {
                this.status = 1;
                debug.so.style.backgroundColor = GameMap.Colors.wall;
            }
            else this.interact(object);
        } else {
            this.status = 0;
            this.jumpCount = 0;
        }
        this.debugS();
        if (this.status != 1) {
            this.status = 0;
            this.Head.e.style.gridColumn = this.Head.x.toString();
            this.Head.e.style.gridRow = this.Head.y.toString();
            if (this.Body.length > 0) for (let i = 0; i < this.Body.length; i++) {
                let x, y;
                if (i == this.Body.length - 1) {
                    x = this.Head.px;
                    y = this.Head.py;
                } else {
                    x = this.Body[i + 1].x;
                    y = this.Body[i + 1].y;
                }
                this.Body[i].e.style.gridColumn = x.toString();
                this.Body[i].e.style.gridRow = y.toString();
                if (i != this.Body.length - 1) {
                    this.Body[i + 1].px = x;
                    this.Body[i + 1].py = y;
                }
                this.Body[i].x = x;
                this.Body[i].y = y;
            }
            this.Head.px = this.Head.x;
            this.Head.py = this.Head.y;
        } else {
            this.Head.x = px;
            this.Head.y = py;
        }
        debug.sx.innerText = Snake.Head.x;
        debug.sy.innerText = Snake.Head.y;
        this.debugS();
    },

    interact: function (object) {
        d = this.Head.d;
        this.debugS();
        if (this.jumpCount > Settings.mjbk && Settings.jump_kill) {
            this.status = -2;
            kill();
        }
        switch (object.className) {
            case "snake":
                if (this.status == 2 || !Settings.self_kill) break;
                this.status = -3;
                debug.so.style.backgroundColor = GameMap.Colors["snake"];
                kill();
                break;
            case "kill":
                this.status = -1;
                debug.so.style.backgroundColor = GameMap.Colors["kill"];
                kill();
                break;
            case "apple":
                this.status = 3;
                this.jumpCount = 0;
                debug.so.style.backgroundColor = GameMap.Colors["apple"];
                this.grow();
                object.remove();
                break;
            case "jump":
                this.status = 2;
                this.debugS();
                debug.so.style.backgroundColor = GameMap.Colors["jump"];
                do {
                    newXY = newLocation(this.Head.x, this.Head.y, d);
                    object = getObject(newXY.x, newXY.y);
                    this.Head.x = newXY.x;
                    this.Head.y = newXY.y;
                    if (object) this.interact(object);
                } while (object && (object.className == "wall" || object.className == "snake"));
                this.jumpCount++;
                break;
        }
    },

    grow: function () {
        debug.sg.style.backgroundColor = pxon;
        setTimeout(function () { debug.sg.style.backgroundColor = pxoff; }, Settings.so);
        let x, y;
        if (this.Body.length > 0) {
            const last = this.Body[this.Body.length - 1];
            x = last.px;
            y = last.py;
        } else {
            x = this.Head.px;
            y = this.Head.py;
        }
        const newElement = document.createElement("div");
        newElement.className = "snake";
        newElement.style.gridColumn = x.toString();
        newElement.style.gridRow = y.toString();
        GameMap.Grid.appendChild(newElement);
        this.Body.unshift({ px: x, py: y, x: x, y: y, e: newElement });
        if (Settings.OAGrow != "" && this.status != 4) newObject(Settings.OAGrow);
        GameMap.Score.innerText = parseInt(GameMap.Score.innerText) + 1;
    },
    debugLocked: false,
    debugS: function () {
        if (!this.debugLocked) {
            this.debugLocked = true;
            debug.ss.innerText = Snake.status;
            setTimeout(function () { this.debugLocked = false; }, Settings.so);
        }
    }
};

const KillHead = {
    status: 0,
    jumpCount: 0,

    Head: {
        e: document.getElementById("KillHead"),
        x: 5,
        y: 10,
        d: "right",
        px: 1,
        py: 1
    },

    Body: [],

    move: function () {
        this.status = 0;
        const px = this.Head.x;
        const py = this.Head.y;
        let newXY = newLocation(this.Head.x, this.Head.y, this.Head.d);
        this.Head.x = newXY.x;
        this.Head.y = newXY.y;
        let object = getObject(this.Head.x, this.Head.y);
        if (object) {
            if (object.className == "wall") {
                this.status = 1;
            }
            else this.interact(object);
        } else {
            this.status = 0;
            this.jumpCount = 0;
        }
        if (this.status != 1) {
            this.status = 0;
            this.Head.e.style.gridColumn = this.Head.x.toString();
            this.Head.e.style.gridRow = this.Head.y.toString();
            if (this.Body.length > 0) for (let i = 0; i < this.Body.length; i++) {
                let x, y;
                if (i == this.Body.length - 1) {
                    x = this.Head.px;
                    y = this.Head.py;
                } else {
                    x = this.Body[i + 1].x;
                    y = this.Body[i + 1].y;
                }
                this.Body[i].e.style.gridColumn = x.toString();
                this.Body[i].e.style.gridRow = y.toString();
                if (i != this.Body.length - 1) {
                    this.Body[i + 1].px = x;
                    this.Body[i + 1].py = y;
                }
                this.Body[i].x = x;
                this.Body[i].y = y;
            }
            this.Head.px = this.Head.x;
            this.Head.py = this.Head.y;
        } else {
            this.Head.x = px;
            this.Head.y = py;
        }
        let randomNumber = getRandomInt(1, 100);
        if(randomNumber >= 0 && randomNumber < 25) this.Head.d = "left";
        if(randomNumber >= 25 && randomNumber < 50) this.Head.d = "right";
        if(randomNumber >= 50 && randomNumber < 75) this.Head.d = "up";
        if(randomNumber >= 75 && randomNumber <= 100) this.Head.d = "down";
    },

    interact: function (object) {
        d = this.Head.d;
        if (this.jumpCount > Settings.mjbk && Settings.jump_kill) {
            this.status = -2;
            kill();
        }
        switch (object.className) {
            case "apple":
                this.status = 3;
                this.jumpCount = 0;
                this.grow();
                object.remove();
                break;
            case "jump":
                this.status = 2;
                do {
                    newXY = newLocation(this.Head.x, this.Head.y, d);
                    object = getObject(newXY.x, newXY.y);
                    this.Head.x = newXY.x;
                    this.Head.y = newXY.y;
                    if (object) this.interact(object);
                } while (object && (object.className == "wall" || object.className == "snake"));
                this.jumpCount++;
                break;
        }
    },

    grow: function () {
        setTimeout(function () { debug.sg.style.backgroundColor = pxoff; }, Settings.so);
        let x, y;
        if (this.Body.length > 0) {
            const last = this.Body[this.Body.length - 1];
            x = last.px;
            y = last.py;
        } else {
            x = this.Head.px;
            y = this.Head.py;
        }
        const newElement = document.createElement("div");
        newElement.className = "kill";
        newElement.style.gridColumn = x.toString();
        newElement.style.gridRow = y.toString();
        GameMap.Grid.appendChild(newElement);
        this.Body.unshift({ px: x, py: y, x: x, y: y, e: newElement });
    }
};

const Settings = {
    dSnakeMove: 300,
    dInputLock: 200,
    dNewObject: 700,
    CfKill: [0, 20],
    CfApple: [50, 73],
    CfJump: [76, 79],
    CfWall: [30, 53],
    OAGrow: "kill",
    self_kill: true,
    jump_kill: true,
    mjbk: 5,
    crdc: false,
    crd: 100,
    so: 300
}

const SElements = {}
const debug = {}

let locked = false;
let pause = false;


document.addEventListener('DOMContentLoaded', function () {
    SElements.dSnakeMove = document.getElementById("smd");
    SElements.dInputLock = document.getElementById("ild");
    SElements.dNewObject = document.getElementById("nrod");
    SElements.CfKillFrom = document.getElementById("cfkf");
    SElements.CfKillTo = document.getElementById("cfkt");
    SElements.CfAppleFrom = document.getElementById("cfaf");
    SElements.CfAppleTo = document.getElementById("cfat");
    SElements.CfJumpFrom = document.getElementById("cfjf");
    SElements.CfJumpTo = document.getElementById("cfjt");
    SElements.CfWallFrom = document.getElementById("cfwf");
    SElements.CfWallTo = document.getElementById("cfwt");
    SElements.OAGrow = document.getElementById("oag");
    SElements.self_kill = document.getElementById("sk");
    SElements.jump_kill = document.getElementById("jk");
    SElements.mjbk = document.getElementById("mjbk");
    SElements.crd = document.getElementById("crd");
    SElements.crdc = document.getElementById("crdc");
    GameMap.Score = document.getElementById("score");
    SElements.e = document.getElementById("settings");

    // debug elements
    SElements.so = document.getElementById("so");

    debug.e = document.getElementById("debug");
    debug.gx = document.getElementById("gx");
    debug.gy = document.getElementById("gy");
    debug.sm = document.getElementById("sm");
    debug.sg = document.getElementById("sg");
    debug.sd = document.getElementById("d");
    debug.sx = document.getElementById("sx");
    debug.sy = document.getElementById("sy");
    debug.so = document.getElementById("object");
    debug.ss = document.getElementById("status");

    debug.il_ = document.getElementById("il_");

    debug.no = document.getElementById("no");
    debug.ox = document.getElementById("ox");
    debug.oy = document.getElementById("oy");
    debug.nos = document.getElementById("nos");

    cancelSettings();
    cso();
    start();
});

function aso() { Settings.so = parseInt(SElements.so.value); }
function cso() { SElements.so.value = Settings.so; }

function start() {
    GameMap.update();
    randomNewObject();
    move();
}

function Reset() {
    let d = 100;

    // restart delay
    if (Settings.crdc) d = Settings.crd;
    else d = Math.max(Settings.dNewObject, Settings.dInputLock, Settings.dSnakeMove);

    GameMap.Grid.innerHTML = '<div id="Head">></div>';
    Snake.Head.e = document.getElementById('Head');
    Snake.Head.x = 1;
    Snake.Head.y = 1;
    Snake.Head.d = "right";
    Snake.Body = [];
GameMap.Grid.innerHTML = '<div id="KillHead">></div>';
    KillHead.Head.e = document.getElementById('KillHead');
    KillHead.Head.x = 5;
    KillHead.Head.y = 10;
    KillHead.Head.d = "right";
    KillHead.Body = [];
    GameMap.Score.innerText = "0";
    pause = true;
    setTimeout(function () {
        pause = false;
        start();
    }, d)
}

function applySettings() {
    Settings.dSnakeMove = parseInt(SElements.dSnakeMove.value);
    Settings.dInputLock = parseInt(SElements.dInputLock.value);
    Settings.dNewObject = parseInt(SElements.dNewObject.value);
    Settings.crd = parseInt(SElements.crd.value);
    Settings.CfKill = [parseInt(SElements.CfKillFrom.value), parseInt(SElements.CfKillTo.value)];
    Settings.CfApple = [parseInt(SElements.CfAppleFrom.value), parseInt(SElements.CfAppleTo.value)];
    Settings.CfJump = [parseInt(SElements.CfJumpFrom.value), parseInt(SElements.CfJumpTo.value)];
    Settings.CfWall = [parseInt(SElements.CfWallFrom.value), parseInt(SElements.CfWallTo.value)];
    if (["wall", "kill", "d-snake", "a-snake", "jump", "apple"].includes(SElements.OAGrow.value)) Settings.OAGrow = SElements.OAGrow.value;
    else SElements.OAGrow.value = Settings.OAGrow;
    Settings.self_kill = SElements.self_kill.checked;
    Settings.jump_kill = SElements.jump_kill.checked;
    Settings.crdc = SElements.crdc.checked;
    Settings.mjbk = parseInt(SElements.mjbk.value);
}
function cancelSettings() {
    SElements.dSnakeMove.value = Settings.dSnakeMove;
    SElements.dInputLock.value = Settings.dInputLock;
    SElements.dNewObject.value = Settings.dNewObject;
    SElements.CfKillFrom.value = Settings.CfKill[0];
    SElements.CfKillTo.value = Settings.CfKill[1];
    SElements.CfAppleFrom.value = Settings.CfApple[0];
    SElements.CfAppleTo.value = Settings.CfApple[1];
    SElements.CfJumpFrom.value = Settings.CfJump[0];
    SElements.CfJumpTo.value = Settings.CfJump[1];
    SElements.CfWallFrom.value = Settings.CfWall[0];
    SElements.CfWallTo.value = Settings.CfWall[1];
    SElements.OAGrow.value = Settings.OAGrow;
    SElements.self_kill.checked = Settings.self_kill;
    SElements.jump_kill.checked = Settings.jump_kill;
    SElements.crdc.checked = Settings.crdc;
    SElements.crd.value = Settings.crd;
    SElements.mjbk.value = Settings.mjbk;
}

document.addEventListener('keydown', function (event) {
    if (!locked) {
        debug.il_.style.backgroundColor = pxon;
        if (!pause) {
            switch (event.code) {
                case "ArrowRight":
                case "KeyD":
                    Snake.Head.d = "right";
                    Snake.Head.e.innerText = ">";
                    break;
                case "ArrowLeft":
                case "KeyA":
                    Snake.Head.d = "left";
                    Snake.Head.e.innerText = "<";
                    break;
                case "ArrowUp":
                case "KeyW":
                    Snake.Head.d = "up";
                    Snake.Head.e.innerText = "/\\";
                    break;
                case "ArrowDown":
                case "KeyS":
                    Snake.Head.d = "down";
                    Snake.Head.e.innerText = "\\/";
                    break;
            }
            debug.sd.innerText = Snake.Head.d;
            locked = true;
        }
        switch (event.code) {
            case "Escape":
                window.location.href = "index.html";
                break;
            case "Space":
                pause = !pause;
                start();
                break;
            case "KeyR":
                Reset();
                break
            case "KeyC":
                if (SElements.e.style.visibility == "hidden") SElements.e.style.visibility = "visible";
                else SElements.e.style.visibility = "hidden";
                break;
            case "KeyB":
                if (debug.e.style.visibility == "hidden") debug.e.style.visibility = "visible";
                else debug.e.style.visibility = "hidden";
                break;
        }
        setTimeout(function () {
            locked = false;
            debug.il_.style.backgroundColor = pxoff;
        }, Settings.dInputLock);
    }
});

function move() {
    if (!pause) {
        Snake.move();
        KillHead.move();

        let randomNumber = getRandomInt(1, 100);
        if(randomNumber > 70) KillHead.grow();

        setTimeout(move, Settings.dSnakeMove);
    }
}

function randomNewObject() {
    if (!pause) {
        if (Snake.status == 0) {
            let randomNumber = getRandomInt(1, 100);
            if (randomNumber >= Settings.CfKill[0] && randomNumber <= Settings.CfKill[1]) newObject("kill");
            if (randomNumber >= Settings.CfApple[0] && randomNumber <= Settings.CfApple[1]) newObject("apple");
            if (randomNumber >= Settings.CfJump[0] && randomNumber <= Settings.CfJump[1]) newObject("jump");
            if (randomNumber >= Settings.CfWall[0] && randomNumber <= Settings.CfWall[1]) newObject("wall");
        }
        setTimeout(randomNewObject, Settings.dNewObject);
    }
}

function newObject(class_) {
    let rx, ry;
    if (class_ == "d-snake") class_ = "snake";
    else if (class_ == "a-snake") {
        Snake.status = 4;
        Snake.grow();
        Snake.status = 0;
        return true;
    }
    debug.nos.style.backgroundColor = pxon;
    setTimeout(function () { debug.nos.style.backgroundColor = pxoff; }, Settings.so);
    debug.no.style.backgroundColor = GameMap.Colors[class_];
    while (true) {
        rx = getRandomInt(1, GameMap.Size.x);
        ry = getRandomInt(1, GameMap.Size.y);
        if (!getObject(rx, ry)) {
            const newElement = document.createElement("div");
            newElement.className = class_;
            newElement.style.gridColumn = rx.toString();
            newElement.style.gridRow = ry.toString();
            GameMap.Grid.appendChild(newElement);
            debug.ox.innerText = rx;
            debug.oy.innerText = ry;
            break;
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getObject(x, y) {
    const objects = GameMap.Grid.querySelectorAll("*");
    for (const object of objects) {
        if (object.style.gridColumn == x && object.style.gridRow == y) return object;
    }
    return null;
}

function newLocation(x, y, d) {
    switch (d) {
        case "right":
            x++;
            break;
        case "left":
            x--;
            break;
        case "up":
            y--;
            break;
        case "down":
            y++;
            break;
    }
    if (x < 1) x = GameMap.Size.x;
    if (y < 1) y = GameMap.Size.y;
    if (x > GameMap.Size.x) x = 1;
    if (y > GameMap.Size.y) y = 1;
    return { x: x, y: y };
}

function kill() {
    Snake.debugS();
    alert("You died! Score: " + GameMap.Score.innerText);
    Reset();
}
