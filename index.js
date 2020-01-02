const db = require("./config/db");
global.__basedir = __dirname;

db.on("error", console.error.bind(console, "connection error:"));
db.once('open', () => {
    const app = require("express")();
    const env = "development";
    const config = require("./config/config")[env];
    

    require("./config/express")(app);
    require('./config/routes')(app);
    
    app.listen(config.port, console.log("Application is running on port " + config.port));
    console.log("Conection to database done!");

});
