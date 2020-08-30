setTimeout(() => {
  console.log('No już wreszcie.');
}, 2000);

function sleep(ile: Number) {
    return new Promise(resolve => setTimeout(resolve, ile));
}

function zmien(fun: (bodyEl: HTMLElement) => void) {
}

function teczoweKolory(el: HTMLElement) {

}