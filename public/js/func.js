/* 
기능
자원 생성.
유닛 생성.
일꾼 배치.
건물 업그레이드.
생성과 업그레이드에 따른 수치변화 적용.
RXjs 적용 완료
Firebase 와 연동
DB 저장

to do list
DB 원하는 내용 읽어오기.
원정 시스템 추가.
전투직군 스텟및 확인창 추가.
각종 화면 구성 추가 : 

|  홈  |  유닛  |  건물  |  연구  |  원정  |  설정창  |

|    리스트!    | |               내용                 |
|      a        | |                                   |
.
.
.https://www.slideshare.net/sungbeenjang/firebase-for-web-2-authentication
.
.
상단 메뉴 고정. 
하위 내용부분만 수정하는 방식으로.
 */
//firebase 
//계정관련 버튼.
let btn_login = document.querySelector('.login');
let btn_logout = document.querySelector('.logout');
let btn_save = document.querySelector('.save');
let btn_load = document.querySelector('.load');

var btn_login_Stream = Rx.Observable.fromEvent(btn_login, 'click');
var btn_logout_Stream = Rx.Observable.fromEvent(btn_logout, 'click');
var btn_save_Stream = Rx.Observable.fromEvent(btn_save, 'click');
var btn_load_Stream = Rx.Observable.fromEvent(btn_load, 'click');


var userInfo;
var auth;
auth = firebase.auth();

var authProvider;

//로그인버튼.
btn_login_Stream.subscribe(e => {
    console.log("push google button");
    authProvider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(authProvider);
});
//로그아웃 버튼.
btn_logout_Stream.subscribe(e => {
    console.log("push logout");
    auth.signOut();
});

//인증 상태 확인.
auth.onAuthStateChanged(function(firebaseUser) {
  if(firebaseUser){
    console.log(firebaseUser);
    userInfo = firebaseUser;
    btn_logout.classList.remove('hide');
    btn_login.classList.add('hide');
    load_on_DB();
  }else{
    console.log("not logged in");
    btn_logout.classList.add('hide');
    btn_login.classList.remove('hide');
  }
});

btn_save_Stream.subscribe(e=>{
    console.log("push save button");
    save_on_DB();
});

btn_load_Stream.subscribe(e=>{
    console.log("push load button");
    load_on_DB();
});

//Unit 수.
var worker = 8;     //일꾼
var swordman = 0;   //검사
var archery = 0;    //궁사
var wizard = 0;     //마법사
var surplus_worker = 0;  //잉여 일꾼

//resource
var gold = 1000;       //금
var wood = 1000;       //목재
var stone = 1000;      //석재
var food = 1000;       //식량
var population = 8; //인구
var max_pop = 10;

//building 수
var fortress = 1; //요새 레벨.
var goldmine = 1; //금광
var logging = 1;  //벌목장
var quarry = 1;   //채석장
var farm = 1;     //농장
var house = 1;    //집

//일꾼 배치.
var gold_worker = 0;
var log_worker = 0;
var quarry_worker = 0;
var farm_worker = 0;

//resource initial increase
var gold_inc = 10;       //금
var wood_inc = 10;       //목재
var stone_inc = 10;      //석재
var food_inc = 10;       //식량
var population_inc = 10; //인구

//데이터베이스 접근용 객체
var database;
//데이터베이스 접근을 위한 코드
database = firebase.database();

function getTimeStamp() {
  var d = new Date();
  var s =
    leadingZeros(d.getFullYear(), 4) + '-' +
    leadingZeros(d.getMonth() + 1, 2) + '-' +
    leadingZeros(d.getDate(), 2) + ' ' +

    leadingZeros(d.getHours(), 2) + ':' +
    leadingZeros(d.getMinutes(), 2) + ':' +
    leadingZeros(d.getSeconds(), 2);

  return s;
};

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
};



