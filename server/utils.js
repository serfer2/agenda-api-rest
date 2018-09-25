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

module.exports.nextDay = nextDay;