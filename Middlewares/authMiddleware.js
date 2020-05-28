exports.isLogged = (req, res, next) => {
    //Utiliza a função isAuthenticated do passport, para verificar se está ou não autenticado. 
    //se não estiver, ele da o erro e redireciona o usuario para a pagina de login.
    if(!req.isAuthenticated()){
        req.flash('error', 'Opss.. ação não permitida!');
        res.redirect('/users/login')
        return
    }
    //está autenticado, vai pra proxima função..
    next()
}

exports.changePass = (req, res) => {

    if(req.body.password != req.body['password-confirm']){
        req.flash('error', 'Senhas não conferem!')
        return res.redirect('back')
    }

    req.user.setPassword(req.body.password, async ()=>{
        await req.user.save()
        req.flash('success', 'Senha alterada com sucesso!')
        res.redirect('/')
    })

}