const numTests = 1_000;

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const placePrize = (arr) => {
    const prizeIndex = random(0, arr.length-1);
    arr[prizeIndex] = 1;
}

// the rule could be that host opens a random door that is not the players door or the prize
const hostOpens = (prizes, playerPick) => {
    while (true) {
        let randomDoor = random(0, prizes.length-1);
        if (randomDoor != playerPick && prizes[randomDoor] != 1) return randomDoor;
    }
}

// but what if the rule was that the host would open every door that was not a prize but one? it could be another goat, or it could be the prize
// for three doors, this would look the same as the random option, but for a bunch of doors this changes everything



const runTests = () => {
    let stickWins = 0;
    let swapWins = 0;
    let games = 0;
    for(let i = 0; i < numTests; i++){
        let prizes = [0, 0, 0]
        placePrize(prizes);
        
        let playerPick = random(0, prizes.length-1);

        let hostDoor = hostOpens(prizes, playerPick);

        if (prizes[playerPick]) stickWins++;

        if (playerPick === 0 && hostDoor === 1) playerPick = 2;
        if (playerPick === 0 && hostDoor === 2) playerPick = 1;
        if (playerPick === 1 && hostDoor === 0) playerPick = 2;
        if (playerPick === 1 && hostDoor === 2) playerPick = 0;
        if (playerPick === 2 && hostDoor === 0) playerPick = 1;
        if (playerPick === 2 && hostDoor === 1) playerPick = 0;

        if (prizes[playerPick]) swapWins++;

        games++
    }

    let stickWinPercent = stickWins / games * 100;
    let swapWinPercent = swapWins / games * 100;
    console.log(`Stick win percent: ${stickWinPercent}%`)
    console.log(`Swap win percent: ${swapWinPercent}%`)

}

runTests();