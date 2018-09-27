var nextDay = () => {
    var d = new Date();
    var dia = d.getDay();
    if (dia > 4) {
        if (dia == 5) {
            // Viernes
            d.setDate(d.getDate() + 3);
        }
        // Sábado
        d.setDate(d.getDate() + 2);
    } else {
        d.setDate(d.getDate() + 1);
    }
    return d;
};

var date2JSON = (date) => {
    return JSON.stringify(date).replace(/["]/g, '');
};

module.exports.nextDay = nextDay;
module.exports.date2JSON = date2JSON;