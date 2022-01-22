const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const fs = require('fs');
const { readFromFile, writeToFile} = require('./helpers/fsUtils');

const uuid = require('./helpers/uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get('/api/notes', (req, res) => res.json(noteData));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add Note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
        }
         
        noteData.push(newNote);
        //   readAndAppend(stuff);
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              // Convert string into JSON object
              const parsedNotes = JSON.parse(data);
      
              // Add a new review
              parsedNotes.push(newNote);
      
              // Write updated reviews back to the file
              fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 2),
                (writeErr) =>
                  writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated reviews!')
              ); 
            }
          });   
          

    const response = {
        status: 'success',
        body: newNote,
        }
    

    console.log(response);
    res.status(201).json(response)
    } else {
        res.status(500).json('Error in posting review');
    }
});

app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "./db/db.json");
    // console.log(req.param.id);
    // console.log(noteData);
  
    readFromFile("./db/db.json").then((data) => {
  
     const newVariable = JSON.parse(data) 
      for (let i = 0; i < newVariable.length; i++) {
        if (newVariable[i].id == req.params.id) {
          noteData.splice(i, 1);
          break;
      }
      }
      fs.writeFile(jsonFilePath, JSON.stringify(noteData, null, 2), function (err) {
        if (err) {
          return console.log(err);
        } else {
          console.log("Note was deleted");
        }
      });
      res.json(noteData);
    })
    });
  
    

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


app.listen(PORT, function() {
        console.log(`App listening at http://localhost:${PORT}`);
});

