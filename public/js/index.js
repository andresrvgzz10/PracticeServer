

const TOKEN = "password123456"; 

function fetchStudents(){
    let url = "/api/students";
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${TOKEN}`
        }
    }

    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response =>{
            if(response.ok)
            {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( responseJSON => {
            console.log(responseJSON);

            for(let i = 0; i<responseJSON.length;i++){
                results.innerHTML += `<div> ${responseJSON[i].name} </div>`;
            }
        })
        .catch(err => {
            results.innerHTML = `<div> The authorization token is invalid </div>`;

        })



    
}

function addStudentFetch(name , id){

    let url = "/api/createStudent";

    let data = {
        name : name,
        id : Number(id)
    }
    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    }


    let results = document.querySelector('.results');


    fetch(url, settings)
    .then(response =>{
        if(response.ok)
        {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then( responseJSON => {
        console.log(responseJSON);
        
    })
    .catch(err => {
        results.innerHTML = `<div> The authorization token is invalid </div>`;

    })


}

function watchForm()
{
    //targe form
    let studentsForm = document.querySelector('.students-form');


    studentsForm.addEventListener('submit', (event) => {

        event.preventDefault();
        console.log("Click")

        fetchStudents();

    });

}

function watchAddStudentForm()
{
    //targe form
    let studentsForm = document.querySelector('.add-student-form');

    studentsForm.addEventListener('submit', (event) => {

        event.preventDefault();
        console.log("Click")
        let name = document.getElementById();
        let id = document.getElementById();

        addStudentFetch(name, id);

    });

}

function init()
{
    watchForm();
    watchAddStudentForm();
}

init();
