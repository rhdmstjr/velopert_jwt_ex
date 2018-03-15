const User = require('../../../models/user')


/*
    POST /api/auth/register
    {
        username,
        password
    }
*/
exports.register = (req, res) => {
    const { username, password } = req.body;
    let newUser = null;
    
    // create a new user if does not exist
    const create = (user) => {
        console.log("try create");
        if (user) {
            throw new Error('username exists');
        } else {
            return User.create(username, password);
        }
    }
    
    // count the number of the user
    const count = (user) => {
        console.log("try count");
        newUser = user;
        return User.count({}).exec();
    }
    
    // assing admin if count is 1
    const assign = (count) => {
        console.log("try assign");
        if (count === 1) {
            return newUser.assignAdmin();
        } else {
            // if not, return a promise that returns false
            return Promise.resolve(false);
        }
    }
    
    // respond to the client
    const respond = (isAdmin) => {
        console.log("try respond");
        res.json({
            message: 'registered successfully',
            admin: isAdmin ? true : false
        })
    }
    
    // run when there is an error (username eixsts)
    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }
    
    // check username duplication
    User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError)
}

exports.test = (req, res) => {
    res.send('[GET]this. router is working');
    
    const { username, password } = { "username": "rhdmstjr9", "password": "hello"};
    let newUser = null;
    
    console.log(username);
    // create a new user if does not exist
    const create = (user) => {
        if (user) {
            throw new Error('username exists');
        } else {
            return User.create(username, password);
        }
    }
    
    // count the number of the user
    const count = (user) => {
        newUser = user;
        return User.count({}).exec();
    }
    
    // assing admin if count is 1
    const assign = (count) => {
        console.log("assing called");
        console.log(count);
        if (count === 1) {
            return newUser.assignAdmin();
        } else {
            // if not, return a promise that returns false
            return Promise.resolve(false);
        }
    }
    
    // respond to the client
    const respond = (isAdmin) => {
        console.log("respond called");
        res.json({
            message: 'registered successfully',
            admin: isAdmin ? true : false
        });
    }
    
    // run when there is an error (username eixsts)
    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }
    
    // check username duplication
    User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    // .catch(onError)
}
