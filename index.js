const canvas = document.querySelector('canvas');
//Scelta tipologia canvas
const obj_canvas = canvas.getContext('2d');

//Configurazione width e height
canvas.width = 1024;
canvas.height = 576;

//Setto il background del canvas
obj_canvas.fillRect( 0 , 0 , canvas.width , canvas.height);

const gravity = 0.7;

//****** */

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
});

const shop = new Sprite({
    position:{
        x:600,
        y:128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
});

const player = new Fighter(
    {
        position:{
            x:0,
            y:0,
        },
        velocity:{
            x:0,
            y:0,
        },
        offset:{
            x:0,
            y:0,
        },
        imageSrc:'./img/samuraiMack/Idle.png',
        framesMax: 8,
        scale: 2.5,
        offset :{
            x:215,
            y:157
        },
        sprites: {
            idle:{
                imageSrc: './img/samuraiMack/Idle.png',
                framesMax: 8
            },
            run:{
                imageSrc: './img/samuraiMack/Run.png',
                framesMax: 8
            },
            jump:{
                imageSrc: './img/samuraiMack/Jump.png',
                framesMax: 2
            },
            fall:{
                imageSrc: './img/samuraiMack/Fall.png',
                framesMax: 2
            },
            attack1:{
                imageSrc: './img/samuraiMack/Attack1.png',
                framesMax: 6
            },
            takeHit:{
                imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
                framesMax: 4
            },
            death:{
                imageSrc: './img/samuraiMack/Death.png',
                framesMax: 6
            }
        },
        attackBox: {
            offset:{
                x:100,
                y:50
            },
            width: 160,
            height: 50
        }
    }
);

const enemy = new Fighter(
    {
        position:{
            x:400,
            y:100,
        },
        velocity:{
            x:0,
            y:0,
        },
        color:'blue',
        offset:{
            x:-50,
            y:0,
        },
        imageSrc:'./img/kenji/Idle.png',
        framesMax: 4,
        scale: 2.5,
        offset :{
            x:215,
            y:167
        },
        sprites: {
            idle:{
                imageSrc: './img/kenji/Idle.png',
                framesMax: 4
            },
            run:{
                imageSrc: './img/kenji/Run.png',
                framesMax: 8
            },
            jump:{
                imageSrc: './img/kenji/Jump.png',
                framesMax: 2
            },
            fall:{
                imageSrc: './img/kenji/Fall.png',
                framesMax: 2
            },
            attack1:{
                imageSrc: './img/kenji/Attack2.png',
                framesMax: 4
            },
            takeHit:{
                imageSrc: './img/kenji/Take_hit.png',
                framesMax: 3
            },
            death:{
                imageSrc: './img/kenji/Death.png',
                framesMax: 7
            }
        },
        attackBox: {
            offset:{
                x:-170,
                y:50
            },
            width: 170,
            height: 50
        }
    }
);

const keys = {
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    arrowright:{
        pressed:false
    },
    arrowleft:{
        pressed:false
    }
}

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    obj_canvas.fillStyle = 'black';
    obj_canvas.fillRect( 0, 0, canvas.width , canvas.height)

    background.update();
    shop.update();

    obj_canvas.fillStyle = 'rgba(255,255,255,0.15)';
    obj_canvas.fillRect(0, 0, obj_canvas.width, obj_canvas.height);

    player.update();
    enemy.update();

    
    //Player movement
    player.velocity.x = 0

    if( keys.a.pressed && player.lastKey === 'a' ){
        player.velocity.x = -5;
        player.switchSprites('run');
    }else if( keys.d.pressed  && player.lastKey === 'd' ){
        player.velocity.x = 5;
        player.switchSprites('run');
    }else{
        player.switchSprites('idle');
    }

    //Player jumping
    if( player.velocity.y < 0){
        player.switchSprites('jump');
    } else if( player.velocity.y > 0 ){
        player.switchSprites('fall');
    }

    //Enemy movement
    enemy.velocity.x = 0
    if( keys.arrowleft.pressed && enemy.lastKey === 'arrowleft' ){
        enemy.velocity.x = -5;
        enemy.switchSprites('run');
    }else if( keys.arrowright.pressed  && enemy.lastKey === 'arrowright' ){
        enemy.velocity.x = 5;
        enemy.switchSprites('run');
    }else{
        enemy.switchSprites('idle');
    }

    //Enemy jumping 
    if( enemy.velocity.y < 0){
        enemy.switchSprites('jump');
    } else if( enemy.velocity.y > 0 ){
        enemy.switchSprites('fall');
    }

    // detect for collision Player
    if(  
        reactangularCollision({ reactangle1: player , reactangle2: enemy }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ){
        enemy.takeHit();
        player.isAttacking = false;
        console.log('player attack successfull');

        gsap.to(
            '#enemyHealth',
            {
                width: `${enemy.health}%`
            }
        );
    }

    //if player misses
    if( player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false;
    }

    // detect for collision Enemy
    if( 
        reactangularCollision({ reactangle1: enemy , reactangle2: player }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ){
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to(
            '#playerHealth',
            {
                width: `${player.health}%`
            }
        );
        console.log('enemy attack successfull');

    }

    //if player misses
    if( enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false;
    }

    //End game based on health
    if( enemy.health <= 0 || player.health <= 0 ){
        determineWinner({player,enemy,timerId});
    }
}

animate();

window.addEventListener('keydown', (event)=>{
    if( !player.dead ){
        switch(event.key.toLowerCase()){
            //player keys
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                player.velocity.y = -18
                break;
            case ' ':
                player.attack()
                break;
        }
    }

    if( !enemy.dead ){
        switch(event.key.toLowerCase()){
            case 'arrowright':
                keys.arrowright.pressed = true;
                enemy.lastKey = 'arrowright';
                break;
            case 'arrowleft':
                keys.arrowleft.pressed = true;
                enemy.lastKey = 'arrowleft';
                break;
            case 'arrowup':
                enemy.velocity.y = -18
                break;
            case 'arrowdown':
                enemy.attack()
                break;
        }
    }
    
})

window.addEventListener('keyup', (event)=>{
    switch(event.key.toLowerCase()){
        //player keys
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        //enemy keys
        case 'arrowright':
            keys.arrowright.pressed = false;
            break;
        case 'arrowleft':
            keys.arrowleft.pressed = false;
            break;
        case 'arrowdown':
            enemy.isAttacking = false
            break;
    }
})