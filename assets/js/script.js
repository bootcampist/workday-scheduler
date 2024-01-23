//Global Variables
const container = $('.container');
const today = dayjs();
let timeInterval;
let timeDelay;
let localTimes = localStorage.getItem('localTimes');
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
$("#currentDay").text(today.format("dddd DD MMMM YYYY"));
};

//Access local storage upon starting the application
function initialise (){
    if (localTimes){
        localArray = JSON.parse(localTimes);
    } else {
        localString = JSON.stringify(times);
        localStorage.setItem('localTimes', localString);
    };
    current = today.format('HH:00');
};

//Persist events between refreshes of the page
function localise (){
    localString = JSON.stringify(localArray);
    localStorage.setItem('localTimes', localString);
};

//Create timeblocks for standard business hours
function render () {
    localArray.map((item)=>{
    
    //Create Elements
    const ulEl = $('<ul>');
    const liEl = $('<li>');

    const hourDiv = $('<div>').addClass('hour').text(item.time);
    const textarea = $('<textarea>').text(item.input);
    const saveBtn = $('<button>').addClass('saveBtn').html('<i class="fa-solid fa-floppy-disk"></i>');
    
    //Save user input in local storage when the save button is clicked
    saveBtn.on('click', (e)=>{
        item.input=textarea.val();
        localise();
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
    localArray.map((item)=>{
        num=localArray.indexOf(item);
        let li = $(`.li${num+1}`);
        switch (item.time === current){
            case true:  
                li.removeClass('past future').addClass('present');
                break;
            case false:
                item.time < current? li.removeClass('present future').addClass('past') : li.removeClass('past present').addClass('future');
                break;
        };
    });
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



timeDisplay();
initialise();
render();
timeDifference();
