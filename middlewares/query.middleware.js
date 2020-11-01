const dateUtil = require('../utils/date.util');

exports.parseQuery = (req, res, next) => {
    
    req.query.lang = req.query.lang || 'A';

    req.query.ids = req.query.ids ? 
        req.query.ids.split(',') : [];

    req.query.employees = req.query.employees ? 
        req.query.employees.split(',') : [];

    req.query.dateFormat = req.query.dateFormat ||
        dateUtil.defaultTextFormat;

    req.query.fromDate = dateUtil.parseDate(req.query.fromDate, 
        req.query.dateFormat);

    req.query.toDate = dateUtil.parseDate(req.query.toDate, 
        req.query.dateFormat);

    req.query.registerFromDate = dateUtil.parseDate(req.query.registerFromDate, 
        req.query.dateFormat);

    req.query.registerToDate = dateUtil.parseDate(req.query.registerToDate, 
        req.query.dateFormat);

    req.query.Types = req.query.Types ? 
        req.query.Types.split(',') : [];

    req.query.effectDate = dateUtil.parseDate(req.query.effectDate, 
        req.query.dateFormat);

    next();
}

exports.validateNumberId = (req, res, next) => {

    if(isNaN(req.params.id)) {

        const error = new Error('Invalid id!');
        error.httpStatusCode = 400;
        return next(error);
    }

    next();
}

exports.validateNumberParam = (paramName) => {
    return function(req, res, next) {
        if(isNaN(req.params[paramName]))
        {
            const error = new Error(`Invalid ${paramName}!`);
            error.httpStatusCode = 400;
            return next(error);
        }
        next();
    }
}

/**
 * Middleware function that parse the specified dates parameters in the request object to dates objects.
 * @param {string} paramsNames - Date parameters names in request.
 * @param {string} dateFormatParamName - Date format parameter name in request.
 * @return {function} - Middleware function.
 */
exports.parseDate = (paramsNames, dateFormatParamName = 'dateFormat') => {
    return function(req, res, next) {
        
        if(!paramsNames || paramsNames.length < 1) {
            const error = new Error(`Invalid dates parameters names!`);
            error.httpStatusCode = 400;
            return next(error);
        }

        req.query[dateFormatParamName] = req.query[dateFormatParamName] || 
            dateUtil.defaultTextFormat;

        paramsNames.forEach(paramName => {
            req.query[paramName] = dateUtil.parseDate(req.query[paramName], 
                req.query[dateFormatParamName]);
        });

        next();
    }
}