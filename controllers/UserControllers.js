const User = require('../models/User')

exports.login = (req, res) =>{
    res.render('login')
}

exports.loginAction = (req, res) =>{

    const auth = User.authenticate()
    auth(req.body.email, req.body.password, (error, result)=>{
        if(!result){
            req.flash('error','Login/Senha invalidos!')
            res.redirect('/users/login')
            return
        }
        req.login(result, ()=>{})

        res.redirect('/')
        
    })
    

}

exports.register = (req, res) =>{
    res.render('register')
}

exports.registerAction = (req, res)=>{

    const newUser = new User(req.body)

    //Utilizando metodo register da bibiloteca passport que foi adicionada ao Model User
    User.register(newUser, req.body.password, (error)=>{
        if(error){
            req.flash('error', 'Erro ao registrar, tente mais tarde.')
            res.redirect('/users/register')
            return
        }
        req.flash('success', 'Cadastrado com sucesso, efetue o login...')
        res.redirect('/users/login')
    })


}

exports.logout = (req, res) =>{
    req.logout();
    res.redirect('/')
}