function save_on_DB(){
    console.log("save DB");
//UID 로 구분.
//현재 자원, 유닛, 배치, 건물 업글, 저장 시간
var userRef = database.ref('User/' + userInfo.uid);
var incRef = database.ref('increase/'+userInfo.uid);
var buildingRef = database.ref('building/'+userInfo.uid);
var unitRef = database.ref('unit/'+userInfo.uid);
userRef.update({
    gold : gold,
    wood : wood,
    stone : stone,
    food : food,
    Population : population,
    Maxpop : max_pop,
    
    Update_date : getTimeStamp()
});
incRef.update({
    goldinc : gold_inc,
    woodinc : wood_inc,
    stoneinc : stone_inc,
    foodinc : food_inc,
    popinc : population_inc
});
buildingRef.update({
    fortress : fortress,
    goldmine : goldmine,
    logging : logging,
    quarry : quarry,
    farm : farm,
    house : house
});
unitRef.update({
    worker : worker,
    swordman : swordman,
    archery : archery,
    wizard : wizard,
    surplusworker : surplus_worker,
    goldworker : gold_worker,
    logworker : log_worker,
    quarryworker : quarry_worker,
    farmworker : farm_worker
});
};
function load_on_DB(){
if(userInfo){
    console.log("login user");
    var userRef = database.ref('User/' + userInfo.uid).once('value').then(function(snapshot){
        gold = snapshot.val().gold;
        wood = snapshot.val().wood;
        stone = snapshot.val().stone;
        food = snapshot.val().food;
        population = snapshot.val().Population;
        max_pop = snapshot.val().Maxpop;
    });
    var incRef = database.ref('increase/'+userInfo.uid).once('value').then(function(snapshot){
        gold_inc = snapshot.val().goldinc;
        wood_inc = snapshot.val().woodinc;
        stone_inc = snapshot.val().stoneinc;
        food_inc = snapshot.val().foodinc;
        population_inc = snapshot.val().popinc;
    });
    var buildingRef = database.ref('building/'+userInfo.uid).once('value').then(function(snapshot){
        fortress = snapshot.val().fortress;
        goldmine = snapshot.val().goldmine;
        logging = snapshot.val().logging;
        quarry = snapshot.val().quarry;
        farm = snapshot.val().farm;
        house = snapshot.val().house;
    });
    var unitRef = database.ref('unit/'+userInfo.uid).once('value').then(function(snapshot){
        worker = snapshot.val().worker;
        swordman = snapshot.val().swordman;
        archery = snapshot.val().archery;
        wizard = snapshot.val().wizard;
        surplus_worker = snapshot.val().surplusworker;
        gold_worker = snapshot.val().goldworker;
        log_worker = snapshot.val().logworker;
        quarry_worker = snapshot.val().quarryworker;
        farm_worker = snapshot.val().farmworker;
    });
}else{
    console.log("login first!!!");
}
};


//RxJS를 쓰기위한 변수들

//유닛 생성버튼.
let Make_Worker_Btn = document.querySelector('.btn_worker_make');
let Make_Swordman_Btn = document.querySelector('.btn_swordman_make');
let Make_Archery_Btn = document.querySelector('.btn_archery_make');
let Make_Wizard_Btn = document.querySelector('.btn_wizard_make');

var btn_MWorker_Stream = Rx.Observable.fromEvent(Make_Worker_Btn, 'click');
var btn_MSwordman_Stream = Rx.Observable.fromEvent(Make_Swordman_Btn, 'click');
var btn_MArchery_Stream = Rx.Observable.fromEvent(Make_Archery_Btn, 'click');
var btn_MWizard_Stream = Rx.Observable.fromEvent(Make_Wizard_Btn, 'click');


btn_MWorker_Stream.subscribe(e => {
    make_worker();
    //인구 체크
    check_population();
});
btn_MSwordman_Stream.subscribe(e => {
    make_swordman();
    //인구 체크
    check_population();
});
btn_MArchery_Stream.subscribe(e => {
    make_archery();
    //인구 체크
    check_population();
});
btn_MWizard_Stream.subscribe(e => {
    make_wizard();
    //인구 체크
    check_population();
});

