function reactangularCollision({reactangle1,reactangle2}){
    return (
        reactangle1.attackBox.position.x + reactangle1.attackBox.width >= reactangle2.position.x && 
        reactangle1.attackBox.position.x <= reactangle2.position.x + reactangle2.width &&
        reactangle1.attackBox.position.y + reactangle1.attackBox.height >= reactangle2.position.y &&
        reactangle1.attackBox.position.y <= reactangle2.position.y + reactangle2.height
    )
}

function determineWinner({player,enemy,timerId}){
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';
    document.querySelector('#timer').innerHTML = timer
    if(player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie';
    } else if(player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    } else if(player.health < enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    }
}

let timer = 60;
let timerId;
function decreaseTimer(){
    
    if(timer>0){
        timerId = setTimeout(decreaseTimer,1000);
        document.querySelector('#timer').innerHTML = timer--
    }
    if( timer === 0 ){
        determineWinner({player,enemy,timerId});
    }

}