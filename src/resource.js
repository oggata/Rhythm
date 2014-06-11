//
//  resource.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var base_dir = "./";


var chara001     = "sprite/st-cthylla1.png";
var chara002     = "sprite/carstairs-beast.png";
var s_back       = "ui/back.png";

var s_tap        = "ui/tap.png";
var s_tap_good   = "ui/tap_good.png";
var s_tap_normal = "ui/tap_normal.png";
var s_tap_bad    = "ui/tap_bad.png";

//json
var charactor_json       = base_dir + "json/charactor.json";
var stages_json          = base_dir + "json/stages.json";
var enemy_json           = base_dir + "json/enemy.json";

//ui
var loading_png          = base_dir + "ui/back.png";
var s_chara_select       = base_dir + "ui/charactor_select.png";
var s_select_button      = base_dir + "ui/select_button.png";
var s_result_clear       = base_dir + "ui/result_clear.png";
var s_result_gameover    = base_dir + "ui/result_gameover.png";
var s_mission_start      = base_dir + "ui/mission_start.png"; 

//button
var s_button001_scale9   = base_dir + "button/button001_scale9.png";
var s_home_button        = base_dir + "button/homeButton.png";
var s_home_button_on     = base_dir + "button/homeButtonOn.png";
var s_item_button        = base_dir + "button/ember.png";
var s_item_button_on     = base_dir + "button/emberOn.png";
var s_facebook_button    = base_dir + "button/facebook.png";
var s_facebook_button_on = base_dir + "button/facebookOn.png";
var s_twitter_button     = base_dir + "button/twitter.png";
var s_twitter_button_on  = base_dir + "button/twitterOn.png";

//effect
var effect_fire          = base_dir + "effect/pipo-btleffect036_60.png";
var effect_water         = base_dir + "effect/pipo-btleffect038.png";

//sprite
var s_initSprite         = base_dir + "sprite/initSprite.png";

//bgm
var s_bgm_001            = base_dir + "res/sound/bgm/bgm_maoudamashii_cyber08.mp3";
var s_bgm_002            = base_dir + "res/sound/bgm/bgm_maoudamashii_cyber08.mp3";
var s_se_dog             = base_dir + "res/sound/se/se_maoudamashii_magical01.mp3";
var s_se_occupied        = base_dir + "res/sound/se/se_maoudamashii_onepoint17.mp3";
var s_se_enemyOccupied   = base_dir + "res/sound/se/se_maoudamashii_onepoint29.mp3";
var s_se_coin            = base_dir + "res/sound/se/se_maoudamashii_system47.mp3";
var s_se_attack          = base_dir + "res/sound/se/se_maoudamashii_battle01.mp3";
var s_se_system          = base_dir + "res/sound/se/se_maoudamashii_system23.mp3";

var g_system_resources   = [
    enemy_json,
    stages_json,
    charactor_json,
    loading_png,
    s_se_system,
    s_button001_scale9
];

var g_chara_select_resources   = [
    enemy_json,
    stages_json,
    charactor_json,
    loading_png,
    s_chara_select,
    s_se_system,
    s_select_button,
    s_button001_scale9
];

var g_resources       = [
    s_tap,
    chara001,
    chara002,
    s_back,
    s_bgm_001,
    s_tap_good,
    s_tap_normal,
    s_tap_bad
];