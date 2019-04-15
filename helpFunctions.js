// Sätter status-meddelandet utifrån vad spelets tillstånd är
// Sätter även gameOver flaggan om spelet är slut
function setStatus(game){
    if (game.public.players.length !== 2){
        return
    }
    let player1 = game.public.players[0]
    let player2 = game.public.players[1]
    if (!game.private[player1] && !game.private[player2]){
        game.public.status = "Waiting for both players to make their moves"
        return
    }
    else if (!game.private[player1]){
        game.public.status = "Waiting for " + player1 + " to make their move"
        return
    }
    else if (!game.private[player2]){
        game.public.status = "Waiting for " + player2 + " to make their move"
        return
    }
    // Logik för att avgöra vem som vann
    let results = ["The game is a tie", player1 + " won", player2 + " won"]
    let choices = ["sten", "sax", "påse"]
    let index = choices.indexOf(game.private[player2]) - choices.indexOf(game.private[player1])
    // resultatet av subtraktionen ovan blir alltid 0 om det är oavgjort och 1 eller -2 om spelare 1 vann
    // samt -1 eller 2 om spelare 2 vann
    // om negativa index räknas bakifrån så är dessa på samma plats i results-arrayen
    if (index < 0) game.public.status = results[results.length + index]
    else game.public.status = results[index]
    game.public.gameOver = true
    return
}

function legalId(games, id){
    if (Object.keys(games).indexOf(id) === -1){
        return {legal:false, message: "Du angav inte ett giltigt spel-id"}
    }
    return {legal:true, message: "Spel-id ok"}    
}

function checkMove(games, id, move, player){
    let legalMoves = ["sten", "sax", "påse"]
    let idStatus = legalId(games, id)
    if(!idStatus.legal) return idStatus
    let nameStatus = checkNamePresent(player)
    if(!nameStatus.legal) return nameStatus
    if(games[id].public.players.indexOf(player) === -1) return {legal:false, message: "Du angav en spelare som inte är med i spelet"}
    if(!move) return {legal: false, message: "Du måste ange ett drag."}
    if(legalMoves.indexOf(move.toLowerCase()) === -1) return {legal:false, message: "Det var inte ett giltigt drag"}
    if(games[id].private[player]) return {legal:false, message:"Du har redan gjort ditt drag"}
    return {legal: true, message: "Drag ok"}
}

function checkJoin(games, id, player){
    let idStatus = legalId(games, id)
    if(!idStatus.legal) return idStatus
    let nameStatus = checkNamePresent(player)
    if(!nameStatus.legal) return nameStatus
    if (games[id].public.players.length !== 1) return {legal: false, message:"Spelet är fullt"}
    if (games[id].public.players[0] === player) return {legal: false, message:"Det namnet är upptaget"}
    return {legal: true, message:"Anslutning ok"}

}

function checkNamePresent(name){
    if(!name) return {legal: false, message: "Du måste ange ett namn."}
    return {legal:true, messsage:"namn angivit"}
}

module.exports = {setStatus, checkMove, checkJoin, legalId, checkNamePresent}