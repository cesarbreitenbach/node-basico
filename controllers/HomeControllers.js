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

    const findFilters = (responseJson.tag === undefined ? { } : {tags:responseJson.tag} )

    const postsPromisse =  Post.getPosts(findFilters);

    const tagsPromisse =  Post.getTagsList();

    const [posts, tags] = await Promise.all([postsPromisse, tagsPromisse])

    responseJson.posts = posts;
    responseJson.tags = tags;

    for(i in responseJson.tags){
        
        if(responseJson.tags[i]._id == responseJson.tag){
            responseJson.tags[i].class='selected'
        }
    }

    console.log(posts[0])
    

    res.render('home', responseJson) 
}
