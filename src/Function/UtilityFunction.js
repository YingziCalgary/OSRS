
export class UtilityFunctionClass {

    static formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1; // Adding 1 to get the actual month (January is 0)
        var year = date.getFullYear();
    
        // Pad the month and day with leading zeros if needed
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
    
        return year + '-' + month + '-' + day;
    }

    static getArrFromFile (file, callback, delimiter){
        fetch(file)
        .then(r => r.text())
        .then(text => {
         const arr = text.split(delimiter);
         callback(arr);
       });
    }

}


