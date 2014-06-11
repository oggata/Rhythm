//
//  GameLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var GameLayer = cc.Layer.extend({
    ctor:function (storage) {
        this._super();
        this.storage  = storage;
    },

    init:function () {
        this._super();

        if ('touches' in sys.capabilities || sys.platform == "browser")
                this.setTouchEnabled(true);
        else if ('mouse' in sys.capabilities)
                this.setMouseEnabled(true);

        this.isGameFinished = false;

        this.comboCnt = 0;

        this.tapCnt = 0;
        this.taps = [];

        this.back = cc.Sprite.create(s_back);
        this.back.setAnchorPoint(0,0);
        this.back.setPosition(0,0);
        this.addChild(this.back);

        this.chara001 = new DisplayPlayer(chara001,10,260);
        this.addChild(this.chara001);

        this.chara002 = new DisplayPlayer(chara002,170,260);
        this.addChild(this.chara002);

        this.combo = cc.LabelTTF.create("00","Arial",30);
        this.combo.setPosition(250,450);
        this.addChild(this.combo);

        this.combo2 = cc.LabelTTF.create("COMBO","Arial",15);
        this.combo2.setPosition(250,430);
        this.addChild(this.combo2);

        this.cutIn = new CutIn();
        this.cutIn.setPosition(0,200);
        this.addChild(this.cutIn,999);
        this.cutIn.set_text("スタート!");

        this.touchBar = cc.LayerColor.create(cc.c4b(255,0,0,255*0.2),320,50);
        this.touchBar.setPosition(0,80 - 25);
        this.touchBar.setAnchorPoint(0,0.5);
        this.addChild(this.touchBar);

        this.scheduleUpdate();
        this.setTouchEnabled(true);

        playBGM();
        return true;
    },

    update:function(dt){

        if(this.isGameFinished == true) return;

        this.storage.successRate = 
        Math.floor((this.storage.good + this.storage.normal + this.storage.bad) / (this.storage.good + this.storage.normal + this.storage.bad + this.storage.miss) * 100)

        this.cutIn.update();

        if(this.comboCnt >= 1){
            this.combo.setVisible(true);
            this.combo2.setVisible(true);
            this.combo.setString(this.comboCnt);
            if(this.comboCnt >= this.storage.maxCombo){
                this.storage.maxCombo = this.comboCnt;
            }
        }else{
            this.combo.setVisible(false);
            this.combo2.setVisible(false);
        }

        this.chara001.update();
        this.chara002.update();

        if(this.chara001.energy >= this.chara001.maxEnergy){
            this.chara001.energy = 0;
            this.chara002.damage(20);
        }

        if(this.chara002.energy >= this.chara002.maxEnergy){
            this.chara002.energy = 0;
            this.chara001.damage(20);
        }

        if(this.chara001.hp <= 0){
            //this.cutIn.set_text("YOU LOSE!!");
            this.isGameFinished = true;
            this.goGameOverLayer();
        }
        if(this.chara002.hp <= 0){
            //this.cutIn.set_text("YOU WIN!!!");
            this.isGameFinished = true;
            this.goResultLayer();
        }

        this.tapCnt++;
        if(this.tapCnt>=32){
            this.tapCnt = 0;
            var depX = getRandNumberFromRange(50,300);
            var depY = 500;
            this.tap = new Tap(this,depX,depY);
            this.addChild(this.tap);
            this.taps.push(this.tap);
        }

        for(var i=0;i<this.taps.length;i++){
            if(this.taps[i].update() == false){
                this.removeChild(this.taps[i]);
                this.taps.splice(i,1);
            }            
        }
    },

//デバイス入力----->
    onTouchesBegan:function (touches, event) {
        if(this.isToucheable() == false) return;
        this.touched = touches[0].getLocation();
        if(this.touched.y >= 200) return;
        for(var i=0;i<this.taps.length;i++){
            var x = this.taps[i].getPosition().x;
            var y = this.taps[i].getPosition().y;
            if( this.touched.x -20 <= x && x <= this.touched.x + 20 &&
                this.touched.y -20 <= y && y <= this.touched.y + 20){
                this.taps[i].tap();
playSE();
            }
        }
    },

    onTouchesMoved:function (touches, event) {
        this.touched = touches[0].getLocation();
    },

    onTouchesEnded:function (touches, event) {

    },

    onTouchesCancelled:function (touches, event) {
    },

//シーンの切り替え----->

    goResultLayer:function (pSender) {
        //ステージを追加
        this.storage.stageNumber++;
        if(this.storage.maxStageNumber <= this.storage.stageNumber){
            this.storage.maxStageNumber = this.storage.stageNumber;
        }
        //this.storage.calcTotal();
        //this.saveData();

        if(this.storage.stageNumber >= CONFIG.MAX_STAGE_NUMBER){
            //全クリア
            var scene = cc.Scene.create();
            scene.addChild(StaffRollLayer.create(this.storage));
            cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        }else{
            var scene = cc.Scene.create();
            //次のステージへいくためにstorageは必ず受けた渡す
            scene.addChild(ResultLayer.create(this.storage));
            //時計回り
            cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.5,scene));
        }
    },

    retry:function() {
        this.player.body.setPos(
            cp.v(100,300)
        );
        this.player.isNoRun = false;
        this.player.body.setAngle(0);
    },

    goGameOverLayer:function (pSender) {
        //this.storage.calcTotal();
        //this.saveData();
        var scene = cc.Scene.create();
        scene.addChild(GameOverLayer.create(this.storage));
        cc.Director.getInstance().replaceScene(cc.TransitionProgressRadialCW.create(1.2, scene));
    },

    saveData :function(){
        //3:android 4:iphone 5:ipad 100:mobile_web 101:pc_web
        var platform = cc.Application.getInstance().getTargetPlatform();
        this.storage = new Storage();  
        if(platform == 100 || platform == 101){
            var toObjString = this.storage.getJson();
            var toObj = JSON.parse(toObjString);
            window.localStorage.setItem("gameStorage",JSON.stringify(toObj));
        }
    },

    isToucheable:function (){
        return true;
    },

    changeLoadingImage:function(){
        //ローディング画像を変更
        var loaderScene = new cc.LoaderScene();
        loaderScene.init();
        loaderScene._logoTexture.src    = "res/loading.png";
        loaderScene._logoTexture.width  = 100;
        loaderScene._logoTexture.height = 100;
        cc.LoaderScene._instance = loaderScene;
    }
});

GameLayer.create = function (storage) {
    var sg = new GameLayer(storage);
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

