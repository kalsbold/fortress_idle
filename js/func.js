/* 
기능
자원 생성.
유닛 생성.
일꾼 배치.
건물 업그레이드.
생성과 업그레이드에 따른 수치변화 적용.

to do list
원정 시스템 추가.
전투직군 스텟및 확인창 추가.
각종 화면 구성 추가 : 

|  홈  |  유닛  |  건물  |  연구  |  원정  |  설정창  |

|    리스트!    | |               내용                 |
|      ㅁ       | |                                    |
.
.
.
.
.

상단 메뉴 고정. 
하위 내용부분만 수정하는 방식으로.
 */

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

//fortress stat
var melee = 0;  //공격
var defense = 0; //방어

//건물 증가함수. //금 + 석재 + 나무 + 식량 필요
function upgrade_fortress(){ //각 10000 * 레벨. 자원 생산 단위 1.5배
    if(gold == wood == stone == food == (10000*fortress)){
        decreaseResource(10000,10000,10000,10000,fortress);
        fortress += 1;
        gold_inc = gold_inc*1.5;
        wood_inc = wood_inc*1.5;
        stone_inc = stone_inc*1.5;
        food_inc = food_inc*1.5;
        population_inc = population_inc*1.5;
        console.log("push u_f");
    }
};
//업그레이드 시 자원 생산 단위 1.1배.
function upgrade_goldmine(){ //50, 100, 250, 100
    if(gold > (50*goldmine) && wood > (100*goldmine) && stone > (250*goldmine) && food > (100*goldmine)){
        decreaseResource(50,100,250,100,goldmine);
        goldmine += 1;
        gold_inc = gold_inc*1.1;
        console.log("push u_g");
    }
};

function upgrade_logging(){ //50, 100, 250, 100
    if(gold > (50*logging) && wood > (100*logging) && stone > (250*logging) && food > (100*logging)){
        decreaseResource(50,100,250,100,logging);
        logging += 1;
        wood_inc = wood_inc*1.1;
        console.log("push u_l");
    }
};

function upgrade_quarry(){ //50, 100, 250, 100
    if(gold > (50*quarry) && wood > (100*quarry) && stone > (250*quarry) && food > (100*quarry)){
        decreaseResource(50,100,250,100,quarry);
        quarry += 1;
        stone_inc = stone_inc*1.1;
        console.log("push u_q");
    }
};

function upgrade_farm(){ //50, 100, 500, 100
   if(gold > (50*farm) && wood > (100*farm) && stone > (500*farm) && food > (100*farm)){
        decreaseResource(50,100,500,100,farm);
        farm += 1;
        food_inc = food_inc*1.1;
        console.log("push u_f");
    }
};

function upgrade_house(){ //100, 250, 250, 100
    if(gold > (50*house) && wood > (250*house) && stone > (250*house) && food > (100*house)){
        decreaseResource(100,250,250,100,house);
        house += 1;
        population_inc = population_inc*1.1;
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
document.getElementById("worker").innerHTML = "worker :"+ surplus_worker +"/" + worker;
document.getElementById("swordman").innerHTML = "swordman :" + swordman;
document.getElementById("archery").innerHTML = "archery :" + archery;
document.getElementById("wizard").innerHTML = "wizard :" + wizard;

document.getElementById("gold").innerHTML = "gold :" + Math.round(gold);
document.getElementById("wood").innerHTML = "wood :" + Math.round(wood);
document.getElementById("stone").innerHTML = "stone :" + Math.round(stone);
document.getElementById("food").innerHTML = "food :" +Math.round(food);
document.getElementById("population").innerHTML = "population :" + Math.round(population) + "/" + Math.round(max_pop);

document.getElementById("gold_worker").innerHTML = "gold_worker :" + gold_worker;
document.getElementById("log_worker").innerHTML = "log_worker :" + log_worker;
document.getElementById("quarry_worker").innerHTML = "quarry_worker :" + quarry_worker;
document.getElementById("farm_worker").innerHTML = "farm_worker :" + farm_worker;

document.getElementById("fortress").innerHTML = "fortress :" + fortress;
document.getElementById("goldmine").innerHTML = "goldmine :" + goldmine;
document.getElementById("logging").innerHTML = "logging :" + logging;
document.getElementById("quarry").innerHTML = "quarry :" + quarry;
document.getElementById("farm").innerHTML = "farm :" + farm;
document.getElementById("house").innerHTML = "house :" + house;
};

//인구 체크
check_population();
//잉여 일꾼 체크
check_Surplus_worker();

//전체 갱신 함수.
function UpdateAll(){
    increaseResource();
    updatePages();
}

setInterval(UpdateAll,1000);


//경고창 띄우는 방법.
//window.alert(5 + 6);