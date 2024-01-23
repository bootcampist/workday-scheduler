const container = $('.container');
const today = dayjs();
let localTimes = localStorage.getItem('localTimes');
let localString;
let localArray;
let value;
let current;
const times = [{time: dayjs().hour(8).format('HH:00'),
                input: ""},
                {time: dayjs().hour(9).format('HH:00'),
                input: ""},
                {time: dayjs().hour(10).format('HH:00'),
                input: ""},
                {time: dayjs().hour(11).format('HH:00'),
                input: ""},
                {time: dayjs().hour(12).format('HH:00'),
                input: ""},
                {time: dayjs().hour(13).format('HH:00'),
                input: ""},
                {time: dayjs().hour(14).format('HH:00'),
                input: ""},
                {time: dayjs().hour(15).format('HH:00'),
                input: ""},
                {time: dayjs().hour(16).format('HH:00'),
                input: ""},
                {time: dayjs().hour(17).format('HH:00'),
                input: ""},
                {time: dayjs().hour(18).format('HH:00'),
                input: ""},
            ];

function timeDisplay (){
$("#currentDay").text(today.format("dddd DD MMMM YYYY"));
}

function initialise (){
    if (localTimes){
        localArray = JSON.parse(localTimes);
    } else {
        localString = JSON.stringify(times);
        localStorage.setItem('localTimes', localString);
    }

    current = today.format('HH:00');
    console.log(current);
}

function localise (){
    localString = JSON.stringify(localArray);
    localStorage.setItem('localTimes', localString);
}

function render () {
    localArray.map((item)=>{
    
    //Create Elements
    const ulEl = $('<ul>');
    const liEl = $('<li>');

    const hourDiv = $('<div>').addClass('hour').text(item.time);
    const textarea = $('<textarea>').text(item.input);
    const saveBtn = $('<button>').addClass('saveBtn').html('<i class="fa-solid fa-floppy-disk"></i>');
    
    saveBtn.on('click', (e)=>{
        item.input=textarea.val();
        localise();
    });

    liEl.addClass('time-block').append(hourDiv, textarea, saveBtn);
    
    switch (item.time === current){
        case true:
            liEl.addClass('present');
            break;
        case false:
            item.time < current? liEl.addClass('past') : liEl.addClass('future')
            break;
    }
    ulEl.append(liEl);
    container.append(ulEl);
    }); 
}

timeDisplay();
initialise();
render();