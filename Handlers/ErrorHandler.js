exports.notFound = (req, res, next) =>{
    let obj = {
        pageTitle:'Erro 404'
    }
    res.status = 404;
    res.render('404', obj)
}