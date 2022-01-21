//create websocket client
let ws = new WebSocket("wss://bad-api-assignment.reaktor.com/rps/live");
//array for all game results
let games = [];
//we will put game results inside this div
let gamesDiv = document.getElementById("games");

//this runs when we get a websocket message
ws.onmessage = function (event) {
	//this line parses game data from json
	let game = JSON.parse(JSON.parse(event.data));
	//this one adds it to the games array
	games[game.gameId] = game;
	//1337 one-liner
	(game.type == "GAME_RESULT") ? addGameR(game.gameId) : addGameB(game.gameId);
	
	console.log(game);
}

//add game begin to document
function addGameB(id){
	//create a new div
	let gameDiv = document.createElement("div");
	//find the right game's data
	let game = games[id];
	//template literals are cool
	gameDiv.innerHTML=`
		<span class="playerAName">${game.playerA.name}</span>
		<span class="vs">vs.</span> <span class="playerBName">${game.playerB.name}</span> </h2>
		<p>Game in Progress</p>
		<span class="playerAHand inProgress">✊</span><span class="playerBHand inProgress">✊</span>
	`
	//set div id to game id
	gameDiv.id = id;
	//add div to the top
	gamesDiv.prepend(gameDiv);
}

//add game result to document
function addGameR(id){
	try{
		//find the right div with id
		let gameDiv = document.getElementById(id);
		//find the right game's data
		let game = games[id];
		
		//add classes for cool css
		gameDiv.classList.add("finished");
		gameDiv.classList.add(getWinner(game.playerA.played, game.playerB.played));
		
		//format the timestamp
		let time = new Date(game.t);
		let hours = ("0" + time.getHours()).slice(-2);
		let minutes = ("0" + time.getMinutes()).slice(-2);
		let seconds = ("0" + time.getSeconds()).slice(-2);
		
		//smash in another template literal with new data
		gameDiv.innerHTML=`
			<span class="playerAName">${game.playerA.name}</span>
			<span class="vs">vs.</span> <span class="playerBName">${game.playerB.name}</span> </h2>
			<p>Game Finished at ${hours}:${minutes}:${seconds}</p>
			<span class="playerAHand">${handEmoji(game.playerA.played)}</span><span class="playerBHand">${handEmoji(game.playerB.played)}</span>
		`
	} catch {
		//this happens when we get a game result before game begin
		console.log("Oopsie woopsie could not add game result");
	}
}

//takes in players' hands as string and returns game result as string
function getWinner(handA, handB){
	let hands = handA + handB;
	switch(hands){
		case "ROCKROCK": case "SCISSORSSCISSORS": case "PAPERPAPER":
			return "draw";
		case "ROCKSCISSORS": case "SCISSORSPAPER": case "PAPERROCK":
			return "winnerA";
		case "ROCKPAPER": case "SCISSORSROCK": case "PAPERSCISSORS":
			return "winnerB";
	}
}

//takes in a string and returns the corresponding emoji
function handEmoji(hand){
	switch(hand) {
		case "ROCK":
			return "✊";
		case "PAPER":
			return "✋";
		case "SCISSORS":
			return "✌️";
	}
}