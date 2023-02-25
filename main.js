let express = require('express');
let fs = require('fs');
let crypto = require('crypto');
let hostName = '127.0.0.1';
let port = 5555;
let app = express();
app.use(express.static(__dirname+"/public"));
app.use(express.json());

app.get("/getData",function(req,res){
    console.log(__dirname);
    res.sendFile(__dirname+"/data.json")
})

app.put("/getData",function(req,res){
    console.log(__dirname);
    fs.readFile(__dirname+"/data.json","utf8",function(err,data){
        if(!err){
            // console.log(data);
            let pdata= JSON.parse(data);
            // console.log(req.body);
            let dataToChange = req.body;
            pdata = pdata.map(function(element){
                if(element.id == dataToChange.id){
                    element.statu = dataToChange.stat;
                }
                return element;
            })
            // console.log(pdata);
            fs.writeFile(__dirname+"/data.json",JSON.stringify(pdata),function(err){
                if(!err){
                    res.status = 200;
                    res.end();
                }
            })
        }
    });
});


app.delete("/getData",function(req,res){
    console.log(req.body);
    let id = req.body.id;
    fs.readFile(__dirname+"/data.json","utf-8",function(err,data){
        if(!err){
            data = JSON.parse(data);
            data = data.filter((element)=>{
                if(element.id == id){
                    return false;
                }
                return true;
            })
            console.log(data);
            fs.writeFile(__dirname+"/data.json",JSON.stringify(data),"utf8",function(err){
                if(!err){
                    res.status = 200;
                    res.end();
                }
            })
        }
    })
})

app.post("/getData",function(req,res){
    let obj = req.body;
    obj.statu = false;
    obj.id = 'c'+crypto.randomBytes(10).toString("hex");
    console.log(obj);
    fs.readFile(__dirname+"/data.json","utf8",function(err,data){
        if(!err){
            if(data == ""){
                data = []
            }else{
                data = JSON.parse(data);
            }
            data.push(obj);
            fs.writeFile(__dirname+"/data.json",JSON.stringify(data),"utf8",function(err){
                if(!err){
                    res.status = 200;
                    res.send(obj);
                }
            })
        }
    })
})

app.listen(port,hostName)