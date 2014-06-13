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

        
        this.gameCnt = 0;
        this.stages = CONFIG.STAGE_001;

        this.musicTempo = 29;
        this.tapBeginCnt = 1;

        this.isGameFinished = false;
        this.comboCnt = 0;
        this.tapCnt = 0;
        this.taps = [];

        this.back = cc.Sprite.create(s_back);
        this.back.setAnchorPoint(0,0);
        this.back.setPosition(0,0);
        this.addChild(this.back);

        this.hitGauge = new Gauge(300,5,'blue');
        this.hitGauge.setPosition(10,10);
        this.addChild(this.hitGauge);

        this.player = new DisplayPlayer(chara001,0,380);
        this.addChild(this.player);

        this.enemy = new DisplayPlayer(chara002,10,160);
        this.addChild(this.enemy);

        this.bullet = new Bullet();
        this.bullet.set_position(320/2,480/2);
        this.addChild(this.bullet);

/*
        this.timeGauge = new Gauge(300,4,'blue');
        this.timeGauge.setPosition(10,10);
        this.addChild(this.timeGauge);
*/
        this.score = cc.LabelTTF.create("100.00%","Arial",17);
        this.score.setPosition(10,15);
        this.score.setAnchorPoint(0,0);
        this.addChild(this.score);

        this.combo = cc.LabelTTF.create("00","Arial",50);
        this.combo.setFontFillColor(cc.c4b(30,144,255,255));
        this.combo.setAnchorPoint(0.5,0.5);
        this.combo.setPosition(320/2,280);
        this.addChild(this.combo);

        this.combo2 = cc.LabelTTF.create("COMBO","Arial",15);
        this.combo2.setFontFillColor(cc.c4b(30,144,255,255));
        this.combo2.setPosition(320/2,280 - 30);
        this.addChild(this.combo2);

        this.cutIn = new CutIn();
        this.cutIn.setPosition(0,200);
        this.addChild(this.cutIn,999);
        this.cutIn.set_text("START");

        this.scheduleUpdate();
        this.setTouchEnabled(true);

        playBGM();
        return true;
    },

    update:function(dt){
        if(this.isGameFinished == true) return;

        //ゲーム時間を進める
        this.gameCnt++;

        this.enemy.update();
        this.cutIn.update();

        //タップする駒を生成
        for(var i=0;i<this.stages.length;i++){
            var time = this.stages[i][0];
            if(this.gameCnt + this.tapBeginCnt * 30 == time * 30){
                this.tap = new Tap(
                    this,
                    this.stages[i][1],
                    this.stages[i][2],
                    this.stages[i][3]
                );
                this.addChild(this.tap);
                this.taps.push(this.tap);       
            }
        }

        //不要な駒を削除する
        for(var i=0;i<this.taps.length;i++){
            if(this.taps[i].update() == false){
                this.removeChild(this.taps[i]);
                this.taps.splice(i,1);
            }            
        }

        //１曲終わったら終了
        if(this.gameCnt + this.tapBeginCnt * 30 == CONFIG.STAGE_001_MUSIC_TIME - 30 * 5){
            this.cutIn.set_text("FINISHED...");
        }
        if(this.gameCnt + this.tapBeginCnt * 30 == CONFIG.STAGE_001_MUSIC_TIME){
            this.goResultLayer();
        }

        //スコアの計測
        this.storage.successRate = Math.floor((this.storage.good + this.storage.normal)/(this.storage.good + this.storage.normal + this.storage.bad + this.storage.miss)* 100);
        if(this.storage.good + this.storage.normal == 0){
            this.score.setString("hit:0%");
            this.hitGauge.update(1);
        }else{
            this.score.setString("hit:" + this.storage.successRate.toFixed(2) + "%");
            this.hitGauge.update(this.storage.successRate.toFixed(2) / 100);
        }

        if(this.comboCnt >= 1){
            this.combo.setVisible(true);
            this.combo2.setVisible(true);
            this.bullet.set_visible(true);
            this.combo.setString(this.comboCnt);
            if(this.comboCnt >= this.storage.maxCombo){
                this.storage.maxCombo = this.comboCnt;
            }
        }else{
            this.combo.setVisible(false);
            this.combo2.setVisible(false);
            this.bullet.set_visible(false);
        }
    },

