const _ = require('lodash');

module.exports = (req, res, next) => {
    const bundle = res.locals.bundle;

    if (bundle.errors) {
        const errors = parseErrors(bundle.errors);
        res.status(500).json({
            errors
        });
    } else {
        next();
    }
}

const parseErrors = (noreRestfulErrors) => {
    const errors = [];
    _.forIn(noreRestfulErrors, error => errors.push(error.message));
    return errors;
};