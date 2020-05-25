const express = require("express");
const mustache = require("mustache-express");
const helpers = require("./helpers")
const router = require("./routes/index");
const errorHandler = require("./Handlers/ErrorHandler") 
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("express-flash")
const mongoose  = require("mongoose")

//configurando autenticação usando bibliotacas passport e passport-local
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


//configurações

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(express.static(__dirname+ '/public/' ))

app.use(cookieParser(process.env.SECRET))

app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}))

//Antes das rotas, inicializar o passport e gerar uma sessão
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
mongoose.set('useFindAndModify', false);
app.use((req, res, next)=>{
    res.locals.h = {...helpers} // ... clona o objeto helpers, para que ele não seja sobrescrito no momento que o menu for montado levando em consideração logado/deslogado
    res.locals.flashes = req.flash()
    res.locals.user =  req.user

    //verifica se está authenticado.. 
    if(req.isAuthenticated()){
        //mostra os menus do objeto menu que esta dentro do locals h , filtra o array para condição logged:true
        res.locals.h.menu = res.locals.h.menu.filter(i=>i.logged)
    }else{
        //mostra os menus do objeto menu que esta dentro do locals h , filtra o array para condição guest:true
        res.locals.h.menu = res.locals.h.menu.filter(i=>i.guest)
    }

    next();
})



//Model de usuario
const User = require('./models/User')
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', router);
app.use(errorHandler.notFound); 


app.engine('mst', mustache(__dirname+'/views/partials', '.mst')); 
app.set('view engine', 'mst');
app.set('views', __dirname+'/views');

module.exports = app;