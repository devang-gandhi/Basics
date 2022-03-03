const mongoose = require('mongoose');

const schema = mongoose.Schema;

const blogschema = new schema({
    title : {
        type : String,
        required : true
    },
    snippet : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    }
} , {timestamps: true});

const blogs = mongoose.model('blogs' , blogschema);
module.exports = blogs;

