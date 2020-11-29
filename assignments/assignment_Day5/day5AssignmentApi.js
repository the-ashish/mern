const http = require('http'); 
const url = require('url');

let avengersData = [
    { "id": 1, "name": "Avenger1", "age": "1000", "planet": "planet1", "weapon": "weapon1"},
    { "id": 2, "name": "Avenger2", "age": "2000", "planet": "planet2", "weapon": "weapon2"},
    { "id": 3, "name": "Avenger3", "age": "3000", "planet": "planet3", "weapon": "weapon3"},
    { "id": 4, "name": "Avenger4", "age": "4000", "planet": "planet4", "weapon": "weapon4"},
    { "id": 5, "name": "Avenger5", "age": "5000", "planet": "planet5", "weapon": "weapon5"},
    { "id": 6, "name": "Avenger6", "age": "6000", "planet": "planet6", "weapon": "weapon6"},
    { "id": 7, "name": "Avenger7", "age": "7000", "planet": "planet7", "weapon": "weapon7"}
]


const server = http.createServer((req, res) => {
    const path = url.parse(req.url, true);
    //console.log(path);

    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers":"*",
        "Content-Type":"application/json"
    });

    if(path.pathname == "/" || path.pathname == "/avengers"){
        res.end(JSON.stringify(avengersData));
    }

    else if(path.pathname == "/avenger"){
        console.log(req.method);

        if(req.method == "OPTIONS"){
            // it is a preflight request judt to return acknowledgement and then goes to POST
            res.end();
        } 
        else if(req.method == 'GET'){
            const id = path.query.id;
            const singleData = avengersData.find((ele) => {
                return ele.id == id;
            })
            //console.log(singleData);
            if(singleData != "undefined" && singleData !=null){
                res.end(JSON.stringify(singleData));
            }
            res.end(JSON.stringify({message:"Avenger Not Found"}));
        }
        else if(req.method == "POST"){
            let body = "";
            req.on('data',(data) => {
                body += data;
            })

            req.on('end', () => {
                let avenger = JSON.parse(body);
                avengersData.push(avenger);
                //console.log(avengersData)
                res.end(JSON.stringify({message:"Avenger Added"}));
            })
        }
        else if(req.method == "PUT"){
            const id = path.query.id;

            let body = "";
            req.on('data', (data) => {
                body += data;
            });

            req.on('end', () => {
                let avenger = JSON.parse(body);
                avengersData.forEach((ele) => {
                    if(ele.id == id){
                        ele.id = avenger.id;
                        ele.name = avenger.name;
                        ele.age = avenger.age;
                        ele.planet = avenger.planet;
                        ele.weapon = avenger.weapon;

                        //console.log(avengersData)
                        res.end(JSON.stringify({message:"Avenger Updated"}));
                    }
                })
                res.end(JSON.stringify({message:"Avenger Not Found And Not Updated"}));
            })
        }
        else if(req.method=="DELETE"){
            const id = path.query.id;
            avengersData.forEach((ele,index) => {
                if(ele.id == id){
                    avengersData.splice(index,1);
                    res.end(JSON.stringify({message:"Avenger Deleted"}));
                }
            })

            res.end(JSON.stringify({message:"Avenger Not Found"}));
        }
    }
    else {
        res.writeHead(404,{
            "Content-Type":"application/json"
        });
        res.end(JSON.stringify({message:"Not Found anything for this URL"}));
    }

})

server.listen("3000", "127.0.0.1", () => {
    console.log("Server is up and running at port 3000");
})