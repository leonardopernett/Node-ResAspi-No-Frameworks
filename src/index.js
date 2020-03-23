const http = require('http');
const {bodyParser} = require('./libs/bodyParser')
 let database = [];


 function home(req,res){
     res.writeHeader(200,{'Content-Type':'text/plain'});
     res.write('server startup');
     res.end();
 }

 function getTasks(req,res){
    res.writeHead(200,{'Content-Type':'application/json'});
    res.write(JSON.stringify(database));
    res.end();
 }

 async function createTask(req,res){
    try {
        await  bodyParser(req)
        database.push(req.body);
        res.writeHead(200,{'Content-Type':'application/json'})
        res.write(JSON.stringify({message:'task created'}));
        res.end();
    } catch (error) {
        res.writeHead(400,{'Content-Type':'application/json'})
        res.write(JSON.stringify(error));
        res.end();
    }
 }


 async function updateTask(req,res){
    
    const {url} = req
     
    const idQuery = url.split('?')[1];
    const idKey = idQuery.split('=')[0]
    const id = idQuery.split('=')[1];

    if(idKey === 'id'){
        await  bodyParser(req)
        database[id-1]= req.body;
        res.writeHead(200,{'Content-Type':'application/json'})
        res.write(JSON.stringify(database));
        res.end(); 
    }else{
        res.writeHead(400,{'Content-Type':'application/json'})
        res.write(JSON.stringify({message:'nvalid id url'}));
        res.end(); 
    }
   


 }

 function deleteTask(req,res){
     const {url} =req
     
     const idQuery = url.split('?')[1];
     const idKey   = idQuery.split('=')[0];
     const id = idQuery.split('=')[1];
      
     if(idKey === 'id'){
         database.splice(id-1, 1)
         res.writeHead(200,{'Content-Type':'application/json'})
         res.write(JSON.stringify(database));
         res.end(); 
     }

     

 }

const  server = http.createServer((req,res)=>{
    const {url, method} = req

    switch(method){
        case  'GET':
           if(url==='/'){
               home(req,res)
           }
            
           if(url==="/tasks"){
              getTasks(req,res)
           }
           break;

        case  'POST':
            if(url==="/tasks"){
               createTask(req,res);
            }
            break;

        case  'PUT':
             updateTask(req,res);

             break;
            
        case  'DELETE':
             deleteTask(req,res);
            break;
        default :


    }
    console.log('url: ' +req.url + ' - method: ' + req.method)
})

server.listen(3000,()=>console.log('server on port',3000))