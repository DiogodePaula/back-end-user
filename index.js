const express = require("express");
const database = require("./database");
const server = express();
server.use(express.json());

//evita o erro de CORS
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

let nextId = null;

server.get("/", (req,res)=>{
    return res.json({
        result: "Welcome to API-database"
    });
});

async function getNextId(req, res, next) {
    await database.query(`SELECT MAX(id) FROM users;`,
    {type: database.QueryTypes.SELECT})
    .then(id =>{
        nextId = id[0].max++;
        nextId ++;
        // nextId = id ++;
        // console.log(id[0].max);
    });
    next();
}

server.get('/', (req, res) => {
    return res.json({
        result: 'Welcome to users'
    });
})

server.get('/users', async (req,res)=>{
    let usersList;

    await database.query(`SELECT * FROM users`, 
    {type: database.QueryTypes.SELECT})
        .then(users =>{
            usersList = users;
        })
        .catch(error =>{
            return res.json(error);
        })

    return res.json({usersList});
})

server.get('/users/:id', async (req, res) =>{
    const {id} = req.params;
    let user;

    await database.query(`SELECT * FROM users WHERE id = ${id}`,
    {type: database.QueryTypes.SELECT})
    .then(userResult => {
        user = userResult;
    })
    .catch(error => {
        return res.json(error);
    });
    return res.json({user});
})

server.post("/users", getNextId, async (req,res)=>{
    let inseriu;
    const {name, age, email, phone} = req.body;

    await database.query(`INSERT INTO users VALUES(${nextId}, '${name}', 
    '${email}', '${phone}', ${age});`,
        {type: database.QueryTypes.INSERT})
        .then(result => {
            inseriu = result;
        })
        .catch(err => {
            return res.json(err);
        });

    if (inseriu[1]) {
        return res.json({
            result: 'dados inseriu com sucesso'
        });
    } else {
        return res.json({
            result: 'dados não foram inseridos'
        });
    }
})

//no delete o then n é necessário, so um cath é necessário
server.delete('/users/:id', async (req, res) => {
    const {id} = req.params;
    let userDeleted;

    await database.query(`DELETE FROM users WHERE id = ${id};`,
    {type: database.QueryTypes.DELETE})
    .then(result => {
        return res.json(result);
    })
    .catch(err => {
        return res.json({err})
    })
    return res.json({userDeleted});
});

server.put('/users/:id', async (req, res) => {
    const {id} = req.params; 
    const {name, email, phone, age} = req.body;
    let update;

    await database.query(`
    UPDATE users SET name = '${name}' WHERE id = ${id};
    UPDATE users SET email = '${email}' WHERE id = ${id};
    UPDATE users SET phone = '${phone}' WHERE id = ${id};
    UPDATE users SET age = '${age}' WHERE id = ${id};`,
    {type: database.QueryTypes.UPDATE})
        .then(results => {
            update = results;
        })
        .catch(err => {
            return res.json (err);
        })

    if (update[1]){
        return res.json({
            result: 'user update successfully.'
        });
    } else {
        return res.json({
            result: 'user cannot be update.'
        });
    }
})

server.listen(process.env.PORT);