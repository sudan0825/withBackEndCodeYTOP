
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

const firebase = require('./firebase');

const axios = require('axios');





const yelp = require('yelp-fusion');

const client = yelp.client('SJsbcC4SOevdjwlSZz3wnXL3A-jbEgV_b2cUy1MKTM0ssBEj5OR2URrHhg0LVJ62qW28aTktJXB42oBnsPwroP5VgdzYAJiW4HUihKiyhOsyPpOl-bh-6BFGbEq4W3Yx');

//get from data Yelp Fusion API

function getDataFromYelp(terms, city,offset){
    let data=[];
    let promise=new Promise((resolve,reject)=>{



        client.search({
            term:terms,
            location: city,
            limit:50,
            offset:offset


        }).then(response => {


            data=data.concat(response.jsonBody.businesses);
            console.log("here")
            axios.post("https://yelpwithp.firebaseio.com/Plumber.json", data).then((res)=>{
                console.log("get success");
               
            }).catch((e)=>{
                console.log(e)
            })

            resolve(data);



        }).catch(e => {
            console.log(e);
        });



    });


    return promise


}

// create a GET route
app.get('/express_backend', (req, res) => {

    //get the search queries;
    let indexOfQuery=req.originalUrl.indexOf('?')+1;
    let queries=req.originalUrl.substring(indexOfQuery).split('&');
    let terms, city;


    for(let i=0; i<queries.length;i++){

        if(queries[i].indexOf('terms')==0){

            terms=queries[i].substring(queries[i].indexOf('=')+1);
        }
        if(queries[i].indexOf('location')==0){

            city=queries[i].substring(queries[i].indexOf('=')+1);
        }
    }


       let promises=[];
        for(let i=0;i<10;i++){
            promises.push(getDataFromYelp("Restaurants", "Sunnyvale",i*50));
        }
        console.log(promises)
        Promise.all(promises).then((data)=>{
            console.log("here");
              console.log(data);
             res.send({ express: data});
        }).catch(e=>{
            console.log(e)
        })







});

