'use strict'
//////////////// require ////////////
const express = require('express');
const superagent = require('superagent');
const methodOverride = require('method-override');
const pg = require('pg');
const { prototype } = require('module');

require('dotenv').config();


/////// use ////////
const app = express();
const PORT = process.env.PORT;

app.set('view engine','ejs');

///////Route///////
app.get('/', showHome)
// app.get('/favorite', showFav);
app.post('/my-card/;id', showDetails)
app.post('/my-cards', setCards);
app.get('/my-cards', showCards);
app.put('/my-cards', udateCard);
app.delete('/my-cards', deletCard);




////database/////
const client = new pg.Client(process.env.DATABASE_URL)


//////functions///////

function showHome(req,res){
    let dataArr = [];
    let url = 'https://digimon-api.herokuapp.com/api/digimon'
    superagent.get(url).then(data=>{
        data.body.forEach(element=>{
         dataArr.push(new Data(element));
        })
        res.render('home', {results:dataArr});
    })
}

//////// CRUP function //////
function setCards(req,res){
    let quer = 'INSERT INTO info (name , image , level) VALUES($1,$2,$3);';
    let values = [req.body.name , req.body.image , req.body.level];
    client.query(quer,values).then(()=>{
        res.redirect('my-cards');
    })
}

function showCards(req,res){
    let query = 'SELECT * FROM info;';
    client.query(query,value).then(data=>{
        res.render('my-cards', {result: data.rows})
    })
    
}

function showDetails(req,res){
    let quer = 'SELECT * info WHERE id=$1;';
    let value = [req.params.id];
    client.query(quer,value).then(data=>{
     res.render('details', {result:data.rows[0]});
    })
}

function udateCard(req,res){
    let query = 'UPDATE info SET name=$1, image=$2, level=$3 WHERE id=$4;';
    let value = [req.body.name , req.body.image , req.body.level , req.params.id];
    client.query(query,value).then(()=>{
        res.redirect('/my-cards');
    })
}

function deletCard(req,res){
    let query = 'DELETE FROM info WHERE id=$1;';
    let value = [req.params.id];
    client.query(query,value).then(()=>{
        res.redirect('/my-cards')
    })
}






function Data(data){
    this.name = data.name;
    this.img = data.img;
    this.level = data.level;
}
///////////////////////////////////
client.connect().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`APP IS LISTEN ON PORT ${PORT}`);
    })
})