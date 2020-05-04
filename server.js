//import what it is in express library
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const {DATABASE_URL, PORT} = require('./config');

//database
const { Students } = require('./studentModel');
const mongoose = require('mongoose');

const validateApiKey = require('./middleware/validate-bearer-token');
const cors = require('./middleware/cors');

//my app use the feature of express
const app = express();
const jsonParser = bodyParser.json();

//const APIKEY = "password123456";

//app.use( morgan('dev'));

app.use(express.static("public"))

/*
request
response
excetue "next" part that need to be execute 

reusar en mas de un endpoint this middlewear like date etc

function middlewear(req,resp,next)
{
    console.log("middlewear")
    req.test = {};
    req.test.message ="Adding something to the the request!";
    next();
}
*/


/*
function validateApiKey(req,res,next)
{
    if (!req.headers.authorization)
    {
        res.statusMessage = "Unathorized Message. Please send the APIKEY"
        return res.status(401).end;      
    }

    if(req.headers.authorization !== `Bearer ${APIKEY}`){
        res.statusMessage = "Unathorized Request. Invalid APIKEY"
        return res.status(401).end;   
    }

    next();
    
}
*/
app.use(validateApiKey);
app.use(cors);

let listOfStudents = [
    {
        name : "Marcel",
        id: 123,
    },
    {
        name : "Martha",
        id: 456,
    },
    {
        name : "Julieta",
        id: 789,
    },
    {
        name : "Alfredo",
        id: 847,
    }

];

//get end-point 
//first parameter url
//second parameter arrow function (request and response)
app.get('/api/students', (req,res) => {
    console.log("Getting all students.");


    Students
        .getAllStudents()
        .then( result =>{
            return res.status(200).json(result);

        })    
});


//get end-point with parameter
app.get('/api/studentById', (req,res) => {
    console.log("Getting student by Id using query string");

    //paramters are send on the url
    console.log(req.query);

    //retrieve the parameter
    let id = req.query.id;

    //also you can use !id
    if( id === undefined)
    {
        res.statusMessage = "Please send the 'id' as parameter";
        return res.status( 406 ).end();

    }

    //search in the json the id
    let result = listOfStudents.find( (students) => {
        if(students.id == id)
        {
            return students;
        }
    });

    //what happend if we dont find the id
    if(!result)
    {
        res.statusMessage = `There are no students with the provided id=${id}`;
        return res.status( 404 ).end();
    }


    return res.status(200).json(result);

});


//alternative way to send as a parameter
app.get('/api/getStudentById/:id', (req,res) =>{

    console.log("Getting student by Id using the integreted param.");
    console.log(req.params);

    let id =  req.params.id;

    //search in the json the id
    let result = listOfStudents.find( (students) => {
        if(students.id == id)
        {
            return students;
        }
    });

    //what happend if we dont find the id
    if(!result)
    {
        res.statusMessage = `There are no students with the provided id=${id}`;
        return res.status( 404 ).end();
    }

    return res.status(200).json(result);


});

///POST - Endpoint 
// jsonParser es un middlewear se ejecuta primero que todo para parser into  a json despues estaria disponible en el req
// If we want to put the middleware here we need to put as an array [jsonParser, middleware]
app.post('/api/createStudent' , jsonParser, (req,res) => {
    console.log("Adding a new student to the list");

    console.log("Body : ", req.body);

    let name =  req.body.name;
    let id = req.body.id;

    //que el body tenga los parametros que necesitamos
    if(!id || !name){
        res.statusMessage = `One of this two parameters are missing in the request 'id'/'name'`;
        return res.status( 406 ).end();
    }

    //hacer un loop para identificar que el id no se repita
    /*let findId = listOfStudents.find( (students) => {
        if(students.id == id)
        {
            res.statusMessage = `The id already exist`;
            return res.status( 406 ).end(); 
        }
    });*/

    if(typeof(id) !== 'number')
    {
        res.statusMessage = `std: id is not a number`;
        return res.status( 406 ).end(); 
    }

    let flag = true;
    for(let i = 0; i < listOfStudents.length; i++)
    {
        if(listOfStudents[i].id === id)
        {
            flag =  false
            break;
            /*
            res.statusMessage = `The id already exist`;
            return res.status( 406 ).end(); 
            */

        }
    }


    //Validate if id exist
    const newStudent = {
        id,
        name

    };
    Students
        .createStudent( newStudent )
        .then( result =>{
            return res.status( 201 ).json(result);
        })
        .catch ( error =>{
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });


});

app.delete('/api/removeStudent' ,  (req,res) => {

    console.log("Deleting student");
    console.log(req.params);

    let id =  req.query.id;

    if(!id)
    {
        res.statusMessage = "Please send the 'id' as parameter";
        return res.status( 406 ).end();

    }

    //see if student exist
    let itemToRemove =  listOfStudents.findIndex((studentById)=>{
        if(studentById.id === Number(id))
        {
            return true;
        }
    })

    //si es -1 significa que no hay
    if(itemToRemove<0)
    {
        res.statusMessage = "The 'id' was not found on the list of student";
        return res.status( 404 ).end();
    }

    //now that we have the index remove form the list with the splice
    listOfStudents.splice(itemToRemove,1)

    return res.status(204).end();

})

//where the server will be accesible API- Primary endpoint
//http://localhost:8080
app.listen(PORT, () => {

    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {

        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });


});


//original
//mongodb+srv://test:<password>@cluster0-oergi.mongodb.net/test?retryWrites=true&w=majority
//change
//mongodb+srv://test:qwerty123@cluster0-oergi.mongodb.net/studentsdb?retryWrites=true&w=majority

