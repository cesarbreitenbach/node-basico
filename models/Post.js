const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slug')
const crypto = require('crypto')


const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Precisa de um titulo'
    },
    corpo: {
        type: String,
        trim: true
    },
    slug: String,
    tags: [String],
    photo: String,
    author: mongoose.SchemaTypes.ObjectId
})

PostSchema.pre('save', async function (next) {

    if (this.isModified('title')) {
        this.slug = slug(this.title, { lower: true })

        const slugRegex = new RegExp(`^(${this.slug})((-[A,z0,9]{1,}$)?)$`, 'i');

        const postsWithSlug = await this.constructor.find({ slug: slugRegex })

        //Caso já exista um slug no banco ele cria o proximo com um hash de 6 digitos
        if (postsWithSlug.length > 0) {
            let hash = crypto.randomBytes(6).toString('hex');
            this.slug = `${this.slug}-${hash}`
        }

    }
    next();
});

PostSchema.statics.getTagsList = function () {
    return this.aggregate([

        { $unwind: '$tags' },
        {
            $group:
            {
                _id: '$tags',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }

    ])

}

PostSchema.statics.getPosts = function (filters = {}) {

    return this.aggregate([
        { $match: filters },
        {
            $lookup:
            {
                //join em users
                from: 'users',
                //cria variavel author baseada no campo author da estrutura
                let:{'author':'$author'}, 
                //seria o where basicamente.. bater a expreção author equals _id
                pipeline:[
                    { $match:{ $expr:{ $eq:['$$author','$_id']}}},
                    { $limit:1 }
                ],
                as: 'author'
            },
        },
        {
            $addFields:{
                'author':{ $arrayElemAt:[  '$author.name' , 0 ]}
            }
        }
    ])

} 

module.exports = mongoose.model('Post', PostSchema);