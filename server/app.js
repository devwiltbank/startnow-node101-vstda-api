/*****************************************
 * 8/29/2018 - DW
 * help from larrycustudio code on github
 * 
 ****************************************/
const express       = require('express');
const morgan        = require('morgan');
const app           = express();
const bodyParser    = require('body-parser')

const initialArray  = [
        { todoItemId: 0,
          name: 'an item',
          priority: 3,
          completed: false
        },
        {
          todoItemId: 1,
          name: 'another item',
          priority: 2,
          completed: false
        },
        {
          todoItemId: 2,
          name: 'a done item',
          priority: 1,
          completed: true
        }
];
  
//console.log(initialArray);

// the middleware
app.use(morgan('tiny'));
app.use(bodyParser.json());

// default route, return json object
app.get ('/', (req, res)  => {
    res.status(200).json({
        status: 'ok'
    });
});

/* FYI- app.get('/hi/:param1', function(req, res){} );
   givin this URL http://www.google.com/hi/there?qs1=you&qs2=tube
   req.query will give {qs1: 'you', qs2: 'tube'}
   req.params will give {param1: 'there'}
*/

// route to return all items
app.get ('/api/TodoItems', (req, res) => {
    res.status(200).json(initialArray);
//console.log('get all the things page ok');
});

// route to read and return a single item
app.get ('/api/TodoItems/:number', (req, res) => {
    let responseObj = {};
       if(req.params.number < initialArray.length) {
        for(let index in initialArray) {
            if(initialArray[index].todoItemId == req.params.number) {
                responseObj = initialArray[index];
            }
        }
    }
    res.status(200).json(responseObj);
});

// POST a todo item and send back what it was
app.post('/api/TodoItems/', (req, res) => {
    isToDoNew = true;
    for(let objIndex in initialArray) {
        if(initialArray[objIndex].todoItemId == req.body.todoItemId) {
            initialArray[objIndex] = req.body;
            res.status(201).send(initialArray[objIndex]);
            isToDoNew = !isToDoNew;
        }
    }
    if (isToDoNew) {
        initialArray.push(req.body);
        res.status(201).json(req.body);
    }
});

// delete a todo item
app.delete('/api/TodoItems/:number', (req, res) => {
    res.send(initialArray[req.params.number]);
    initialArray.splice(req.params.number, 1);
});

//PUT a todo item
app.put("/api/TodoItems/:number", (req, res) => {
    res.send(req.body);
    initialArray.splice(req.params.number, 1, req.body);
});

//PATCH a todo item
app.patch("/api/TodoItems/:id/:prop/:val", (req, res) => {
    if (req.params.id < initialArray.length && initialArray[req.params.id].hasOwnProperty(req.params.prop)) {
        initialArray[req.params.id][req.params.prop] = req.params.val;
        res.send(initialArray[req.params.id]);
    } else {
        //handle invalid patch request
        res.send("Invalid PATCH request...try again!");
    }
})
module.exports = app;