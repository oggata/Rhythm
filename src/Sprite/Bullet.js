//
//  Bullet.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Bullet = cc.Node.extend({
    ctor:function () {
        this._super();

        var frameSeq = [];
        for (var i = 0; i <= 6; i++) {
            var frame = cc.SpriteFrame.create(effect_fire,cc.rect(0,120*i,320,120));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq,0.05);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(effect_fire,cc.rect(0,0,320,120));
        this.sprite.runAction(this.ra);
        this.addChild(this.sprite);
        this.isEffect    = true;

        this.sprite.setPosition(0,30);
    },

    init:function () {
    },

    update:function() {
        return false;
    },

    set_position:function(x,y){
        this.setPosition(x,y);
    },

    set_visible:function(isVisible){
        this.sprite.setVisible(isVisible);
    }
});
