window.onload=function(){
function Card(id, color, addr, state){ //card constructer
    this.id = id; //0~card_num-1
    this.color = color, //花色 1~color_num / 0->蓋牌
    this.addr = addr, //address = 0~card_num-1
    this.state = state //show=1 or nshow=0
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
let first = true;
let start = false;
let starting = false;
let check = false;
let time = 0;
let found = 0;
let open1 = -1;
let open2 = -1;
let color_num = 8; //花色數量
let card_num = color_num*2; //卡片數量
let cards = new Array(card_num); //卡片 array
let addrs = new Array(card_num);
let addr_remaining = new Array(card_num); 
let board = document.getElementById("board");
let card_src = [
    "./pictures/000.jpeg",
    "./pictures/001.jpeg",
    "./pictures/002.jpeg",
    "./pictures/003.jpeg",
    "./pictures/004.jpeg",
    "./pictures/005.jpeg",
    "./pictures/006.jpeg",
    "./pictures/007.jpeg",
    "./pictures/008.jpeg"
]



function shuffle(){
    for(let i=0;i<card_num;i++){
        addr_remaining[i] = i;
    }
    for(let i=0;i<card_num;i++){
        let my_index = getRandomInt(addr_remaining.length);
        let my_addr = addr_remaining[ my_index ];
        addrs[i] = my_addr;
        addr_remaining.splice(my_index,1);
        cards[i] = new Card(i, (i%color_num)+1, my_addr, 0);
     
        let row = Math.floor(i/4);
		let col = i % 4;
		board.rows[row].cells[col].innerHTML = "<img src = \" " + card_src[0] + "\">";
		board.rows[row].cells[col].onclick = boardClick; 
        board.rows[row].cells[col].id = i;
    }
}

document.getElementById("start").onclick = function(){
    if(first){
        time = 0;
        document.getElementById("time").style.color = "#e5eeeb";
        first = !first;
        shuffle();
        found = 0;
        document.getElementById("my-time").innerHTML = time;
    }
    myTimer();
}

document.getElementById("hint").onclick = function(){
    if(starting){
    start = false;
    for(let i=0;i<card_num;i++){
        let row = Math.floor(i/4);
		let col = i % 4;
        let card_id = addrs.indexOf(i);
        let card_color = cards[ card_id ].color;
		board.rows[row].cells[col].innerHTML = "<img src = \" " + card_src[ card_color ] + "\">";
    }
    setTimeout(function(){
        for(let i=0;i<card_num;i++){
            let row = Math.floor(i/4);
		    let col = i % 4;
            let card_id = addrs.indexOf(i);
            if(!cards[ card_id ].state){
                board.rows[row].cells[col].innerHTML = "<img src = \" " + card_src[ 0 ] + "\">";
            }
        }
        start = true;
    },1500);
    }
}

function fold(){
    let row1 = Math.floor(open1/4);
    let row2 = Math.floor(open2/4);
    let col1 = open1%4;
    let col2 = open2%4;
    cards[ addrs.indexOf(open2) ].state = false;
    cards[ addrs.indexOf(open1) ].state = false;
    board.rows[row1].cells[col1].innerHTML = "<img src = \" " + card_src[0] + "\">";
    board.rows[row2].cells[col2].innerHTML = "<img src = \" " + card_src[0] + "\">";
    open1 = -1;
    open2 = -2;
}

function boardClick(){
    let cell_id = parseInt(this.id);
    let card_id = addrs.indexOf(cell_id);
    if(start && (!cards[ card_id ].state) ){
        if(!check){
            this.innerHTML = "<img src = \" " + card_src[ cards[ card_id ].color ] + "\">"
            cards[ card_id ].state = true;
            open1 = cell_id;
            check = !check;
        }
        else{
            start = false;
            this.innerHTML = "<img src = \" " + card_src[ cards[ card_id ].color ] + "\">"
            cards[ card_id ].state = true;
            open2 = cell_id;
            check = !check;

            if( cards[ addrs.indexOf(open1) ].color === cards[ addrs.indexOf(open2) ].color){
                found++;
                if(found === color_num){
                    myTimer();
                    first = true;
                    start = false;
                    document.getElementById("time").style.color = "#FFFF93";
                }
                else{
                    start = true;
                }
            }
            else{
                setTimeout(function(){
                    fold();
                    start=true;
                },1000);
            }
        }
    }
}

function timerStart(){
    time++;
    document.getElementById("my-time").innerHTML = time;
    timer = setTimeout(function(){timerStart();},1000);
}

function myTimer(){
    if(!starting){
        document.getElementById("small-pause").style.visibility = "visible";
        document.getElementById("small-start").style.visibility = "hidden";
        start = true;
        starting = true;
        timerStart();
    }
    else{
        document.getElementById("small-pause").style.visibility = "hidden";
        document.getElementById("small-start").style.visibility = "visible";
        clearTimeout(timer);
        start = false;
        starting = false;
    }
    
}


}