//일꾼 배치 버튼.
let Gold_Worker_Btn = document.querySelector('.btn_gold_worker');
let Log_Worker_Btn = document.querySelector('.btn_log_worker');
let Quarry_Worker_Btn = document.querySelector('.btn_quarry_worker');
let Farm_Worker_Btn = document.querySelector('.btn_farm_worker');

var btn_GWorker_Stream = Rx.Observable.fromEvent(Gold_Worker_Btn, 'click');
var btn_LWorker_Stream = Rx.Observable.fromEvent(Log_Worker_Btn, 'click');
var btn_QWorker_Stream = Rx.Observable.fromEvent(Quarry_Worker_Btn, 'click');
var btn_FWorker_Stream = Rx.Observable.fromEvent(Farm_Worker_Btn, 'click');

btn_GWorker_Stream.subscribe(e => {
    inc_gold_worker();
    //잉여 일꾼 체크
    check_Surplus_worker();
});
btn_LWorker_Stream.subscribe(e => {
    inc_log_worker();
    //잉여 일꾼 체크
    check_Surplus_worker();
});
btn_QWorker_Stream.subscribe(e => {
    inc_quarry_worker();
    //잉여 일꾼 체크
    check_Surplus_worker();
});
btn_FWorker_Stream.subscribe(e => {
    inc_farm_worker();
    //잉여 일꾼 체크
    check_Surplus_worker();
});

//건축 버튼.
let Upgrade_fortress_Btn = document.querySelector('.btn_fortress_upgrade');
let Upgrade_goldmine_Btn = document.querySelector('.btn_goldmine_upgrade');
let Upgrade_logging_Btn = document.querySelector('.btn_logging_upgrade');
let Upgrade_quarry_Btn = document.querySelector('.btn_quarry_upgrade');
let Upgrade_farm_Btn = document.querySelector('.btn_farm_upgrade');
let Upgrade_house_Btn = document.querySelector('.btn_house_upgrade');

var btn_Upfortress_Stream = Rx.Observable.fromEvent(Upgrade_fortress_Btn,'click');
var btn_Upgoldmine_Stream = Rx.Observable.fromEvent(Upgrade_goldmine_Btn,'click');
var btn_Uplogging_Stream = Rx.Observable.fromEvent(Upgrade_logging_Btn,'click');
var btn_Upquarry_Stream = Rx.Observable.fromEvent(Upgrade_quarry_Btn,'click');
var btn_Upfarm_Stream = Rx.Observable.fromEvent(Upgrade_farm_Btn,'click');
var btn_Uphouse_Stream = Rx.Observable.fromEvent(Upgrade_house_Btn,'click');

btn_Upfortress_Stream.subscribe(e => {
    upgrade_fortress();
});
btn_Upgoldmine_Stream.subscribe(e => {
    upgrade_goldmine();
});
btn_Uplogging_Stream.subscribe(e => {
    upgrade_logging();
});
btn_Upquarry_Stream.subscribe(e => {
    upgrade_quarry();
});
btn_Upfarm_Stream.subscribe(e => {
    upgrade_farm();
});
btn_Uphouse_Stream.subscribe(e => {
    upgrade_house();
});
//출력 스트림.
const interv = Rx.Observable.interval(1000);

const Resource_Increase_Stream = interv.sample(Rx.Observable.interval(1000));

const sub_RIS = Resource_Increase_Stream.subscribe(val =>{
increaseResource();
updatePages();
});

const Auto_Save_Stream = interv.sample(Rx.Observable.interval(300000));

const Auto_Save = Auto_Save_Stream.subscribe(val => {
    console.log("Auto save");
    save_on_DB();
});


