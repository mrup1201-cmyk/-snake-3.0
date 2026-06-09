const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const grid = 20;
let snake, dir, food, score, interval;

let settings = {
    control: "swipe",
    speed: 110
};

let best = localStorage.getItem("best") || 0;
document.getElementById("best").innerText = "Рекорд: " + best;

function init(){
    snake = [{x:10,y:10}];
    dir = {x:1,y:0};
    score = 0;
    spawnFood();
}

function spawnFood(){
    food = {
        x: Math.floor(Math.random()*20),
        y: Math.floor(Math.random()*20)
    };
}

function game(){
    const head = {
        x: snake[0].x + dir.x,
        y: snake[0].y + dir.y
    };

    snake.unshift(head);

    if(head.x === food.x && head.y === food.y){
        score++;
        spawnFood();
        if(score > best){
            best = score;
            localStorage.setItem("best", best);
        }
    } else {
        snake.pop();
    }

    if(head.x<0||head.y<0||head.x>=20||head.y>=20){
        reset();
    }

    draw();
}

function draw(){
    ctx.fillStyle="#111827";
    ctx.fillRect(0,0,400,400);

    ctx.fillStyle="red";
    ctx.fillRect(food.x*grid, food.y*grid, grid, grid);

    ctx.fillStyle="lime";
    snake.forEach(s=>{
        ctx.fillRect(s.x*grid, s.y*grid, grid-2, grid-2);
    });
}

function startGame(){
    document.getElementById("menu").classList.add("hidden");
    init();
    clearInterval(interval);
    interval = setInterval(game, settings.speed);
}

function reset(){
    clearInterval(interval);
    alert("Game Over");
    document.getElementById("menu").classList.remove("hidden");
}

function openSettings(){
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("settings").classList.remove("hidden");
}

function backMenu(){
    document.getElementById("settings").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}

function saveSettings(){
    settings.control = document.getElementById("controlType").value;
    settings.speed = +document.getElementById("speed").value;
    localStorage.setItem("settings", JSON.stringify(settings));
    backMenu();
}

/* управление стрелками */
document.addEventListener("keydown", e=>{
    if(e.key==="ArrowUp" && dir.y===0) dir={x:0,y:-1};
    if(e.key==="ArrowDown" && dir.y===0) dir={x:0,y:1};
    if(e.key==="ArrowLeft" && dir.x===0) dir={x:-1,y:0};
    if(e.key==="ArrowRight" && dir.x===0) dir={x:1,y:0};
});

/* свайпы */
let sx, sy;

canvas.addEventListener("touchstart", e=>{
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e=>{
    if(settings.control !== "swipe") return;

    let dx = e.changedTouches[0].clientX - sx;
    let dy = e.changedTouches[0].clientY - sy;

    if(Math.abs(dx) > Math.abs(dy)){
        if(dx > 0 && dir.x===0) dir={x:1,y:0};
        else if(dx < 0 && dir.x===0) dir={x:-1,y:0};
    } else {
        if(dy > 0 && dir.y===0) dir={x:0,y:1};
        else if(dy < 0 && dir.y===0) dir={x:0,y:-1};
    }
});
