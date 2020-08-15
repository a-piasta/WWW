var el = document.querySelectorAll('div.passenger');
var best = '';
function chooseBestPassenger(current) {
    var currentValue = current.getAttribute('data-identyfikator-pasazera');
    if (currentValue > best)
        best = currentValue;
}
el.forEach(chooseBestPassenger);
alert(best);