//건물 증가함수. //금 + 석재 + 나무 + 식량 필요
function upgrade_fortress(){ //각 10000 * 레벨. 자원 생산 단위 1.5배
    if(gold>= (10000*fortress) && wood>= (10000*fortress) && stone>= (10000*fortress) && food >= (10000*fortress)){
        decreaseResource(10000,10000,10000,10000,fortress);
        fortress += 1;
        gold_inc += gold_inc*1.5;
        wood_inc += wood_inc*1.5;
        stone_inc += stone_inc*1.5;
        food_inc += food_inc*1.5;
        population_inc = population_inc*1.5;
        console.log("push u_f");
    }
};
//업그레이드 시 자원 생산 단위 1.1배.
function upgrade_goldmine(){ //50, 100, 250, 100
    if(gold > (50*goldmine) && wood > (100*goldmine) && stone > (250*goldmine) && food > (100*goldmine)){
        decreaseResource(50,100,250,100,goldmine);
        goldmine += 1;
        gold_inc += gold_inc*1.1;
        console.log("push u_g");
    }
};

function upgrade_logging(){ //50, 100, 250, 100
    if(gold > (50*logging) && wood > (100*logging) && stone > (250*logging) && food > (100*logging)){
        decreaseResource(50,100,250,100,logging);
        logging += 1;
        wood_inc += wood_inc*1.1;
        console.log("push u_l");
    }
};

function upgrade_quarry(){ //50, 100, 250, 100
    if(gold > (50*quarry) && wood > (100*quarry) && stone > (250*quarry) && food > (100*quarry)){
        decreaseResource(50,100,250,100,quarry);
        quarry += 1;
        stone_inc += stone_inc*1.1;
        console.log("push u_q");
    }
};

function upgrade_farm(){ //50, 100, 500, 100
   if(gold > (50*farm) && wood > (100*farm) && stone > (500*farm) && food > (100*farm)){
        decreaseResource(50,100,500,100,farm);
        farm += 1;
        food_inc += food_inc*1.1;
        console.log("push u_f");
    }
};

function upgrade_house(){ //100, 250, 250, 100
    if(gold > (50*house) && wood > (250*house) && stone > (250*house) && food > (100*house)){
        decreaseResource(100,250,250,100,house);
        house += 1;
        population_inc += population_inc*1.1;
        check_population();
        console.log("push u_h");
    }
};

function decreaseResource(g,w,s,f,thing){
    gold -= g*thing;
    wood -= w*thing;
    stone -= s*thing;
    food -= f*thing;
    console.log("use Resource");
}

//자원 생산 
//기본식 : 증가량 * 일꾼수.
function increaseResource(){
    gold += gold_inc*gold_worker;
    wood += wood_inc*log_worker;
    stone += stone_inc*quarry_worker;
    food += food_inc*farm_worker;
    console.log('increase Resource', gold, wood, stone, food);
};

//유닛 생성 버튼 함수 // 자원 필요.
function make_worker(){ //50, 100, 100, 100
    if(gold > (50*worker) && wood > (100*worker) && stone > (100*worker) && food > (100*worker)){
        if(population < max_pop){
            decreaseResource(50,100,100,100,worker);
            worker += 1;
            population += 1;
            check_Surplus_worker();
            console.log("push m_w");
        }
    }
};
function make_swordman(){ //150, 100, 100, 100
    if(gold > (150*swordman) && wood > (100*swordman) && stone > (100*swordman) && food > (100*swordman)){
        if(population < max_pop){
            swordman += 1;
            decreaseResource(150,100,100,100,swordman);
            population += 1;
            console.log("push m_s");
        }
    }
};
function make_archery(){ //100, 150, 100, 100
    if(gold > (100*archery) && wood > (150*archery) && stone > (100*archery) && food > (100*archery)){
        if(population < max_pop){
            archery += 1;
            decreaseResource(100,150,100,100,archery);
            population += 1;
            console.log("push m_a");
        }
    }
};
function make_wizard(){ //200, 100, 100, 100
    if(gold > (200*wizard) && wood > (100*wizard) && stone > (100*wizard) && food > (100*wizard)){
        if(population < max_pop){
            wizard += 1;
            decreaseResource(200,100,100,100,wizard);
            population += 1;
            console.log("push m_w");
        }
    }
};

//인구 계산식
function check_population(){
    population = worker+swordman+archery+wizard;
    max_pop = house*population_inc;
};

