module.exports = {
    passwordValidation: (req,res,next) => {
        const {password, repeatPassword} = req.body;

        if(password !== repeatPassword) {
            res.render('signup.hbs', {error: "Both passwords do not match!"})
            return;
        }
        
        next();
    } 
}