const GameMap = {
    Grid: document.getElementById('Grid'),
    Score: null,
    Size: {
        x: 5,
        y: 5
    },
    update: function () {
        // IDK how to get the number of columns and rows
        // This is from StackOverflow https://stackoverflow.com/questions/55204205/a-way-to-count-columns-in-a-responsive-grid
        const gridComputedStyle = window.getComputedStyle(this.Grid);

        // get number of grid rows
        const gridRowCount = gridComputedStyle.getPropertyValue("grid-template-rows").split(" ").length;

        // get number of grid columns
        const gridColumnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;

        this.Size.x = gridColumnCount;
        this.Size.y = gridRowCount;
    }
};

const Snake = {
    status: 0,
    jumpCount: 0,

    Head: {
        e: document.getElementById("Head"),
        x: 1,
        y: 1,
        d: "right"
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
            if (object.className == "wall") this.status = 1;
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
                this.Body[i].x = x;
                this.Body[i].y = y;
            }
            this.Head.px = this.Head.x;
            this.Head.py = this.Head.y;
        } else {
            this.Head.x = px;
            this.Head.y = py;
        }
    },

    interact: function (object) {
        d = this.Head.d;
        if (this.jumpCount > Settings.mjbk && Settings.jump_kill) {
            this.status = -2;
            kill();
        }
        switch (object.className) {
            case "snake":
                if (this.status == 2 || !Settings.self_kill) break;
            case "kill":
                this.status = -1;
                kill();
                break;
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
        let x, y;
        if (this.Body.length > 0) {
            const last = this.Body[this.Body.length - 1];
            x = last.x;
            y = last.y;
            d = last.d;
        } else {
            x = this.Head.x;
            y = this.Head.y;
            d = this.Head.d;
        }
        let newXY = opositNewLocation(x, y, d);
        x = newXY.x;
        y = newXY.y;
        const newElement = document.createElement("div");
        newElement.className = "snake";
        newElement.style.gridColumn = x.toString();
        newElement.style.gridRow = y.toString();
        GameMap.Grid.appendChild(newElement);
        this.Body.unshift({ x: x, y: y, e: newElement });
        if (Settings.OAGrow != "") newObject(Settings.OAGrowth);
        GameMap.Score.innerText = parseInt(GameMap.Score.innerText) + 1;
    }
};

const Settings = {
    dSnakeMove: 300,
    dInputLock: 200,
    dNewObject: 700,
    dGridUpdate: 1000,
    CfKill: [0, 20],
    CfApple: [50, 75],
    CfJump: [76, 83],
    CfWall: [30, 40],
    OAGrow: "wall",
    self_kill: true,
    jump_kill: true,
    mjbk: 5
}

const SElements = {
}

let locked = false;
let pause = false;


document.addEventListener('DOMContentLoaded', function () {
    SElements.dSnakeMove = document.getElementById("smd");
    SElements.dInputLock = document.getElementById("ild");
    SElements.dNewObject = document.getElementById("nrod");
    SElements.dGridUpdate = document.getElementById("gud");
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
    GameMap.Score = document.getElementById("score");
    calceSettings();
    start();
});

function start() {
    update();
    randomNewObject();
    move();
}

function Reset() {
    GameMap.Grid.innerHTML = '<div id="Head">></div>';
    Snake.Head.e = document.getElementById('Head');
    Snake.Head.x = 1;
    Snake.Head.y = 1;
    Snake.Head.d = "right";
    Snake.Body = [];
    GameMap.Score.innerText = "0";
}

function applySettings() {
    // from here is auto fill by Tabnine
    Settings.dSnakeMove = parseInt(SElements.dSnakeMove.value);
    Settings.dInputLock = parseInt(SElements.dInputLock.value);
    Settings.dNewObject = parseInt(SElements.dNewObject.value);
    Settings.dGridUpdate = parseInt(SElements.dGridUpdate.value);
    Settings.CfKill = [parseInt(SElements.CfKillFrom.value), parseInt(SElements.CfKillTo.value)];
    Settings.CfApple = [parseInt(SElements.CfAppleFrom.value), parseInt(SElements.CfAppleTo.value)];
    Settings.CfJump = [parseInt(SElements.CfJumpFrom.value), parseInt(SElements.CfJumpTo.value)];
    Settings.CfWall = [parseInt(SElements.CfWallFrom.value), parseInt(SElements.CfWallTo.value)];
    // end
    if (["wall", "kill", "snake", "jump"].includes(SElements.OAGrow.value)) {
        Settings.OAGrow = SElements.OAGrow.value;
    }
    Settings.self_kill = SElements.self_kill.checked;
    Settings.jump_kill = SElements.jump_kill.checked;
    Settings.mjbk = parseInt(SElements.mjbk.value);
}
function calceSettings() {
    SElements.dSnakeMove.value = Settings.dSnakeMove;
    SElements.dInputLock.value = Settings.dInputLock;
    SElements.dNewObject.value = Settings.dNewObject;
    SElements.dGridUpdate.value = Settings.dGridUpdate;
    // from "SElements.CfKillFrom.value =" is auto fill by Tabnine
    SElements.CfKillFrom.value = Settings.CfKill[0];
    SElements.CfKillTo.value = Settings.CfKill[1];
    SElements.CfAppleFrom.value = Settings.CfApple[0];
    SElements.CfAppleTo.value = Settings.CfApple[1];
    SElements.CfJumpFrom.value = Settings.CfJump[0];
    SElements.CfJumpTo.value = Settings.CfJump[1];
    SElements.CfWallFrom.value = Settings.CfWall[0];
    SElements.CfWallTo.value = Settings.CfWall[1];
    SElements.OAGrow.value = Settings.OAGrow;
    // end
    SElements.self_kill.checked = Settings.self_kill;
    SElements.jump_kill.checked = Settings.jump_kill;
    SElements.mjbk.value = Settings.mjbk;
}

document.addEventListener('keydown', function (event) {
    if (!locked) {
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
        }
        locked = true;
        setTimeout(locked = false, Settings.dInputLock);
    }
});

function move() {
    if (!pause) {
        Snake.move();
        setTimeout(move, Settings.dSnakeMove);
    }
}

function update() {
    if (!pause) {
        GameMap.update();
        setTimeout(update, Settings.dGridUpdate);
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
    while (true) {
        rx = getRandomInt(1, GameMap.Size.x);
        ry = getRandomInt(1, GameMap.Size.y);
        if (!getObject(rx, ry)) {
            const newElement = document.createElement("div");
            newElement.className = class_;
            newElement.style.gridColumn = rx.toString();
            newElement.style.gridRow = ry.toString();
            GameMap.Grid.appendChild(newElement);
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
    alert("You died! Score: " + GameMap.Score.innerText);
    Reset();
}

function opositNewLocation(x, y, d) {
    switch (d) {
        case "right":
            x--;
            break;
        case "left":
            x++;
            break;
        case "up":
            y++;
            break;
        case "down":
            y--;
            break;
    }
    if (x < 1) x = GameMap.Size.x;
    if (y < 1) y = GameMap.Size.y;
    if (x > GameMap.Size.x) x = 1;
    if (y > GameMap.Size.y) y = 1;
    return { x: x, y: y };
}