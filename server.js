const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const fs = require('fs');

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
            note_id: uuid()
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              // Convert string into JSON object
              const parsedReviews = JSON.parse(data);
      
              // Add a new review
              parsedReviews.push(newNote);
      
              // Write updated reviews back to the file
              fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedReviews, null, 4),
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



app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


app.listen(PORT, function() {
        console.log(`App listening at http://localhost:${PORT}`);
});