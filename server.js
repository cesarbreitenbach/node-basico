

require("dotenv").config({ path: "variables.env" });

//configura o mongo
const mongo = require("mongoose")
mongo.set('useUnifiedTopology', true);
mongo.Promise = global.Promise
mongo.connect(process.env.DATABASE, { useNewUrlParser: true });
mongo.connection.on('error', err => {
    console.log("Erro ao conectar no mongo: "+err);
  });

  //Carregar model post

  require('./models/Post')

  const app = require("./app");



const server = app.listen(process.env.PORT || 7777, () => {
    console.log("Estamos rodando na porta.. " + server.address().port)
});    