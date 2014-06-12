//
//  Player.js
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
        this.dx                = 0;
        this.dy                = 0;
        this.scale             = 1;
        this.alpha             = 1;
        this.touchX            = touchX;
        this.touchY            = touchY;


this.depDis = depDis;
if(this.depDis == "left"){
    this.depX = touchX - 300;
    this.depY = touchY;
}
if(this.depDis == "right"){
    this.depX = touchX + 300;
    this.depY = touchY;
}
if(this.depDis == "top"){
    this.depX = touchX;
    this.depY = touchY + 300;
}
if(this.depDis == "bottom"){
    this.depX = touchX;
    this.depY = touchY - 300;
}
if(this.depDis == "topleft"){
    this.depX = touchX - 300;
    this.depY = touchY + 300;
}
if(this.depDis == "topright"){
    this.depX = touchX + 300;
    this.depY = touchY + 300;
}
if(this.depDis == "bottomleft"){
    this.depX = touchX - 300;
    this.depY = touchY - 300;
}
if(this.depDis == "bottomright"){
    this.depX = touchX + 300;
    this.depY = touchY - 300;
}


        this.isTapped          = false;
        this.markerPosX        = this.depX - this.touchX;
        this.markerPosY        = this.depY - this.touchY;
        this.randingCnt        = 0;
        this.initializeAnimation();
        this.status = "none";
    },
    
    init:function () {
    },

    update:function() {
        this.speed = 10;
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
        this.sprite.setPosition(this.depX,this.depY);
        this.good.setPosition(this.depX,this.depY);
        this.normal.setPosition(this.depX,this.depY);
        this.bad.setPosition(this.depX,this.depY);

        if((this.depX == this.touchX) && (this.depY == this.touchY)){
            this.randingCnt++;
            if(this.status == "none" || this.status == "miss"){
                if(this.randingCnt>=10){
                    this.status = "miss";
                    this.bad.setVisible(true);
                    //return false;
                }
                if(this.randingCnt>=10){
                    this.alpha -= 0.05;
                    this.sprite.setOpacity(255 * this.alpha);
                    this.target.setOpacity(255 * this.alpha);
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

        if(this.isTapped == true){
            this.scale += 0.15;
            this.alpha -= 0.02;
            if(this.alpha < 0) this.alpha = 0;
            this.sprite.setScale(this.scale);
            this.sprite.setOpacity(255 * this.alpha);
        }

        return true;
    },

    tap:function(){
        if(this.isTapped==true) return;
        if(this.status == "miss") return;

        var distance = getDistance(
            this.target.getPosition().x,
            this.target.getPosition().y,
            this.sprite.getPosition().x,
            this.sprite.getPosition().y
        );
        if(50 < distance) return;

        playSE();
        this.isTapped = true;
        this.status = "bad";

        if(this.randingCnt <= 4){
            this.status = "normal";
        }
        if(this.randingCnt <= 2){
            this.status = "good";
        }

        if(this.status == "bad"){
            this.bad.setVisible(true);
            this.game.comboCnt = 0;
            this.game.storage.bad++;
        }
        if(this.status == "normal"){
            this.normal.setVisible(true);
            this.game.comboCnt = 0;
            this.game.storage.normal++;
        }
        if(this.status == "good"){
            this.good.setVisible(true);
            this.game.comboCnt++;
            this.game.storage.good++;
        }
    },

    initializeAnimation:function(){
        this.setPosition(0,0);

        this.target = cc.Sprite.create(s_tap_target);
        this.target.setPosition(this.touchX,this.touchY);
        this.addChild(this.target);

/*
        this.tap = cc.Node.create();
        this.tap.setPosition(this.depX,this.depY);
*/

        this.sprite = cc.Sprite.create(s_tap);
        this.addChild(this.sprite);
        this.sprite.setPosition(this.depX,this.depY);
        
        this.good = cc.Sprite.create(s_tap_good);
        this.addChild(this.good);
        this.good.setPosition(this.depX,this.depY);
        this.good.setVisible(false);

        this.normal = cc.Sprite.create(s_tap_normal);
        this.addChild(this.normal);
        this.normal.setPosition(this.depX,this.depY);
        this.normal.setVisible(false);

        this.bad = cc.Sprite.create(s_tap_bad);
        this.addChild(this.bad);
        this.bad.setPosition(this.depX,this.depY);
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