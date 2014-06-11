//
//  Player.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Tap = cc.Node.extend({

    ctor:function (game,depX,depY) {
        this._super();
        this.game              = game;
        this.storage           = this.game.storage;
        this.dx                = 0;
        this.dy                = 0;
        this.scale             = 1;
        this.alpha             = 1;
        this.depX              = depX;
        this.depY              = depY;
        this.isTapped          = false;
        this.initializeAnimation();

        this.status = "none";
    },
    
    init:function () {
    },

    update:function() {
        if(this.isTapped == true){
            this.scale += 0.05;
            this.alpha -= 0.05;
            if(this.alpha < 0) this.alpha = 0;
            this.sprite.setScale(this.scale);
            this.sprite.setOpacity(255 * this.alpha);
        }
        this.setPosition(this.getPosition().x,this.getPosition().y - 5);
        if(this.getPosition().y < -100){
            //this.game.chara001.damage(10);
            if(this.status == "none"){
                this.game.chara002.energy += 10;
                this.game.comboCnt = 0;
                this.game.storage.miss++;
            }
            if(this.status == "bad"){
                this.game.chara002.energy += 5;
            }
            return false;
        }
        return true;
    },

    tap:function(){
        this.isTapped = true;
        
        this.status = "bad";
        if(80 - 20 <= this.getPosition().y && this.getPosition().y <= 80 + 20){
            this.status = "normal";
        }
        if(80 - 10 <= this.getPosition().y && this.getPosition().y <= 80 + 10){
            this.status = "good";
        }

        if(this.status == "bad"){
            this.bad.setVisible(true);
            this.game.chara001.energy += 5;
            this.game.comboCnt = 0;
            this.game.storage.bad++;
        }
        if(this.status == "normal"){
            this.normal.setVisible(true);
            this.game.chara001.energy += 10;
            this.game.comboCnt = 0;
            this.game.storage.normal++;
        }
        if(this.status == "good"){
            this.good.setVisible(true);
            this.game.chara001.energy += 20;
            this.game.comboCnt++;
            this.game.storage.good++;
        }

        //this.sprite.img = s_tap2;
        //this.sprite.setTexture(s_tap2);
    },

    initializeAnimation:function(){
        
        this.sprite = cc.Sprite.create(s_tap);
        this.addChild(this.sprite);
        this.setPosition(this.depX,this.depY);
        
        this.good = cc.Sprite.create(s_tap_good);
        this.addChild(this.good);
        this.good.setPosition(0,0);
        this.good.setVisible(false);

        this.normal = cc.Sprite.create(s_tap_normal);
        this.addChild(this.normal);
        this.normal.setPosition(0,0);
        this.normal.setVisible(false);

        this.bad = cc.Sprite.create(s_tap_bad);
        this.addChild(this.bad);
        this.bad.setPosition(0,0);
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