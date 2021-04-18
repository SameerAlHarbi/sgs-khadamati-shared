const dateUtil = require('../utils/date.util');

exports.parseQuery = (req, res, next) => {
    
    req.query.lang = req.query.lang ?  req.query.lang.toUpperCase() : 'A';

    if(req.query.ids)
        req.query.ids = req.query.ids.split(',');

    if(req.query.employeesIds)
        req.query.employeesIds = req.query.employeesIds.split(',');

    req.query.dateFormat = req.query.dateFormat ||
        dateUtil.defaultTextFormat;

    if(req.query.fromDate)  
        req.query.fromDate = dateUtil.parseDate(req.query.fromDate, 
            req.query.dateFormat);

    if(req.query.toDate)  
        req.query.toDate = dateUtil.parseDate(req.query.toDate, 
            req.query.dateFormat);

    if(req.query.registerFromDate)
        req.query.registerFromDate = dateUtil.parseDate(req.query.registerFromDate, 
            req.query.dateFormat);

    if(req.query.registerToDate)
        req.query.registerToDate = dateUtil.parseDate(req.query.registerToDate, 
            req.query.dateFormat);

    if(req.query.Types)
        req.query.Types = req.query.Types.split(',');

    if(req.query.effectDate)
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
 * Middleware function that set the default language for the request.
 * @param {string} defaultLanguage - The default language for the request if not exist.
 * @param {string} paramName - The language parameter name in the request object.
 * @returns {function} Middleware function.
 */
exports.setLanguage = (defaultLanguage = 'A', paramName = 'lang') => {

    return function(req, res, next) {

        req.query[paramName] = req.query[paramName] ?  req.query[paramName].toUpperCase() : defaultLanguage;

        next();
    }
}

/**
 * Middleware function that parse the specified dates parameters in the request object to dates objects.
 * @param {array<string>} paramsNames - Date parameters names in request.
 * @param {string} dateFormatParamName - Date format parameter name in request.
 * @param {boolean} removeNaN - Remove parameter and to be set it as undefined if the result of parsing date is NAN.
 * @param {boolean} utc -Parse date as utc.
 * @return {function} Middleware function.
 */
exports.parseDate = (paramsNames
    , dateFormatParamName = 'dateFormat'
    , removeNaN = true
    , utc = false
    , parseBody = false) => {

        return function(req, res, next) {
            
            if(!paramsNames || paramsNames.length < 1) {
                const error = new Error(`Invalid dates parameters names!`);
                error.httpStatusCode = 400;
                return next(error);
            }

            const reqParams = !parseBody ? req.query : req.body;

            reqParams[dateFormatParamName] = reqParams[dateFormatParamName] || 
                dateUtil.defaultTextFormat;

            paramsNames.forEach(paramName => {

                if(reqParams[paramName]) {
                    reqParams[paramName] = dateUtil.parseDate(reqParams[paramName], 
                        reqParams[dateFormatParamName], utc);

                    if (isNaN(reqParams[paramName].getTime()) && removeNaN) {
                        delete reqParams[paramName] ;
                    }
                }

            });

            next();
        }
}

/**
 * Middleware function that split the specified parameters in the request object to array of strings.
 * @param {Array<string>} paramsNames - Array of parameters names in the request object to be splited.
 * @param {string} symbol - Seplit character.
 * @return {function} Middleware function..
 */
exports.split = (paramsNames, symbol = ',') => {
    return function(req, res, next) {

        if(!paramsNames || paramsNames.length < 1) {
            const error = new Error(`Invalid parameters names!`);
            error.httpStatusCode = 400;
            return next(error);
        }

        paramsNames.forEach(paramName => {
            req.query[paramName] = req.query[paramName] ?
                 req.query[paramName].split(symbol) : [];
        });

        return next();
    }
}

/**
 * Middleware function that parse the specified boolean parameters in the request object to boolean objects.
 * @param {Array<string>} paramsNames - Array of parameters names in the request object to be parsed.
 * @param {string} defaultValue - Default value for boolean object.
 * @returns Middleware function..
 */
exports.parseBoolean = (paramsNames, defaultValue = false) => {

    return function(req, res, next) {

        if(!paramsNames || paramsNames.length < 1) {
            const error = new Error(`Invalid parameters names!`);
            error.httpStatusCode = 400;
            return next(error);
        }

        paramsNames.forEach(paramName => {

                req.query[paramName] = req.query[paramName] ? 
                    req.query[paramName] === 'true' : defaultValue ;

        });

        return next();
    }

}
