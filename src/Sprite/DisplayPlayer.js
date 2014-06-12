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

        this.dx = 1;
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
    },

    update:function(){
        this.posY2 += this.dx;
        if(this.posY2 >= this.posY + 40 || this.posY2 <= this.posY - 40){
            this.dx = this.dx * -1;
        }
        this.setPosition(this.posX,this.posY2);
    },

    damage:function(num){
        this.hp-=num;
        this.isDamaged = true;
    }

});