//
//  Storage.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Storage = cc.Class.extend({

    ctor:function () {
        //total score
        this.totalGameScore          = 0;
        this.totalOccupiedCnt        = 0;
        this.totalKilledEnemyCnt     = 0;
        this.totalProductCnt         = 0;
        this.totalCoinAmount         = 0;

        this.totalKilledPlayerCnt    = 0;
        this.totalKilledColleagueCnt = 0;
        this.maxStageNumber          = 1;
        this.maxGameScore            = 0;

        //stage
        this.gameScore   = 0;
        this.successRate = 0;
        this.good        = 0;
        this.normal      = 0;
        this.bad         = 0;
        this.miss        = 0;
        this.maxCombo    = 0;

        //stage difficulty

        //system
        this.isSoundOn        = true;
        this.bgmVolume        = 1;
        this.seVolume         = 0.5;
    },

    init:function () {
    },

    calcScore:function(){
        this.gameScore = this.occupiedCnt + this.killedEnemyCnt + this.productCnt + this.coinAmount;
    },

    calcTotal:function(){
        this.totalGameScore          += this.gameScore;
        this.totalOccupiedCnt        += this.occupiedCnt;
        this.totalKilledEnemyCnt     += this.killedEnemyCnt;
        this.totalProductCnt         += this.productCnt;
        this.totalCoinAmount         += this.coinAmount;
    },

    getJson:function(){
        var rtn = '{';
        rtn += '"saveData"            : true,';
        rtn += '"name"                : "ogahamu",';
        rtn += '"charactorImg"        : "hogehoge",';
        rtn += '"maxStageNumber"      :' + this.maxStageNumber + ',';
        rtn += '"totalGameScore"      :' + this.totalGameScore + ',';
        rtn += '"totalOccupiedCnt"    :' + this.totalOccupiedCnt + ',';
        rtn += '"totalKilledEnemyCnt" :' + this.totalKilledEnemyCnt + ',';
        rtn += '"totalProductCnt"     :' + this.totalProductCnt + ',';
        rtn += '"totalCoinAmount"     :' + this.totalCoinAmount + '';
        rtn += '}';
        return rtn;
    },

    setJson:function(JsonData){
        this.gameScore           = JsonData["gameScore"];
        this.totalGameScore      = JsonData["totalGameScore"];
        this.totalOccupiedCnt    = JsonData["totalOccupiedCnt"];
        this.totalKilledEnemyCnt = JsonData["totalKilledEnemyCnt"];
        this.totalProductCnt     = JsonData["totalProductCnt"];
        this.totalCoinAmount     = JsonData["totalCoinAmount"];
        this.maxStageNumber      = JsonData["maxStageNumber"];
    },

    resetJson:function(){
        this.gameScore           = 0;
        this.totalGameScore      = 0;
        this.totalOccupiedCnt    = 0;
        this.totalKilledEnemyCnt = 0;
        this.totalProductCnt     = 0;
        this.totalCoinAmount     = 0;
        this.maxStageNumber      = 1;
    },

    useCoin:function(amount){
        this.coinAmount-=amount;
    },
});

var saveData = function(storage){
    //3:android 4:iphone 5:ipad 100:mobile_web 101:pc_web
    var platform = cc.Application.getInstance().getTargetPlatform();
    this.storage = new Storage();  
    if(platform == 100 || platform == 101){
        var toObjString = storage.getJson();
        var toObj = JSON.parse(toObjString);
        window.localStorage.setItem("gameStorage",JSON.stringify(toObj));
    }
};

var getCharactorDataFromJson = function(storage,charactorCode){
    var jsonFile             = cc.FileUtils.getInstance().getStringFromFile(charactor_json);
    this.jsonData            = JSON.parse(jsonFile);
    var charactorData        = this.jsonData["charactors"][charactorCode];

    storage.lv               = 1;
    storage.hp               = charactorData["hp"];
    storage.maxHp            = charactorData["hp"];
    storage.attack           = charactorData["attack"];
    storage.defence          = charactorData["defence"];
    storage.eyeSightRange    = charactorData["eye_sight"];
    storage.walkSpeed        = charactorData["walk_speed"];
    storage.createCot        = 1;

    storage.image            = charactorData["image"];
    storage.imgWidth         = charactorData["image_width"];
    storage.imgHeight        = charactorData["image_height"];
    storage.charactorCode    = charactorCode;

    return storage;
};

var getStageDataFromJson = function(storage,stageNum) {
    var jsonFile             = cc.FileUtils.getInstance().getStringFromFile(stages_json);
    this.jsonData            = JSON.parse(jsonFile);
    var stageData            = this.jsonData["stages"][stageNum];

    //ステージがなかったら終了する
    //if(stageData == null){
        //cc.log("ending");
        //return;
    //}

    //init
    storage.killedEnemyCnt   = 0;
    storage.coinAmount       = 0;

    //mission
    storage.missionNumber    = stageData["id"];
    storage.missionTitle     = stageData["title"];
    storage.missionTimeLimit = stageData["time_limit"];
    storage.missionGenre     = stageData["genre"];
    storage.missionMaxCnt    = stageData["mission_count"];
    storage.mapImage         = stageData["map"]["image"];
    storage.maxX             = stageData["map"]["x"];
    storage.mapY             = stageData["map"]["y"];

    //stage difficult
    storage.initEnemyCnt     = stageData["init_enemy_cnt"];
    storage.stageNumber      = stageData["id"];
    storage.itemCoinCnt      = stageData["item_coin"];
    storage.enemySetInterval = stageData["enemy_interval"];
    storage.enemyCode        = stageData["enemy_code"];
    storage.stageItems       = stageData["items"];

    return storage;
};

var onBackCallback = function (pSender) {
    var scene = cc.Scene.create();
    scene.addChild(SysMenu.create());
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
};
