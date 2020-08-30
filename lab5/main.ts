console.log("dupa");

function zaloguj(...komunikaty: string[]) {
    console.log("adada", ...komunikaty);
}

zaloguj("aaaa", "bbbb", "cvxdcsd");

let jsonString: string = `{
    "lotniska": {
        "WAW": ["Warszawa", [3690, 2800]],
        "NRT": ["Narita", [4000, 2500]],
        "BQH": ["Biggin Hill", [1802, 792]],
        "LBG": ["Paris-Le Bourget", [2665, 3000, 1845]]
    }
}`;

type Pilot = {
    name: string;
}

interface ILotnisko {
    string: [string, number[]];
}

interface ILiniaLotnicza {
    piloci: Pilot[];
    lotniska: {string: ILotnisko};
}

let dataStructure: ILiniaLotnicza = JSON.parse(jsonString);

console.log(dataStructure.piloci.length);
