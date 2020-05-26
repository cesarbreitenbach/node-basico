const mongoose = require("mongoose")
const Post = mongoose.model('Post')
const slug = require('slug');


exports.view = async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug })
    res.render('view', { post })
}

exports.add = (req, res) => {
    res.render('addpost')
}

exports.addAction = async (req, res) => {
    req.body.tags = req.body.tags.split(',').map(t => t.trim())

    req.body.author = req.user;

    const post = new Post(req.body)
    try {
        await post.save();
    } catch (error) {
        req.flash('error', 'Ocorreu um erro: ' + error.message)
    }

    req.flash('success', 'Post salvo com sucesso! ')
    res.redirect("/")
}

exports.edit = async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug })
    res.render('editpost', { post })
}

exports.editAction = async (req, res) => { 
    try {
        req.body.tags = req.body.tags.split(',').map(t => t.trim())

        req.body.slug = slug(req.body.title, { lower: true });
        const post = await Post.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            {
                new: true,
                runValidators: true 
            })

    } catch (error) {
        req.flash("error", "Erro: " + error.message);
        return res.redirect('/post/' + req.params.slug + '/edit')
    }
    req.flash("success", "Atualizado com sucesso")
    res.redirect('/')

}