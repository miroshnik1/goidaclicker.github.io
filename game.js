// by fakejutsu & miroshnikoff


const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const enemyCanvas = document.getElementById('game-canvas');
const enemyCtx = canvas.getContext('2d');

const healthBar = document.getElementById('health-bar');
const comboBar = document.getElementById('combo-bar');
const scoreBar = document.getElementById('score');
const bestScoreBar = document.getElementById('bestScore');

let hero = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 40,
    health: 100
};

const sins = ["Гордыня","Ревность","Алчность","Похоть","Чревоугодие",
"Лень","Блуд","Обжорство","Ненависть","Клевета"];

let withoutFalse = 0
let score = 0

let bestScore = 0

let curSpeedIndex = 0
let newLevelSpeedRequire = [10, 25, 50, 100, 200, 500]
let speed = [200, 120, 80, 40, 30, 25, 15]
let spawnSpeed = [1000, 900, 600, 400, 300, 250, 200]

let less = new Audio('less.mp3');

let hitRadius = 90

let enemies = [];
let bloodEffects = [];
let swings = [];

splashImage = new Image();
splashImage.src = "pngwing.com.png"

let heroImage = new Image();
heroImage.src = "hero.png"

let goiImage = new Image();
goiImage.src = "goy.gif"

var goyda = new Audio('goida.mp3');

var gopnek = new Audio('gopnek.mp3');

var backgroundmusik = new Audio('animetyanbigbrothernya.mp3');






let frame = 0


let arsens_frame = 0
let arsens = []
for (let i = 1; i <= 25; ++i)
{
    arsens.push(i);
}

for (let i = 25; i >= 1; --i)
{
    arsens.push(i);
}


let womens = [];
for (let i = 1; i < 6; ++i)
{
    let curImage = new Image();
    curImage.src = "women" + i + ".png";
    womens.push(curImage);
}

function updateTime() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    document.getElementById('time').innerText = `Время игры: ${elapsedTime} сек`;
  }
  
  let startTime = new Date();

function draw() {
    enemyCtx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.drawImage(heroImage, hero.x - 50, hero.y - 50 - arsens[Math.floor(arsens_frame / 3)], 100, 100);
    
    arsens_frame += 1
    arsens_frame %= 150

    ctx.fill();


    frame += 1
    frame %= 25
    for (let i = 0; i < enemies.length; i++) {
        enemyCtx.globalAlpha = 1;
        enemyCtx.fillStyle = '#f00';
        enemyCtx.beginPath();

        enemyCtx.drawImage(womens[Math.floor(frame / 5)], enemies[i].x - 40, enemies[i].y - 40, 80, 80)
        
        

        enemyCtx.fill();

        ctx.drawImage(enemyCanvas, 0, 0)
    }

    for (let i = 0; i < swings.length; i++)
    {
        ctx.fillStyle = '#a00'
        ctx.beginPath();

        ctx.drawImage(splashImage, swings[i].x - 25, swings[i].y - 25, 50, 50)
        ctx.font = "12px serif";
        ctx.fillText("ОСОЗНАЙ СИЛУ", swings[i].x - 25, swings[i].y - 80)
        
        ctx.fillText(swings[i].sin.toUpperCase() ,swings[i].x - 25, swings[i].y - 70)
        ctx.fill();
    }

    drawBloodEffects();

    healthBar.style.width = `${hero.health / 2}%`;
}

function update() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].x += (hero.x - enemies[i].x) / speed[curSpeedIndex];
        enemies[i].y += (hero.y - enemies[i].y) / speed[curSpeedIndex];

        if (distance(hero, enemies[i]) < hero.radius + enemies[i].radius) {
            hero.health -= 10;
            addBloodEffect(hero.x, hero.y);
            enemies.splice(i, 1);
            gopnek.play();
        }
    }

    if (hero.health <= 0) {
        alert('Ваш счёт:' + score);
        hero.health = 100;
        

        if (bestScore < score)
        {
            bestScore = score;
            bestScoreBar.innerText = bestScore;
            scoreBar.innerText = 0;
            withoutFalse = 0;
            curSpeedIndex = 0;


            clearInterval(enemiesInterval);
                enemiesInterval = setInterval(() => {
                    enemies.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: 10,
                        health: 20
                    });
                }, spawnSpeed[curSpeedIndex]);
        }


        backgroundmusik.currentTime = 0; 
        backgroundmusik.play();

        score = 0;
    }
    updateTime();
}



function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function getRandomHitRadius() {
  return Math.random() * (hitRadius * 1.2 - hitRadius) + hitRadius;
}

