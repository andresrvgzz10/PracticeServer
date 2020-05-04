const mongoose = require('mongoose');

//specify our collection schema
//building the structure od the table
const studentsCollectionSchema = mongoose.Schema({
    name : {
        type: String,
        require: true
    },
    id : {
        type: Number,
        require: true
    }
})

//create the schema if doesnt exist in mongo shield and if already exist 
const studentsCollection = mongoose.model( 'students' , studentsCollectionSchema );


//QUERY

const Students = {

    createStudent : function( newStudent ) {
        return studentsCollection
                //insert new student
                .create(newStudent)
                //send the information return
                .then(createdStudent => {
                    return createdStudent;
                })
                //error of any kind
                .catch( error => {
                    return error;
                });
    },

    getAllStudents : function () {
        return studentsCollection
            .find()
            //send the information return
            .then(allStudents => {
                return allStudents;
            })
            //error of any kind
            .catch( error => {
                return error;
            });

    }

}


module.exports = {Students};