//잉여일꾼 계산식
//기본식 : 전체 일꾼 - 생산지 할당 일꾼 총합.
function check_Surplus_worker(){
    surplus_worker = worker-(gold_worker+log_worker+quarry_worker+farm_worker);
};

//일꾼 사용 버튼 함수.
function inc_gold_worker(){
    if(surplus_worker >0){ //잉여 일꾼이 있으면.
        gold_worker += 1; //할당.
        check_Surplus_worker();
        console.log("push i_g_w");
    }   
};
function inc_log_worker(){
    if(surplus_worker >0){
        log_worker += 1;
        check_Surplus_worker();
        console.log("push i_l_w");
    }
};
function inc_quarry_worker(){
    if(surplus_worker >0){
        quarry_worker += 1;
        check_Surplus_worker();
        console.log("push i_q_w");
    }
};
function inc_farm_worker(){
    if(surplus_worker >0){
        farm_worker += 1;
        check_Surplus_worker();
        console.log("push i_f_w");
    }
};



//각종 내용 표시. 저장은 소수점 전부. 표기는 소수점 반올림해서.
function updatePages(){  
document.querySelector(".worker").innerText = surplus_worker +"/" + worker;
document.querySelector(".swordman").innerText = swordman;
document.querySelector(".archery").innerText = archery;
document.querySelector(".wizard").innerText = wizard;

document.querySelector(".Wo_price").innerText = 50*worker + " , " + 100*worker + " , " + 100*worker + " , " + 100*worker;
document.querySelector(".S_price").innerText = 150*swordman + " , " + 100*swordman + " , " + 100*swordman + " , " + 100*swordman;
document.querySelector(".A_price").innerText = 100*archery + " , " + 150*archery + " , " + 100*archery + " , " + 100*archery;
document.querySelector(".Wi_price").innerText = 200*wizard + " , " + 100*wizard + " , " + 100*wizard + " , " + 100*wizard;

document.querySelector(".gold").innerText = Math.round(gold);
document.querySelector(".wood").innerText = Math.round(wood);
document.querySelector(".stone").innerText = Math.round(stone);
document.querySelector(".food").innerText = Math.round(food);
document.querySelector(".population").innerText = Math.round(population) + "/" + Math.round(max_pop);

document.querySelector(".G_inc").innerText = gold_inc;
document.querySelector(".W_inc").innerText = wood_inc;
document.querySelector(".S_inc").innerText = stone_inc;
document.querySelector(".F_inc").innerText = food_inc;
document.querySelector(".P_inc").innerText = population_inc;

document.querySelector(".gold_worker").innerText = gold_worker;
document.querySelector(".log_worker").innerText = log_worker;
document.querySelector(".quarry_worker").innerText = quarry_worker;
document.querySelector(".farm_worker").innerText = farm_worker;

document.querySelector(".fortress").innerText = fortress;
document.querySelector(".goldmine").innerText = goldmine;
document.querySelector(".logging").innerText = logging;
document.querySelector(".quarry").innerText = quarry;
document.querySelector(".farm").innerText = farm;
document.querySelector(".house").innerText = house;

document.querySelector(".Fo_price").innerText = 10000*fortress + " , " + 10000*fortress + " , " + 10000*fortress + " , " + 10000*fortress;
document.querySelector(".G_price").innerText = 50*goldmine + " , " + 100*goldmine + " , " + 250*goldmine + " , " + 100*goldmine;
document.querySelector(".L_price").innerText = 50*logging + " , " + 100*logging + " , " + 250*logging + " , " + 100*logging;
document.querySelector(".Q_price").innerText = 50*quarry + " , " + 100*quarry + " , " + 250*quarry + " , " + 100*quarry;
document.querySelector(".Fa_price").innerText = 50*farm + " , " + 100*farm + " , " + 500*farm + " , " + 100*farm;
document.querySelector(".H_price").innerText = 100*house + " , " + 250*house + " , " + 250*house + " , " + 100*house;
};
