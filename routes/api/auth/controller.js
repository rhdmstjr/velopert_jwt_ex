const jwt = require('jsonwebtoken');
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
            return Promise.resolve(false)
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
    
    const { username, password } = { "username": "rhdmstjr11", "password": "hello"};
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
        console.log({
            message: 'registered successfully',
            admin: isAdmin ? true : false
        });
        
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
    .catch(onError)
}


/*
    POST /api/auth/login
    {
        username,
        password
    }
*/


exports.login_test = (req, res) => {
    res.send('[GET]login api is working')
    
    //const {username, password} = req.body;
    const {username, password} = { 'username':'rhdmstjr11', 'password':'hello'};
    const secret = req.app.get('jwt-secret')
    
    console.log(secret);
    
    // check the user info & generate the jwt
    const check = (user) => {
        if (!user){
            // user does not exist
            throw new Error('login failed')
        } else {
            // user exists, check the password
            if (user.verify(password)){
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign({
                        _id: user._id,
                        username: user.username,
                        admin: user.admin
                    },
                    secret,
                    {
                        expiresIn: '7d',
                        issuer: 'rhdmstjr',
                        subject: 'userInfo'
                    }, (err, token) => {
                        if (err) reject(err);
                        resolve(token);
                    })
                });
                return p;
            } else {
                throw new Error('login failed');
            }
        }
    }
    
    // respond the token
    const respond = (token) => {
        console.log("[respond]");
        console.log({
            message: 'logged in successfully',
            token
        });
        res.json({
            message: 'logged in successfully',
            token
        })
    }
    
    
    //error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }
    
    User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError)
}


/*
    GET /api/auth/check
*/

exports.check = (req, res) => {
    // read the token from header or url
    const token = req.headers['x-access-token'] || req.query.token
    
    // token does not exist 
    if(!token){
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }
    
    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        })
    )
    
    // if token is valid, it will respond with its info
    const respond = (token) => {
        res.json({
            success: true,
            info: token
        })
    }
    
    // if it has failed to verify, it will an error message
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }
    
    // process the promise
    p.then(respond).catch(onError)
}