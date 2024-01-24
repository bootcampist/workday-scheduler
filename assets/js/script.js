//Global Variables
const container = $('.container');
let today = dayjs();
let timeInterval;
let timeDelay;
let num;
let localString;
let localArray;
let value;
let current;
const times = [{time: dayjs().hour(8).format('HH:00'), input: ""},
                {time: dayjs().hour(9).format('HH:00'), input: ""},
                {time: dayjs().hour(10).format('HH:00'), input: ""},
                {time: dayjs().hour(11).format('HH:00'), input: ""},
                {time: dayjs().hour(12).format('HH:00'), input: ""},
                {time: dayjs().hour(13).format('HH:00'), input: ""},
                {time: dayjs().hour(14).format('HH:00'), input: ""},
                {time: dayjs().hour(15).format('HH:00'), input: ""},
                {time: dayjs().hour(16).format('HH:00'), input: ""},
                {time: dayjs().hour(17).format('HH:00'), input: ""},
                {time: dayjs().hour(18).format('HH:00'), input: ""},];
let liArray = [];

//Display the Current Day
function timeDisplay (){
    today=dayjs();
    $("#currentDay").text(today.format("dddd DD MMMM YYYY"));
};

//Access local storage upon starting the application
function initialise (){
    let localTimes = localStorage.getItem('localTimes');
    if (localTimes){
        localArray = JSON.parse(localTimes);
    } else {
        localString = JSON.stringify(times);
        localStorage.setItem('localTimes', localString);
    };
};

//Persist events between refreshes of the page
function localise (){
    localString = JSON.stringify(localArray);
    localStorage.setItem('localTimes', localString);
};

//Create timeblocks for standard business hours
function render () {
    const ulEl = $('<ul>');
    ulEl.addClass('sortable');

    localArray.map((item)=>{
    
    //Create Elements
    const liEl = $('<li>');    
    const hourDiv = $('<div>').addClass('hour').text(item.time);
    const textarea = $('<textarea>').text(item.input);
    const saveBtn = $('<button>').addClass('saveBtn').html('<i class="fa-solid fa-floppy-disk"></i>');
    
    //Save user input in local storage when the save button is clicked
    saveBtn.on('click', (e)=>{
        item.input=textarea.val();
        localise();
    });

    hourDiv.on('click', (e)=>{
        e.preventDefault;
        sorting();
    });

    liEl.addClass('time-block').append(hourDiv, textarea, saveBtn);
    liEl.addClass(`li${liArray.length + 1}`);
    
    //Color-code time blocks based on past, present and future
    switch (item.time === current){
        case true:
            liEl.addClass('present');
            break;
        case false:
            item.time < current? liEl.addClass('past') : liEl.addClass('future')
            break;
    };
    liArray.push(liEl); 
    ulEl.append(liEl);
    container.append(ulEl);
    }); 
};

//Update past, present, future classes to change the colour every hour
function timeUpdate () {
    current = dayjs().format('HH:00');
    let divArray =[];
    divArray = $('.hour');
    divArray.map((item)=>{
        let li = divArray[item].parentNode;
        let divText = divArray[item].innerHTML;
        switch (divText === current){
            case true:  
                li.classList.remove('past', 'future');
                li.classList.add('present');
                break;
            case false:
                if(divText < current){
                    li.classList.remove('present','future');
                    li.classList.add('past');
                } else {
                    li.classList.remove('past', 'present');
                    li.classList.add('future');
                }
                break;
        };
    });
    timeDisplay();
};

//Set setinterval to run every hour to update li past, present, future classes
function timer (milliseconds){
    let delay = setTimeout(()=>{timeUpdate(); timeInterval = setInterval(timeUpdate, 3600000)},milliseconds);
};

//Calculate time until next hour
function timeDifference () {
    let now = dayjs();
    let next = dayjs().endOf('hour');
    let difference = next.diff(now, 'milliseconds');
    let minutes = next.diff(now, 'minutes');
    timeDelay = parseInt(difference);
  
    timer(timeDelay);
};

//Rearrange order of time blocks by dragging and update times to revert to chronilogical order on click
function sorting () {
    let hourArray = [];
    hourArray = $('li');
    hourArray.map((hour)=>{
        let div = hourArray[hour].childNodes[0];
        let userInput = hourArray[hour].childNodes[1];
        div.innerHTML = localArray[hour].time;
        localArray[hour].input = userInput.innerHTML;
        localise();
        initialise();
        timeUpdate();
    });  
}

timeDisplay();
initialise();
render();
timeDifference();
timeUpdate();

$(function () {
    $('.sortable').sortable();
  }); 