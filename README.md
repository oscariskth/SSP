För att installera alla nödvändiga beroenden, kör:
npm install

För att starta servern, kör:
npm start

CURL
För att starta ett nytt spel och generera ett spel-id:
curl -d '{"name":"exempelnamn"}' -H "Content-Type: application/json" -X POST "http://localhost:5000/api/games" -w "\n"


För att ansluta till ett existerande spel:
curl -d '{"name":"exempelnamn"}' -H "Content-Type: application/json" -X POST "http://localhost:5000/api/games/{spel-id}/join" -w "\n"

För att göra ett drag:
curl -d '{"name":"exempelnamn", "move":{legalMove}}' -H "Content-Type: application/json" -X POST "http://localhost:5000/api/games/{spel-id}/move" -w "\n"

Till exempel med namnet Oscar, draget sten, och spel id c30a9810-5f4e-11e9-89ce-35ee951a8ab9:

curl -d '{"name":"Oscar", "move":"sten"}' -H "Content-Type: application/json" -X POST "http://localhost:5000/api/games/c30a9810-5f4e-11e9-89ce-35ee951a8ab9/move" -w "\n"

där legelMove är en av följande: "sten", "sax", "påse"
och där exempelnamn är det namn du registrerade när du anslöt


För att se statusen för spelet:
curl "http://localhost:5000/api/games/{spel-id}" -w "\n"
