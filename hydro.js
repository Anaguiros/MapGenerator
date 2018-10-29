var north = document.getElementById('north'),
east = document.getElementById('east'),
south = document.getElementById('south'),
west = document.getElementById('west');

function randomizeWinds(){
    north.checked = Math.random() >= 0.75;
    east.checked = Math.random() >= 0.75;
    south.checked = Math.random() >= 0.75;
    west.checked = Math.random() >= 0.75;
}

function generatePrecipitation(){
    
    if (north.checked + east.checked + south.checked + west.checked === 0) {
        let side = Math.random();
        if (side >= 0.25 && side < 0.5) {
            north.checked = true;
        } else if (side >= 0.5 && side < 0.75) {
            east.checked = true;
        } else if (side >= 0.75) {
            south.checked = true;
        } else {
            west.checked = true;
        }
    }

    let sides = north.checked + east.checked + south.checked + west.checked,
    precipInit = precipitationInput.value / sides,
    selection = 10 / sides;

    if (north.checked){

    }
    if (east.checked){

    }
    if(south.checked){

    }
    if(west.checked){
        
    }

}