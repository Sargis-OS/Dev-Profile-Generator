const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
var pdf = require("html-pdf");

function generateHTML(data, color) {
  return `
 
    <!DOCTYPE html>
    <html lang="en"><head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    
    
    <style>
    .container{
      margin-right: 0;
      margin-left: 0;
      font-family: Helvetica, Arial;    
    }
    .card-body{
      background-color: navy;
      color:yellow;
      text-align: center;
      padding: 10px;
      margin: 10px;
    }
    img{
      width: 200px;
      height: 200px;
    }
    </style> 
    
    <title>Profile Generator</title>
  </head>
    <body>
      <div class="container">
        
        <div class="row">
            <div class="col-lg-9 card-body">
                  <img src="https://media-exp1.licdn.com/dms/image/C5603AQEEI8cpFyfPog/profile-displayphoto-shrink_200_200/0?e=1585180800&v=beta&t=dFCkkSKp-hA5dlDR5VuF6bIgSoMPiyFD4X-IHf60mT0" alt="...">
                  <h2> Hello Everyone! </h2>
                  <h2> My name is Geoff McCammon</h2>
              </div>
          </div>
         
          <div class="row text-center">
              <div class="col-lg-4 card-body">
                <h2>Public Respositories</h2>
                <h4>16</h4>
              </div>
             
              <div class="col-lg-4 card-body">
                  <h2>Followers</h2>
                  <h4>5</h4>
                </div> 
          </div>
         
          <div class="row">
              <div class="col-lg-4 card-body">
                <h2>Github Stars</h2>
                <h4>0</h4>
              </div>
              
              <div class="col-lg-4 card-body">
                  <h2>Following</h2>
                  <h4>6</h4>
                </div> 
          </div>
      </div>
  
  </body>
  </html>`;
}

function userInput() {
  inquirer
    .prompt([
      {
        message: "Please enter your GitHub username:",
        name: "name"
      },
      {
        type: "list",
        message: "Please enter your favorite color:",
        name: "color",
        choices: ["Blue", "Black", "Gold", "Green", "Red", "Orange", "Pink"]
      }
    ])
    .then(function({ name, color }) {
      const queryUrl = `https://api.github.com/users/${name}`;
      console.log(queryUrl);

      axios.get(queryUrl).then(function(res) {
        const queryUrl = `https://api.github.com/users/${name}/repos`;
        axios.get(queryUrl).then(function() {
          const profile = generateHTML(res.data, color);
          console.log();
          fs.writeFile("./index.html", profile, function(err) {
            if (err) {
              throw err;
            }
            var html = fs.readFileSync("./index.html", "utf8");
            var options = {
              format: "Letter"
            };

            pdf
              .create(html, options)
              .toFile("./profile.pdf", function(err, res) {
                if (err) return console.log(err);
                console.log(res);
              });

            console.log("HTML generated");
          });
        });
      });
    });
}

userInput();
