//
//  Storage.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Storage = cc.Class.extend({

    ctor:function () {
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
        rtn += '}';
        return rtn;
    },

    setJson:function(JsonData){
    },

    resetJson:function(){
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
    return storage;
};

var getStageDataFromJson = function(storage,stageNum) {
    return storage;
};

var onBackCallback = function (pSender) {
    var scene = cc.Scene.create();
    scene.addChild(SysMenu.create());
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
};
