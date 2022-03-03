const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const blogs = require('./models/blog');


app.set('view engine','ejs');
app.use(express.static('style'));
app.use('/images',express.static('./images'));

const storage = multer.diskStorage({
    destination : 'images',
    filename : (req,file,cb) => {
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    },
});

const upload = multer({
    storage : storage
}).single('file');

//for post req only
app.use(express.urlencoded({extended :true}));

const url = 'mongodb+srv://dev:test1234@cluster0.d1wo9.mongodb.net/node-blog?retryWrites=true&w=majority'
mongoose.connect(url)
    .then((result) => {
        app.listen(3000);
        console.log('connected to database')})
    .catch((err) => console.log(err))


app.get('/',(req,res) => {
    res.redirect('/blogs');
});

app.get('/blogs' , (req,res) => {
    blogs.find().sort({createdAt : -1})
    .then((result) => {
        res.render('index' , {title : 'All blogs' , blogs:result});
    })
    .catch((err) => {
        console.log(err);
    })
});

app.post('/blogs' ,upload , (req,res) => {
    const blog = new blogs({
        title : req.body.title,
        snippet : req.body.snippet,
        body : req.body.body,
        image : req.file.filename
    })
    blog.save()
    .then((result) => {
        res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/blogs/:id' , (req,res) => {
    const id  = req.params.id;
    blogs.findById(id)
        .then((result) => {
            res.render('details' , {blogs : result,title : 'blog details'});
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/blogs/delete/:id' , (req,res) => {
    const id = req.params.id;
    blogs.findByIdAndDelete(id)
    .then((result) => {
        res.redirect('/blogs')
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/blogs/edit/:id' , (req,res) => {
    const id = req.params.id;
    blogs.findById(id)
    .then((result) => {
        res.render('update' ,{title : 'Update an existing blog' , data : result})
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/blogs/update' , upload , (req,res) => {
    const id = req.body.id;
    blogs.findByIdAndUpdate(id , {
        title : req.body.title,
        snippet : req.body.snippet,
        body : req.body.body, 
        image : req.file.filename
    })
    .then((result) => {
        res.redirect('/');
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/about',(req,res) => {
    res.render('about' , {title : 'About'});
});

app.get('/create',(req,res) => {
    res.render('create' , {title : 'Create a new blog'});
});

app.use( (req,res) => {
    res.status(404).render('404' , {title : '404 page'});
});