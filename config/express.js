const bodyParser = require('body-parser');
const cookiePrser = require('cookie-parser');
const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars')

module.exports = (app) => {
    app.engine(
      "hbs",
      handlebars({
        extname: "hbs",
        defaultLayout: "main",
        layoutsDir: "views",
        partialsDir: "views/partials"
      })
    );

    app.use(cookiePrser());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(express.static(path.resolve(__basedir, 'static')));
}