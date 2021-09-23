var express = require('express')
var cors = require('cors')
var app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static('./public'))
app.set('view engine','ejs');
app.set('views','views')
app.use(cors('http://locahost:3000'))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
var arrUser=[];
io.on('connection',socket=>{
    socket.on('USER_DANG_KY',function(data){
        const isExist = arrUser.filter(e=>e.username === data.username)
        if(isExist.length>0){
            socket.emit('DANG_KY_THAT_BAI',data)
        }else{
            arrUser.push(data)
            socket.emit('DANH_SACH_DANG_KY',arrUser)
            socket.broadcast.emit('CO_NGUOI_MOI',data)
        }
       
    })
})
app.get('/',(req,res,next)=>{
    res.render('index')
})
server.listen(3000, () => {
    console.log('listening on *:3000');
  });