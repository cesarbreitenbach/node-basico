const jimp = require('jimp');
const multer = require('multer');
const uuid = require('uuid');


const muterOptions = {
    storage:multer.memoryStorage(),
    fileFilter:(req, file, next)=>{
        const allowed = ['image/jpg', 'image/png', 'image/jpeg'];
        if(allowed.includes(file.mimetype)){
            next(null, true);
            return
        } else {
            next({message:'Formato do arquivo não permitido'}, false)
        }
    }
}

exports.upload = multer(muterOptions).single('photo');

exports.resize = async (req, res, next) =>{
    if (!req.file){
        next() 
        return
    }
    console.log('entrei no resize para dimensionar imagem..')
    const ext = req.file.mimetype.split('/')[1]; //Pega a extenção do arquivo, dando um split no mimetype do file e pegando a segunda posição que é a extenção.

    let fileName = `${uuid.v4()}.${ext}`;

    console.log(fileName)

    req.body.photo = fileName; 

    const photo = await jimp.read(req.file.buffer);
    await photo.resize(600, jimp.AUTO)
    await photo.write(`./public/uploads/${fileName}`)
    next()

};