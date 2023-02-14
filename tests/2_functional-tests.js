/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
// const server = "https://personal-library.freecodecamp.rocks/";

chai.use(chaiHttp);
let id = ''

suite('Functional Tests', function() {
  this.timeout(5000)
  
  /* ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       console.log(res.body)
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        let newBook = {
          title: 'this is a book title'
        }
        
        chai.request(server)
        .post('/api/books')
        .type('form')
        .send(newBook)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'title', 'response should contain title');
          assert.property(res.body, '_id', 'response should contain _id');
          assert.equal(res.body.title, newBook.title, 'response book should have the same title that we input');
          id = res.body._id
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        let newBook = {
          
        }
        
        chai.request(server)
        .post('/api/books')
        .type('form')
        .send(newBook)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title', 'response should give an error text');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'commentcount', 'Books should contain commentcount');
          assert.property(res.body, 'title', 'Books should contain title');
          assert.property(res.body, '_id', 'Books should contain _id');
          assert.equal(res.body._id, id, 'Books should have the same id ');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        let noId = "flkdjasfjslfjdlfj"
        chai.request(server)
        .get(`/api/books/${noId}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists", 'response should be not exist')
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        let comment = {
          comment: 'this is a comment'
        }
        chai.request(server)
        .post(`/api/books/${id}`)
        .type('form')
        .send(comment)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'commentcount', 'Books should contain commentcount');
          assert.property(res.body, 'title', 'Books should contain title');
          assert.property(res.body, '_id', 'Books should contain _id');
          assert.equal(res.body._id, id, 'Books should have the same id ');
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        let comment = {
        }
        chai.request(server)
        .post(`/api/books/${id}`)
        .type('form')
        .send(comment)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field comment", 'response should be error')
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        let comment = {
          comment: 'this is a comment'
        }
        let noId = "flkdjasfjslfjdlfj"
        chai.request(server)
        .post(`/api/books/${noId}`)
        .type('form')
        .send(comment)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists", 'response should be error')
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete(`/api/books/${id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "delete successful", 'response should be success')
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        let noId = "flkdjasfjslfjdlfj"
        chai.request(server)
        .delete(`/api/books/${noId}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists", 'response should be not exist')
          done();
        });
      });

    });

    suite('DELETE /api/books => delete all books ', function() {

      test('Test DELETE /api/books/ all books in db', function(done){
        chai.request(server)
        .delete(`/api/books`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "complete delete successful", 'response should be success')
          done();
        });
      });

    });

  });

});
