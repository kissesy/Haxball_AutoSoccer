/*
게임은 시작중에 참가가 불가능하며 
링크를 통해 접속하면 대기실이 존재, /참가 를 입력하면 레드팀으로 들어가게 되어 
대기실 접속이 가능하다. 

대기실의 총 인원에 따라 1대1 맵에서 4대4맵까지 정해짐

*/

const Default_Stadium = "Small"; //기본 대기실
const One_Stadium = "Easy"; // 1vs1 
const Two_Stadium = "Big"; //2vs2

let GreenRoom_personnel=0; //대기실 인원


//대기실 참가

//게임 참가 - red or blue 균등 분배

const room = HBInit({
	roomName: "Auto Soccer Room",
	maxPlayers: 16,
    noPlayer: true, // Remove host player (recommended!)
    public: false
});

//대기실 참가
function JoinGame(player){  
    //대기실은 일단 RED로 참가
    //만약 이미 대기실에 참가된 상태라면
    if(player.team != 0){
        room.sendAnnouncement(msg="You'r Already in Green Room!",
                              targetId=player.id,
                              color=0xfe7171,
                              style="bold");
    } else{
        room.setPlayerTeam(playerID=player.id, team=1);
        room.sendAnnouncement(msg="Join "+player.name+" in Green Room! Have good time~",
                              player.id=null,
                              color=0xd789d7,
                              style="bold");
        GreenRoom_personnel += 1;
        //게임을 시작할 수 있는 최소 인원 수 
        if(GreenRoom_personnel >= 2){
            room.sendAnnouncement(msg="The game starts after 30 seconds.",
                                  targetId=null,
                                  color=0xf0a500,
                                  style="bold");
            //게임 시작 함수 호출(게임 틱 실행)
            StartGame();
        } else{
            room.sendAnnouncement(msg="There must be at least 2 people to play the game.",
                                  targetId=null,
                                  color=0xf0a500,
                                  style="bold");
        }
        
    }
}

//옵저버로 변경
function ObserverGame(player){
    //만약 이미 옵저버라면
    if(player.team == 0){
        room.sendAnnouncement(msg="You'r Already Observer!",
                              targetId=player.id,
                              color=0xfe7171,
                              style="bold");
    } else{
        let player_team;
        if(player.team == 1){
            player_team = "RED ";
        } else{
            player_team = "BLUE ";
        }
        room.setPlayerTeam(playerID=player.id, team=0);
        room.sendAnnouncement(msg="Leave from "+player_team+player.name+"! Take a break while observing~",
                              targetId=null,
                              color=0xd789d7,
                              style="bold");
        GreenRoom_personnel -= 1;
        //2명 이하이기 때문에 인원이 존재하는 팀의 승리로 돌리고 대기실로 이동
        if(GreenRoom_personnel < 2){
            
        } 
    }   
}


//대기실에서 벗어나 실제 게임 시작,
//게임 틱을 돌려서 30초이 지난 시점 인원이 최소 2명이 있다면 시작 아니라면 다시 30초 대기 or 오면 바로 시작
function msg_start(second){
    room.sendAnnouncement(msg="The game starts after "+String(second/60) +" seconds.",
                              targetId=null,
                              color=0xd2e603,
                              style="bold");
}


//역순으로 할 수 있게 변경해야함.
function StartGame(){
    console.log("30 Seconds!");
    let second = 0;
    room.onGameTick = function(){  
        switch(second){
            case 60:
                msg_start(second);
                break;
            case 120:
                msg_start(second);
                break;
            case 180:
                msg_start(second);
                break;
            case 240:
                msg_start(second);
                break;
            case 300:
                msg_start(second);
                break;
            case 600:
                msg_start(second);
                break;
            case 1200:
                msg_start(second);
                break;
            case 1800:
                msg_start(second);
                break;
        }
        /*
        if(second % 60 == 0){
            let date = new Date(); //1초 
            console.log("Time : ", + second/60 + " ==== "+date);
        } */
        second+=1;
    }
}

//일정 인원수 미만으로 게임 끝내고 대기실로 이동
function StopGame(){
    console.log("asds");
}

//대기실 기본 세팅
function InitGame(){
    room.setDefaultStadium(Default_Stadium);
    room.setScoreLimit(99);
    room.setTimeLimit(0);
}

//게임 시작
room.startGame();

/* 플레이어 접속 및 떠나기 이벤트 등록 */
room.onPlayerJoin = function(player){
    room.sendAnnouncement(msg="Hello Player! : "+player.name+"!"+" Please Enter !help", 
                          targetId=player.id, 
                          color=0x00FF00, 
                          style="bold");
}

room.onPlayerLeave = function(player){
    room.sendAnnouncement(msg="Leave "+player.name,
                          color=0x00FF00, 
                          style="bold");
}

/* 명령어 체크 */
room.onPlayerChat = function(player, message){
    const prefix = '!';
    if(message.startsWith(prefix)){
        if(message.endsWith("help")){
            room.sendAnnouncement(msg="Help "+player.name, 
                                  targetId=player.id);
        } 
        else if(message.endsWith("join")){
            room.sendAnnouncement(msg="Join "+player.name,
                                  color=0x00FF00,
                                  style="bold");
            JoinGame(player);
        }
        else if(message.endsWith("leave")){
            room.sendAnnouncement(msg="Go Observer "+player.name,
            color=0x00FF00,
            style="bold");
            ObserverGame(player);
        }
        else{
            room.sendAnnouncement(msg="Sorry. Can't understand "+message+" command",
                                  targetId=player.id, 
                                  color=0xfe7171, 
                                  style="bold");
        }
    }
}

