const dateUtil = require('date-and-time');

exports.defaultTextFormat = 'YYYY-MM-DDTHH:mm:ss';
exports.defaultCompiledFormat = 
    dateUtil.compile(this.defaultTextFormat);

exports.defaultSapTextFormat = 'YYYYMMDD';
exports.defaultSapCompiledFormat = 
    dateUtil.compile(this.defaultSapTextFormat);

exports.defaultSapTimeFormat = 'HHmmss';

exports.parseDate = (dateText, dateFormat = this.defaultCompiledFormat, utc = false) => {

    if(!dateText) {
        return NaN;
    }

    return dateUtil.parse(dateText, dateFormat, utc);

}

exports.formatDate = (dateObject, dateFormat = this.defaultCompiledFormat, utc = false) => {

    if(!dateObject || isNaN(dateObject)) {
        return "";
    }

    const formatedDate = dateUtil.format(dateObject, dateFormat, utc);

    return formatedDate;

}

exports.convertFormat = (dateText, dateFormat, newFormat, utc = false) => {

    if(!dateText || !dateFormat || !newFormat) {
        return "";
    }

    const parsedDate = this.parseDate(dateText, dateFormat, utc);

    if(!parsedDate || isNaN(parsedDate)) {
        return "";
    }

    const formatedDate = this.formatDate(parsedDate, newFormat, utc);
    return formatedDate;
}

exports.calcDaysDuration = (startDateObject, endDateObject) => {
    return dateUtil.subtract(endDateObject, startDateObject).toDays();
}

exports.addDays = (dateObject ,daysCount) => {
    return dateUtil.addDays(dateObject, daysCount);
}