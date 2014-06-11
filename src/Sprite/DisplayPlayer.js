//
//  DisplayPlayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var DisplayPlayer = cc.Node.extend({
    ctor:function (img,w,h) {
        this._super();

        this.hp     = 100;
        this.maxHp  = 100;
        this.attack = 10;
        this.energy = 0;
        this.maxEnergy = 100;

        this.posX = w;
        this.posY = h;
        this.posY2 = h;
        this.damageCnt = 0;
        this.isDamaged = false;
        this.setPosition(w,h);

        this.chara001 = cc.Sprite.create(img);
        this.chara001.setAnchorPoint(0,0);
        this.chara001.setScale(0.6);
        this.addChild(this.chara001);
        this.chara001.setPosition(0,0);

        this.hpGauge = new Gauge(140,10,'blue');
        this.hpGauge.setAnchorPoint(0,0);
        this.hpGauge.setPosition(0,170);
        this.addChild(this.hpGauge);

        this.attackGauge = new Gauge(140,10,'red');
        this.attackGauge.setAnchorPoint(0,0);
        this.attackGauge.setPosition(0,150);
        this.addChild(this.attackGauge);
    },

    update:function(){

        this.hpGauge.update(this.hp/this.maxHp);
        this.attackGauge.update(this.energy/this.maxEnergy);

        if(this.isDamaged == true){
            this.damageCnt++;
            if(this.damageCnt>=30){
                this.damageCnt = 0;
                this.isDamaged = false;
            }
            this.posY2+=5;
            if(this.posY2 >= this.posY + 20){
                this.posY2 = this.posY;
            }
            this.setPosition(this.posX,this.posY2);
        }else{
            this.setPosition(this.posX,this.posY);
        }
    },

    damage:function(num){
        this.hp-=num;
        this.isDamaged = true;
    }

});