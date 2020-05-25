const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise

//Criar o schema no mongoose para o usuario. Ele está basicamente criando a estrutura do documento USER que vai ser gavado no MongoDB
const userSchema = new mongoose.Schema({
    name:String,
    email:String
})


//Adiciona o plugin passport-local-mongoose para utilizarmos as funções do passport no model User
userSchema.plugin(passportLocalMongoose, { usernameField:'email' });

//Está linha exporta o modelo User.
//Os parametros são: 
//Nome do arquivo, no caso User
//Qual o Schema a ser usado, criado no passo anterior.
module.exports = mongoose.model('User', userSchema)