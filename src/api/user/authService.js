const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./user');
const env = require('../../.env');

const emailRegex = /\S+@\S+.\S+/
//const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/
const passwordRegex = /\S/

const sendErrorsFromDB = (res, dbErrors) => {
    const errors = [];
    _.forIn(dbErrors.errors, error => errors.push(error.message));
    return res.status(400).json({
        errors
    });
}

const login = (req, res, next) => {
    const email = req.body.email || '';
    const password = req.body.email || '';

    User.findOne({
        email
    }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(req, err);
        } else if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(user, env.authSecret, {
                expireIn: '1 day'
            });
            const {
                name,
                email
            } = user;
            res.json({
                name,
                email,
                token
            });
        } else {
            return res.status(400).send({
                errors: ['Usuário/Senha inválidos']
            });
        }
    });
}

const validateToken = (req, res, next) => {
    const token = req.body.token || '';

    jwt.verify(token, env.authSecret, function (err, decoded) {
        return res.status(200).send({
            valid: !err
        });
    });
}

const singup = (req, res, next) => {
    const name = req.body.name || '';
    const email = req.body.email || '';
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || '';

    if (!email.match(emailRegex)) {
        return res.status(400).send({
            errors: ['O Email informado está inválido']
        });
    }

    if (!password.match(emailRegex)) {
        return res.status(400).send({
            errors: ['A senha precisa ter entre 1 e 20 caracteres']
        });
    }

    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({
            errors: ['As senhas não conferem']
        });
    }

    User.findOne({
        email
    }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err);
        } else if (user) {
            return res.status(400).send({
                errors: ['Usuário já cadastrado']
            });
        } else {
            const newUser = new User({
                name,
                email,
                password: passwordHash
            });

            newUser.save(err => {
                if (err) {
                    return sendErrorsFromDB(res, err);
                } else {
                    login(req, res, next);
                }
            });
        }
    });
}

module.exports = {
    login,
    singup,
    validateToken
}