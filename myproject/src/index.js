// importação do express
const express = require('express');
// importanção de biblioteca que cria id de usuário unicas
const { v4:uuidv4 }  = require('uuid');
const app = express();
app.use(express.json());

//simulação do banco de dados
const projects = [];

//midleware
function logRoutes (req, res, next) {
    
    const {method, url } = req;
    const route = `Método ${method.toUpperCase()}  ||| ${url}`;
    console.log(route);
    return next();
}

//forma de usar middlewares para todas as rotas
//app.use(logRoutes);

//listagem
app.get('/projects', function(req, res){    

    return res.json(projects)
});

// inserção
app.post('/projects',logRoutes, function(req, res){
    
    const {name, owner} = req.body;    

    const project = {
        id: uuidv4(),
        name,
        owner
    }
    projects.push(project);

    return res.status(201).json(project);    
});

// alteração
app.put('/projects/:id', function(req, res){
    //caso queira passar + de um argumento por parâmetro
    //'/projects/:id/:name

    const {id} = req.params;
    const { name, owner}  = req.body; 

    //verifique os parâmetros que chegaram
    console.log(id);
    console.log(name, owner);   

    //simulação de busca em um banco
    //mas na realidade é uma busca em um array
    const projecIndex = projects.findIndex(p => p.id === id);

    //caso o registro a ser atualizado esteja passado errado
    if (projecIndex < 0) {
        return res.status(404).json({"error": 'Project not found!'});
    }


    // aqui a ideia era atualizar todos os campos, então caso algum 
    // campo não seja passado, a requisição não é aceita
    // caso queira passar um campo apenas, elimine isso. 
    if (name == undefined || owner == undefined) {
         return res.status(400).json({ "error": "Name and owner are required"});
     }

      //montagem do objeto que atualizará o registro
      const project = {
          id,
          name, 
          owner 
     }

     //atualização do registro
     projects[projecIndex] = project;

     //resposta
     return res.json(project);     
});

//deleção por id
app.delete('/projects/:id', function(req, res){
    const {id} = req.params;

    const projecIndex = projects.findIndex(p => p.id === id);

    if (projecIndex < 0) {
        return res.status(404).json({"error": 'Project not found!'});
    }

    projects.splice(projecIndex, 1);

    return res.status(204).send();
    
});

app.listen(3000, () => {
    console.log("server started on port 3000! 🏆")
});