//デバイス入力----->
    onTouchesBegan:function (touches, event) {
        //指１本目
        if(this.isToucheable() == false) return;
        
        if(touches.length >= 1){
            this.touched = touches[0].getLocation();
            for(var i=0;i<this.taps.length;i++){
                var x = this.taps[i].target.getPosition().x;
                var y = this.taps[i].target.getPosition().y;
                cc.log("aaax:" + x + "y:" + y);
                if( this.touched.x -20 <= x && x <= this.touched.x + 20 &&
                    this.touched.y -20 <= y && y <= this.touched.y + 20){
                    cc.log("x:" + x + "y:" + y);
                    this.taps[i].tap();
                }
            }
        }
        
        //指2本目
        if(touches.length >= 2){
            this.touched = touches[1].getLocation();
            for(var i=0;i<this.taps.length;i++){
                var x = this.taps[i].target.getPosition().x;
                var y = this.taps[i].target.getPosition().y;
                cc.log("aaax:" + x + "y:" + y);
                if( this.touched.x -20 <= x && x <= this.touched.x + 20 &&
                    this.touched.y -20 <= y && y <= this.touched.y + 20){
                    cc.log("x:" + x + "y:" + y);
                    this.taps[i].tap();
                }
            }
        }

        //指3本目
        if(touches.length >= 3){
            this.touched = touches[2].getLocation();
            for(var i=0;i<this.taps.length;i++){
                var x = this.taps[i].target.getPosition().x;
                var y = this.taps[i].target.getPosition().y;
                cc.log("aaax:" + x + "y:" + y);
                if( this.touched.x -20 <= x && x <= this.touched.x + 20 &&
                    this.touched.y -20 <= y && y <= this.touched.y + 20){
                    cc.log("x:" + x + "y:" + y);
                    this.taps[i].tap();
                }
            }
        }
    },

    onTouchesMoved:function (touches, event) {
        if(this.isToucheable() == false) return;

        if(touches.length >= 1){
            this.touched = touches[0].getLocation();
            for(var i=0;i<this.taps.length;i++){
                var x = this.taps[i].target.getPosition().x;
                var y = this.taps[i].target.getPosition().y;
                cc.log("aaax:" + x + "y:" + y);
                if( this.touched.x -20 <= x && x <= this.touched.x + 20 &&
                    this.touched.y -20 <= y && y <= this.touched.y + 20){
                    cc.log("x:" + x + "y:" + y);
                    this.taps[i].tap();
                }
            }
        }

        if(touches.length >= 2){
            this.touched = touches[1].getLocation();
            for(var i=0;i<this.taps.length;i++){
                var x = this.taps[i].target.getPosition().x;
                var y = this.taps[i].target.getPosition().y;
                cc.log("aaax:" + x + "y:" + y);
                if( this.touched.x -20 <= x && x <= this.touched.x + 20 &&
                    this.touched.y -20 <= y && y <= this.touched.y + 20){
                    cc.log("x:" + x + "y:" + y);
                    this.taps[i].tap();
                }
            }
        }

        if(touches.length >= 3){
            this.touched = touches[2].getLocation();
            for(var i=0;i<this.taps.length;i++){
                var x = this.taps[i].target.getPosition().x;
                var y = this.taps[i].target.getPosition().y;
                cc.log("aaax:" + x + "y:" + y);
                if( this.touched.x -20 <= x && x <= this.touched.x + 20 &&
                    this.touched.y -20 <= y && y <= this.touched.y + 20){
                    cc.log("x:" + x + "y:" + y);
                    this.taps[i].tap();
                }
            }
        }

    },

    onTouchesEnded:function (touches, event) {
    },

    onTouchesCancelled:function (touches, event) {
    },

//シーンの切り替え----->

    goResultLayer:function (pSender) {
        stopBGM();
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
        stopBGM();
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
