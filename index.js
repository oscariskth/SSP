const helpFunctions = require('./helpFunctions')
const express = require('express');
const uuidv1 = require("uuid/v1");
const app = express();

app.use(express.json())

let games = {}

//Initiera ett spel och skapa alla nödvändiga attribut
app.post('/api/games', (req,res) => {
    let name = req.body.name
    let uuid = uuidv1()
    nameStatus = helpFunctions.checkNamePresent(name)
    if(!nameStatus.legal){
        res.json(nameStatus.message)
        return
    }
    games[uuid] = {public:{players: [name]}}
    games[uuid].public.status = "Väntar på att spelare 2 ska ansluta"
    games[uuid].public.gameOver = false
    games[uuid].public.id = uuid
    games[uuid].private = {}
    games[uuid].private[name] = null
    res.json("Spelet skapat, ditt spel-id är: " + uuid);

});

// Gå med i ett spel
app.post('/api/games/:id/join', (req,res) => {
    let name = req.body.name
    let id = req.params.id
    // Kollar om id och namn är ok samt att spelet inte är fullt
    let joinStatus = helpFunctions.checkJoin(games, id, name)
    
    if(!joinStatus.legal){
        res.json(joinStatus.message)
        return
    }

    games[id].public.players.push(name)
    games[id].private[name] = null
    helpFunctions.setStatus(games[id])
    
    res.json("Ansluten till spelet")

});

// Gör ett drag för för en spelare i ett spel
app.post('/api/games/:id/move', (req,res) => {
    let name = req.body.name
    let move = req.body.move
    let id = req.params.id    
    // Kontrollera att id, spelare, och drag är giltiga samt att spelaren inte redan har gjort ett godkänt drag
    let moveStatus = helpFunctions.checkMove(games, id, move, name)
    if (!moveStatus.legal){
        res.json(moveStatus.message)
        return
    }

    games[id].private[name] = move.toLowerCase()
    helpFunctions.setStatus(games[id])
    res.json("Drag registrerat")

});
// Ger statusen för spelet. Man kan endast se dragen om spelet redan är slut (för att undvika fusk).
app.get('/api/games/:id', (req,res) => {
    let id = req.params.id
    let idStatus = helpFunctions.legalId(games, id)
    // Kontrollerar att id:t man angivit är giltigt
    if (!idStatus.legal){
        res.json(idStatus.message)
        return
    }
    if(games[id].public.gameOver){
        res.json(games[id])
    }
    else{
        res.json(games[id].public)
    }
});


// Tar hand om alla GET-requests till något annat endpoint än de ovan angivna
app.get('*', (req,res) =>{
    res.json("Den angivna ändpunkten finns tyvärr inte")
});

// Samma för POST 
app.post('*', (req,res) =>{
    res.json("Den angivna ändpunkten finns tyvärr inte")
});

const port = process.env.PORT || 5000;
app.listen(port);
