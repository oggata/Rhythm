//
//  Tap.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Tap = cc.Node.extend({

    ctor:function (game,touchX,touchY,depDis) {
        this._super();
        this.game              = game;
        this.storage           = this.game.storage;
        this.scale             = 1;
        this.alpha             = 1;
        this.rotate            = getRandNumberFromRange(0,360);
        this.touchX            = touchX;
        this.touchY            = touchY;
        this.isTapped          = false;
        this.speed             = 10;
        this.randingCnt        = 0;
        this.setMarkerDep(depDis);
        this.initializeAnimation();
        this.status = "none";
    },
    
    init:function () {
    },

    update:function() {
        if(this.status == "none"){
            this.rotate+=30;
        }else{
            this.rotate+=5;
        }
        this.marker.setRotation(this.rotate);
        //駒を動かす制御
        if(this.depX < this.touchX){
            this.depX += this.speed;
        }
        if(this.depX > this.touchX){
            this.depX -= this.speed;
        }
        if(this.depY < this.touchY){
            this.depY += this.speed;
        }
        if(this.depY > this.touchY){
            this.depY -= this.speed;
        }
        this.marker.setPosition(this.depX,this.depY);

        //タップする枠に入ったら着地とみなして、randingCntを増やす
        if((this.depX == this.touchX) && (this.depY == this.touchY)){
            this.randingCnt++;
            if(this.status == "none" || this.status == "miss"){
                //到達してから10フレーム経過したらミス扱い
                if(this.randingCnt>=10){
                    if(this.status == "none"){
                        this.game.storage.miss++;
                    }
                    this.status = "miss";
                    this.star.setVisible(false);
                    this.game.comboCnt = 0;
                    this.bad.setVisible(true);
                    this.alpha -= 0.05;
                    this.setMarkerAlpha(this.alpha);
                }
                if(this.randingCnt>=20){
                    return false;
                }
            }else{
                if(this.randingCnt>=10){
                    return false;
                }
            }
        }

        //駒がタップされたらscaleを増加する
        if(this.isTapped == true){
            this.scale += 0.15;
            this.alpha -= 0.05;
            if(this.alpha < 0) this.alpha = 0;
            this.marker.setScale(this.scale);
            this.setMarkerAlpha(this.alpha);
        }
        return true;
    },

    isCanTap:function(){
        //既にタップされた、ミスと見なされた、距離が離れすぎている駒はタップできない
        if(this.isTapped == true) return false;
        if(this.status == "miss") return false;
        var distance = getDistance(
            this.target.getPosition().x,
            this.target.getPosition().y,
            this.marker.getPosition().x,
            this.marker.getPosition().y
        );
        if(50 < distance) return false;
        return true;
    },

    tap:function(){
        if(this.isCanTap() == false) return;

        playSE();
        this.isTapped = true;
        
        //反射スピードによって評価がかわる
        this.status = "bad";
        if(this.randingCnt <= 4){
            this.status = "normal";
        }
        if(this.randingCnt <= 1){
            this.status = "good";
        }

        this.setScore(this.status);
    },

    setScore:function(status){
        //駒の評価に応じてスコアを計測する
        if(status == "bad"){
            this.bad.setVisible(true);
            this.game.comboCnt = 0;
            this.game.storage.bad++;
            this.star.setVisible(false);
        }
        if(status == "normal"){
            this.normal.setVisible(true);
            this.game.comboCnt = 0;
            this.game.storage.normal++;
            this.star.setVisible(false);
        }
        if(status == "good"){
            this.good.setVisible(true);
            this.game.comboCnt++;
            this.game.storage.good++;
            this.star.setVisible(false);
        }
    },

    setMarkerDep:function(depDis){
        if(depDis == "left"){
            this.depX = this.touchX - 300;
            this.depY = this.touchY;
        }
        if(depDis == "right"){
            this.depX = this.touchX + 300;
            this.depY = this.touchY;
        }
        if(depDis == "top"){
            this.depX = this.touchX;
            this.depY = this.touchY + 300;
        }
        if(depDis == "bottom"){
            this.depX = this.touchX;
            this.depY = this.touchY - 300;
        }
        if(depDis == "topleft"){
            this.depX = this.touchX - 300;
            this.depY = this.touchY + 300;
        }
        if(depDis == "topright"){
            this.depX = this.touchX + 300;
            this.depY = this.touchY + 300;
        }
        if(depDis == "bottomleft"){
            this.depX = this.touchX - 300;
            this.depY = this.touchY - 300;
        }
        if(depDis == "bottomright"){
            this.depX = this.touchX + 300;
            this.depY = this.touchY - 300;
        }
    },

    setMarkerAlpha:function(num){
        this.target.setOpacity(255 * num);
        this.star.setOpacity(255 * num);
        this.good.setOpacity(255 * num);
        this.normal.setOpacity(255 * num);
        this.bad.setOpacity(255 * num);
    },

    initializeAnimation:function(){
        this.setPosition(0,0);

        this.target = cc.Sprite.create(s_tap_target);
        this.target.setPosition(this.touchX,this.touchY);
        this.addChild(this.target);

        this.marker = cc.Node.create();
        this.marker.setPosition(this.depX,this.depY);
        this.addChild(this.marker);

        this.star = cc.Sprite.create(s_tap);
        this.marker.addChild(this.star);
        
        this.good = cc.Sprite.create(s_tap_good);
        this.marker.addChild(this.good);
        this.good.setVisible(false);

        this.normal = cc.Sprite.create(s_tap_normal);
        this.marker.addChild(this.normal);
        this.normal.setVisible(false);

        this.bad = cc.Sprite.create(s_tap_bad);
        this.marker.addChild(this.bad);
        this.bad.setVisible(false);

        //デバッグ
        /*
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(0,0);
            this.addChild(this.sigh);
        }*/
    }
});