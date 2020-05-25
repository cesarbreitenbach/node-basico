const mongo = require('mongoose');
const Post = mongo.model('Post');


exports.index= async (req, res)=>{
    let responseJson = {   
        title:'POSTS CRIADOS',
        posts:[],
        tags:[],
        tag:'',
        class:''
    }


    responseJson.tag = req.query.t;
    console.log(req.user)

    const findFilters = (responseJson.tag === undefined ? { } : {tags:responseJson.tag} )

    const postsPromisse =  Post.find(findFilters);

    const tagsPromisse =  Post.getTagsList();

    const [posts, tags] = await Promise.all([postsPromisse, tagsPromisse])

    responseJson.posts = posts;
    responseJson.tags = tags;

    for(i in responseJson.tags){
        
        if(responseJson.tags[i]._id == responseJson.tag){
            responseJson.tags[i].class='selected'
        }
    }

    

    res.render('home', responseJson) 
}
