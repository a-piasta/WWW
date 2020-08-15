let el = document.querySelectorAll('div.passenger') as NodeListOf<HTMLElement>;

var best: string = '';

function chooseBestPassenger(current: HTMLElement) {
    let currentValue = current.getAttribute('data-identyfikator-pasazera');
    if (currentValue > best) best = currentValue;
}

el.forEach(chooseBestPassenger);

alert(best);