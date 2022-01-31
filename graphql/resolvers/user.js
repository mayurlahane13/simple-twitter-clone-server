const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, SECRET_KEY, { expiresIn: '1h' }); //the first arguement is the payload(the data that should be encoded with the token) 
    //and the second arguement is a secret key, and the options is the 3rd arguement
};

module.exports = {
    Mutation: {
        async register(parent, {
            registerInput: {
                username,
                email,
                password,
                confirmPassword
            }
        }, context, info) {
            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                });
            }
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: 'This username is already taken'
                    }
                });
            }
            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            });
            const result = await newUser.save();
            const token = generateToken(result);
            return {
                ...result._doc, //result._doc is storing all the properties of User model, and the spread operator just adds all of them to the return 
                id: result._id,
                token
            };
        },
        async login(parent, { username, password }, context, info) {
            const { errors, valid } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                });
            }
            const user = await User.findOne({ username });
            if (!user) {
                errors.general = 'Incorrect username/password';
                throw new UserInputError('Incorrect username', { errors });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                errors.general = 'Incorrect username/password';
                throw new UserInputError('Incorrect password', { errors });
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };
        }
    }
};