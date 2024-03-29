const dateUtil = require("../utils/date.util");

exports.parseQuery = (req, res, next) => {
	req.query.lang = req.query.lang ? req.query.lang.toUpperCase() : "A";

	if (req.query.ids) req.query.ids = req.query.ids.split(",");

	if (req.query.employeesIds)
		req.query.employeesIds = req.query.employeesIds.split(",");

	req.query.dateFormat = req.query.dateFormat || dateUtil.defaultTextFormat;

	if (req.query.fromDate)
		req.query.fromDate = dateUtil.parseDate(
			req.query.fromDate,
			req.query.dateFormat
		);

	if (req.query.toDate)
		req.query.toDate = dateUtil.parseDate(
			req.query.toDate,
			req.query.dateFormat
		);

	if (req.query.registerFromDate)
		req.query.registerFromDate = dateUtil.parseDate(
			req.query.registerFromDate,
			req.query.dateFormat
		);

	if (req.query.registerToDate)
		req.query.registerToDate = dateUtil.parseDate(
			req.query.registerToDate,
			req.query.dateFormat
		);

	if (req.query.Types) req.query.Types = req.query.Types.split(",");

	if (req.query.effectDate)
		req.query.effectDate = dateUtil.parseDate(
			req.query.effectDate,
			req.query.dateFormat
		);

	next();
};

exports.validateNumberId = (req, res, next) => {
	if (isNaN(req.params.id)) {
		const error = new Error("Invalid id!");
		error.httpStatusCode = 400;
		return next(error);
	}

	next();
};

exports.validateNumberParam = (paramName) => {
	return function (req, res, next) {
		if (isNaN(req.params[paramName])) {
			const error = new Error(`Invalid ${paramName}!`);
			error.httpStatusCode = 400;
			return next(error);
		}
		next();
	};
};

/**
 * Middleware function that set the default language for the request.
 * @param {string} defaultLanguage - The default language for the request if not exist.
 * @param {string} paramName - The language parameter name in the request object.
 * @returns {function} Middleware function.
 */
exports.setLanguage = (defaultLanguage = "A", paramName = "lang") => {
	return function (req, res, next) {
		req.query[paramName] = req.query[paramName]
			? req.query[paramName].toUpperCase()
			: defaultLanguage;

		next();
	};
};

/**
 * Middleware function that parse the specified dates parameters in the request object to dates objects.
 * @param {array<string>} paramsNames - Date parameters names in request.
 * @param {string} dateFormatParamName - Date format parameter name in request.
 * @param {boolean} removeNaN - Remove parameter and to be set it as undefined if the result of parsing date is NAN.
 * @param {boolean} utc -Parse date as utc.
 * @return {function} Middleware function.
 */
exports.parseDate = (
	paramsNames,
	dateFormatParamName = "dateFormat",
	removeNaN = true,
	utc = false,
	parseBody = false
) => {
	return function (req, res, next) {
		if (!paramsNames || paramsNames.length < 1) {
			const error = new Error(`Invalid dates parameters names!`);
			error.httpStatusCode = 400;
			return next(error);
		}

		const reqParams = !parseBody ? req.query : req.body;

		reqParams[dateFormatParamName] =
			reqParams[dateFormatParamName] ||
			req.query[dateFormatParamName] ||
			dateUtil.defaultTextFormat;

		paramsNames.forEach((paramName) => {
			if (reqParams[paramName]) {
				reqParams[paramName] = dateUtil.parseDate(
					reqParams[paramName],
					reqParams[dateFormatParamName],
					utc
				);

				if (isNaN(reqParams[paramName].getTime()) && removeNaN) {
					delete reqParams[paramName];
				}
			}
		});

		next();
	};
};

/**
 * Middleware function that split the specified parameters in the request object to array of strings.
 * @param {Array<string>} paramsNames - Array of parameters names in the request object to be splited.
 * @param {string} symbol - Seplit character.
 * @return {function} Middleware function..
 */
