const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = error.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12).then(hashedPw => {
        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        });
        return user.save();
    }).then(result => {
        res.status(201).json({ message: 'User Created!', useId: result._id });
    }).catch(err => cosole.log(err));
}


exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }).then(user => {
        if (!user) {
            const error = new Error('A user with this details could not found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrupt.compare(password, user.password);
    }).then(isEqual => {
        if (!isEqual) {
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser_id.toString()
        },'secretKey',
        {expiresIn:'1h'}
    );
    res.status(200).json({
        token: token,userId:loadedUser._id.toString()
    });
    })
        .catch(err => console.log(err))

}