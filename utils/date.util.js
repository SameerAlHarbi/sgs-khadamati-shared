const dateUtil = require('date-and-time');

exports.defaultTextFormat = 'YYYY-MM-DDTHH:mm:ss';
exports.defaultCompiledFormat = 
    dateUtil.compile(this.defaultTextFormat);

exports.defaultSapTextFormat = 'YYYYMMDD';
exports.defaultSapCompiledFormat = 
    dateUtil.compile(this.defaultSapTextFormat);

exports.parseDate = (dateText, dateFormat = this.defaultCompiledFormat) => {

    if(!dateText) {
        return NaN;
    }

    return dateUtil.parse(dateText, dateFormat, false);

}

exports.formatDate = (dateObject, dateFormat = this.defaultCompiledFormat) => {

    if(!dateObject || isNaN(dateObject)) {
        return "";
    }

    let formatedDate = dateUtil.format(dateObject, dateFormat);

    return formatedDate;

}

exports.convertFormat = (dateText, dateFormat, newFormat) => {

    if(!dateText || !dateFormat || !newFormat) {
        return "";
    }

    let parsedDate = this.parseDate(dateText, dateFormat);

    if(!parsedDate || isNaN(parsedDate)) {
        return "";
    }

    let formatedDate = this.formatDate(parsedDate, newFormat);
    return formatedDate;
}

exports.calcDaysDuration = (startDateObject, endDateObject) => {
    return dateUtil.subtract(endDateObject, startDateObject).toDays();
}

exports.addDays = (dateObject ,daysCount) => {
    return dateUtil.addDays(dateObject, daysCount);
}