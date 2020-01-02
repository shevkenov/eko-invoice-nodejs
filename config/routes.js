const validation = require('../utils/validator');
const {authentication} = require('../utils/auth');

const homeController = require('../controllers/home');
const notFoundController = require('../controllers/notFound');
const loginController = require('../controllers/login');
const vatController = require('../controllers/uploadVat');
const signupController = require('../controllers/signup');
const logoutController = require('../controllers/logout');
const uploadController = require('../controllers/upload');

module.exports = (app) => {
    
    app.get('/login', authentication, loginController.getLogin);
    app.post("/login", loginController.postLogin);

    app.get("/signup", signupController.getSignup);
    app.post("/signup", validation.passwordValidation, signupController.postSignup);

    app.get("/vat", authentication, vatController.getVat);
    app.post("/uploadVat", authentication, vatController.postVat);
    app.get("/downloadVat", authentication, vatController.getDownloadVat);

    app.get('/upload', authentication, uploadController.getUpload);
    app.post("/upload", authentication, uploadController.postUpload);

    app.get("/home", authentication, homeController.getHome);
    app.get("/", authentication, homeController.getHome);
    app.post('/invoice', authentication, homeController.postHome);

    app.get('/logout', logoutController.getLogout);

    app.get('*', notFoundController.getNotFound);
}