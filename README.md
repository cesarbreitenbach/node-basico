# node-basico
Exercicios e desenvolvimento realizados no curso de node B7web

Esse é um projeto simples de um site feito em NodeJs, onde o usuario cria uma conta e insere posts com imagem e tags.

Descrição da implementação:
- Uso da biblioteca express e dependencias para controle das rotas e servidor
- Uso de mensagens flash() biblioteca express-flash
- Controle de cadastro e login de usuarios com biblioteca passport
- Upload de fotos e resize do tamanho utilizando bibliotecas jimp, mutler e uuid. Essa ultima para gerar um nome de arquivo unico.
- Controle de slugs, utilizando a biblioteca slug
- Uso de middlewares para controle de authenticação e controle de rotas, middleware para tratar upload de arquivos
- Usuario pode postar e editar posts
- Controle de menu conforme status do visitante
- uso da biblioteca crypto para gerar tags e controlar links de trocar senha
- Recuperar senha, envio de email utilizando nodemailer


Requerimentos:
- É necessário que seja instalado o MongoDB e biblioteca mongoose
download do mongodb: https://www.mongodb.com/download-center