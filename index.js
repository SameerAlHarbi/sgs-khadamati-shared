exports.parseDate = (dateText, dateFormat = "YYYY-MM-DDTHH:mm:ss") => {

    if(!dateText) {
        return undefined;
    }

    console.log('Today');
    
    return new Date();
}