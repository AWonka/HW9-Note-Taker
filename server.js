const fs = require('fs');
const express = require('express');
const path = require('path');
const db = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());