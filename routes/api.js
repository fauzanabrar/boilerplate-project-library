/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';


module.exports = function (app, model) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      model.find({}, (err, docs)=>{
        if(err) return res.send("Error cant get all the books")
        return res.json(docs)
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if( title == undefined || title == ''){
        return res.send('missing required field title')
      }

      let newBook = new model({
        title,
        commentcount: 0
      })

      newBook.save((err, doc)=>{
        if(err) return res.send("missing required field title")
        return res.json({
          title,
          _id: doc._id,
        })
      })


    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      model.deleteMany({}, (err)=>{
        if(err) return res.send("Error")
        return res.send("complete delete successful")
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
      model.findById(bookid, (err, doc)=>{
        if(err) return res.send("no book exists")
        if(doc){
          return res.json(doc)
        }
        return res.send("no book exists")
      })

    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if(!comment || comment == undefined){
        return res.send('missing required field comment')
      }

      model.findById(bookid, (err, doc)=>{
        if(err|| !doc) return res.send("no book exists")
        doc.comments.push(comment)
        let commentcount = doc.comments.length
        model.findByIdAndUpdate(bookid, {
          comments: doc.comments,
          commentcount: commentcount
        },{new: true}, (err, docUpdate)=>{
          if(err) return res.send("error add comment")
          return res.json(docUpdate)
        })
      })

      


      

    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      model.deleteOne({_id: bookid}, (err, doc)=>{
        if(err) return res.send("no book exists")
        if(doc.deletedCount > 0){
          return res.send("delete successful")
        } 
        return res.send("no book exists")
      })

    });
  
};
