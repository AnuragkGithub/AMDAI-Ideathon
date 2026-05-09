const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const overlay = document.getElementById('overlay');

const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');

const startBtn = document.getElementById('startBtn');

const tile = 30;
const tiles = canvas.width / tile;

let snake;
let food;

let velocityX;
let velocityY;

let score;
let level;

let gameRunning = false;

function initGame(){

  snake = [
    {x:10,y:10},
    {x:9,y:10},
    {x:8,y:10}
  ];

  velocityX = 1;
  velocityY = 0;

  score = 0;
  level = 1;

  spawnFood();

  gameRunning = true;

  overlay.style.display = 'none';

  gameLoop();
}

function spawnFood(){

  food = {

    x:Math.floor(Math.random()*tiles),
    y:Math.floor(Math.random()*tiles)
  };
}

function gameLoop(){

  if(!gameRunning) return;

  update();

  render();

  setTimeout(()=>{

    requestAnimationFrame(gameLoop);

  },100 - level*5);
}

function update(){

  const head = {

    x:snake[0].x + velocityX,
    y:snake[0].y + velocityY
  };

  if(head.x < 0) head.x = tiles-1;
  if(head.y < 0) head.y = tiles-1;

  if(head.x >= tiles) head.x = 0;
  if(head.y >= tiles) head.y = 0;

  for(let part of snake){

    if(head.x === part.x &&
       head.y === part.y){

      endGame();
      return;
    }
  }

  snake.unshift(head);

  if(head.x === food.x &&
     head.y === food.y){

    score += 10;

    if(score % 50 === 0){

      level++;
    }

    scoreEl.innerText = score;
    levelEl.innerText = level;

    spawnFood();

  }else{

    snake.pop();
  }
}

function render(){

  ctx.fillStyle = 'rgba(1,3,9,0.18)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  drawGrid();

  drawFood();

  drawSnake();
}

function drawGrid(){

  ctx.strokeStyle = 'rgba(0,255,255,0.08)';

  for(let i=0;i<tiles;i++){

    ctx.beginPath();

    ctx.moveTo(i*tile,0);
    ctx.lineTo(i*tile,canvas.height);

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(0,i*tile);
    ctx.lineTo(canvas.width,i*tile);

    ctx.stroke();
  }
}

function drawSnake(){

  snake.forEach((part,index)=>{

    const x = part.x * tile;
    const y = part.y * tile;

    ctx.shadowBlur = 40;
    ctx.shadowColor = '#00f5ff';

    const gradient = ctx.createLinearGradient(
      x,
      y,
      x + tile,
      y + tile
    );

    gradient.addColorStop(0,'#00f5ff');
    gradient.addColorStop(1,'#00ff88');

    ctx.fillStyle = gradient;

    roundRect(
      x+3,
      y+3,
      tile-6,
      tile-6,
      12
    );
  });

  ctx.shadowBlur = 0;
}

function drawFood(){

  const x = food.x * tile;
  const y = food.y * tile;

  const pulse =
    8 + Math.sin(Date.now()*0.01)*2;

  ctx.shadowBlur = 45;
  ctx.shadowColor = '#ff00ff';

  ctx.fillStyle = '#ff00ff';

  ctx.beginPath();

  ctx.arc(
    x + tile/2,
    y + tile/2,
    pulse,
    0,
    Math.PI*2
  );

  ctx.fill();

  ctx.shadowBlur = 0;
}

function roundRect(x,y,w,h,r){

  ctx.beginPath();

  ctx.moveTo(x+r,y);

  ctx.lineTo(x+w-r,y);

  ctx.quadraticCurveTo(x+w,y,x+w,y+r);

  ctx.lineTo(x+w,y+h-r);

  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);

  ctx.lineTo(x+r,y+h);

  ctx.quadraticCurveTo(x,y+h,x,y+h-r);

  ctx.lineTo(x,y+r);

  ctx.quadraticCurveTo(x,y,x+r,y);

  ctx.closePath();

  ctx.fill();
}

function endGame(){

  gameRunning = false;

  overlay.innerHTML = `
    <h1>GAME OVER</h1>
    <p>SCORE ${score}</p>
    <button onclick="location.reload()">
      RESTART
    </button>
  `;

  overlay.style.display = 'flex';
}

document.addEventListener('keydown',e=>{

  switch(e.key){

    case 'ArrowUp':

      if(velocityY !== 1){

        velocityX = 0;
        velocityY = -1;
      }

      break;

    case 'ArrowDown':

      if(velocityY !== -1){

        velocityX = 0;
        velocityY = 1;
      }

      break;

    case 'ArrowLeft':

      if(velocityX !== 1){

        velocityX = -1;
        velocityY = 0;
      }

      break;

    case 'ArrowRight':

      if(velocityX !== -1){

        velocityX = 1;
        velocityY = 0;
      }

      break;
  }
});

startBtn.addEventListener('click',initGame);