exports.split = (paramsNames, symbol = ",") => {
	return function (req, res, next) {
		if (!paramsNames || paramsNames.length < 1) {
			const error = new Error(`Invalid parameters names!`);
			error.httpStatusCode = 400;
			return next(error);
		}

		paramsNames.forEach((paramName) => {
			req.query[paramName] = req.query[paramName]
				? req.query[paramName].split(symbol)
				: [];
		});

		return next();
	};
};

/**
 * Middleware function that parse the specified boolean parameters in the request object to boolean objects.
 * @param {Array<string>} paramsNames - Array of parameters names in the request object to be parsed.
 * @param {string} defaultValue - Default value for boolean object.
 * @returns Middleware function..
 */
exports.parseBoolean = (paramsNames, defaultValue = false) => {
	return function (req, res, next) {
		if (!paramsNames || paramsNames.length < 1) {
			const error = new Error(`Invalid parameters names!`);
			error.httpStatusCode = 400;
			return next(error);
		}

		paramsNames.forEach((paramName) => {
			req.query[paramName] = req.query[paramName]
				? req.query[paramName] === "true"
				: defaultValue;
		});

		return next();
	};
};

exports.parseNumberParams = (
	paramsNames,
	required = true,
	removeUnvalid = true,
	validateInteger = true,
	validateRange = true,
	min = 1,
	max = 10000,
	parseInteger = "non", // 'non|round|floor|ceil'
	fromBody = false
) => {
	return function (req, res, next) {
		if (!paramsNames || paramsNames.length < 1) {
			const error = new Error(`Invalid number parameters names!`);
			error.httpStatusCode = 400;
			return next(error);
		}

		const reqParams = !fromBody ? req.query : req.body;

		for (let paramName of paramsNames) {
			if (isNaN(reqParams[paramName])) {
				if (required === true) {
					const error = new Error(`${paramName} is required!`);
					error.httpStatusCode = 400;
					return next(error);
				} else if (removeUnvalid) {
					delete reqParams[paramName];
				}
				continue;
			}

			reqParams[paramName] = +reqParams[paramName];

			if (!Number.isInteger(reqParams[paramName]) && validateInteger === true) {
				const error = new Error(`${paramName} is invalid integer!`);
				error.httpStatusCode = 400;
				return next(error);
			}

			if (
				reqParams[paramName] < min ||
				(reqParams[paramName] > max && validateRange === true)
			) {
				const error = new Error(`${paramName} is out of range!`);
				error.httpStatusCode = 400;
				return next(error);
			}

			if (parseInteger !== "non") {
				switch (parseInteger) {
					case "round":
						reqParams[paramName] = Math.round(reqParams[paramName]);
						break;
					case "floor":
						reqParams[paramName] = Math.floor(reqParams[paramName]);
						break;
					default:
						reqParams[paramName] = Math.ceil(reqParams[paramName]);
				}
			}
		}

		return next();
	};
};

exports.validateEnums = (
	paramName,
	enumNames,
	required = true,
	defaultValue = undefined,
	fromBody = false
) => {
	return function (req, res, next) {
		if (!paramName) {
			const error = new Error(`Invalid parameter name!`);
			error.httpStatusCode = 500;
			return next(error);
		}

		if (!enumNames || enumNames.length < 1) {
			const error = new Error(`Invalid enum names!`);
			error.httpStatusCode = 500;
			return next(error);
		}

		const reqParam = !fromBody ? req.query : req.body;

		if (!reqParam[paramName]) {
			if (required === true) {
				const error = new Error(`${paramName} is required!`);
				error.httpStatusCode = 400;
				return next(error);
			}
			reqParam[paramName] = defaultValue;
		} else if (
			!enumNames.find(
				(enumName) =>
					enumName.toString().toUpperCase() ===
					reqParam[paramName].toString().toUpperCase()
			)
		) {
			const error = new Error(`${paramName} is invalid!`);
			error.httpStatusCode = 400;
			return next(error);
		}

		if (!isNaN(reqParam[paramName])) {
			reqParam[paramName] = +reqParam[paramName];
		}

		return next();
	};
};