function attackNearestEnemy(x, y) {
    let nearestEnemy = null;
    let nearestDistance = Infinity;

    for (let i = 0; i < enemies.length; i++) {
        let distanceToEnemy = Math.sqrt(Math.pow(x - enemies[i].x, 2) + Math.pow(y - enemies[i].y, 2));
        if (distanceToEnemy < nearestDistance) {
            nearestDistance = distanceToEnemy;
            nearestEnemy = enemies[i];
        }
    }

    if (nearestEnemy) {
        nearestEnemy.health -= 20;
        if (nearestEnemy.health <= 0) {
            enemies.splice(enemies.indexOf(nearestEnemy), 1);
        }
    }
}

function getNearestEnemy(x, y) {
  let nearestEnemy = null;
  let nearestDistance = Infinity;

  for (let i = 0; i < enemies.length; i++) {
      let distanceToEnemy = Math.sqrt(Math.pow(x - enemies[i].x, 2) + Math.pow(y - enemies[i].y, 2));
      if (distanceToEnemy < nearestDistance && distanceToEnemy < getRandomHitRadius()) {
          nearestDistance = distanceToEnemy;
          nearestEnemy = enemies[i];
      }
  }

  return nearestEnemy;
}

function getRandomEnemyObj()
{
    let xSign = (-1) + Math.random() * 2;
    if (xSign > 0)
    {
        xSign = 1;
    }
    else
    {
        xSign = -1;
    }


    let ySign = (-1) + Math.random() * 2;
    if (ySign > 0)
        {
            ySign = 1;
        }
        else
        {
            ySign = -1;
        }

    return {x: hero.x + xSign * ((Math.random() * canvas.width / 1.5) + 80),
    y: hero.y - ySign * ((Math.random() * canvas.height / 1.5) + 80),
    radius: 10,
    health: 20};
}

function spawnRandomEnemy()
{
    enemies.push(getRandomEnemyObj());
}

canvas.addEventListener('click', (e) => {
    backgroundmusik.play();
    const nearestEnemy = getNearestEnemy(canvas.width / 2, canvas.height / 2);

    if (nearestEnemy) {


        withoutFalse += 1
        if (withoutFalse > 5)
        {
            score += 10
        }
        else
        {
            score += 1
        }

        scoreBar.innerText = score;
        
        less.play();


        if (curSpeedIndex < 6)
        {
            if (score > newLevelSpeedRequire[curSpeedIndex])
            {
                curSpeedIndex += 1;
                
                clearInterval(enemiesInterval);
                enemiesInterval = setInterval(spawnRandomEnemy, spawnSpeed[curSpeedIndex]);
            }
        }


        attackNearestEnemy(nearestEnemy.x, nearestEnemy.y);

        // Add sword swing effect animation
        const swordSwingAnimation = () => {
            

            swings.push({x: nearestEnemy.x, y: nearestEnemy.y, sin: sins[Math.floor(Math.random() * 10)]})

            setTimeout(() => {
                swings.splice(0, 1);
            }, 400); // Clear the animation after 200ms
        };

 
        swordSwingAnimation();

    }
    else
    {
        withoutFalse = 0
    }

    if (withoutFalse < 6)
    {
        comboBar.style.width = `${withoutFalse * 10}%`;
        if (withoutFalse == 5)
        {
            comboBar.style.backgroundColor = "yellow";
            comboBar.innerHTML = "<a class=\"combo-text\">GOIDA</a>";
            goyda.play();
        }
        else 
        {
            comboBar.style.backgroundColor = "blue";
            comboBar.innerHTML = "<a class=\"combo-text\">COMBO</a>";
        }
    }
    
});


function drawBloodEffects() {
    for (let i = bloodEffects.length - 1; i >= 0; i--) {
        ctx.fillStyle = 'rgba(255, 0, 0, ' + bloodEffects[i].alpha + ')';
        ctx.beginPath();
        ctx.arc(bloodEffects[i].x, bloodEffects[i].y, bloodEffects[i].radius, 0, 2 * Math.PI);
        ctx.fill();
        bloodEffects[i].alpha -= 0.01;
        if (bloodEffects[i].alpha <= 0) {
            bloodEffects.splice(i, 1);
        }
    }
}

function addBloodEffect(x, y) {
    for (let i = 0; i < 10; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 20 + 10;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;

        bloodEffects.push({
            x: x + offsetX,
            y: y + offsetY,
            radius: Math.random() * 5 + 2,
            alpha: 1
        });
    }
}



enemiesInterval = setInterval(
    spawnRandomEnemy, 1000);

tickInterval = setInterval(() => {
    draw();
    update();
}, 20);