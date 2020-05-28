const User = require('../models/User')
const crypto = require('crypto')
const authMiddleware = require('../Middlewares/authMiddleware')
const mailHandler = require('../Handlers/MailHandler')

exports.login = (req, res) => {
    res.render('login')
}

exports.loginAction = (req, res) => {

    const auth = User.authenticate()
    auth(req.body.email, req.body.password, (error, result) => {
        if (!result) {
            req.flash('error', 'Login/Senha invalidos!')
            res.redirect('/users/login')
            return
        }
        req.login(result, () => { })

        res.redirect('/')

    })


}

exports.register = (req, res) => {
    res.render('register')
}

exports.registerAction = (req, res) => {

    const newUser = new User(req.body)

    //Utilizando metodo register da bibiloteca passport que foi adicionada ao Model User
    User.register(newUser, req.body.password, (error) => {
        if (error) {
            req.flash('error', 'Erro ao registrar, tente mais tarde.')
            res.redirect('/users/register')
            return
        }
        req.flash('success', 'Cadastrado com sucesso, efetue o login...')
        res.redirect('/users/login')
    })


}

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/')
}

exports.profile = (req, res) => {
    res.render('profile', req.user)
}

exports.profileAction = async (req, res) => {

    try {
        const usuario = await User.findOneAndUpdate(
            { '_id': req.user._id },
            { name: req.body.name, email: req.body.email },
            {
                new: true,
                runValidators: true
            }
        )
        req.flash('success', `Alterado com sucesso!`)
        res.redirect('/users/profile')
    } catch (e) {
        req.flash('error', `Ocorreu um erro: ${e}`)
        res.redirect('/users/profile')
    }
}

exports.forget = (req, res) => {
    res.render('forget')
}

exports.forgetAction = async (req, res) => {
    //verificar se o email existe
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'Email não existe')
        return res.redirect('/users/forget')
    }

    //gerar token e data de expiração de 1 hora e salvar no banco

    user.changePassToken = crypto.randomBytes(20).toString('hex')
    user.changePassExpires = Date.now() + 3600000;

    await user.save();

    //gerar link que vai resetar a senha

    const resetLink = `http://${req.headers.host}/user/reset/${user.changePassToken}`

    const html = `Link para alteração de senha: <a href='${resetLink}'>click aqui</a>`

    const text = `Link para alteração de senha: ${resetLink}`

    mailHandler.send({
        to:user.email,
        subject:'Alterar senha',
        html,
        text,

    })


    req.flash('success', `Link enviado para o email`)
    res.redirect('/users/forget')
}

validateToken = async (req) =>{
    //verifica se existe usuario com aquele token e se o token está valido, retorna user
    const user = await User.findOne({
        changePassToken: req.params.token,
        changePassExpires: { $gt: Date.now() }
    })
    return user
}

exports.forgetToken = async (req, res) => {
   
    //se token não for valido, redireciona para a pagina de esqueci a senha e da mensagem de erro
    const user = await validateToken(req, res);
    if (!user) {
        req.flash('error', 'Token expirado!')
        return res.redirect('/users/forget')
    }
    
    //tudo certo, redireciona para pagina de resetar a senha
    res.render('reset')
}

exports.forgetTokenAction = async (req, res) => {

    //se token não estiver mais valido, redireciona para a pagina de esqueci a senha e da mensagem de erro
    const user = await validateToken(req, res);
    if (!user) {
        req.flash('error', 'Token expirado!')
        return res.redirect('/users/forget')
    }

    //altera a senha do user

    req.user = user

    authMiddleware.changePass(req, res)

    
}