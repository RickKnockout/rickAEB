// ==UserScript==
// @name                AE Extras Rick
// @namespace           http://www.vig.vg/
// @description         Various user interface enhancements for the Astro Empires MMOG (www.astroempires.com)
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant GM_addStyle
// @include             http://*.astroempires.com/*
// @include             http://www.vig.vg/*
// @exclude             http://*.astroempires.com/
// @exclude             http://*.astroempires.com/home.aspx*
// @exclude             http://*.astroempires.com/login.aspx*
// @exclude             http://*.astroempires.com/profile.aspx?action=*
// @exclude             http://forum.astroempires.com/*
// @exclude             http://support.astroempires.com/*
// @exclude             http://wiki.astroempires.com/*
// @exclude             http://wiki.astroempires.com/*/*
// @exclude             http://*.astroempires.com/upgrade.aspx*
// @exclude             http://*.astroempires.com/tables.aspx*
// @exclude        http://*.astroempires.com/smilies.aspx*
// ==/UserScript==
/*
AE Extras Creator -- knubile (May 2008)
AE Extras Coder -- Cold-Phoenix (Sep 6, 2008)
AE Extras WoG Edit -- Mapleson (Apr 10, 2009)
AE Extras WoG Edit(After Sever Layout Change) -- Vig (May 23, 2009)
AE Bits (after WoG disbanding) -- Vig(Apr 17, 2010)
AE Bits (after vig stopped development)

------May 28th------
- Fixed the broken links to my site, as well as put a redirecting page (sorry i messed that up)
- Fixed the bug with the quick queue links on the construction pages. It now uses their new way of queueing, not having to reload the entire page.
- Fixed the bug with the advanced construction script, where it was incorectly showing how many of what buildings were being queued.
- Added the Ixion galaxy to the FireFox extension menu and added the ability for it to run under the extension
- Fixed a menu bug in the FireFox extension
- Added links to the attack screen and fleet info page where you can load my battle calculator pre-set with the proper units and technology
- Fixed a bug with the location text box on the map pages, the one that allows for easier copying of the planets location.
- Changed the added empire menu (when not on the empire tab) to reflect the new prodction tab.
- Changed the quickbookmarks to allow scrolling. Meaning you can fill it up and the page will expand and allow you to scroll down to see all your links
- General script clean up and performance enhancing

----------------------
Disclaimer
----------------------
Certain parts of this script are taken from other similer projects, all rights
 on those sections are owned by their respective creators.
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
For a full copy of the GNU General Public License, see
http://www.gnu.org/licenses/.

*/


var totalStart = new Date();
var DEBUGNEWCODE = 0;

var scriptName = 'Kashikoi\'s  AE Bits';
var scriptId = '33239';
var scriptVersion = 1.31;
var chatlink = new Object;
chatlink.fenix = 'http://www.gamesurge.net/chat/?';
chatlink.gamma = 'http://www.gamesurge.net/chat/?';
chatlink.helion = 'http://moral-decay.net/chat/irc.php?nick=';
var calc_link = 'https://aebits.win/aeBattleCalc';
//==========================================
//Debug Setup
//==========================================
var DEBUG_KEY = "config_debug";
var LOG_LEVEL_KEY = "config_logLevel";

var LOG_LEVEL_DEBUG = 1;
var LOG_LEVEL_INFO = 2;
var LOG_LEVEL_WARN = 3;
var LOG_LEVEL_ERROR = 4;

var location = window.location.href;
var _site = "ae";
var _page = getPageType();
var LOG_LEVEL = parseNum(getSetting(LOG_LEVEL_KEY, 0));

if (!getSetting(DEBUG_KEY, false)) LOG_LEVEL = 0;
if (DEBUGNEWCODE) LOG_LEVEL = 4;


// console = ff, unsafewindow.console = firebug, else custom

try {
    var debugwith;
    if ((console && console.log) || (unsafeWindow.console && unsafeWindow.console.log)) debugwith = "firefox";
    if (unsafeWindow.console && unsafeWindow.console.firebug) debugwith = "firebug";
    var console = {
        log: function() // Basic logging function for loading etc
        {
            if (LOG_LEVEL >= 1 && debugwith == "firebug") {
                if (arguments.length == 1 && typeof(arguments[0]) == "string") {
                    unsafeWindow.console.log("Location: " + location +
                        " \nLog(" + typeof(arguments) + "): " + arguments[0]);
                } else if ((typeof(arguments) == "object" || typeof(arguments) == "array")) {
                    unsafeWindow.console.log("Location: " + location +
                        " \nLog(" + typeof(arguments) + "): %o", arguments);
                } else {
                    unsafeWindow.console.log("Location: " + location +
                        " \nLog(" + typeof(arguments) + "): " + arguments);
                }
                return;
            }
            if (LOG_LEVEL >= 1 && debugwith == "firefox") {
                //unsafeWindow.console.log("Location: " + location + " \nLog: " + arguments);
                return;
            }
            if (LOG_LEVEL >= 1 && !debugwith) {
                notify("\nError: " + arguments[0], MESSAGE_CLASS_ERROR);
                return;
            }
        },
        info: function() // Show data relevent to any functions being worked on
        {
            if (LOG_LEVEL >= 2 && debugwith == "firebug") {
                if (arguments.length == 1 && typeof(arguments[0]) == "string") {
                    unsafeWindow.console.error("Location: " + location +
                        " \nInfo(" + typeof(arguments) + "): " + arguments[0]);
                } else if ((typeof(arguments) == "object" || typeof(arguments) == "array")) {
                    unsafeWindow.console.error("Location: " + location +
                        " \nInfo(" + typeof(arguments) + "): %o", arguments);
                } else {
                    unsafeWindow.console.error("Location: " + location +
                        " \nInfo(" + typeof(arguments) + "): " + arguments);
                }
                return;
            }
            if (LOG_LEVEL >= 2 && debugwith == "firefox") {
                console.log("Location: " + location + " \nInfo: " + arguments);
                return;
            }
            if (LOG_LEVEL >= 2 && !debugwith) {
                notify("Location: " + location + " \nError: " + arguments[0], MESSAGE_CLASS_ERROR);
                return;
            }
        },
        warn: function() // Show any non-fatal errors
        {
            if (LOG_LEVEL >= 3 && debugwith == "firebug") {
                if (arguments.length == 1 && typeof(arguments[0]) == "string") {
                    unsafeWindow.console.warn("Location: " + location + " \nWarn(" + typeof(arguments) + "): " + arguments[0]);
                } else if ((typeof(arguments) == "object" || typeof(arguments) == "array")) {
                    unsafeWindow.console.warn("Location: " + location + " \nWarn(" + typeof(arguments) + "): %o", arguments);
                } else {
                    unsafeWindow.console.warn("Location: " + location + " \nWarn(" + typeof(arguments) + "): " + arguments);
                }
                return;
            }
            if (LOG_LEVEL >= 3 && debugwith == "firefox") {
                console.log("Location: " + location + " \nWarning: " + arguments);
                return;
            }
            if (LOG_LEVEL >= 3 && !debugwith) {
                notify("Location: " + location + " \nError: " + arguments[0], MESSAGE_CLASS_ERROR);
                return;
            }
        },
        error: function() // If error is breaking entire script
        {
            if (LOG_LEVEL == 4 && debugwith == "firebug") {
                if (arguments.length == 1 && typeof(arguments[0]) == "string") {
                    unsafeWindow.console.error("Location: " + location + " \nError(" + typeof(arguments) + "): " + arguments[0]);
                } else if ((typeof(arguments) == "object" || typeof(arguments) == "array")) {
                    unsafeWindow.console.error("Location: " + location + " \nError(" + typeof(arguments) + "): %o", arguments);
                } else {
                    unsafeWindow.console.error("Location: " + location + " \nError(" + typeof(arguments) + "): " + arguments);
                }
                return;
            }
            if (LOG_LEVEL == 4 && debugwith == "firefox") {
                console.log("Location: " + location + " \nError: " + arguments);
                return;
            }
            if (LOG_LEVEL == 4 && !debugwith) {
                notify("Location: " + location + " \nError: " + arguments[0], MESSAGE_CLASS_ERROR);
                return;
            }
        }
    };

} catch (e) {
    notify("Console exception: " + e, MESSAGE_CLASS_ERROR);
}

//if (document.title.indexOf("Error") != -1) return; // try to break out if connections down to avoid messing up error page

if (DEBUGNEWCODE) console.log("Log level: " + LOG_LEVEL + " Server: " + getServer());

if (DEBUGNEWCODE) // Test save to check if functional
{
    setSetting("test", "working");
    var val = getSetting("test", "BROKEN");
    if (val != "working") console.log("Debug Test Save " + val);
}

//==========================================
//-----------Preset Definitions-------------
//==========================================

//NOTE: These are simpy defaults. There's no need to edit these here in the script.
//All names and values are configurable from the production page.


var PRESET_KEYS = new Array("Fighters", "Bombers", "Heavy Bombers", "Ion Bombers", "Corvette", "Recycler", "Destroyer", "Frigate", "Ion Frigate",
    "Scout Ship", "Outpost Ship", "Cruiser", "Carrier", "Heavy Cruiser", "Battleship", "Fleet Carrier", "Dreadnought", "Titan", "Leviathan", "Death Star", "Goods");
var DEFAULT_PRESET_1 = "500,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
var DEFAULT_PRESET_2 = "50,0,0,0,20,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
var DEFAULT_PRESET_3 = "60,0,0,0,0,0,0,0,0,0,0,8,0,4,0,0,0,0,0,0,0";
var DEFAULT_PRESET_4 = "120,0,0,0,0,0,0,0,0,0,0,16,0,8,0,0,0,0,0,0,0";
var DEFAULT_PRESET_NAME_1 = "Fighters";
var DEFAULT_PRESET_NAME_2 = "Light Fleet";
var DEFAULT_PRESET_NAME_3 = "Heavy Fleet";
var DEFAULT_PRESET_NAME_4 = "Double Heavy Fleet";
var PRESET_1_NAME_KEY = "PRESET_1_NAME";
var PRESET_2_NAME_KEY = "PRESET_2_NAME";
var PRESET_3_NAME_KEY = "PRESET_3_NAME";
var PRESET_4_NAME_KEY = "PRESET_4_NAME";
var PRESET_1_VALUE_KEY = "PRESET_1_VALUE";
var PRESET_2_VALUE_KEY = "PRESET_2_VALUE";
var PRESET_3_VALUE_KEY = "PRESET_3_VALUE";
var PRESET_4_VALUE_KEY = "PRESET_4_VALUE";

var BASE_LIST_KEY = "BaseList";
var MESSAGE_CLASS = "notifier";
var MESSAGE_CLASS_ERROR = "notifierError";
GM_addStyle('#gm_update_alert {' +
    '  position: relative;' +
    '  top: 0px;' +
    '  left: 0px;' +
    '  margin:0 auto;' +
    '  width:' + getTableWidth() + 'px;' +
    '  background-color: #191919;' +
    '  text-align: center;' +
    '  font-size: 11px;' +
    '  font-family: Tahoma;' +
    '  border: #333333 solid 1px;' +
    '  margin-bottom: 10px;' +
    '  padding-left: 0px;' +
    '  padding-right: 0px;' +
    '  padding-top: 10px;' +
    '  padding-bottom: 10px;' +
    '  opacity: 0.82;' +
    '}');
var startTime = totalStart;
var endTime;
var timerMessage = "";

var NAME_INDEX = 0;

var FT_INDEX = 0;
var BO_INDEX = 1;
var HB_INDEX = 2;
var IB_INDEX = 3;
var CV_INDEX = 4;
var RC_INDEX = 5;
var DE_INDEX = 6;
var FR_INDEX = 7;
var IF_INDEX = 8;
var SS_INDEX = 9;
var OS_INDEX = 10;
var CR_INDEX = 11;
var CA_INDEX = 12;
var HC_INDEX = 13;
var BC_INDEX = 14;
var FC_INDEX = 15;
var DN_INDEX = 16;
var TI_INDEX = 17;
var LE_INDEX = 18;
var DS_INDEX = 19;
var BARRACKS_INDEX = 20;
var LASER_TURRETS_INDEX = 21;
var MISSLE_TURRETS_INDEX = 22;
var PLASMA_TURRENTS_INDEX = 23;
var ION_TURRETS_INDEX = 24;
var PHOTON_TURRETS_INDEX = 25;
var DISRUPTOR_TURRETS_INDEX = 26;
var DEFLECTION_SHIELDS_INDEX = 27;
var PLANETARY_SHIELD_INDEX = 28;
var PLANETARY_RING_INDEX = 29;
var fightingShips = "11111011100101101111";
var shipValues = new Array(5, 10, 30, 60, 20, 30, 40, 80, 120, 40, 100, 200, 400, 500, 2000, 2500, 10000, 50000, 200000, 500000);
var shipHangarValues = new Array(0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 60, 8, 40, 400, 200, 1000, 4000, 10000);
var shipDefaultArmour = new Array(2, 2, 4, 4, 4, 2, 8, 12, 12, 2, 4, 24, 24, 48, 128, 96, 512, 2048, 6600, 13500, 4, 8, 16, 24, 32, 64, 256, 512, 2048, 1024);
var shipDefaultPower = new Array(2, 4, 10, 12, 4, 2, 8, 12, 14, 1, 2, 24, 12, 48, 168, 64, 756, 3402, 10000, 25500, 4, 8, 16, 24, 32, 64, 256, 2, 4, 2048);
var shipDefaultShield = new Array(0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 2, 2, 4, 10, 8, 20, 30, 40, 60, 0, 0, 0, 0, 2, 6, 8, 16, 20, 12);
var shipShortName = new Array("FT", "BO", "HB", "IB", "CV", "RC", "DE", "FR", "IF", "SS", "OS", "CR", "CA", "HC", "BS", "FC", "DN", "TI", "LE", "DS", "BA", "LT", "MT", "PT", "IT", "OT", "DT", "FS", "PS", "PR");

//Tech in order, Laser, Missile, Plasma, Ion, Photon, Disruptor, Armour, Shielding
var shipWeaponTechIndex = new Array(0, 1, 2, 3, 0, 0, 2, 1, 3, 0, 0, 2, 1, 2, 3, 3, 4, 5, 4, 5, 0, 0, 1, 2, 3, 4, 5, 3, 3, 4);
//==========================================
// Check if new install
//==========================================
function installCheck() { // 2010-10, used once
    try {
        var OldVersion = parseFloat(GM_getValue("scriptVersion", 0 + ""));
        var NewVersion = parseFloat(scriptVersion);
        var LatestVersion = 0.0;
        var lastCheck = parseInt(GM_getValue("updateCheckTime", 0 + ""));
        var currTime = (new Date).getTime();
        if (OldVersion == null || OldVersion == "") {
            GM_setValue("scriptVersion", NewVersion + "");
            if (GM_listValues() == null || GM_listValues() == "") resetConfig("newInstall");
            insertNotification("You have sucessfully installed " + scriptName + " Version: " + NewVersion + " to your web browser.<br />");
            return;
        } else if (NewVersion > OldVersion) {
            //console.log(NewVersion);
            GM_setValue("scriptVersion", NewVersion + "");
            insertNotification("You have sucessfully upgraded " + scriptName + " From (" + OldVersion + ") To (" + NewVersion + ").<br />");
        }
    } catch (e) {
        console.log("Line Number: " + e.lineNumber + "\ninstallCheck(): " + e);
    }
}
//==========================================
//---------Common Functions-----------
//==========================================

function getPlayerName(name){
    var regex = /(\[.*?\])(.*)/;
    result = regex.exec(name);
    if(result != null)
    return result[2].substring(1);
    else return name;
}
function getGuild(name){
    var regex = /\[.*?\]/;
    result = regex.exec(name);
    if(result) return result[0];
    else return name;
}

//From http://www.web-source.net/web_development/currency_formatting.htm
function commaFormat(amount) { // 2010-10, used 6 times
    var delimiter = unescape(getSetting(NUMBER_DELIMETER_KEY, ","));
    amount = "" + amount;
    var a = amount.split('.', 2);
    var d = a[1];
    var i = parseNum(a[0]);
    if (isNaN(i)) {
        return '';
    }
    var minus = '';
    if (i < 0) {
        minus = '-';
    }
    i = Math.abs(i);
    var n = new String(i);
    a = [];
    while (n.length > 3) {
        var nn = n.substr(n.length - 3);
        a.unshift(nn);
        n = n.substr(0, n.length - 3);
    }
    if (n.length > 0) {
        a.unshift(n);
    }
    n = a.join(delimiter);
    if (d == undefined || d.length < 1) {
        amount = n;
    } else {
        amount = n + '.' + d;
    }
    amount = minus + amount;
    return amount;
}



var thousandsFormatter = getSetting(NUMBER_DELIMETER_KEY, ',');

function parseNum(s) { // 2010-10, used 10+
    try {
        s += '';
        var re = /,/g;
        if (thousandsFormatter == '%2C'){
            re = /,/g;
        }
        if (thousandsFormatter == '%20'){
            re = / /g;
        }
        s = s.replace(re,"");
        return parseInt(s);
    } catch (e) {
        console.log('parseNum(' + s + ') error ' + e);
        return s;
    }
}
var cached_new_style = 5;

function isNewStyle() {
    if (cached_new_style != 5) return cached_new_style;
    if (document.getElementById('background-container') || document.getElementById('background-content')) {
        cached_new_style = true;
    } else {
        cached_new_style = false;
    }
    return cached_new_style;
}

//==========================================
//Get/Set Functions
//Prefixes server name to settings
//==========================================
function getSetting(key, value) {
    try {
        if (typeof value == "float") value += "";
        return GM_getValue(getServer() + "_" + key, value);
    } catch (e) {
        console.warn("Line Number: " + e.lineNumber + "\n getSetting error: " + e);
        console.info("\nKey: " + key + "\nValue: " + value);
    }
}

function setSetting(key, value) {
    try {
        if (typeof value == "float") value += "";
        return GM_setValue(getServer() + "_" + key, value);
    } catch (e) {
        console.log("Line Number: " + e.lineNumber + "\n setSetting error: " + e);
        console.log("\nKey: " + key + "\nValue: " + value);
    }
}

function onFeatureComplete(name) {
    if (getSetting(SHOW_EXECUTION_TIME_KEY, false)) {
        var startMilliseconds = startTime.getTime();
        var endMilliseconds = new Date().getTime();
        var difference = endMilliseconds - startMilliseconds;
        //console.log("Execution time: "+ difference +" milliseconds");
        if (difference > 0)
            timerMessage = timerMessage + "<br />" + name + ": " + difference;
        startTime = new Date();
    }
}

function displayTimes() { // 2010-10, used once
    var startMilliseconds = totalStart.getTime();
    var endMilliseconds = new Date().getTime();
    var difference = endMilliseconds - startMilliseconds;
    timerMessage = timerMessage + "<br />Total Time: &cong; " + difference;
    //console.info(timerMessage);
    var center = document.createElement("div");
    center.id = "loadtimers";
    center.setAttribute("class", "cpscripttimes");
    center.innerHTML = timerMessage;
    document.body.appendChild(center);
}

//==========================================
//Returns the full server name
//==========================================

var _server = null;

function getServer() { // 2010-10, used alot
    if (_server == null) {
        var regex = /https?:\/\/([a-z]+)\.astroempires\.com/;
        var result = regex.exec(document.location);
        if (result == null) {
            regex = /https?:\/\/([a-z]+)\.astroempires\.com/;
            result = regex.exec(document.URL);
        }
        if (result != null) _server = result[1];
    }
    //console.log("Server: " + _server);
    return _server;
}

function getGalaxy() { // 2010-10, used 2 times
    if (_server == null) var _server = getServer();
    return _server.charAt(0).toUpperCase();
}

function getView() {
    var view = location.split("view=", 2);
    if (view.length <= 1)
        return "";
    view = view[1].split("&")[0];
    view = view.substring(0, 1).toUpperCase() + view.substring(1);
    //console.log(view);
    return view;
}

function getPageType() { // 2010-10, used once
    if (location.indexOf('empire.aspx') != -1) {
        if (location.indexOf('bases_capacities') != -1) return 'bases_capacities';
        if (location.indexOf('report') != -1) return 'report';
        if (location.indexOf('view=units') != -1) return 'empire_units';
        if (location.indexOf('view=structures') != -1) return 'empire_structures';
        return 'empire';
    } else if (location.indexOf('map.aspx') != -1) {
        switch (window.location.search.length) {
            case 17:
                if (location.indexOf('cmp=') != -1) return 'mapRegion';
                else return 'mapAstro';
            break;
            case 20:
                return 'mapSystem';
        }
    } else if (location.indexOf('base.aspx') != -1) {
        if (location.indexOf('structures') == -1 && location.indexOf('defenses') == -1 && location.indexOf('production') == -1 &&
            location.indexOf('research') == -1 && location.indexOf('trade') == -1 && location.indexOf('base=') != -1) {
            return 'baseOverview';
        } else return 'other';
    } else if (location.indexOf('messages.aspx') != -1) return 'messages';
    else if (location.indexOf('guild.aspx') != -1) return 'guild';
    else if (location.indexOf('profile.aspx') != -1 && location.indexOf('?player=') == -1) return 'profile';
    else return 'other';
}
// Simple replacement of getelementbyid with $ to save typing
function $(variable) {
    if (!variable) return;
    //  console.log("$("+variable+")");
    var node = document.getElementById(variable);
    if (node) return node;
}
//==========================================
//---------Display Functions----------------
//==========================================
//Notifier Utility Code
//http://javascript.nwbox.com/asyncAlert/
//-----------------------------------
var notifycount = 1;

function notify(m, c) {
    if ($('Message')) {
        //        console.log("Removing old notify: "+document.body.firstChild.innerHTML);
        document.body.removeChild($('Message'));
    }
    //    var msg = "New notify: "+m
    //    if(c != null) msg = msg+" Type: "+c;
    //    console.log(msg);
    //  create a block element
    var b = document.createElement('div');
    b.id = 'Message';
    b.className = c || 'notifier';
    //  b.style.cssText='top:-9999px;left:-9999px;position:absolute;white-space:nowrap;';
    b.style.cssText = 'position:absolute;white-space:nowrap;z-index:10;';
    //  insert block in to body
    b = document.body.insertBefore(b, document.body.firstChild);
    //  write HTML fragment to it
    b.innerHTML = m;
    //  save width/height before hiding
    var bw = b.offsetWidth;
    var bh = b.offsetHeight;
    //  hide, move and then show
    b.style.display = 'none';
    b.style.top = (document.body.clientHeight / 2 + window.pageYOffset - bh / 2) + "px";
    b.style.left = (document.body.clientWidth / 2 + window.pageXOffset - bw / 2) + "px";

    //console.log( b.style.top);
    //console.log("window height: "+document.body.clientHeight);
    //console.log("window width: "+document.body.clientWidth);
    //console.log("window scroll x: "+window.pageXOffset);
    //console.log("window scroll y: "+window.pageYOffset);

    b.style.display = 'block';
    var duration = 2000;
    var endOpacity = 0;
    if (c == MESSAGE_CLASS_ERROR) {
        b.className = "notifierError";
        b.id = 'errorMessage';
        var pos = notifycount * 40;
        b.style.top = (document.body.clientHeight / 2 + window.pageYOffset - bh / 2) - (400 - pos);
        duration = 4000;
        if (DEBUGNEWCODE) duration = 8000;
        endOpacity = 50;
    }
    notifycount++;
    // fadeout block if supported
    setFading(b, 100, endOpacity, duration, function() {
        document.body.removeChild(b);
    });
}

// apply a fading effect to an object
// by applying changes to its style
// @o = object style
// @b = begin opacity
// @e = end opacity
// @d = duration (millisec)
// @f = function (optional)
function setFading(o, b, e, d, f) {
    var t = setInterval(
        function() {
            b = stepFX(b, e, 2);
            setOpacity(o, b / 100);
            if (b == e) {
                if (t) {
                    clearInterval(t);
                    t = null;
                }
                if (typeof f == 'function') {
                    f();
                }
            }
        }, d / 20
    );
}

// set opacity for element
// @e element
// @o opacity
function setOpacity(e, o) {
    // for IE
    e.style.filter = 'alpha(opacity=' + o * 100 + ')';
    // for others
    e.style.opacity = o;
}

// increment/decrement value in steps
// checking for begin and end limits
//@b begin
//@e end
//@s step
function stepFX(b, e, s) {
    return b > e ? b - s > e ? b - s : e : b < e ? b + s < e ? b + s : e : b;
}

function getTableWidth() {
    var tables = document.evaluate(
        "//table[@class='top']",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //console.log('Found '+ tables.snapshotLength + ' tables.');
    if (tables.snapshotLength == 0) return 900;
    var topTable = tables.snapshotItem(0);
    return topTable.getAttribute("width");
}

function insertNotification(message) {
    if (message != null) {
        var notification = document.createElement("div");
        notification.setAttribute('id', 'gm_update_alert');
        var close = document.createElement("div");
        close.setAttribute('id', 'gm_update_alert_button_close');
        close.innerHTML = "Click to hide";
        close.addEventListener('click', function(event) {
            document.body.removeChild($('gm_update_alert'));
            document.body.removeChild($('gm_update_alert_button_close'));
        }, true);
        notification.innerHTML = '' +
            '  <div id="gm_update_title">AE Bits Notification</div>' +
            '  <hr class="cphr" /><p>' + message +
            '</p>';
        notification.appendChild(close);
        document.body.insertBefore(notification, document.body.firstChild);
    }
}

function getElementPosition(a) {
    var x = 0;
    var y = 0;
    while (1) {
        x += a.offsetLeft;
        y += a.offsetTop;
        if (!a.offsetParent) break;
        a = a.offsetParent;
    }
    return [x, y];
}

//==========================================
//---------Fleet Screen Utilities-----------
//==========================================
//Sums values and modifies fleet table
//------------------------------------------
function sumShips(rows) {
    try {
        rows = document.evaluate(
            "//table[@class='layout listing1 tbllisting1 sorttable']/tbody/tr",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        var header = document.evaluate(
            "//table[@class='layout listing1 tbllisting1 sorttable']/thead/tr",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        if (rows.snapshotLength == 1)
            return;

        var sums = new Array(20);
        var totalMobileSums = new Array(20);
        //var galaxyFleets = new Array();

        for (var i = 0; i < 20; i++) {
            sums[i] = 0;
            totalMobileSums[i] = 0;
        }
        if (getSetting(SHOW_ATTACK_SIZE_KEY, true))
            header.snapshotItem(0).lastChild.innerHTML = "<a href='empire.aspx?view=fleets&order=size'>Attack Size / Size</a>";
        var cells;
        var mobileFleetCount = 0,
            currentFleetTotal, overallFleetTotal = 0,
            overallFightingFleetTotal = 0,
            overallMobileFleetTotal = 0,
            overallMobileFightingFleetTotal = 0;
        var fleetUrl;
        for (i = 0; i < rows.snapshotLength; i++) {
            var row = rows.snapshotItem(i);
            currentFleetTotal = parseNum(rows.snapshotItem(i).lastChild.textContent);
            overallFleetTotal += currentFleetTotal;
            //console.log('Summing fleet '+i);
            cells = document.evaluate(
                ".//td[@style]",
                row,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null);
            //console.log('Found '+cells.snapshotLength+' cells');
            var shiplocation = row.childNodes[1].textContent;
            var galaxy = row.childNodes[1].firstChild.firstChild.href.split("=")[1].match(/([A-Z])(\d\d)/)[2];
            //console.log(galaxy);
            var galaxyInfoArray = getGalaxyInfoArray(galaxy);
            //console.log('FT: '+cells.snapshotItem(FT_INDEX).textContent);
            var currentFightingFleetTotal = 0,
                shipTotal;

            //Iterate over all ship amounts in this row and add value to all sums that apply (total,fighting,galaxymobile,mobile)
            for (var j = 0; j < cells.snapshotLength; j++) {
                //console.log(cells.snapshotItem(j).textContent);
                if (cells.snapshotItem(j).textContent.length > 0) {
                    //console.log(sums[j]+' + '+parseNum(cells.snapshotItem(j).textContent));
                    shipTotal = parseNum(cells.snapshotItem(j).textContent);
                    sums[j] = sums[j] + shipTotal;
                    if (isFightingShip(j))
                        currentFightingFleetTotal += shipValues[j] * shipTotal;
                    if (!isBase(shiplocation)) {
                        //increment galaxy info numbers
                        galaxyInfoArray[2][j] = galaxyInfoArray[2][j] + shipTotal;

                        //increment total mobile numbers
                        totalMobileSums[j] = totalMobileSums[j] + shipTotal;
                    }
                }
            }

            //Add total row fleet size to overall total count
            overallFightingFleetTotal += currentFightingFleetTotal;

            //if fleet is mobile add total row fleet size to overall total mobile count
            if (!isBase(shiplocation)) {
                //increment galaxy info numbers
                galaxyInfoArray[4] += currentFleetTotal;
                galaxyInfoArray[3] += currentFightingFleetTotal;
                galaxyInfoArray[1] += 1;
                //console.log(location + ": "+isBase(location));
                overallMobileFleetTotal += currentFleetTotal;
                overallMobileFightingFleetTotal += currentFightingFleetTotal;
                mobileFleetCount += 1;
            }
            //console.log(rows.snapshotItem(i).lastChild.textContent);
            if (getSetting(SHOW_ATTACK_SIZE_KEY, true))
                rows.snapshotItem(i).lastChild.textContent = commaFormat(currentFightingFleetTotal) + " / " + commaFormat(rows.snapshotItem(i).lastChild.textContent);
            fleetUrl = rows.snapshotItem(i).firstChild.firstChild.firstChild.href;
            //console.log("fleeturl "+fleetUrl);
            if (getSetting(ADD_FLEET_MOVE_LINK_KEY, true)) {
                if (rows.snapshotItem(i).firstChild.nextSibling.firstChild.textContent.indexOf('*') == -1) {
                    var cell = document.createElement("td");
                    var content = document.createElement("small");
                    content.setAttribute("style", "white-space:nowrap;");
                    var moveLink = document.createElement("a");
                    moveLink.setAttribute("href", fleetUrl + "&view=move");
                    moveLink.textContent = "Move";
                    content.appendChild(moveLink);
                    var seperator = document.createTextNode(" / ");
                    content.appendChild(seperator);
                    var atkLink = document.createElement("a");
                    atkLink.setAttribute("href", fleetUrl + "&view=attack");
                    atkLink.textContent = "Attack";
                    content.appendChild(atkLink);
                    cell.appendChild(content);
                    cell.setAttribute("align", "center");
                    //                cell.setAttribute("width","75px");
                    row.insertBefore(cell, row.firstChild.nextSibling);
                } else {
                    cell = rows.snapshotItem(i).insertCell(1);
                    content = document.createElement("small");
                    content.textContent = "In transit";
                    cell.appendChild(content);
                    rows.snapshotItem(i).setAttribute("style", "background:#664444;");
                }
            }
        }
        if (getSetting(ADD_FLEET_MOVE_LINK_KEY, true)) {
            header.snapshotItem(0).firstChild.setAttribute("colspan", "2");
        }
        //console.log('Ship Sums: '+sums);
        //console.log('Mobile ship Sums: '+mobileSums);
        //console.log("Mobile fleet "+overallMobileFleetTotal);
        //console.log("Mobile attack fleet "+overallMobileFightingFleetTotal);
        if (getSetting(SHOW_TOTAL_FLEET_ROW_KEY, true)) {
            insertTotalsRow(rows.snapshotItem(0).parentNode, sums, totalMobileSums, rows.snapshotLength - 1,
                mobileFleetCount, overallFleetTotal, overallFightingFleetTotal, overallMobileFleetTotal, overallMobileFightingFleetTotal);
        }
        //console.log(prepareTotalsRow(sums));
    } catch (e) {
        console.log("Line Number: " + e.lineNumber + "\n sumships error: " + e);
    }
}

var galaxyInfoArrays = new Array();

function getGalaxyInfoArray(galaxy) {
    if (galaxyInfoArrays[galaxy] == undefined) {
        var newArray = new Array(20);
        for (var i = 0; i < 20; i++) {
            newArray[i] = 0;
        }
        galaxyInfoArrays[galaxy] = new Array(galaxy, 0, newArray, 0, 0); //[galaxy number],[mobile fleet count],[mobilefleetarray],[total fighting fleet],[total fleet],
    }
    return galaxyInfoArrays[galaxy];
}

//==========================================
//Determines if supplied ship type is a fighting ship
//==========================================

function isFightingShip(shipIndex) {
    return fightingShips.charAt(shipIndex) == "1";
}

//==========================================
//Inserts totals row in fleet table
//==========================================

function insertTotalsRow(nodeloc, sums, mobileSums, fleetCount, mobileFleetCount, overallFleetTotal, overallFightingFleetTotal, overallMobileFleetTotal, overallMobileFightingFleetTotal) {

    //GALAXY ROWS
    for (var i = 0; i < galaxyInfoArrays.length; i++) {
        var galaxyInfoArray = galaxyInfoArrays[i];
        if (galaxyInfoArray == undefined || galaxyInfoArray[1] == 0)
            continue;
        var sumRow = document.createElement("tr");
        sumRow.setAttribute('align', 'center');
        var element = sumRow.insertCell(0);
        if (getSetting(ADD_FLEET_MOVE_LINK_KEY, true)) element.setAttribute("colspan", "2");
        element.textContent = "Mobile Fleets (" + getGalaxy() + i + ")";
        element = sumRow.insertCell(1);
        element.textContent = galaxyInfoArray[1];
        var galaxyFleetSums = galaxyInfoArray[2];
        for (var k = 0; k < 20; k++) {
            //console.log(sums[k]);
            var cell = document.createElement("td");
            cell.setAttribute("style", "border: #000066 solid 1px; border-width: 0 1 1 1;");
            if (galaxyFleetSums[k] > 0)
                cell.innerHTML = "<small>" + galaxyFleetSums[k] + "</small>";
            //console.log(element);
            sumRow.insertBefore(cell, null);
        }
        //Add totals cell
        cell = document.createElement("td");
        //cell.setAttribute("style","border: #000066 solid 1px; border-width: 0 1 1 1;");
        cell.innerHTML = commaFormat(galaxyInfoArray[3]) + " / " + commaFormat(galaxyInfoArray[4]);
        //console.log(element);
        sumRow.insertBefore(cell, null);
        nodeloc.insertBefore(sumRow, null);
    }
    //MOBILE ROW
    sumRow = document.createElement("tr");
    sumRow.setAttribute('align', 'center');
    element = sumRow.insertCell(0);
    if (getSetting(ADD_FLEET_MOVE_LINK_KEY, true)) element.setAttribute("colspan", "2");
    element.textContent = "Total Mobile Fleets";
    element = sumRow.insertCell(1);
    element.textContent = mobileFleetCount;
    for (k = 0; k < 20; k++) {
        //console.log(sums[k]);
        cell = document.createElement("td");
        cell.setAttribute("style", "border: #000066 solid 1px; border-width: 0 1 1 1;");
        if (mobileSums[k] > 0)
            cell.innerHTML = "<small>" + mobileSums[k] + "</small>";
        //console.log(element);
        sumRow.insertBefore(cell, null);
    }
    //Add totals cell
    cell = document.createElement("td");
    //cell.setAttribute("style","border: #000066 solid 1px; border-width: 0 1 1 1;");
    cell.innerHTML = commaFormat(overallMobileFightingFleetTotal) + " / " + commaFormat(overallMobileFleetTotal);
    //console.log(element);
    sumRow.insertBefore(cell, null);
    nodeloc.insertBefore(sumRow, null);
    //TOTAL ROW
    sumRow = document.createElement("tr");
    sumRow.setAttribute('align', 'center');
    element = sumRow.insertCell(0);
    if (getSetting(ADD_FLEET_MOVE_LINK_KEY, true)) element.setAttribute("colspan", "2");
    element.textContent = "Total Fleets";
    element = sumRow.insertCell(1);
    element.textContent = fleetCount;
    for (k = 0; k < 20; k++) {
        //console.log(sums[k]);
        cell = document.createElement("td");
        cell.setAttribute("style", "border: #000066 solid 1px; border-width: 0 1 1 1;");
        if (sums[k] > 0)
            cell.innerHTML = "<small>" + sums[k] + "</small>";
        //console.log(element);
        sumRow.insertBefore(cell, null);
    }
    //Add totals cell
    cell = document.createElement("td");
    //cell.setAttribute("style","border: #000066 solid 1px; border-width: 0 1 1 1;");
    cell.innerHTML = commaFormat(overallFightingFleetTotal) + " / " + commaFormat(overallFleetTotal);
    //console.log(element);
    if (getSetting(ADD_FLEET_MOVE_LINK_KEY, true)) cell.setAttribute("colspan", "2");
    sumRow.insertBefore(cell, null);
    nodeloc.insertBefore(sumRow, null);
}
//==========================================
//---------Trade Utilities-----------
//==========================================
//This function finds all nodes for the supplied player name and
//highlights it and appends '(Duplicate)' to the name
//------------------------------------------
var tradeNames = new Array(); //string names of all trade partners
var tradeNodes = new Array(); //element object of all trade partners
function highlightTrade(nameToFind) {
    var item;
    //console.log('Searching ' + tradeNodes.length + ' routes');
    for (var i = 0; i < tradeNodes.length; i++) {
        item = tradeNodes[i];
        //console.log(item.innerHTML + " " + nameToFind);
        if (item.innerHTML == nameToFind) {
            //console.log('Found node: ' + item.innerHTML);
            item.style.color = 'red';
            item.innerHTML = item.innerHTML + ' (Duplicate)';
        }
    }
}
//==========================================
//Finds all 'small' elements with 'gray' style and determines if
//there are any duplicates. If any are found they are highlighted.
//Two arrays are used. One to hold string names of trade partners in order
//to be sortable. The second holds the actual element objects.
//==========================================
function checkTradePage() {
    //console.log('Checking trade page');
    var allNames, thisName, lastName;
    //Find all trade name elements
    allNames = document.evaluate(
        "//small[@class='gray']",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //Iterate through all and add only odd ones to name and node arrays.
    //console.log ("Allnames: "+allNames);
    if (!tradeNames) var tradeNames = new Array();
    for (var i = 0; i < allNames.snapshotLength; i++) {
        thisName = allNames.snapshotItem(i);
        tradeNames.push(thisName.innerHTML);
        tradeNodes.push(thisName);
        //console.log("Individual name: "+thisName.innerHTML);
    }
    //console.log("tn length: "+tradeNames.length);
    tradeNames.sort();
    saveTradePartners(tradeNodes, tradeNames);
    //console.log('Found ' + tradeNodes.length + ' trades.');
    //Iterate through sorted names and compare each to the one before it.
    //If a duplicate is found pass the name to the highlight method to find
    // all element objects and apply highlight.
    for (i = 1; i < tradeNames.length; i++) {
        thisName = tradeNames[i];
        lastName = tradeNames[i - 1];
        //console.log(thisName + " " + lastName);
        if (thisName == lastName) {
            //console.log('Found duplicate: ' + thisName + " == " + lastName);
            highlightTrade(thisName);
        }
    }
}
//==========================================
//Persist Trade Partners
//==========================================
function saveTradePartners(tradeNodes, tradeNames) {
    var saveData = tradeNames[0];
    for (var i = 1; i < tradeNames.length; i++) {
        saveData += ";" + tradeNames[i];
    }
    if (saveData == null) saveData = "cpnotrades";
    setSetting('tradePartners', escape(saveData));
    //console.log("Saved Data: "+escape(saveData));
    //console.log("Check saved Data: "+unescape(getSetting('tradePartners')));
    var d = new Date();
    var currentTime = Math.round(d.getTime() / 1000); // Unix time in seconds
    setSetting('lastTradeCheck', currentTime);
    //console.log ('lastTradeCheck: '+currentTime)
}
//==========================================
//Load Trade Partners
//==========================================
function getTradePartners() {
    var saveData = getSetting('tradePartners');
    if (saveData == "cpnotrades") return null;
    var tradePartners = null;
    if (saveData != null) {
        saveData = unescape(saveData);
        //console.log("Check saved Data: "+saveData);
        tradePartners = saveData.split(";");
    }
    //  console.log('Loaded ' + tradePartners.length + ' trade partners');
    tradeNames = tradePartners;
    return tradePartners;
}
//==========================================
//Check Trade Partners Data Age
//==========================================
function checkTradeDataAge() {
    if (getSetting('tradePartners') == null) {
        insertNotification('Trade partner data has not been set for highlighting.<br />' +
            '   Visit the <a href="empire.aspx?view=trade">trade page</a> to set the information.');
        return;
    }
    //console.log('Trade data check.');
    var lastTradeCheck = parseNum(getSetting('lastTradeCheck', 0));
    var d = new Date();
    var currentTime = Math.round(d.getTime() / 1000); // Unix time in seconds
    //console.log('lastTradeCheck: '+lastTradeCheck);
    //console.log('currentTime: '+currentTime);
    //console.log('Need fresh trade data: ' + (currentTime > (lastTradeCheck + (86400*3))));
    //console.log('Next Check (minutes): '+ ( (lastTradeCheck + (86400*3)) - currentTime)/60 );
    if (currentTime > (lastTradeCheck + (86400 * 3))) {
        insertNotification('Trade partner data has not been updated in over three days.<br />' +
            '   Visit the <a href="empire.aspx?view=trade">trade page</a> to refresh the information.');
    }
}

//==========================================
//Check Tech Data Age
//==========================================
function checkTechDataAge() {
    //console.log("Checking tech data age.");
    if (getSetting('techData') == null) {
        insertNotification('Technology data has not been set.<br />' +
            '   Visit the <a href="empire.aspx?view=technologies">technologies page</a> to set the information.');
        return;
    }
    //console.log('Trade data check.');
    var lastTechCheck = parseNum(getSetting('lastTechCheck', 0));
    var d = new Date();
    var currentTime = Math.round(d.getTime() / 1000); // Unix time in seconds
    //console.log('lastTechCheck: '+lastTechCheck);
    //console.log('currentTime: '+currentTime);
    //console.log('Need fresh tech data: ' + (currentTime > (lastTechCheck + (86400*3))));
    //console.log('Next Check (minutes): '+ ( (lastTradeCheck + (86400*3)) - currentTime)/60 );
    if (currentTime > (lastTechCheck + (86400 * 3))) {
        insertNotification('Technology data has not been updated in over three days.<br />' +
            '   Visit the <a href="empire.aspx?view=technologies">technologies page</a> to refresh the information.');
    }
}
var myGuildColor;
var myGuild;
var guild_color_cache = {};

function getHighlightColorForGuild(guild) {
    if (!myGuildColor) myGuildColor = unescape(getSetting(MY_GUILD_COLOUR_KEY, null));
    if (!myGuild) myGuild = unescape(getSetting(MY_GUILD_KEY, null));
    //    if(myGuild != null && myGuildColor != null) {
    //        myGuild = unescape(myGuild);
    //        myGuildColor = unescape(myGuildColor);
    //    }
    //    debug("myguild: "+myGuild+" colour:"+ myGuildColor);
    if (myGuild != null && myGuildColor != null) {
        if (myGuild == guild)
            return myGuildColor;
    }
    if (!guild_color_cache.guilds) guild_color_cache.guilds = unescape(getSetting(ALLIED_GUILDS_KEY, null));
    if (!guild_color_cache.guildColor) guild_color_cache.guildColor = unescape(getSetting(ALLIED_GUILDS_COLOUR_KEY, null));

    var guilds = guild_color_cache.guilds;
    var guildColor = guild_color_cache.guildColor;
    if (guilds != null && guildColor != null) {
        //        guilds = unescape(guilds);
        //        guildColor = unescape(guildColor);
        //        debug("guilds: "+guilds);
        var guildArray = guilds.split(",");
        //        debug("guildArray: "+guildArray);
        for (var i = 0; i < guildArray.length; i++) {
            //debug(guildArray[i].split("=")[0] +" = "+ guild);
            if (guildArray[i].split("=")[0] == guild) return guildColor; // FIXME
        }
    }
    if (!guild_color_cache.nap_guilds) guild_color_cache.nap_guilds = unescape(getSetting(NAPPED_GUILDS_KEY, null));
    if (!guild_color_cache.map_guilds_color) guild_color_cache.map_guilds_color = unescape(getSetting(NAPPED_GUILDS_COLOUR_KEY, null));

    guilds = guild_color_cache.nap_guilds;
    guildColor = guild_color_cache.map_guilds_color;
    if (guilds != null && guildColor != null) {
        //console.log("guilds: "+guilds);
        guildArray = guilds.split(",");
        //console.log("guildArray: "+guildArray);
        for (i = 0; i < guildArray.length; i++) {
            //console.log(guildArray[i].split("=")[0] +" = "+ guild);
            if (guildArray[i].split("=")[0] == guild)
                return guildColor;
        }
    }
    guilds = getSetting(ENEMY_GUILDS_KEY, null);
    guildColor = getSetting(ENEMY_GUILDS_COLOUR_KEY, null);
    if (guilds != null && guildColor != null) {
        guilds = unescape(guilds);
        guildColor = unescape(guildColor);
        //console.log("guilds: "+guilds);
        guildArray = guilds.split(",");
        //console.log("guildArray: "+guildArray);
        for (i = 0; i < guildArray.length; i++) {
            //console.log(guildArray[i].split("=")[0] +" = "+ guild);
            if (guildArray[i].split("=")[0] == guild)
                return guildColor;
        }
    }
    return null;
}

//Input is player name without guild name
function getHighlightColorForPlayer(player) {
    var playerColors = getSetting(PLAYER_COLORS_KEY, null);
    if (playerColors == null) return;
    playerColors = unescape(playerColors);
    //console.log("colors: "+playerColors);
    var playerArray = playerColors.split(",");
    //console.log("playerArray: "+playerArray);
    for (var i = 0; i < playerArray.length; i++) {
        //console.log(playerArray[i].split("=")[0] +" = "+ player);
        if (playerArray[i].split("=")[0] == player) {
            //console.log(playerArray[i].split("=")[0] +" = "+ player);
            return playerArray[i].split("=")[1];
        }
    }
    return null;
}
//==========================================
//Checks if supplied name is a trade partner
//==========================================
function isTradePartner(name) {
    return false;
}

//==========================================
// Check if guild is not set, give option to hide if unguilded.
//==========================================
function checkGuildDataAge() {
    if (getSetting(AUTOSET_GUILD_KEY, true) != true) return;
    if (getSetting(AUTOSET_GUILD_NOTIFY_KEY, true) != true) return;
    if (location.indexOf("profile.aspx") != -1) return;
    var lastGuildCheck = parseNum(getSetting('lastGuildCheck', "0"));
    var d = new Date();
    var currentTime = Math.round(d.getTime() / 1000);
    if (lastGuildCheck == 0) {
        insertNotification('Your guild has not been set for highlighting.<br />' +
            '   Visit the <a href="profile.aspx">profile page</a> to set the information.' +
            '  <div class="gm_update_alert_buttons">' +
            '      <span id="gm_update_alert_button_unguilded"><a href="#">Don&#39;t remind me again</a>' +
            '  </span><span id="gm_update_alert_button_disable"><a href="#">Disable autoset</a>' +
            '  </span> </div>' +
            '</div>');
        $('gm_update_alert_button_disable').addEventListener('click', function(event) {
            setSetting(AUTOSET_GUILD_KEY, false);
            alert("You will not be reminded again. You can re-enable autoset guild in options.");
            document.body.removeChild($('gm_update_alert'));
        }, true);
        $('gm_update_alert_button_unguilded').addEventListener('click', function(event) {
            setSetting(AUTOSET_GUILD_NOTIFY_KEY, false);
            alert("You will not be reminded again. You can re-enable autoset guild notify in options.");
            document.body.removeChild($('gm_update_alert'));
        }, true);
        return;
    }
    // Unix time in seconds
    //    console.log('lastTradeCheck: '+lastGuildCheck);
    //    console.log('currentTime: '+currentTime);
    //console.log('Need fresh trade data: ' + (currentTime > (lastTradeCheck + (86400*3))));
    //console.log('Next Check (minutes): '+ ( (lastTradeCheck + (86400*3)) - currentTime)/60 );
    if (currentTime > (lastGuildCheck + (86400 * 3 * 7))) {
        insertNotification('Guild highlighting data has not been updated in over three weeks.<br />' +
            '   Visit the <a href="profile.aspx">profile page</a> to refresh the information.' +
            '  <div class="gm_update_alert_buttons">' +
            '      <span id="gm_update_alert_button_unguilded"><a href="#">Don&#39;t remind me again' +
            '  / I am not guilded</a></span> </div>' +
            '</div>');
        $('gm_update_alert_button_unguilded').addEventListener('click', function(event) {
            setSetting(AUTOSET_GUILD_KEY, false);
            alert("You will not be reminded again. You can re-enable autoset guild in options.");
            document.body.removeChild($('gm_update_alert'));
        }, true);
        return;
    }
}
//==========================================
// Get players guild
//==========================================
function setGuildHighlight() {
    var guild;
    if (_page == 'profile') {
        // Get cell from table
        var c = document.evaluate(
            "//table[contains(@id,'profile')]",
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (isNewStyle())
            c = c.firstChild.firstChild.textContent;
        else
            c = c.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.textContent;
        //console.log(c);
        var d = c.indexOf(' ', 0); // check for space to show guild tag split
        if (d == -1) guild = '';
        else guild = trim(c.substring(0, d));
        var name = c.substring(d + 1, c.length); // split string into guild/tag
        notify("Setting players guild: " + guild);
        setSetting(MY_GUILD_KEY, escape(guild)); // set tag
        setSetting(MY_NAME_KEY, escape(name));
        d = new Date();
        var currentTime = Math.round(d.getTime() / 1000); // set date for notifications
        setSetting('lastGuildCheck', currentTime);
        //console.log (getSetting('lastGuildCheck'));
        var acc = document.evaluate(
            "//b[text() = 'Account:']",
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode;
        acc = acc.innerHTML.substr(acc.innerHTML.indexOf('Account:'));
        acc = acc.substring(acc.indexOf('</b>') + 5, acc.indexOf('<br'));
        if (acc.indexOf("Upgraded") != -1) {
            setSetting('upgradedAccount', true);
        } else {
            setSetting('upgradedAccount', false);
        }
        //console.log (getSetting('upgradedAccount'));
    }
}
//==========================================
//Inserts Empire sub menu on all pages
//==========================================
function cleanEmpireMenus() {
    //Clear out additional menus cause i'm tired of having multiple ones loading if you run seperate scripts
    var cleanmenus = document.evaluate("//table[@class='header']",
        document, null, XPathResult.UNORDERED_NODE_TYPE, null);
    if (cleanmenus.snapshotLength > 1) {
        for (var i = 0; i < cleanmenus.snapshotLength; i++) {
            cleanmenus.parentNode.removeChild(cleanmenus.previousSibling);
        }
    }
}

function insertEmpireMenu() {
    var html = '<tbody><tr>' +
        '<th width="10%" id="bases_events"><a href="empire.aspx?view=bases_events">Events</a></th>' +
        '<th width="10%" id="bases_production"><a href="empire.aspx?view=bases_production">Production</a></th>' +
        '<th width="10%" id="economy"><a href="empire.aspx?view=economy">Economy</a></th>' +
        '<th width="10%" id="trade"><a href="empire.aspx?view=trade">Trade</a></th>' +
        '<th width="10%" id="report"><a href="empire.aspx?ch=1&view=report">Reports</a></th>' +
        '</tr><tr>' +
        '<th width="10%" id="bases_capacities"><a href="empire.aspx?view=bases_capacities">Capacities</a></th>' +
        '<th width="10%" id="structures"><a href="empire.aspx?view=structures">Structures</a></th>' +
        '<th width="10%" id="fleets"><a href="empire.aspx?view=fleets">Fleets</a></th>' +
        '<th width="10%" id="unitsmenu"><a href="empire.aspx?view=units">Units</a></th>' +
        '<th width="*" id="technologies"><a href="empire.aspx?view=technologies">Technologies</a></th>' +
        '</tr></tbody>';
    var empireMenu = document.createElement('table');
    empireMenu.setAttribute('align', 'center');
    empireMenu.setAttribute('class', 'header');
    var sString = "@class='top'";
    //Custom Fracking Epire Menus for the styles.
    if (isNewStyle()) {
        sString = "@id='main-header'";

        if (!document.getElementById('background-container')) {
            empireMenu.setAttribute('class', 'box box-full default');
            html = "<tr><td class='box_content default_content'>" +
                "<table id='empire_menu' class='menu'>" +
                "<tr class='row1'>" +
                "<td><div id='bases_events' class='button button-normal'><a href='empire.aspx?view=bases_events'>Events</a></div></td>" +
                "<td><div id='bases_production' class='button button-normal'><a href='empire.aspx?view=bases_production'>Production</a></div></td>" +
                "<td><div id='economy' class='button button-normal'><a href='empire.aspx?view=economy'>Economy</a></div></td>" +
                "<td><div id='trade' class='button button-normal'><a href='empire.aspx?view=trade'>Trade</a></div></td>" +
                "<td><div id='scanners' class='button button-normal'><a href='empire.aspx?view=scanners'>Scanners</a></div></td>" +
                "</tr><tr class='row1'>" +
                "<td><div id='bases_capacities' class='button button-normal'><a href='empire.aspx?view=bases_capacities'>Capacities</a></div></td>" +
                "<td><div id='structures' class='button button-normal'><a href='empire.aspx?view=structures'>Structures</a></div></td>" +
                "<td><div id='fleets' class='button button-normal'><a href='empire.aspx?view=fleets'>Fleets</a></div></td>" +
                "<td><div id='unitsmenu' class='button button-normal'><a href='empire.aspx?view=units'>Units</a></div></td>" +
                "<td><div id='technologies' class='button button-normal'><a href='empire.aspx?view=technologies'>Technologies</a></div></td>" +
                "</tr></table></td></tr>";
        } else {
            empireMenu.setAttribute('class', 'default_box-content box-content');
            html = "<tr><td class='default_box-content-center box-content-center'>" +
                "<div class='default_content'>" +
                "<table id='empire_menu' class='menu'>" +
                "<tr class='row1'>" +
                "<td class='menu-item'><table id='bases_events' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='empire.aspx?view=bases_events'>Events</a></td><td class='button-right'></td></tr></table>" +
                "<td class='menu-item'><table id='bases_production' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='empire.aspx?view=bases_production'>Production</a></td><td class='button-right'></td></tr></table>" +
                "<td class='menu-item'><table id='economy' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='empire.aspx?view=economy'>Economy</a></td><td class='button-right'></td></tr></table>" +
                "<td class='menu-item'><table id='trade' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='empire.aspx?view=trade'>Trade</a></td><td class='button-right'></td></tr></table>" +
                "<td class='menu-item'><table id='scanners' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='empire.aspx?view=scanners'>Scanners</a></td><td class='button-right'></td></tr></table>" +
                "</tr><tr class='row1'>" +
                "<td class='menu-item'><table id='bases_capacities' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='empire.aspx?view=bases_capacities'>Capacities</a></td><td class='button-right'></td></tr></table>" +
                "<td class='menu-item'><table id='structures' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='empire.aspx?view=structures'>Structures</a></td><td class='button-right'></td></tr></table>" +
                "<td class='menu-item'><table id='fleets' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='empire.aspx?view=fleets'>Fleets</a></td><td class='button-right'></td></tr></table>" +
                "<td class='menu-item'><table id='unitsmenu' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='empire.aspx?view=units'>Units</a></td><td class='button-right'></td></tr></table>" +
                "<td class='menu-item'><table id='technologies' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='empire.aspx?view=technologies'>Technologies</a></td><td class='button-right'></td></tr></table>" +
                "</tr></table></div></td></tr>";
        }
    }
    var tables = document.evaluate(
        "//table[" + sString + "]",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    //console.log('Found '+ tables.snapshotLength + ' tables.');
    if (tables.snapshotLength == 0) return;
    var topTable = tables.snapshotItem(0);
    empireMenu.setAttribute('width', topTable.getAttribute("width"));
    empireMenu.innerHTML = html;
    if (topTable) {
        topTable.parentNode.insertBefore(empireMenu, topTable.nextSibling);
        var lineBreak = document.createElement('br');
        topTable.parentNode.insertBefore(lineBreak, empireMenu);
    }
}

function moveEmpireMenu() {
    var empiremenu = document.evaluate(
        "//table[@class='header']",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var header = document.evaluate(
        "//table[@class='top']",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    empiremenu.parentNode.removeChild(empiremenu.previousSibling);
    header.parentNode.insertBefore(empiremenu, header.nextSibling);
    empiremenu.parentNode.insertBefore(document.createElement("br"), empiremenu);
}
//==========================================
//Highlight Poor Trade Values
//==========================================
var hideGoodTR = getSetting("HIDE_GOOD_TRS", false);

function findPoorTrades() {
    // Filter tr tags out
    var rows = document.evaluate(
        "//tr[@align='center']",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //console.log('Found '+ rows.snapshotLength + 'rows.');

    var upperThreshold = getSetting(POOR_TRADE_UPPER_THRESHOLD_KEY, 10);
    var lowerThreshold = getSetting(POOR_TRADE_LOWER_THRESHOLD_KEY, 10);
    for (var i = 0; i < rows.snapshotLength; i++) {
        var eco1Cell = document.evaluate(
            "td[3]",
            rows.snapshotItem(i),
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null).snapshotItem(0);
        var eco2Cell = document.evaluate(
            "td[4]",
            rows.snapshotItem(i),
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null).snapshotItem(0);
        if (eco1Cell) var eco1 = parseNum(eco1Cell.innerHTML);
        if (eco2Cell) var eco2 = parseNum(eco2Cell.innerHTML);
        //      console.log(eco1 + ' / ' + eco2);
        if (eco1Cell && eco2Cell && !isNaN(eco1) && !isNaN(eco2)) {
            if (eco2 - eco1 > upperThreshold) {
                eco2Cell.style.color = "orange";
                rows.snapshotItem(i).setAttribute("style", "background: #444400; opacity: 0.82;");
            } else if (eco2 - eco1 < -1 * lowerThreshold) {
                eco2Cell.style.color = "red";
                rows.snapshotItem(i).setAttribute("style", "background: #440000; opacity: 0.82;");
            } else {
                if (hideGoodTR)
                    rows.snapshotItem(i).setAttribute("style", "display:none");
                else
                    rows.snapshotItem(i).setAttribute("style", "");
            }
        }
    }
}

function insertCollapsTradeLink() {
    var tradeTable = document.evaluate(
        "//table[@id='empire_trade_trade-routes']",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //console.log(tradeTable);

    var center = document.createElement("center");
    if (hideGoodTR)
        center.innerHTML = "<a href='javascript:void(0)' id='hideShowGoodTR'>Show Good Trade Routes</a><br/><br/>";
    else
        center.innerHTML = "<a href='javascript:void(0)' id='hideShowGoodTR'>Hide Good Trade Routes</a><br/><br/>";

    tradeTable.parentNode.insertBefore(center, tradeTable);

    $('hideShowGoodTR').addEventListener("click", function() {
        hideGoodTRs();
    }, true);
}

function hideGoodTRs() {
    if ($('hideShowGoodTR').innerHTML == "Show Good Trade Routes") {
        $('hideShowGoodTR').innerHTML = "Hide Good Trade Routes";
        hideGoodTR = false;
    } else {
        $('hideShowGoodTR').innerHTML = "Show Good Trade Routes";
        hideGoodTR = true;
    }
    setSetting("HIDE_GOOD_TRS", hideGoodTR);
    findPoorTrades();
}

//==========================================
//Handle Trade Board Page
//==========================================

function highlightTradePartners(){
	var color_partners = getSetting(HIGHLIGHT_TRADE_PARTNERS_KEY,true);
    //console.log('Checking trade page');

    //if on the main empire page, only check links in the marquee
    //this saves time checking all the other links on the page that are useless
    var query = "//a[contains(@href,'profile.aspx') or contains(@href,'base.aspx') and not(contains(@class,'header'))]";
    if(location.indexOf("empire.aspx")!=-1 && (getView()=="" || getView()=="Structures"))
        query = "//marquee"+query;
    if(location.indexOf("bases_events")!= -1) query = "//marquee"+query;
    //console.log(query);

    var allLinks,item;
        allLinks = document.evaluate(
        query,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
	//Iterate through all and add only odd ones to name and node arrays.
	var highlightPlayers = (getSetting(PLAYER_COLORS_KEY,null) != null) && getSetting(HIGHLIGHT_PLAYERS_KEY,true);
	for (var i = 0; i < allLinks.snapshotLength; i++) {
		item = allLinks.snapshotItem(i);
		if (color_partners && isTradePartner(item.innerHTML)) {
			item.style.color = unescape(getSetting(HIGHLIGHT_TRADE_COLOUR_KEY));
		}
		if(highlightPlayers) {
			var guild = getGuild(item.innerHTML);
			//Highlight by guild
			var color = getHighlightColorForGuild(guild);
			if(color != null) {
				item.style.color = color;
			}
			//Apply overrides
			var color = getHighlightColorForPlayer(getPlayerName(item.innerHTML));
			if(color != null) {
				item.style.color = color;
			}
		}
	}
}
//profile_context.highlightTradePartners = highlightTradePartners;
//==========================================
//Insert Production Presets
//==========================================
function insertProductionPresetsButtons() {
    //profile_context.start('insertProductionPresetsButtons');
    var preset1Name = getSetting(PRESET_1_NAME_KEY, DEFAULT_PRESET_NAME_1);
    var preset2Name = getSetting(PRESET_2_NAME_KEY, DEFAULT_PRESET_NAME_2);
    var preset3Name = getSetting(PRESET_3_NAME_KEY, DEFAULT_PRESET_NAME_3);
    var preset4Name = getSetting(PRESET_4_NAME_KEY, DEFAULT_PRESET_NAME_4);
    //  Insert Preset Buttons
    var buttons = '<div class="gm_update_alert_buttons">' +
        '      <a href="javascript:void(0)" id="presetButton1">' + preset1Name + '</a></span> - ' +
        '      <a href="javascript:void(0)" id="presetButton2">' + preset2Name + '</a></span> - ' +
        '      <a href="javascript:void(0)" id="presetButton3">' + preset3Name + '</a></span> - ' +
        '      <a href="javascript:void(0)" id="presetButton4">' + preset4Name + '</a></span>' +
        '      <div><a href="javascript:void(0)" id="fillHangars">Fill hangar space</a></div>' +
        '</div>';

    var buttonElement = document.createElement("div");
    buttonElement.innerHTML = buttons;
    buttonElement.setAttribute("align", "center");
    //buttonElement.setAttribute("width",getTableWidth());

    var table = document.evaluate("//table[@id='base_production']/tbody/tr", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.firstChild;
    if (table.childNodes.length > 1)
        table = table.firstChild;
    table.appendChild(buttonElement, table);
    $('presetButton1').addEventListener('click', function(event) {
        applyProductionPreset(1);
    }, true);
    $('presetButton2').addEventListener('click', function(event) {
        applyProductionPreset(2);
    }, true);
    $('presetButton3').addEventListener('click', function(event) {
        applyProductionPreset(3);
    }, true);
    $('presetButton4').addEventListener('click', function(event) {
        applyProductionPreset(4);
    }, true);
    $('fillHangars').addEventListener('click', function(event) {
        queueFullHangarSpace();
    }, true);
    //Insert Set Preset Buttons
    buttons = ' <div class="gm_update_alert_buttons">' +
        '      <a href="javascript:void(0)" id="setButton1">Set Preset 1</a>&nbsp;&nbsp;' +
        '      <a href="javascript:void(0)" id="setButton2">Set Preset 2</a>&nbsp;&nbsp;' +
        '      <a href="javascript:void(0)" id="setButton3">Set Preset 3</a>&nbsp;&nbsp;' +
        '      <a href="javascript:void(0)" id="setButton4">Set Preset 4</a>&nbsp;&nbsp;' +
        '</div>';
    //console.log(table);
    buttonElement = document.createElement("div");
    buttonElement.innerHTML = buttons;
    buttonElement.setAttribute("align", "center");

    //table.parentNode.insertBefore(buttonElement,table);
    //console.log(submitButton.parentNode.parentNode.parentNode.parentNode);
    var Button = document.evaluate("//input[@type='reset']",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    Button.parentNode.insertBefore(buttonElement, Button);
    $('setButton1').addEventListener('click', function(event) {
        saveProductionPreset(1);
    }, true);
    $('setButton2').addEventListener('click', function(event) {
        saveProductionPreset(2);
    }, true);
    $('setButton3').addEventListener('click', function(event) {
        saveProductionPreset(3);
    }, true);
    $('setButton4').addEventListener('click', function(event) {
        saveProductionPreset(4);
    }, true);
    //profile_context.end('insertProductionPresetsButtons');
}
//==========================================
//Apply Production Presets
//==========================================
function applyProductionPreset(preset) {
    var presetArray;
    switch (preset) {
        case 1:
            {
                presetArray = getSetting(PRESET_1_VALUE_KEY, DEFAULT_PRESET_1).split(",");
                break;
            }
        case 2:
            {
                presetArray = getSetting(PRESET_2_VALUE_KEY, DEFAULT_PRESET_2).split(",");
                break;
            }
        case 3:
            {
                presetArray = getSetting(PRESET_3_VALUE_KEY, DEFAULT_PRESET_3).split(",");
                break;
            }
        case 4:
            {
                presetArray = getSetting(PRESET_4_VALUE_KEY, DEFAULT_PRESET_4).split(",");
                break;
            }
    }
    //console.log("Preset: "+presetArray);
    var countTextBox, timeTextBox;
    var shipName;
    var value, presetText, textBoxName;

    for (var i = 0; i < presetArray.length; i++) {
        var count = 0;
        var time = 0;
        shipName = PRESET_KEYS[i];
        presetText = presetArray[i];
        //console.log(presetArray[i]);

        if (presetText.charAt(0) == "t") {
            time = parseNum(presetText.substring(1));
            //console.log(parseNum(presetText.substring(1)));
        } else {
            count = parseNum(presetText);
        }

        countTextBox = document.evaluate(
            "//input[@name='" + shipName + "']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
        //console.log(textBox);

        timeTextBox = document.evaluate(
            "//input[@name='" + shipName + " - Time']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
        //console.log(textBox);

        if (timeTextBox != null) {
            if (time > 0)
                value = time;
            else
                value = null;
            timeTextBox.value = value;
        }
        if (countTextBox != null) {
            if (count > 0)
                value = count;
            else
                value = null;
            countTextBox.value = value;
        }
        //console.log("Preset Text: "+presetText+" Time: "+time+" Count: "+count+" Value: "+value);
        //console.log("Setting production count for "+shipName+" to "+value+".");
    }
    onProductionTextBoxKeyUp();
}
//==========================================
//Save Production Preset
//==========================================
function saveProductionPreset(preset) {
    try {
        //console.log("Saving preset " + preset);
        var shipName, textBox;
        var count;
        var presetArray = new Array();
        for (var i = 0; i < PRESET_KEYS.length; i++) {
            shipName = PRESET_KEYS[i];

            //Check time textbox
            textBox = document.evaluate(
                "//input[@name='" + shipName + " - Time']",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null).singleNodeValue;

            //If time is not set, check quantity
            if (textBox == null || textBox.value == "" || textBox.value == "0") {

                textBox = document.evaluate(
                    "//input[@name='" + shipName + "']",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null).singleNodeValue;

                if (textBox == null || textBox.value == "") {
                    //console.log("Failed to find textBox for "+shipName+".");
                    count = 0;
                } else {
                    //console.log(textBox.value);
                    //console.log(textBox.parentNode.previousSibling.previousSibling.previousSibling.innerHTML);
                    count = parseNum(textBox.value);
                }
                //console.log(count + " " + shipName);
                presetArray[i] = count;
            } else {
                //console.log(textBox.value);
                //console.log(textBox.parentNode.previousSibling.previousSibling.previousSibling.innerHTML);
                var time = parseNum(textBox.value);
                //console.log(time + " (time) " + shipName);
                presetArray[i] = "t" + time;
            }
        }
        var name = prompt("Enter preset name.");
        if (name == null) return;
        //console.log(name +": "+presetArray);
        switch (preset) {
            case 1:
                {
                    setSetting(PRESET_1_VALUE_KEY, presetArray.join());setSetting(PRESET_1_NAME_KEY, name);$('presetButton1').firstChild.innerHTML = name;
                    break;
                }
            case 2:
                {
                    setSetting(PRESET_2_VALUE_KEY, presetArray.join());setSetting(PRESET_2_NAME_KEY, name);$('presetButton2').firstChild.innerHTML = name;
                    break;
                }
            case 3:
                {
                    setSetting(PRESET_3_VALUE_KEY, presetArray.join());setSetting(PRESET_3_NAME_KEY, name);$('presetButton3').firstChild.innerHTML = name;
                    break;
                }
            case 4:
                {
                    setSetting(PRESET_4_VALUE_KEY, presetArray.join());setSetting(PRESET_4_NAME_KEY, name);$('presetButton4').firstChild.innerHTML = name;
                    break;
                }
        }

        notify("'" + name + "' preset saved.");
    } catch (e) {
        //debug(e,'error');
    }
}

//=========================================
//Queues fighters to fill queued ships hangar space
//==========================================
function queueFullHangarSpace() {
    var textBox;
    //shipHangarValues
    var totalHangarSpace = 0;
    for (var i = 0; i < PRESET_KEYS.length; i++) {
        var shipName = PRESET_KEYS[i];
        textBox = document.evaluate(
            "//input[@name='" + shipName + "']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
        //console.log(textBox);
        if (textBox != null && textBox.value != "") {
            //console.log(textBox.value);
            //console.log(textBox.parentNode.previousSibling.previousSibling.previousSibling.innerHTML);
            totalHangarSpace += parseNum(textBox.value) * shipHangarValues[i];
        }
    }
    //console.log("Total hangar space: "+totalHangarSpace);

    var textBox = document.evaluate(
        "//input[@name='" + PRESET_KEYS[FT_INDEX] + "']",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue;
    //console.log(textBox);
    if (textBox != null) {
        //console.log(textBox.value);
        //console.log(textBox.parentNode.previousSibling.previousSibling.previousSibling.innerHTML);
        textBox.value = totalHangarSpace;
    }
    onProductionTextBoxKeyUp();
}

//==========================================
//Calculates total cost of production and sets Submit button label with amount
//==========================================
function onProductionTextBoxKeyUp() {
    try {
        var shipName, textBox;
        var count = 0,
            cost = 0;
        var productionCost = 0;
        var totalTime = 0;
        for (var i = 0; i < PRESET_KEYS.length; i++) {
            shipName = PRESET_KEYS[i];
            textBox = document.evaluate(
                "//input[@name='" + shipName + "']",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null).singleNodeValue;
            //console.log(textBox);
            if (textBox == null) {
                //console.log("Failed to find textBox for "+shipName+".");
                continue;
            }

            if (textBox.value != "") {
                var row = textBox.parentNode.parentNode;
                var time = row.childNodes[4].textContent;
                //console.log(textBox.value);
                count = parseNum(textBox.value);
                cost = parseNum(textBox.parentNode.previousSibling.previousSibling.previousSibling.innerHTML);
                totalTime += getSeconds(time) * count;
                //console.log(count + " " + shipName + "s @ " + cost);
                productionCost += (cost * count);
                //textBox.parentNode.nextSibling.value = "";
            }
        }
        //console.log("total Time: "+getTimeDisplay(totalTime));
        var fastProduction = document.evaluate("//input[@type='checkbox']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.checked;
        //console.log(fastProduction);
        if (fastProduction) {
            productionCost *= 2;
            totalTime /= 2;
        }
        //console.log("Text changed. Total production cost: " +productionCost);
        var submitButton = document.evaluate(
            "//input[@type='submit']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
        if (productionCost > 0)
            submitButton.value = "Submit (" + productionCost + ") - " + getTimeDisplay(totalTime);
        else
            submitButton.value = "Submit";
        document.getElementById('total_cred').innerHTML = productionCost;
        document.getElementById('total_time').innerHTML = getTimeDisplay(totalTime);
    } catch (e) {
        //debug(e,'error');
    }
}

function registerTextBoxEventListeners() {
    var shipName, i, textBox;
    for (i = 0; i < PRESET_KEYS.length; i++) {
        shipName = PRESET_KEYS[i];
        textBox = document.evaluate(
            "//input[@name='" + shipName + "']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
        //console.log(textBox);
        if (textBox == null) {
            //console.log("Failed to find textBox for "+shipName+".");
            continue;
        }
        textBox.addEventListener('keyup', onProductionTextBoxKeyUp, false);
        //textBox.addEventListener('blur',onProductionTextBoxChanged,true);
    }
    var checkbox = document.evaluate("//input[@type='checkbox']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (checkbox) checkbox.addEventListener('change', onProductionTextBoxKeyUp, false);
    //document.evaluate("//input[@type='reset']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.addEventListener('click',onProductionTextBoxKeyUp,true);
    document.evaluate("//form[@method='post']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.addEventListener('reset', onProductionTextBoxKeyUp, false);
}
//==========================================
//Production Quantities by Time
//==========================================

function minimizeProductionPage() {
    //adjust colspan for all help rows
    var helpCells = document.evaluate(
        "//td[@class='help comment']",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //console.log(helpCells.snapshotLength);
    for (var i = 0; i < helpCells.snapshotLength; i++) {
        if (getSetting(HIDE_HELP_TEXT_KEY, true) == true)
            helpCells.snapshotItem(i).innerHTML = "<div id='itemDetails" + (i + 1) + "'></div>";
    }
}

function getSeconds(timeString) {
    var regex = /(\d*h)?\W?(\d*m)?\W?(\d*s)?/;
    var result = regex.exec(timeString);
    if (result) {
        //console.log(result);
        var h = 0;
        var m = 0;
        var s = 0;
        if (result[1] != null)
            h = result[1].substring(0, result[1].indexOf("h"));
        if (result[2] != null)
            m = result[2].substring(0, result[2].indexOf("m"));
        if (result[3] != null)
            s = result[3].substring(0, result[3].indexOf("s"));
        return h * 60 * 60 + m * 60 + s * 1;
    } else return -1;
}

function getTimeDisplay(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor((seconds % 3600) % 60);
    var string = s + "s";
    if (m > 0 || h > 0)
        string = m + "m " + string;
    if (h > 0)
        string = h + "h " + string;
    return string;
}

//==========================================
// Minor func for config page
//==========================================
function poorTradesChanged() {
    var isChecked = $('config_highlightPoorTrades').checked;
    //console.log("Poor trades changed." + isChecked);
    $('config_poorTradeUpperThreshold').disabled = !isChecked;
    $('config_poorTradeLowerThreshold').disabled = !isChecked;
}

//==========================================
//Shorten Page Titles
//Uses code from FlxGrey on AE Forums. Thanks!
//==========================================
function adjustTitles() {
    //console.log("Adjust titles");
    var view = getView();
    var server = getServer();

    if (view != "")
        document.title = server + " - " + getView();
    else
        document.title = document.title.replace("Astro Empires - ", server + " - ");
}

//==========================================
//Enhanced Queue Display
//==========================================
function fixQueues() {
    if (document.evaluate('//a[text()="remove"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength > getSetting(MAX_QUEUES_KEY, 5))
        return;
    var queueTitle = getView();
    console.log("Fixing queues :" +queueTitle);
    if (queueTitle == "Structures" || queueTitle == "Defenses" || queueTitle == "Research")
        queueTitle = "base-queue";
    if (queueTitle == "Production")
        queueTitle = "base_events-production";
    var queues = document.evaluate('//table[@id = "' + queueTitle + '"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (queues) {
        queues = queues.firstChild.firstChild.firstChild;
        queues.parentNode.parentNode.setAttribute("width", getTableWidth());
        queues = queues.parentNode.parentNode.parentNode;
        var fixedDiv = document.createElement("div");
        fixedDiv.setAttribute("id", "queueFooter");
        //console.log(queues);
        fixedDiv.appendChild(queues);
        document.body.appendChild(fixedDiv);
        var spacer = document.createElement('div');
        spacer.setAttribute("id", "spacer");
        spacer.style.position = "relative";
        spacer.innerHTML = "&nbsp;";
        spacer.style.height = queues.offsetHeight + "px";
        document.body.appendChild(spacer);
    }
}

function productionSubmit() {
    //  console.log("Click!");
    document.forms[1].submit();
}
//==========================================
// Insert Logo Section
//==========================================

function insertCpLogo() {
    try {
        //      Get Node
        var logoo = document.evaluate(
            "//table[@class='top']/tbody/tr[1]",
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        //if (!logoo) return;
        //      Insert new cell to stick it all in
        var cell = logoo.insertCell(1);
        cell.parentNode.firstChild.setAttribute("colspan", "4");
        //      Make new tag to hold
        var span = document.createElement("small");
        span.id = "cpmenu";
        span.textContent = "Extras RK Fixed Edition V" + scriptVersion;
        var br = document.createElement("br");
        span.appendChild(br);
        var configLink = document.createElement("a");
        configLink.setAttribute("href", "javascript:void(0)");
        configLink.innerHTML = "Extras Config";
        configLink.id = "CP_Settings_Link";
        configLink.addEventListener("click", function() {
            showConfig(null);
        }, true);
        span.appendChild(configLink, null);
        cell.appendChild(span);
        cell.id = "cpmenucell";
        cell.setAttribute("align", "center");
    } catch (e) {
        console.log("Line Number: " + e.lineNumber + "\n Config link insert error: " + e);
    }
}


//==========================================
//Inserts Battle Calculator Link
//==========================================
function insertBattleCalcLink() {
    console.log("inserting bcalc...");
    var bookmarkLink = $("bookmarks");
    if (!bookmarkLink) return;
    var th = document.createElement("th");
    th.setAttribute("width", "11%");
    th.setAttribute("id", "battlecalc");
    th.innerHTML = "<a href='" + calc_link + "' target='_new'>Battle Calc</a>";
    if (isNewStyle()) {
        if (!document.getElementById('background-container')) {
            th.innerHTML = "<td style='width: 11%;'><div id='battleCalc' class='button button-normal'><a href='" + calc_link + "' target='_new'>Battle Calc</a></div></td>";
        } else {
            th.innerHTML = "<td class='menu-item' style='width: 11%;'><table id='notes' class='button button-normal' onmouseout='buttonOut(this)' onmouseover='buttonOver(this, \"button button-normal-over\")'><tr><td class='button-left'></td><td class='button-center'><a href='" + calc_link + "' target='_new'>Battle Calc</a></td><td class='button-right'></td></tr></table></td>";
        }
        $("base").parentNode.setAttribute("style", "width: 11%;");
        $("map").parentNode.setAttribute("style", "width: 11%;");
        $("fleet").parentNode.setAttribute("style", "width: 11%;");
        $("empire").parentNode.setAttribute("style", "width: 11%;");
        $("commmander").parentNode.setAttribute("style", "width: 11%;");
        $("guild").parentNode.setAttribute("style", "width: 11%;");
        $("notes").parentNode.setAttribute("style", "width: 11%;");
        $("bookmarks").parentNode.setAttribute("style", "width: 11%;");
        bookmarkLink.parentNode.parentNode.insertBefore(th, bookmarkLink.parentNode);
    } else {
        $("base").setAttribute("width", "11%");
        $("map").setAttribute("width", "11%");
        $("fleet").setAttribute("width", "11%");
        $("empire").setAttribute("width", "11%");
        $("commander").setAttribute("width", "12%");
        $("guild").setAttribute("width", "11%");
        $("notes").setAttribute("width", "11%");
        $("bookmarks").setAttribute("width", "11%");
        bookmarkLink.parentNode.insertBefore(th, bookmarkLink);
    }

    //    var otherRows = document.evaluate("/html/body/table/tbody/tr/td",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
    //    otherRows.setAttribute("colspan",5);
}

function saveTechData() {
    //console.log("Saving tech data");
    var techData = new Array();
    var rows = document.evaluate(
        "//tr[@align='center']",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //console.log("Tech rows: "+ rows.snapshotLength);
    for (var i = 0; i < rows.snapshotLength; i++) {
        var techNameCell = document.evaluate(
            "th[1]",
            rows.snapshotItem(i),
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        var techValueCell = document.evaluate(
            "td[4]",
            rows.snapshotItem(i),
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        if (techNameCell.snapshotLength > 0) {
            var techValue = parseNum(techValueCell.snapshotItem(0).innerHTML);
            var techName = techNameCell.snapshotItem(0).innerHTML;
            //console.log(techName +": "+techValue);
            techData[i] = techValue;
        }
    }
    setSetting("techData", techData.join());

    var d = new Date();
    var currentTime = Math.round(d.getTime() / 1000); // Unix time in seconds
    setSetting('lastTechCheck', currentTime);
}

function getShipIndex(shipName) {
    switch (shipName) {
        case "Fighters":
            {
                return FT_INDEX;
            }
        case "Bombers":
            {
                return BO_INDEX;
            }
        case "Heavy Bombers":
            {
                return HB_INDEX;
            }
        case "Ion Bombers":
            {
                return IB_INDEX;
            }
        case "Corvette":
            {
                return CV_INDEX;
            }
        case "Recycler":
            {
                return RC_INDEX;
            }
        case "Destroyer":
            {
                return DE_INDEX;
            }
        case "Frigate":
            {
                return FR_INDEX;
            }
        case "Ion Frigate":
            {
                return IF_INDEX;
            }
        case "Scout Ship":
            {
                return SS_INDEX;
            }
        case "Outpost Ship":
            {
                return OS_INDEX;
            }
        case "Cruiser":
            {
                return CR_INDEX;
            }
        case "Carrier":
            {
                return CA_INDEX;
            }
        case "Heavy Cruiser":
            {
                return HC_INDEX;
            }
        case "Battleship":
            {
                return BC_INDEX;
            }
        case "Fleet Carrier":
            {
                return FC_INDEX;
            }
        case "Dreadnought":
            {
                return DN_INDEX;
            }
        case "Titan":
            {
                return TI_INDEX;
            }
        case "Leviathan":
            {
                return LE_INDEX;
            }
        case "Death Star":
            {
                return DS_INDEX;
            }
        case "Barracks":
            {
                return BARRACKS_INDEX;
            }
        case "Laser Turrets":
            {
                return LASER_TURRETS_INDEX;
            }
        case "Missle Turrets":
            {
                return MISSLE_TURRETS_INDEX;
            }
        case "Plasma Turrets":
            {
                return PLASMA_TURRENTS_INDEX;
            }
        case "Ion Turrets":
            {
                return ION_TURRETS_INDEX;
            }
        case "Photon Turrets":
            {
                return PHOTON_TURRETS_INDEX;
            }
        case "Disruptor Turrets":
            {
                return DISRUPTOR_TURRETS_INDEX;
            }
        case "Deflection Shields":
            {
                return DEFLECTION_SHIELDS_INDEX;
            }
        case "Planetary Shield":
            {
                return PLANETARY_SHIELD_INDEX;
            }
        case "Planetary Ring":
            {
                return PLANETARY_RING_INDEX;
            }
    }
}

//==========================================
//Highlight bases on scanner
//==========================================
function scannerFormat() {
    var i;
    try {
        var baseArray = document.getElementsByTagName("a");
        var bases = getSetting("baseCoords") + "";
        var custbases = unescape(getSetting(HIGHLIGHT_CUS_SCANNER_KEY)) + "";
        for (i = 0; i < baseArray.length; i++) {
            if (baseArray[i].innerHTML.match(/[A-Za-z][0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
                var basecoord = baseArray[i].innerHTML.match(/[A-Za-z][0-9]{2}:[0-9]{2}:[0-9]{2}/)
                if (bases.match(basecoord)) {
                    baseArray[i].setAttribute("style", "font-weight: bold;");
                    baseArray[i].style.color = getSetting(HIGHLIGHT_SYSTEM_COLOUR_KEY, 'orange');
                }
                if (custbases && custbases.match(basecoord)) {
                    baseArray[i].setAttribute("style", "font-weight: bold;");
                    baseArray[i].style.color = getSetting(HIGHLIGHT_CUSSYSTEM_COLOUR_KEY, 'blue');
                }
            }
            if (baseArray[i].innerHTML.match(/[A-Za-z][0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
                var basecoord = baseArray[i].innerHTML.match(/[A-Za-z][0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{2}/)
                if (bases.match(basecoord)) {
                    baseArray[i].setAttribute("style", "font-weight: bold;");
                    baseArray[i].style.color = getSetting(HIGHLIGHT_BASE_COLOUR_KEY, 'red');
                }
                if (custbases && custbases.match(basecoord)) {
                    baseArray[i].setAttribute("style", "font-weight: bold;");
                    baseArray[i].style.color = getSetting(HIGHLIGHT_CUSBASE_COLOUR_KEY, 'purple');
                }
            }
        }
    } catch (e) {
        console.log("Line Number: " + e.lineNumber + "\n scannerFormat() exception: " + e)
    }
}
//==========================================
//Sum Fleets
//==========================================

var fleetData = new Array(); //[guild],[incoming],[landed],[incoming today]
var guildSummed = false;

function sumFleets() {
    try{
        var my_nick = unescape(getSetting(MY_NAME_KEY,"Newb"));
        var sString = "//table[@id = 'map_fleets']";
        if(location.indexOf("base.aspx?base=")!=-1) {
            if(!getSetting(SUM_FLEETS_BASE,true)) throw "return";
            sString = "//table[@id = 'base_fleets']";
        }
        var rows = document.evaluate(sString,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
        if(!rows) throw "return";
        rows = rows.getElementsByClassName('layout listing sorttable')[0].childNodes[1].childNodes;
        var formatNumbers = getSetting(FORMAT_NUMBERS_KEY,true);
        var addFleets = getSetting(SUM_FLEETS_KEY,true);
        var now = new Date(), future = new Date();
        for(i=0;i<rows.length;i++) {
            //console.log(rows[i]);
            var row = rows[i];

            //while(row.childNodes[3].firstChild.textContent.indexOf"."
            //console.log(row.childNodes[3].firstChild.textContent);
            var size = parseNum(row.childNodes[3].firstChild.textContent);
            if(formatNumbers) row.childNodes[3].firstChild.textContent = commaFormat(size);
            if(addFleets) {
                var player = row.childNodes[1].firstChild.textContent;
                var arrivalTimeCell = row.childNodes[2];
                var guild = getGuild(player);
                var p = getPlayerName(player);
                var incoming = (arrivalTimeCell.childNodes.length > 0);
                var incomingToday = false;
                //console.log(arrivalTimeCell);
                //console.log(arrivalTimeCell.id.indexOf('time') +": "+ parseNum(arrivalTimeCell.title)+"-<"+((arrivalTimeCell.id.indexOf('time') != -1 || arrivalTimeCell.id.indexOf('checked') != -1) && (parseNum(arrivalTimeCell.title) <= 0)));
                if(my_nick == p) {
                    row.setAttribute("guild",p);
                } else {
                    row.setAttribute("guild",guild);
                }
                if((arrivalTimeCell.id.indexOf('time') != -1 || arrivalTimeCell.id.indexOf('checked') != -1) && (parseNum(arrivalTimeCell.title) >= 0) ) {
                    var time = arrivalTimeCell.title;
                    future.setTime(now.getTime() + (time * 1000));
                    incomingToday = (future.getDate() - now.getDate() == 0);
                    //console.log("date diff: "+ (future.getDate() - now.getDate()));
                    //if(incomingToday) console.log("Incoming today");
                }
                //console.log(player +": "+size);
                var incomingSize = incoming? size:0;
                var incomingTodaySize = incomingToday? size:0;
                addFleetSize(guild,size,incomingSize,incomingTodaySize);
                if(my_nick == p && guild != p) // FIXME, breaks when there is a space in the nick
                {
                    addFleetSize(p,size,incomingSize,incomingTodaySize);
                }
            }
        }
        if(addFleets) {
            if(guildSummed) insertFleetSummary();
        }
    } catch (e) {
        //if (e !== "return") console.log("sumfleets error: "+e);
    }
   // profile_context.end('sumFleets');
}
function addFleetSize(guild,size,incomingSize,incomingTodaySize)
{
    //console.log("adding fleet size " +guild +" size: "+size+" incomingSize: "+incomingSize+" incomingToday: "+incomingTodaySize);
     for(x=0;x<fleetData.length;x++)
    {
        //console.log("Searching... "+fleetData[i][0]);
         if(fleetData[x][0]==guild)
        {
            //console.log("Found "+fleetData[i][0]);
             if(incomingSize==0)
             fleetData[x][1] = (fleetData[x][1] + size);
             fleetData[x][2] = (fleetData[x][2] + incomingSize);
             fleetData[x][3] = (fleetData[x][3] + incomingTodaySize);
             guildSummed = true;
             return;
        }
    }
    //console.log("adding guild "+guild+" at index "+fleetData.length);
     if(incomingSize==0)
     fleetData[fleetData.length] = new Array(guild,size,0,0);
     else
     fleetData[fleetData.length] = new Array(guild,0,incomingSize,incomingTodaySize);
}
function insertFleetSummary()
{
    var html = "<tr><th>Fleet Summary</th></tr>"+
    "<tr align='center'><td>"+
        "<table class='box3_box-content box-content' width='600'>"+
            "<tr><td class='box3_box-content-left box-content-left'> </td>"+
            "<td class='box3_box-content-center box-content-center'>"+
                "<div class='box3_content'>"+
                    "<table class ='layout listing'>"+
                        "<tr class='listing-header'><th width='25%'>Guild</th><th width='25%'>Incoming (Today)</th>"+
                        "<th width='25%'>Landed</th><th width='25%'>Total Fleet Size</th><th/></tr>";
    var style="";
    var incoming,arrived,incomingToday,total;
    var formatNumbers = getSetting(FORMAT_NUMBERS_KEY,true);
    for(i=0;i<fleetData.length;i++)
    {
        incoming = fleetData[i][2];
        arrived = fleetData[i][1];
        total = fleetData[i][1] + fleetData[i][2];
        incomingToday = fleetData[i][3];
        //console.log(incoming);
        var color = getHighlightColorForPlayer(getPlayerName(fleetData[i][0]));
        if(color==null)
        color = getHighlightColorForGuild(fleetData[i][0]);
        if(getSetting(HIGHLIGHT_PLAYERS_KEY,true))
        style = "style='color:"+color+"'";
        if(formatNumbers)
        {
             incoming = commaFormat(incoming);
             arrived = commaFormat(arrived);
             incomingToday = commaFormat(incomingToday);
             total = commaFormat(total);
        }
        html = html+"<tr align='center' "+style+"><td>"+fleetData[i][0]+"</td><td>"+incoming+" ("+incomingToday+")</td><td>"+arrived+"</td><td>"+total+
        "</td><td><a id='showHide"+fleetData[i][0]+"' href='javascript: void(0)'>Hide</a></td></tr>";
        //href='#showHide"+fleetData[i][0]+"'
    }
    html += "</table></div></td><td class='box3_box-content-right box-content-right'> </td></tr></table></td></tr>";
     var newTable = document.createElement("table");
     newTable.setAttribute("align","center");
     newTable.setAttribute("class","box box-full box3");
     newTable.innerHTML = html;
     var sString = "//table[@id = 'map_fleets']";
     if(location.indexOf("base.aspx?base=")!=-1)
     {
        sString = "//table[@id = 'base_fleets']";
     }
     var table = document.evaluate(
            sString,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
    //console.log(table);
    //table.setAttribute("name","fleetTable");
     table.parentNode.insertBefore(newTable,table);
     var br = document.createElement("br");
     table.parentNode.insertBefore(br,table);
    //console.log("registering events");
     for(i=0;i<fleetData.length;i++)
    {
         var link = $("showHide"+fleetData[i][0]);
         link.addEventListener('click',getShowHideFleetClosure(fleetData[i][0]),true);
        //console.log(link);
        //console.log(getShowHideFleetClosure(fleetData[i][0]));
    }
}

function getShowHideFleetClosure(guild)
{
    function func(){
        toggleFleetVisibility(guild);
    };
    return func;
}
function toggleFleetVisibility(guild)
{
    //console.log("Toggle visibility for :" +guild);
     var guildRows = document.evaluate(
    "//tr[@guild='"+guild+"']",
     document,
     null,
     XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
     null);
    //console.log("Found " + guildRows.snapshotLength + " fleet(s)");
     for (i = 0; i < guildRows.snapshotLength; i++)
    {
         var row = guildRows.snapshotItem(i);
         row.style.display = (row.style.display=="none")? "":"none";
         row.style.visibility = (row.style.visibility=="hidden")? "":"hidden";
    }
     var link = $("showHide"+guild);
     link.textContent= (link.textContent=="Show")? "Hide":"Show";
    //document.body.scrollTop += 200;
}
//==========================================
//Map Enhancements
//==========================================
function moveGalaxyList() {
    var centerElement = document.evaluate(
        "//center",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < centerElement.snapshotLength; i++) {
        var cE = centerElement.snapshotItem(i);
        if (cE.firstChild.nodeName == "SMALL") {
            cE.parentNode.appendChild(cE);
            cE.parentNode.insertBefore(document.createElement("br"), cE);
            var linksElement = $("linksClones");
            if (linksElement) cE.setAttribute("style", "position: relative; bottom: " + linksElement.offsetHeight);
        }
    }
}

function copyBaseLinks() {
    var sString = "//div[@id='myCanvas']";
    if (isNewStyle()) {
        sString = "//div[@id='map-galaxy_canvas']";
    }
    var canvasElement = document.evaluate(
        sString,
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (!canvasElement) return;
    var baseLinks = document.evaluate(
        "//a[@onmouseout][contains(@href,'base')]",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //console.log("Found "+baseLinks.snapshotLength+" base(s).");
    if (baseLinks.snapshotLength == 0) return;
    var divElement = document.createElement("div");
    if (isNewStyle())
        divElement.setAttribute("style", "position: absolute; left: 10%;border:2px ridge #9999FF;width:150;text-align:center;background-color:#000000");
    else
        divElement.setAttribute("style", "position: relative; left: 10%;border:2px ridge #9999FF;width:150;text-align:center;background-color:#000000");
    divElement.setAttribute("id", "linksClones");
    var titleElement = document.createElement("center");
    titleElement.textContent = "Bases";
    //titleElement.setAttribute("text-align","center");
    divElement.appendChild(titleElement);
    for (var i = 0; i < baseLinks.snapshotLength; i++) {
        //console.log(baseLinks.snapshotItem(i));
        var clone = baseLinks.snapshotItem(i).cloneNode(true);
        divElement.appendChild(clone);
        divElement.appendChild(document.createElement("br"));
    }
    canvasElement.parentNode.insertBefore(divElement, canvasElement);
    canvasElement.setAttribute("style", canvasElement.getAttribute("style") + "bottom: " + divElement.offsetHeight);
    divElement.setAttribute("style", divElement.getAttribute("style") + "top: " + canvasElement.offsetHeight / 4);
}

function copyFleetLinks() {
    var sString = "//div[@id='myCanvas']";
    if (isNewStyle()) {
        sString = "//div[@id='map-galaxy_canvas']";
    }
    var canvasElement = document.evaluate(
        sString,
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (!canvasElement) return;
    var fleetLinks = document.evaluate(
        "//a[@onmouseout][contains(@href,'fleet')][not(contains(@href,'edit'))]",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //console.log("Found "+fleetLinks.snapshotLength+" fleet(s).");
    if (fleetLinks.snapshotLength == 0) return;
    var divElement = document.createElement("div");
    if (isNewStyle())
        divElement.setAttribute("style", "position: absolute; left: 10%;border:2px ridge #9999FF;width:150;text-align:center;background-color:#000000");
    else
        divElement.setAttribute("style", "position: relative; left: -30%;border:2px ridge #9999FF;width:150;text-align:center;background-color:#000000");
    divElement.setAttribute("id", "linksClones");
    var titleElement = document.createElement("center");
    titleElement.textContent = "Fleets";
    //titleElement.setAttribute("text-align","center");
    divElement.appendChild(titleElement);
    for (var i = 0; i < fleetLinks.snapshotLength; i++) {
        //console.log(baseLinks.snapshotItem(i));
        var clone = fleetLinks.snapshotItem(i).cloneNode(true);
        divElement.appendChild(clone);
        divElement.appendChild(document.createElement("br"));
    }
    canvasElement.parentNode.insertBefore(divElement, canvasElement);
    canvasElement.setAttribute("style", canvasElement.getAttribute("style") + "bottom: " + divElement.offsetHeight);
    divElement.setAttribute("style", divElement.getAttribute("style") + "top: " + canvasElement.offsetHeight / 4);
}
//==========================================
//Base Default Presets
//==========================================
var DEFAULT_BASE_PRESET_1 = "0,0,0,0,0,0,25,20,20,16,0,20,10,15,10,15,0,0,0,0,0,0,,0,0,0,0,2,0,2,0,2,2";
var DEFAULT_BASE_PRESET_2 = "0,0,0,0,0,0,25,0,20,24,5,20,10,15,10,5,0,0,0,0,0,0,,0,0,0,0,2,0,2,0,2,2";
var DEFAULT_BASE_PRESET_3 = "0,0,0,0,0,0,25,0,20,16,0,20,10,15,10,5,0,0,0,0,0,0,,0,0,0,0,2,0,2,0,2,2";
var DEFAULT_BASE_PRESET_4 = "0,0,0,0,0,0,25,0,20,16,0,20,10,15,10,5,0,0,0,5,0,0,,0,0,0,0,5,0,5,0,5,5";
var DEFAULT_BASE_PRESET_5 = "0,0,0,0,0,0,25,0,20,16,0,20,20,15,10,5,0,0,0,0,0,0,,0,0,0,0,5,0,5,0,5,5";
var DEFAULT_BASE_PRESET_6 = "0,0,0,0,0,0,25,0,20,16,0,20,10,15,10,5,0,0,0,0,0,0,,0,0,0,0,2,0,2,0,2,2";
var DEFAULT_BASE_PRESET_7 = "0,0,0,0,0,0,25,0,20,0,0,0,0,15,10,0,0,0,0,0,0,0,,0,0,0,0,2,0,2,0,2,2";
var DEFAULT_BASE_PRESET_8 = "0,0,0,0,0,0,25,0,20,16,0,20,10,15,10,5,0,0,0,0,0,5,,0,0,0,0,2,0,2,0,2,2";
var DEFAULT_BASE_PRESET_NAME_1 = "E";
var DEFAULT_BASE_PRESET_NAME_2 = "P";
var DEFAULT_BASE_PRESET_NAME_3 = "R";
var DEFAULT_BASE_PRESET_NAME_4 = "JG";
var DEFAULT_BASE_PRESET_NAME_5 = "D";
var DEFAULT_BASE_PRESET_NAME_6 = "M";
var DEFAULT_BASE_PRESET_NAME_7 = "B";
var DEFAULT_BASE_PRESET_NAME_8 = "C";
var DEFAULT_BASE_PRESET_TITLE_1 = "Economy";
var DEFAULT_BASE_PRESET_TITLE_2 = "Production";
var DEFAULT_BASE_PRESET_TITLE_3 = "Research";
var DEFAULT_BASE_PRESET_TITLE_4 = "JumpGate";
var DEFAULT_BASE_PRESET_TITLE_5 = "Defense";
var DEFAULT_BASE_PRESET_TITLE_6 = "Mixed";
var DEFAULT_BASE_PRESET_TITLE_7 = "Basic";
var DEFAULT_BASE_PRESET_TITLE_8 = "Capital";
var BASE_PRESET_1_NAME_KEY = "BASE_PRESET_1_NAME";
var BASE_PRESET_2_NAME_KEY = "BASE_PRESET_2_NAME";
var BASE_PRESET_3_NAME_KEY = "BASE_PRESET_3_NAME";
var BASE_PRESET_4_NAME_KEY = "BASE_PRESET_4_NAME";
var BASE_PRESET_5_NAME_KEY = "BASE_PRESET_5_NAME";
var BASE_PRESET_6_NAME_KEY = "BASE_PRESET_6_NAME";
var BASE_PRESET_7_NAME_KEY = "BASE_PRESET_7_NAME";
var BASE_PRESET_8_NAME_KEY = "BASE_PRESET_8_NAME";
var BASE_PRESET_1_TITLE_KEY = "BASE_PRESET_1_TITLE";
var BASE_PRESET_2_TITLE_KEY = "BASE_PRESET_2_TITLE";
var BASE_PRESET_3_TITLE_KEY = "BASE_PRESET_3_TITLE";
var BASE_PRESET_4_TITLE_KEY = "BASE_PRESET_4_TITLE";
var BASE_PRESET_5_TITLE_KEY = "BASE_PRESET_5_TITLE";
var BASE_PRESET_6_TITLE_KEY = "BASE_PRESET_6_TITLE";
var BASE_PRESET_7_TITLE_KEY = "BASE_PRESET_7_TITLE";
var BASE_PRESET_8_TITLE_KEY = "BASE_PRESET_8_TITLE";
var BASE_PRESET_1_VALUE_KEY = "BASE_PRESET_1_VALUE";
var BASE_PRESET_2_VALUE_KEY = "BASE_PRESET_2_VALUE";
var BASE_PRESET_3_VALUE_KEY = "BASE_PRESET_3_VALUE";
var BASE_PRESET_4_VALUE_KEY = "BASE_PRESET_4_VALUE";
var BASE_PRESET_5_VALUE_KEY = "BASE_PRESET_5_VALUE";
var BASE_PRESET_6_VALUE_KEY = "BASE_PRESET_6_VALUE";
var BASE_PRESET_7_VALUE_KEY = "BASE_PRESET_7_VALUE";
var BASE_PRESET_8_VALUE_KEY = "BASE_PRESET_8_VALUE";
//==========================================
//Advanced Structures Page
//5 and 6 settings added by Cold-Phoenix, 7 and 8 added by hightower
//Settings buttons fixed by hightower (only first 4 were working before)
//==========================================
function insertBaseSettingLinks() {
    var row;
    loadBaseTypes();
    GM_addStyle('.settingsLink {' +
        '   color: yellow;' +
        '   font-weight: bold;' +
        '   font-size: x-small;' +
        '   background-color: #333399;' +
        '   border: solid 1px none;' +
        '  padding-left: 2px;' +
        '  padding-right: 2px;' +
        '  margin-left: 2px;' +
        '  margin-right: 2px;' +
        '}' +
        ' .settingsLinkSelected {' +
        '   color: black;' +
        '   font-weight: bold;' +
        '   font-size: x-small;' +
        '   background-color: navy;' +
        '   border: solid 1px none;' +
        '  padding-left: 2px;' +
        '  padding-right: 2px;' +
        '  margin-left: 2px;' +
        '  margin-right: 2px;' +
        '}'
    );

    var baseLinks = document.evaluate(
        "//a[contains(@href,'base.aspx?base=')]",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    //console.log("Found "+baseLinks.snapshotLength +" base(s).");
    var fillerTd = document.createElement("td");
    fillerTd.setAttribute("align", "center");
    // Fix location for link if refreashed after clicking a setting
    var href = location.split("#")[0];
    fillerTd.innerHTML = "<a href='" + href + "&mode=edit' id='editLink'>Edit Goals</a>";
    //fillerTd.setAttribute("width","*");
    //fillerTd.setAttribute("colspan","3");
    var styleColour1 = unescape(getSetting(STRUCT_COLOUR1_KEY, "aqua"));
    var styleColour2 = unescape(getSetting(STRUCT_COLOUR2_KEY, "orange"));
    var styleColour3 = unescape(getSetting(STRUCT_COLOUR3_KEY, "green"));

    var topRow = baseLinks.snapshotItem(0).parentNode.parentNode.previousSibling;

    var instructionTd = document.createElement("td");
    instructionTd.setAttribute("width", 18);
    instructionTd.setAttribute("align", "center");
    instructionTd.setAttribute("style", "border-style: solid; border-color: rgb(0, 0, 102); border-width: 0pt 1px 1px; font-family: verdana,arial;" +
        " font-style: normal; font-variant: normal; font-weight: normal; font-size: 10px; line-height: normal; font-size-adjust: none; font-stretch: normal;padding-bottom:12px");
    instructionTd.innerHTML = "<span style='color:" + styleColour2 + ";font-size: large;'>&#x25CF;</span><br /> <br />N<br />O<br />T<br /> <br />S<br />T<br />A<br />R<br />T<br />E<br />D";
    topRow.replaceChild(instructionTd, topRow.firstChild);
    instructionTd = document.createElement("td");
    instructionTd.setAttribute("width", 18);
    instructionTd.setAttribute("align", "center");
    instructionTd.setAttribute("style", "border-style: solid; border-color: rgb(0, 0, 102); border-width: 0pt 1px 1px; font-family: verdana,arial;" +
        " font-style: normal; font-variant: normal; font-weight: normal; font-size: 10px; line-height: normal; font-size-adjust: none; font-stretch: normal;padding-bottom:12px");
    instructionTd.innerHTML = "<span style='color:" + styleColour1 + ";font-size: large;'>&#x25CF;</span><br /> <br />P<br />R<br />O<br />G<br />R<br />E<br />S<br />S<br />I<br />N<br />G";
    topRow.insertBefore(instructionTd, topRow.firstChild);
    instructionTd = document.createElement("td");
    instructionTd.setAttribute("width", 18);
    instructionTd.setAttribute("align", "center");
    instructionTd.setAttribute("style", "border-style: solid; border-color: rgb(0, 0, 102); border-width: 0pt 1px 1px; font-family: verdana,arial;" +
        " font-style: normal; font-variant: normal; font-weight: normal; font-size: 10px; line-height: normal; font-size-adjust: none; font-stretch: normal;padding-bottom:12px");
    instructionTd.innerHTML = "<span style='color:" + styleColour3 + ";font-size: large;'>&#x25CF;</span><br /> <br />C<br />O<br />M<br />P<br />L<br />E<br />T<br />E<br />D<br /> <br />&nbsp;";
    topRow.insertBefore(instructionTd, topRow.firstChild);
    topRow.insertBefore(fillerTd, topRow.firstChild);

    var preset1Name = getSetting(BASE_PRESET_1_NAME_KEY, DEFAULT_BASE_PRESET_NAME_1);
    var preset2Name = getSetting(BASE_PRESET_2_NAME_KEY, DEFAULT_BASE_PRESET_NAME_2);
    var preset3Name = getSetting(BASE_PRESET_3_NAME_KEY, DEFAULT_BASE_PRESET_NAME_3);
    var preset4Name = getSetting(BASE_PRESET_4_NAME_KEY, DEFAULT_BASE_PRESET_NAME_4);
    var preset5Name = getSetting(BASE_PRESET_5_NAME_KEY, DEFAULT_BASE_PRESET_NAME_5);
    var preset6Name = getSetting(BASE_PRESET_6_NAME_KEY, DEFAULT_BASE_PRESET_NAME_6);
    var preset7Name = getSetting(BASE_PRESET_7_NAME_KEY, DEFAULT_BASE_PRESET_NAME_7);
    var preset8Name = getSetting(BASE_PRESET_8_NAME_KEY, DEFAULT_BASE_PRESET_NAME_8);

    var preset1Title = getSetting(BASE_PRESET_1_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_1);
    var preset2Title = getSetting(BASE_PRESET_2_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_2);
    var preset3Title = getSetting(BASE_PRESET_3_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_3);
    var preset4Title = getSetting(BASE_PRESET_4_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_4);
    var preset5Title = getSetting(BASE_PRESET_5_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_5);
    var preset6Title = getSetting(BASE_PRESET_6_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_6);
    var preset7Title = getSetting(BASE_PRESET_7_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_7);
    var preset8Title = getSetting(BASE_PRESET_8_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_8);
    //console.log("key: "+BASE_PRESET_8_TITLE_KEY+" title: "+DEFAULT_BASE_PRESET_TITLE_8+" output: "+preset8Title);
    //var lastElement;

    for (var i = 0; i < baseLinks.snapshotLength; i++) {
        var link = baseLinks.snapshotItem(i);
        row = link.parentNode.parentNode;
        row.firstChild.setAttribute("colspan", "3");

        var baseId = link.href.substring(link.href.indexOf("=") + 1);
        var settingsTd = document.createElement("td");
        var html = "<a class='settingsLink' href='#" + baseId + "' id='1-" + baseId + "' title='" + preset1Title + "'>" + preset1Name + "</a>" +
            "<a class='settingsLink' href='#" + baseId + "' id='2-" + baseId + "' title='" + preset2Title + "'>" + preset2Name + "</a>" +
            "<a class='settingsLink' href='#" + baseId + "' id='3-" + baseId + "' title='" + preset3Title + "'>" + preset3Name + "</a>" +
            "<a class='settingsLink' href='#" + baseId + "' id='4-" + baseId + "' title='" + preset4Title + "'>" + preset4Name + "</a>" +
            "<a class='settingsLink' href='#" + baseId + "' id='5-" + baseId + "' title='" + preset5Title + "'>" + preset5Name + "</a>" +
            "<a class='settingsLink' href='#" + baseId + "' id='6-" + baseId + "' title='" + preset6Title + "'>" + preset6Name + "</a>" +
            "<a class='settingsLink' href='#" + baseId + "' id='7-" + baseId + "' title='" + preset7Title + "'>" + preset7Name + "</a>" +
            "<a class='settingsLink' href='#" + baseId + "' id='8-" + baseId + "' title='" + preset8Title + "'>" + preset8Name + "</a>";
        settingsTd.innerHTML = html;
        row.insertBefore(settingsTd, row.firstChild);
        //console.log($("E"+baseId));
        var baseType = getBaseType(baseId);
        //console.log("Base Type: "+baseType);

        //Modify base link to go directly to structures page
        link.href = link.href + "&view=structures";

        if (baseType)
            onBaseTypeSet(baseId, baseType);

        $("1-" + baseId).addEventListener('click', getSetBaseClosure(baseId, "1"), true);
        $("2-" + baseId).addEventListener('click', getSetBaseClosure(baseId, "2"), true);
        $("3-" + baseId).addEventListener('click', getSetBaseClosure(baseId, "3"), true);
        $("4-" + baseId).addEventListener('click', getSetBaseClosure(baseId, "4"), true);
        $("5-" + baseId).addEventListener('click', getSetBaseClosure(baseId, "5"), true);
        $("6-" + baseId).addEventListener('click', getSetBaseClosure(baseId, "6"), true);
        $("7-" + baseId).addEventListener('click', getSetBaseClosure(baseId, "7"), true);
        $("8-" + baseId).addEventListener('click', getSetBaseClosure(baseId, "8"), true);
    }
}

function getSetBaseClosure(baseId, type) {
    function func() {
        setBase(baseId, type);
    };
    return func;
}
var bases;
var baseTypes = new Array();

function setBase(baseId, type) {
    //console.log(baseId +": "+type);
    for (var i = 0; i < baseTypes.length; i++) {
        //console.log("Searching... "+fleetData[i][0]);
        if (baseTypes[i].split("=")[0] == baseId) {
            //console.log("Found "+fleetData[i][0]);
            baseTypes[i] = baseId + "=" + type;
            saveBaseTypes();
            onBaseTypeSet(baseId, type);
            return;
        }
    }
    baseTypes[baseTypes.length] = baseId + "=" + type;
    saveBaseTypes();
    onBaseTypeSet(baseId, type);
}

function getBaseType(baseId) {
    for (var i = 0; i < baseTypes.length; i++) {
        //console.log("Searching... "+baseTypes[i][0]);
        if (baseTypes[i].split("=")[0] == baseId) {
            //console.log("Found base type: "+baseTypes[i].split("=")[1]);
            return baseTypes[i].split("=")[1];
        }
    }
    return null;
}

function getBaseTypeValues(type) {
    //console.log("Finding array for "+type);
    var array;
    switch (type) {
        case "1":
            {
                array = getSetting(BASE_PRESET_1_VALUE_KEY, DEFAULT_BASE_PRESET_1);
                break;
            }
        case "2":
            {
                array = getSetting(BASE_PRESET_2_VALUE_KEY, DEFAULT_BASE_PRESET_2);
                break;
            }
        case "3":
            {
                array = getSetting(BASE_PRESET_3_VALUE_KEY, DEFAULT_BASE_PRESET_3);
                break;
            }
        case "4":
            {
                array = getSetting(BASE_PRESET_4_VALUE_KEY, DEFAULT_BASE_PRESET_4);
                break;
            }
        case "5":
            {
                array = getSetting(BASE_PRESET_5_VALUE_KEY, DEFAULT_BASE_PRESET_5);
                break;
            }
        case "6":
            {
                array = getSetting(BASE_PRESET_6_VALUE_KEY, DEFAULT_BASE_PRESET_6);
                break;
            }
        case "7":
            {
                array = getSetting(BASE_PRESET_7_VALUE_KEY, DEFAULT_BASE_PRESET_7);
                break;
            }
        case "8":
            {
                array = getSetting(BASE_PRESET_8_VALUE_KEY, DEFAULT_BASE_PRESET_8);
                break;
            }
        default:
            {
                return null;
            };
    }
    array = array.split(",");
    return array;
}

function saveBaseTypeValues(array, type) {
    switch (type) {
        case "1":
            {
                setSetting(BASE_PRESET_1_VALUE_KEY, array.join(","));
                break;
            }
        case "2":
            {
                setSetting(BASE_PRESET_2_VALUE_KEY, array.join(","));
                break;
            }
        case "3":
            {
                setSetting(BASE_PRESET_3_VALUE_KEY, array.join(","));
                break;
            }
        case "4":
            {
                setSetting(BASE_PRESET_4_VALUE_KEY, array.join(","));
                break;
            }
        case "5":
            {
                setSetting(BASE_PRESET_5_VALUE_KEY, array.join(","));
                break;
            }
        case "6":
            {
                setSetting(BASE_PRESET_6_VALUE_KEY, array.join(","));
                break;
            }
        case "7":
            {
                setSetting(BASE_PRESET_7_VALUE_KEY, array.join(","));
                break;
            }
        case "8":
            {
                setSetting(BASE_PRESET_8_VALUE_KEY, array.join(","));
                break;
            }
    }
}

function onBaseTypeSet(baseId, type) {
    //console.log(type+"-"+baseId);
    if ($(type + "-" + baseId).getAttribute("class") == "settingsLinkSelected") {
        //Clear
        $(type + "-" + baseId).setAttribute("class", "settingsLink");
        fillCells(baseId, "clear");
    } else {
        //apply
        $(type + "-" + baseId).setAttribute("class", "settingsLinkSelected");
        for (i = 1; i <= 8; i++) {
            if (i != type) $(i + "-" + baseId).setAttribute("class", "settingsLink");
        }
        //console.log(baseId);
        fillCells(baseId, type);
    }
}

function fillCells(baseId, type) {
    var targetValues = getBaseTypeValues(type);
    //console.log("//a[contains(@href,'base.aspx?base="+baseId+"')]");
    var baseLink = document.evaluate(
        "//a[contains(@href,'base.aspx?base=" + baseId + "')]",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //console.log("Found "+baseLink.singleNodeValue +" base.");
    var row = baseLink.parentNode.parentNode;
    //console.log(row);
    var styleColour1 = unescape(getSetting(STRUCT_COLOUR1_KEY, "aqua"));
    var styleColour2 = unescape(getSetting(STRUCT_COLOUR2_KEY, "orange"));
    var styleColour3 = unescape(getSetting(STRUCT_COLOUR3_KEY, "green"));
    var styleColour4 = "";
    for (var i = 2; i < row.childNodes.length; i++) {
        var cell = row.childNodes[i];
        //Reset
        if (cell.childNodes.length == 1) {
            var small = cell.childNodes[0];
            if (small.style.color == styleColour1) small.style.color = "white";
            if (small.style.color == styleColour2) cell.removeChild(small);
        }
        if (type == "clear") {
            //console.log("resetting cell");
            continue;
        }
        var targetValue = targetValues[i - 2];
        if (targetValue == "-1") continue;
        //console.log(cell);
        //console.log(i+": "+targetValue);
        if (cell.childNodes.length == 1) {
            var count = parseNum(small.textContent);
            if (count < targetValue) {
                small.style.color = styleColour1;
                small.style.background = "";
                small.title = "Goal: " + targetValue + ", " + (targetValue - count) + " left to go.";
            }
            if (count >= targetValue && targetValue != 0) {
                small.style.background = styleColour4;
                small.style.color = styleColour3;
            }
        } else {
            if (targetValue > 0) {
                var small = document.createElement("small");
                small.style.color = styleColour2;
                small.textContent = targetValue;
                cell.appendChild(small);
            }
        }
    }
}

function insertEditRows() {
    var table = document.evaluate(
        "//table[@class='layout listing1']",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue;
    console.log(table);
    var typeArray = new Array("1", "2", "3", "4", "5", "6", "7", "8");
    var typeNameArray = new Array(getSetting(BASE_PRESET_1_NAME_KEY, DEFAULT_BASE_PRESET_NAME_1),
        getSetting(BASE_PRESET_2_NAME_KEY, DEFAULT_BASE_PRESET_NAME_2),
        getSetting(BASE_PRESET_3_NAME_KEY, DEFAULT_BASE_PRESET_NAME_3),
        getSetting(BASE_PRESET_4_NAME_KEY, DEFAULT_BASE_PRESET_NAME_4),
        getSetting(BASE_PRESET_5_NAME_KEY, DEFAULT_BASE_PRESET_NAME_5),
        getSetting(BASE_PRESET_6_NAME_KEY, DEFAULT_BASE_PRESET_NAME_6),
        getSetting(BASE_PRESET_7_NAME_KEY, DEFAULT_BASE_PRESET_NAME_7),
        getSetting(BASE_PRESET_8_NAME_KEY, DEFAULT_BASE_PRESET_NAME_8));

    var typeTitleArray = new Array(getSetting(BASE_PRESET_1_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_1),
        getSetting(BASE_PRESET_2_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_2),
        getSetting(BASE_PRESET_3_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_3),
        getSetting(BASE_PRESET_4_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_4),
        getSetting(BASE_PRESET_5_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_5),
        getSetting(BASE_PRESET_6_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_6),
        getSetting(BASE_PRESET_7_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_7),
        getSetting(BASE_PRESET_8_TITLE_KEY, DEFAULT_BASE_PRESET_TITLE_8));
    for (var j = 0; j < typeArray.length; j++) {
        var newRow = document.createElement("tr");
        newRow.setAttribute("align", "center");
        newRow.setAttribute("id", typeArray[j]);
        var newCell = document.createElement("td");
        newCell.setAttribute("align", "right");
        newCell.setAttribute("style", "padding-right:5px");
        newCell.colspan = 2;
        newCell.innerHTML = "<input type='text' size='1.5' value='" + typeNameArray[j] + "' /><br /><input type='text' size='4' value='" + typeTitleArray[j] + "' />";
        newRow.appendChild(newCell);
        var typeValues = getBaseTypeValues(typeArray[j]);
        //console.log(typeValues);
        for (var i = 0; i <= 32; i++) {
            newCell = document.createElement("td");
            if (i != 22) {
                //console.log(typeValues[i]);
                newCell.innerHTML = "<input type='text' size='1.5' value='" + typeValues[i] + "' />";
            }
            newRow.appendChild(newCell);
        }
        table.firstChild.appendChild(newRow);
    }
    var center = document.createElement("center");
    center.setAttribute("style", "margin-top: 5px;");
    var button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", "Save");
    button.setAttribute("id", "save");
    center.appendChild(button);
    document.body.appendChild(center);
    var href = location.replace("&mode=edit", "");
    button.addEventListener('click', function(event) {
        saveNewBaseTypeValues();
        window.location = href;
    }, true);
    button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", "Cancel");
    button.setAttribute("id", "Cancel");
    button.setAttribute("style", "margin-left: 5px;");
    center.appendChild(button);
    button.addEventListener('click', function(event) {
        window.location = href;
    }, true);
}

function saveNewBaseTypeValues() {
    //console.log("Saving new base type values");
    var rows = document.evaluate(
        "//tr[@id='1' or @id='2' or @id='3' or @id='4' or @id='5' or @id='6' or @id='7' or @id='8']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    console.log(rows.snapshotItem(0).childNodes[0].childNodes[2].value);
    setSetting(BASE_PRESET_1_NAME_KEY, rows.snapshotItem(0).childNodes[0].firstChild.value);
    setSetting(BASE_PRESET_2_NAME_KEY, rows.snapshotItem(1).childNodes[0].firstChild.value);
    setSetting(BASE_PRESET_3_NAME_KEY, rows.snapshotItem(2).childNodes[0].firstChild.value);
    setSetting(BASE_PRESET_4_NAME_KEY, rows.snapshotItem(3).childNodes[0].firstChild.value);
    setSetting(BASE_PRESET_5_NAME_KEY, rows.snapshotItem(4).childNodes[0].firstChild.value);
    setSetting(BASE_PRESET_6_NAME_KEY, rows.snapshotItem(5).childNodes[0].firstChild.value);
    setSetting(BASE_PRESET_7_NAME_KEY, rows.snapshotItem(6).childNodes[0].firstChild.value);
    setSetting(BASE_PRESET_8_NAME_KEY, rows.snapshotItem(7).childNodes[0].firstChild.value);

    setSetting(BASE_PRESET_1_TITLE_KEY, rows.snapshotItem(0).childNodes[0].childNodes[2].value);
    setSetting(BASE_PRESET_2_TITLE_KEY, rows.snapshotItem(1).childNodes[0].childNodes[2].value);
    setSetting(BASE_PRESET_3_TITLE_KEY, rows.snapshotItem(2).childNodes[0].childNodes[2].value);
    setSetting(BASE_PRESET_4_TITLE_KEY, rows.snapshotItem(3).childNodes[0].childNodes[2].value);
    setSetting(BASE_PRESET_5_TITLE_KEY, rows.snapshotItem(4).childNodes[0].childNodes[2].value);
    setSetting(BASE_PRESET_6_TITLE_KEY, rows.snapshotItem(5).childNodes[0].childNodes[2].value);
    setSetting(BASE_PRESET_7_TITLE_KEY, rows.snapshotItem(6).childNodes[0].childNodes[2].value);
    setSetting(BASE_PRESET_8_TITLE_KEY, rows.snapshotItem(7).childNodes[0].childNodes[2].value);
    console.log(rows[0].childNodes[0].firstChild.value);
    for (var j = 0; j < rows.snapshotLength; j++) {
        var array = new Array();
        var row = rows.snapshotItem(j);
        var type = row.getAttribute("id");
        console.log(row);
        for (var i = 1; i < row.childNodes.length; i++) {
            var structureId = (i - 1);
            if (i != 23) {
                console.log(row.childNodes[i].firstChild.value);
                array[structureId] = row.childNodes[i].firstChild.value;
            } else
                array[structureId] = "-1";
        }
        saveBaseTypeValues(array, type);
    }
}

function saveBaseCoords() {
    var baseCoordArray = document.body.innerHTML.match(/[A-Za-z][0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{2}/g);
    var baseCoords = [];
    if (baseCoordArray.length == 0) return;
    for (var i = 0; i < baseCoordArray.length; i = i + 2) {
        if (baseCoordArray[i] == 'D22:22:22:22') continue;
        baseCoords[baseCoords.length] = baseCoordArray[i];
    }
    baseCoords = baseCoords.join(',');
    var old_bases = getSetting("baseCoords") + "";
    if (old_bases != baseCoords) setSetting("baseCoords", baseCoords)
}

function saveBases() {
    //console.log("Saving bases");
    var links = document.evaluate(
        "//a[contains(@href,'base.aspx?base=')]",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //console.log(links.snapshotLength);
    bases = new Array();
    for (var i = 0; i < links.snapshotLength; i++) {
        var link = links.snapshotItem(i);
        //console.log(link);
        bases[i] = link.textContent + "=" + link.href.split("=")[1];
    }
    //console.log(bases);
    setSetting("bases", escape(bases.join(",")));
    var d = new Date();
    var currentTime = Math.round(d.getTime() / 1000); // Unix time in seconds
    setSetting('lastBaseCheck', currentTime);
}

function loadBases() {
    var loaded = getSetting("bases", null);
    if (!loaded) return;
    loaded = unescape(loaded);
    bases = loaded.split(",");
    //console.log(bases);
    return bases;
}

function isBase(base) {
    if (bases == null) var bases = loadBases();
    if (bases == null) return false;
    for (var i = 0; i < bases.length; i++) {
        //      console.log("Base: "+base+" Compared: "+bases[i].split("=")[0])
        if (base == bases[i].split("=")[0])
            return true;
    }
    return false;
}


function checkBaseDataAge() {
    if (getSetting('bases', null) == null) return;
    //console.log('Base data check.');
    var lastBaseCheck = parseNum(getSetting('lastBaseCheck', 0));
    var d = new Date();
    var currentTime = Math.round(d.getTime() / 1000); // Unix time in seconds
    //console.log('lastBaseCheck: '+lastBaseCheck);
    //console.log('currentTime: '+currentTime);
    //console.log('Need fresh trade data: ' + (currentTime < (lastBaseCheck + (86400*3))));
    //console.log('Next Check (minutes): '+ ( (lastBaseCheck + (86400*3)) - currentTime)/60 );
    if (currentTime > (lastBaseCheck + (864000 * 3))) {
        insertNotification('Base data has not been updated in over three days.<br />' +
            '   Visit the empire structures page to refresh the information.<br /><br /><br />');
    }
}

function saveBaseTypes() {
    //console.log(baseTypes);
    setSetting("newBaseTypes", escape(baseTypes.join(",")));
}

function loadBaseTypes() {
    var loaded = getSetting("newBaseTypes", null);
    if (!loaded)
        return;
    loaded = unescape(loaded);
    baseTypes = loaded.split(",");
    //console.log(baseTypes);
}

//==========================================
//Fleet movement links
//==========================================
var supportShips = new Array("Recycler", "Scout Ship", "Outpost Ship", "Carrier", "Fleet Carrier");
var attackShips = new Array("Fighters", "Bombers", "Heavy Bombers", "Ion Bombers", "Corvette", "Destroyer", "Frigate", "Ion Frigate",
    "Cruiser", "Heavy Cruiser", "Battleship", "Dreadnought", "Titan", "Leviathan", "Death Star");
var availableShips = new Array();

function setAvailableShips() {
    var ships = document.evaluate(
        "//td/b",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    console.log("Found "+ships.snapshotLength+" ships types.");
    for (var i = 0; i < ships.snapshotLength; i++) {
        console.log(ships.snapshotItem(i));
        availableShips[i] = ships.snapshotItem(i).textContent;
    }
    console.log(availableShips);
}

function isAvailableShip(ship) {
    for (var i = 0; i < availableShips.length; i++) {
        console.log(ship+" = "+availableShips[i]);
        if (ship == availableShips[i]) {
            console.log(ship+" = "+availableShips[i]);
            return true;
        }
    }
    return false;
}

function createSupportMovementHref() {
    var href = "";
    for (var i = 0; i < supportShips.length; i++) {
        if (isAvailableShip(supportShips[i]))
            href = href + "javascript:maxquant('" + supportShips[i] + "');";
    }
    for (var i = 0; i < attackShips.length; i++) {
        if (isAvailableShip(attackShips[i]))
            href = href + "javascript:zero('" + attackShips[i] + "');";
    }
    console.log("support href: "+href);
    return href;
}

function createAttackMovementHref(includeFighters) {
    var href = "";
    for (var i = 0; i < supportShips.length; i++) {
        if (isAvailableShip(supportShips[i]))
            href = href + "javascript:zero('" + supportShips[i] + "');";
    }
    var i = 0;
    if (!includeFighters) {
        href = href + "javascript:zero('Fighters');";
        i = 1;
    }
    for (i; i < attackShips.length; i++) {
        if (isAvailableShip(attackShips[i]))
            href = href + "javascript:maxquant('" + attackShips[i] + "');";
    }
    //console.log("attack href ("+includeFighters+"): "+href);
    return href;
}

function createAllMovementNoFTHref() {
    var href = "";
    href = href + "javascript:zero('Fighters');";
    for (var i = 0; i < supportShips.length; i++) {
        if (isAvailableShip(supportShips[i]))
            href = href + "javascript:maxquant('" + supportShips[i] + "');";
    }
    for (var i = 1; i < attackShips.length; i++) {
        if (isAvailableShip(attackShips[i]))
            href = href + "javascript:maxquant('" + attackShips[i] + "');";
    }
    return href;
}

function insertMoveFleetLinks() {
    setAvailableShips();
    var allNoFTHref = createAllMovementNoFTHref();
    var supportHref = createSupportMovementHref();
    var attackHref = createAttackMovementHref(true);
    var attackNoFTHref = createAttackMovementHref(false);
    try {
        var cell = document.evaluate(
            "//a[text()='All']",
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    } catch (e) {
        return;
    }
    if (!cell) return;
    cell = cell.parentNode;
    var noneLink = cell.childNodes[2];
    cell.removeChild(noneLink);
    cell.innerHTML = cell.innerHTML + ' <a href="' + allNoFTHref + '">All(no FT)</a> - <a href="' + supportHref +
        '">Support</a> - <a href="' + attackHref + '">Attack</a> - <a href="' + attackNoFTHref + '">Attack(no FT)</a> - ';
    cell.setAttribute("colspan", "3");
    cell.parentNode.removeChild(cell.nextSibling);
    cell.parentNode.removeChild(cell.previousSibling);
    cell.appendChild(noneLink);
}

//==========================================
//Format Numbers
//==========================================
function formatVariousNumbers() {
    try {
        var debrisElement = document.evaluate(
            "//center[contains(text(),'Debris')]",
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (debrisElement != null) {
            var debrisMessage = debrisElement.textContent;
            //          console.log(debrisMessage);
            var indexOfText = debrisMessage.indexOf(" credits");
            var valueText = debrisMessage.substring(0, indexOfText);
            var value = commaFormat(parseNum(valueText));
            //console.log(valueText+" new value:" +value.toString());
            //console.log(debrisElement.textContent + " -< " + debrisElement.textContent.replace(valueText,value.toString()));
            debrisElement.textContent = debrisElement.textContent.replace(valueText, value.toString());
        }
    } catch (e) {
        console.log("Line Number: " + e.lineNumber + "\n " + e)
    }
}

function sumSingleFleet() {
    var regex = /<td><b>(.*?)<\/b><\/td><td align=.*?>([0-9\.,]+?)<\/td>/ig;
    var source = document.body.innerHTML,
        result;
    var fightingSize = 0,
        totalSize = 0;
    do {
        result = regex.exec(source);
        if (result) {
            console.log(result[2]);
            var shipName = result[1];
            var shipIndex = getShipIndex(shipName);
            var shipCount = parseFloat(result[2].replace(/,?/g, ""));
            var shipSize = shipValues[shipIndex] * shipCount;
            console.log("Shipcount: '"+shipCount +"' Shipname: '"+ shipName +"'(s) ("+shipSize+") is fighting ship: "+isFightingShip(shipIndex));
            totalSize += shipSize;
            if (isFightingShip(shipIndex)) fightingSize += shipSize;
        }
    }
    while (result)
    var table = document.evaluate(
        "//table[ @class='layout listing']",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue;
    console.log(rows);
    if (!table)
        return;
    table = table.firstChild;
    console.log(table);

    table.innerHTML = table.innerHTML + "<tr><td><b>Fighting Size</b></td><td align='center'>" + fightingSize + "</td></tr>" +
        "<tr><td><b>Total Size</b></td><td align='center'>" + totalSize + "</td></tr>";

}

//==========================================
//Sum Credits Page
//==========================================
function sumCreditsPage() {
    var mainTable = $("credits_table");
    var parent;
    var summary = $("credits_table_sumary");

    if (mainTable && summary) {
        parent = mainTable.parentNode;
        parent.insertBefore(summary, mainTable);
        parent.insertBefore(document.createElement("br"), mainTable);

        // Code runs on credits.aspx and sums up values.
        // The main usefulness is to figure how much debris you picked up.
        var regex = /<td>(.+?)<\/td><td>(.[,\.\d]+?)<\/td>/ig;
        var source = document.body.innerHTML,
            result;
        var derbLocations = new Array();
        do {
            result = regex.exec(source);
            if (result) {
                //console.log(result[1]+": "+parseNum(result[2]));
                if (result[1].indexOf('Debris collected') !== -1) {
                    var arrayIndex = derbLocations.length;
                    var loc = result[1].substring(result[1].indexOf('Debris collected at') + 20);
                    if (derbLocations.indexOf(loc) == -1) {
                        derbLocations[arrayIndex] = loc;
                    }
                }
            }
        }
        while (result);

        var derbsRow = document.evaluate(
            "//td[text()='Debris Collect']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
        if (derbsRow) {
            console.log(derbsRow);
            var html = "";
            for (var i = 0; i < derbLocations.length; i++) {
                if (i == 0) {
                    html = "<br/><table>";
                }
                html += "<tr><td>" + derbLocations[i] + "</td></tr>";
                if (i == derbLocations.length - 1) {
                    html += "</table>";
                }
            }
            //derbsRow.innerHTML += html;
        }
    }
}

//==========================================
//Swap Location Names
//==========================================

function replaceLocationNames() {
    if (getSetting(LOCATION_NAMES_KEY, null) == null)
        return;

    //select all links without img child nodes
    var links = document.evaluate(
        "//a[contains(@href,'loc=') and (count(img) = 0)]",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);

    //console.log("Links: "+links.snapshotLength);

    for (var i = 0; i < links.snapshotLength; i++) {
        //console.log(links.snapshotItem(i));
        links.snapshotItem(i).textContent = getLocationName(links.snapshotItem(i).textContent);
    }
}

var names = null;

function getLocationName(location) {
    if (names == null)
        var names = getSetting(LOCATION_NAMES_KEY, null);
    if (names == null)
        return;
    names = unescape(names);
    //console.log("names: "+names);
    var namesArray = names.split(",");
    for (var i = 0; i < namesArray.length; i++) {
        var def = namesArray[i].split("=");
        //console.log(def);
        if (def[0] == location)
            return def[1];
    }
    return location;
}

//==========================================
//Calculate Depart Time
//==========================================

function getLaunchTime(arriveTime, duration) { // 2010-10, used twice
    try {
        var departDate = calculateLaunchTime(arriveTime, duration);
        //console.log(departDate.getYear());
        var DateFormat = GetDateFormat(arriveTime);
        var dString = "";
        if (DateFormat == 1)
            dString = '' + zeroPad(departDate.getDate()) + ' ' + monthArray[departDate.getMonth()] + ' ' + departDate.getFullYear() + ', ' +
            departDate.getHours() + ':' + zeroPad(departDate.getMinutes()) + ':' + zeroPad(departDate.getSeconds());
        else if (DateFormat == 2)
            dString = '' + monthArray[departDate.getMonth()] + ' ' + zeroPad(departDate.getDate()) + ' ' + departDate.getFullYear() + ', ' +
            departDate.getHours() + ':' + zeroPad(departDate.getMinutes()) + ':' + zeroPad(departDate.getSeconds());
        else
            dString = '' + departDate.getFullYear() + '-' + zeroPad(parseNum(departDate.getMonth() + 1)) + '-' + zeroPad(departDate.getDate()) + ' ' +
            departDate.getHours() + ':' + zeroPad(departDate.getMinutes()) + ':' + zeroPad(departDate.getSeconds());
        return dString;
    } catch (e) {
        console.log("Line Number: " + e.lineNumber + "\n " + e)
    }
}

function calculateLaunchTime(arriveTime, duration) { // 2010-10, used once
    try {
        var currentTime = getCurrentServerTime();
        if (duration == "") {
            throw "No duration. Set fleet and destination.";
        }
        var durationSeconds = getSeconds(duration);
        var arrivalDate = getDateObject(arriveTime, true);
        var departDate = new Date();
        departDate.setTime(arrivalDate.getTime() - (durationSeconds * 1000));
        //console.log(departDate);
    } catch (e) {
        console.log("Line Number: " + e.lineNumber + "\n " + e)
    }
    return departDate;
}

//15-05-2008 4:37:00
function getDateObject(dateString, serverTime) {
    //console.log(DateFormat);
    var regex;
    if (serverTime) {
        var DateFormat = GetDateFormat(dateString);
        if (DateFormat == 1)
            regex = /(\d+)\s(\w+)\s(\d+)+,\s(\d+):(\d+):(\d+)/;
        else if (DateFormat == 2)
            regex = /(\w+)\s(\d+)\s(\d+)+,\s(\d+):(\d+):(\d+)/;
        else if (DateFormat == 3)
            regex = /(\d+)-(\d+)-(\d+)+\W(\d+):(\d+):(\d+)/;
    } else
        regex = /(\d+)-(\d+)-(\d+)+\W(\d+):(\d+):(\d+)/;
    var result = regex.exec(dateString);
    if (result) {
        if (serverTime) {
            if (DateFormat == 1)
                return new Date(result[3], monthArray.indexOf(result[2]), result[1], result[4], result[5], result[6]);
            else if (DateFormat == 2)
                return new Date(result[3], monthArray.indexOf(result[1]), result[2], result[4], result[5], result[6]);
            else
                return new Date(result[1], (result[2] - 1), result[3], result[4], result[5], result[6]);
        } else
            return new Date(result[3], (result[2] - 1), result[1], result[4], result[5], result[6]);
    } else if (dateString) {
        notify("Invalid arrival input " + dateString + ". Ensure arrival time is in the following format. MM-DD-YYYY HH:MM:SS");
        setSetting("FleetReminders", "-");
    }
}

function getCurrentServerTime() { // 2010-10, used 7 times
    try {
        var regex = /Server time: ((\d+)-(\d+)-(\d)+\W(\d+):(\d+):(\d+))/;
        var source = document.body.innerHTML;
        var result = regex.exec(source);
        if (result) {
            //console.log(result[1]);
            return result[1];
        } else {
            var container = 'pageDate';
            if (isNewStyle())
                container = 'top-header_server-time';
            if (!$(container)) return;
            var pageDate = $(container);
            var timerDateObject = new Date();
            var time = parseNum(pageDate.title);
            if (!time) return;
            time += 1000;
            pageDate.title = time;
            timerDateObject.setTime(time);
            var DateFormat = GetDateFormat(pageDate.textContent.split(": ")[1]);
            var dString = "";
            if (DateFormat == 1)
                dString = '' + zeroPad(timerDateObject.getDate()) + ' ' + monthArray[timerDateObject.getMonth()] + ' ' + timerDateObject.getFullYear() + ', ' +
                timerDateObject.getHours() + ':' + zeroPad(timerDateObject.getMinutes()) + ':' + zeroPad(timerDateObject.getSeconds());
            else if (DateFormat == 2)
                dString = '' + monthArray[timerDateObject.getMonth()] + ' ' + zeroPad(timerDateObject.getDate()) + ' ' + timerDateObject.getFullYear() + ', ' +
                timerDateObject.getHours() + ':' + zeroPad(timerDateObject.getMinutes()) + ':' + zeroPad(timerDateObject.getSeconds());
            else
                dString = '' + timerDateObject.getFullYear() + '-' + zeroPad(parseNum(timerDateObject.getMonth() + 1)) + '-' + zeroPad(timerDateObject.getDate()) + ' ' +
                timerDateObject.getHours() + ':' + zeroPad(timerDateObject.getMinutes()) + ':' + zeroPad(timerDateObject.getSeconds());
            return dString;
        }
    } catch (e) {
        console.log("getCurrentServerTime error: " + e)
    }
}

function GetDateFormat(dateString) {
    var DateFormat;
    if (dateString.indexOf(',') != -1) {
        dateString = dateString.split(',');
        var date = dateString[0].split(' ');
        if (parseInt(date[0]))
            DateFormat = 1;
        else
            DateFormat = 2;
    } else
        DateFormat = 3;
    return DateFormat;
}

var monthArray = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
// Nab a date in DD-MM-YYYY HH:II:SS format and convert it to an object.
function AEDateToTime(timerText) {
    var date;
    var time;
    var pageDate = new Date();
    var DateFormat = GetDateFormat(timerText);

    switch (DateFormat) {
        case 1:
            timerText = timerText.split(',');
            date = timerText[0].split(' ');
            time = timerText[1].split(':');
            pageDate.setFullYear(date[2]);
            pageDate.setDate(date[0]);
            pageDate.setMonth(monthArray.indexOf(date[1]));
            pageDate.setHours(time[0]);
            pageDate.setMinutes(time[1]);
            pageDate.setSeconds(time[2]);
            break
        case 2:
            timerText = timerText.split(',');
            date = timerText[0].split(' ');
            time = timerText[1].split(':');
            pageDate.setFullYear(date[2]);
            pageDate.setDate(date[1]);
            pageDate.setMonth(monthArray.indexOf(date[0]));
            pageDate.setHours(time[0]);
            pageDate.setMinutes(time[1]);
            pageDate.setSeconds(time[2]);
            break;
        case 3:
            timerText = timerText.split(' ');
            date = timerText[0].split('-');
            time = timerText[1].split(':');
            pageDate.setFullYear(date[0]);
            pageDate.setDate(date[2]);
            pageDate.setMonth(parseInt(date[1] - 1));
            pageDate.setHours(time[0]);
            pageDate.setMinutes(time[1]);
            pageDate.setSeconds(time[2]);
            break;
    }
    return pageDate;
}

//==========================================
//Add finishing times
//Based on code from FlxGrey on AE Forums. Thanks!
//"Mostly based off the code from spectre3ooo, but edited to be a little more sturdy." - FlxGrey
//Month part added by hightower, 24 hours clock/ single line fix by BishopGumby
//==========================================
function zeroPad(num) {
    if (num <= 9)
        return "0" + num;
    return num;
}

//==========================================
//Replaces the Asterix and shows the Amount
//of Debris on each astro (if any)
//==========================================

function debrisShow() {
    var spanArray = document.getElementsByTagName("span")
    for (var i = 0; i < spanArray.length; i++) {
        if (spanArray[i].getAttribute("class") == "gray comment") {
            //          Attempt to move debris to a better location commented out due to bug with occ bases
            //          spanArray[i].style.cssText='position:relative;top:10px;';
            spanArray[i].innerHTML = spanArray[i].title;
            spanArray[i].parentNode.setAttribute('align', 'center');
            //          var br = document.createElement("br");
            //          var tag = spanArray[i];

            //          spanArray[i].parentNode.insertBefore(br,tag);
        }
    }

}

//==========================================
//Pillage viewer
//==========================================
//Minimum Pillage (at full economy) = [(0.3 * max income) ^2] * 6
//
//At a players base: (number of hours since last pillage; max 100)% * (Base Economy/Total Bases Economy) * Base Owner Credits
//At a NPC base: Pillage = (number of hours since last pillage  max 100)% * Base Economy * 25
//Additional Pillage bonus: 0.5 * ('base actual income'-'new income') * ('base actual income'-'new income')/2 * 24

function checkPillageAmount() {
    //  //td/a[text()='"+name+"']/../..
    //  var table = document.evaluate("//th[contains(.,'Processing capacity')]",
    var d = document.evaluate("//table[@class = 'layout listing3']",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(1);
    var t = d.firstChild;
    var temp = [];
    temp[0] = t.childNodes[4].childNodes[1].textContent;
    temp[1] = t.childNodes[5].childNodes[1].textContent;
    return temp;
}

function attachPillage() {
    try {
        var table = document.evaluate("//table[@class = 'layout listing3']",
            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(1);
        table = table.firstChild.insertRow(9);
        if (!table) return;
        var econ = checkPillageAmount();
        var minpillage = Math.floor(6 * Math.pow(econ[1] - (econ[0] * .7), 2));
        table.setAttribute('align', 'center');
        var element = table.insertCell(0);
        element.textContent = "Pillage";
        element = table.insertCell(1);
        element.textContent = minpillage;
        element.setAttribute("colspan", "2");
        //  console.log("Minimum Pillage: " + minpillage+ " Econ: " + econ[0] + " Income: " + econ[1]);
    } catch (e) {
        console.log("Line Number: " + e.lineNumber + "\nattachPillage(): " + e);
    }
}
//==========================================
// Remove board redirects from links
//==========================================
function removeRedirects() {
    var i;
    try {
        var command = "//body/table";
        if (location.indexOf('guild.aspx') != -1) command = command + "[last()-1]";
        else command = command + "[last()]";
        var table = document.evaluate(command, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!table) return;
        var links = table.getElementsByTagName('a');
        for (i = 0; i < links.length; i++) {
            var tlink = links[i].getAttribute("href");
            //console.log ("\nlink: "+tlink+"\nFixed link: "+tlink.replace(/redirect\.aspx\?/g,''));
            links[i].setAttribute("href", tlink.replace(/redirect\.aspx\?/g, '') + "");
        }
    } catch (e) {
        console.log("\nremoveRedirects(): " + e + " Line Number: " + e.lineNumber);
    }
}
//-----------------------------------
//Clear hidden iframes on battlcalc
//-----------------------------------
function cleanAdverts(tag) {
    var adverts = document.getElementsByTagName(tag);
    if (adverts.length) {
        for (var i = adverts.length; i > 0;) {
            var ref = adverts[--i];
            ref.setAttribute('src', 'javascript: void(0)');
            ref.parentNode.removeChild(ref);
        }
    }
}

//==========================================
//Config Page
//==========================================

var PROFIT_SUM_KEY = "config_profitsum";
var HIGHLIGHT_COMMANDERS_KEY = "config_commanderHighlight";
var HIGHLIGHT_COMMANDER_CONSTRUCTION = "config_highlightConstuctionCom";
var HIGHLIGHT_COMMANDER_RESEARCH = "config_highlightResearchCom";
var HIGHLIGHT_COMMANDER_PRODUCTION = "config_highlightProductionCom";
var HIGHLIGHT_COMMANDER_DEFENSE = "config_highlightDefenseCom";
var HIGHLIGHT_COMMANDER_TACTICAL = "config_highlightTacticalCom";
var HIGHLIGHT_COMMANDER_LOGISTICS = "config_highlightLogisticsCom";

var QUICK_BAR = "config_quickbar";
var QUICK_BAR_FIX = "config_quickbarFix";

var HIGHLIGHT_TRADE_PARTNERS_KEY = "config_highlightTradePartners";
var HIGHLIGHT_POOR_TRADES_KEY = "config_highlightPoorTrades";
var POOR_TRADE_UPPER_THRESHOLD_KEY = "config_poorTradeUpperThreshold";
var POOR_TRADE_LOWER_THRESHOLD_KEY = "config_poorTradeLowerThreshold";
var HIGHLIGHT_DUPLICATE_TRADE_PARTNERS_KEY = "config_highlightDuplicateTradePartners";
var SHOW_TOTAL_FLEET_ROW_KEY = "config_showTotalFleetRow";
var SHOW_ATTACK_SIZE_KEY = "config_showFleetAttackSize";
var ENABLE_PRODUCTION_PRESETS_KEY = "config_enableProductionPresets";
var ADD_EMPIRE_SUBMENU_KEY = "config_addEmpireSubmenu";
var MOVE_EMPIRE_SUBMENU_KEY = "config_moveEmpireSubmenu";
var INSERT_BATTLECALC_LINK_KEY = "config_insertBattleCalcLink";
var ADJUST_TITLES_KEY = "config_adjustTitles";
var FIX_QUEUES_KEY = "config_fixQueues";
var HIGHLIGHT_PLAYERS_KEY = "config_highlightPlayers";
var PLAYER_COLORS_KEY = "config_playerColors";
var MY_GUILD_KEY = "config_myGuild";
var MY_NAME_KEY = "config_myName";
var MY_GUILD_COLOUR_KEY = "config_myGuildColour";
var ENEMY_GUILDS_KEY = "config_enemyGuilds";
var NAPPED_GUILDS_KEY = "config_nappedGuilds";
var ALLIED_GUILDS_KEY = "config_alliedGuilds";
var ENEMY_GUILDS_COLOUR_KEY = "config_enemyGuildColour";
var NAPPED_GUILDS_COLOUR_KEY = "config_nappedGuildColour";
var ALLIED_GUILDS_COLOUR_KEY = "config_alliedGuildColour";
var HIGHLIGHT_TRADE_COLOUR_KEY = "config_highlightPlayerColor";
var HIGHLIGHT_TIMER_CSS_KEY = "config_highlightTimerCss"; // FIXME
var HIGHLIGHT_BASE_COLOUR_KEY = "config_highlightBaseColor";
var HIGHLIGHT_SYSTEM_COLOUR_KEY = "config_highlightSystemColor";
var HIGHLIGHT_CUS_SCANNER_KEY = "config_customScannerCoord";
var HIGHLIGHT_CUSBASE_COLOUR_KEY = "config_highlightCustomBaseColor";
var HIGHLIGHT_CUSSYSTEM_COLOUR_KEY = "config_highlightCustomSystemColor";
var STRUCT_COLOUR1_KEY = "config_structColour1";
var STRUCT_COLOUR2_KEY = "config_structColour2";
var STRUCT_COLOUR3_KEY = "config_structColour3";
var ADD_FLEET_MOVE_LINK_KEY = "config_addFleetMoveLink";
var AUTOSET_GUILD_KEY = "config_autosetGuild";
var AUTOSET_GUILD_NOTIFY_KEY = "config_autosetGuildNotify";
var SUM_FLEETS_KEY = "config_sumFleets";
var SUM_FLEETS_BASE = "config_sumFleetsBase";
var HIDE_ALLI_FLEETS = "config_hideAlliFleets";
var FLEET_INFO_POPUP = "config_fleetInfoPopUp";
var FLEET_INFO_POPUP_TIMER = "config_fleetInfoPopUpTime";
var FLEET_INFO_POPUP_FADE = "config_fleetInfoPopUpFade";
var SUM_CREDITS_KEY = "config_sumCredits";
var FORMAT_NUMBERS_KEY = "config_formatNumbers";
var NUMBER_DELIMETER_KEY = "config_numberDelimeter";
var CLONE_BASE_LINKS_KEY = "config_cloneBaseLinks";
var CLONE_FLEET_LINKS_KEY = "config_cloneFleetLinks";
var MOVE_GALAXY_LINKS_KEY = "config_moveGalaxyLinks";
var STRUCTURES_GOALS_KEY = "config_structuresGoals";
var INSERT_MOVE_PRESETS_KEY = "config_insertMovePresets";
var MAX_QUEUES_KEY = "config_maxQueues";
var SHOW_EXECUTION_TIME_KEY = "config_showExecutionTime";
var NAME_LOCATIONS_KEY = "config_nameLocations";
var LOCATION_NAMES_KEY = "config_locationNames";
var SHOW_PILLAGE_KEY = "config_showPillage";
var FORMAT_SCANNER_KEY = "config_formatScanner";
var REMOVE_REDIRECT_KEY = "config_removeRedirect";
var CONSTRUCT_ENHANCE_KEY = "config_enhanceCons";
var SCRIPT_BATTLECALC_KEY = "config_battlecalcScript";
var HIDE_HELP_TEXT_KEY = "config_hideHelpText";

function configBody(tab) {
    var url = location;
    GM_addStyle('.configHeading {' +
        '   color: gold;' +
        '   font-weight: bold;' +
        '}' +
        '.featureName {' +
        '   color: #EEDC82;' +
        '}' +
        '.subFeatureName {' +
        '   color: #8B814C;' +
        '   padding-left:20' +
        '}' +
        '.footnote {' +
        '   color: gold;' +
        '   font-weight: bold;' +
        '}');
    var width = getTableWidth();
    if (width < 900) width = 900;
    var newbody = "<div align='center'>" +
        "<h2>AE Bits - Settings</h2>" +
        "<small>Script Version: " + scriptVersion + "<span id='pageDate'></span></small> <br/>";
    //newbody += "<input type='button' value='Check For Updates' id='updateCheckButton' onClick='if(document.getElementById(\"updateCheckButton\").value == \"Check For Updates\"){document.getElementById(\"updateCheckButton\").value = \"Checking For Updates..\";}else{document.getElementById(\"updateCheckButton\").value = \"Check For Updates\";}' />";
    //newbody += "<p><div>Direct updates, feedback, and request to <a href='http://www.vig.vg/AE/index.php' target='_new'>Vigs AE Page(mention its clever's version)</a>.</p>"+
    newbody += "<table width='" + width + "'>" +
        "<tr><td></td><th width='230'>Feature</th><th>Description</th><th>Applied to page(s)</th></tr>" +
        "<tr><td colspan='5'></td></tr>";

    //if (!tab)
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>General</td></tr>" +

        "<tr><td><input type='checkbox' id='config_adjustTitles' /></td><td class='featureName'>Adjust Page Titles</td>" +
        "<td style='padding-left:20'>Shortens page titles for better viewing with multiple tabs. Prefixes page titles with server.</td><td style='padding-left:20'>All</td></tr>" +

        "<tr><td><input type='checkbox' id='config_addEmpireSubmenu' /></td><td class='featureName'>Add empire sub-menu</td>" +
        "<td style='padding-left:20'>Inserts the empire sub menu.</td><td style='padding-left:20'>All except fleet movement</td></tr>" +

        "<tr><td><input type='checkbox' id='config_moveEmpireSubmenu' /></td><td class='featureName'>Move empire sub-menu</td>" +
        "<td style='padding-left:20'>Moves the empire sub menu above adverts in free accounts.</td><td style='padding-left:20'>Empire pages</td></tr>" +

        "<tr><td><input type='checkbox' id='config_insertBattleCalcLink' /></td><td class='featureName'>Add battle calc link</td>" +
        "<td style='padding-left:20'>Inserts a link to Vig's Battle Calculator.</td><td style='padding-left:20'>All</td></tr>" +

        "<tr><td><input type='checkbox' id='config_formatNumbers' /></td><td class='featureName'>Format numbers</td>" +
        "<td style='padding-left:20'>Formats fleet size numbers for better readability.</td><td style='padding-left:20'>Base pages</td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Delimeter: <input type='text' id='config_numberDelimeter' style='width:25;' /></td><td style='padding-left:20'></td><td></td></tr>" +


        "<tr><td colspan='5'></td></tr>";

    //if (tab == "Highlights")
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Player Highlights</td></tr>" +

        "<tr><td><input type='checkbox' id='config_highlightPlayers' /></td><td class='featureName'>Highlight players</td>" +
        "<td style='padding-left:20'>Highlights players according to guild.<br /><b>Note:</b>This overrides colour from the player highlight feature.</td><td style='padding-left:20'>All</td></tr>" +

        "<tr><td class='featureName' colspan='2'><input type='checkbox' id='config_autosetGuild' /> Find guild</td>" +
        "<td style='padding-left:20'>Attempt to autoset guild when on profile page.</td><td style='padding-left:20'>Profile</td></tr>" +

        "<tr><td colspan='3' class='subfeatureName'>My Guild Tag<a href='#foot2'><sup class='footnote'>2</sup></a>: <input type='text' id='config_myGuild' style='width:100;' /></td>" +
        "<td class='subFeatureName' width='200'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup></a>: <input type='text' id='config_myGuildColour' style='width:100;' /></td></tr>" +

        "<tr><td colspan='4' class='subfeatureName'>My Name</a>: <input type='text' id='config_myName' style='width:100;' /></td>" +

        "<tr><td colspan='2' class='subfeatureName'><input type='checkbox' id='config_autosetGuildNotify' /> Show reminder</td>" +
        "<td style='padding-left:20'>Notifies you every 3 weeks to view your profile page.</td><td style='padding-left:20'>All pages</td></tr>" +

        "<tr><td colspan='3' class='subfeatureName'>Allied/Pact Guild Tags<a href='#foot2'><sup class='footnote'>2</sup></a>: <input type='text' id='config_alliedGuilds' style='width:90%;' /></td>" +
        "<td class='subFeatureName' width='200'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup></a>: <input type='text' id='config_alliedGuildColour' style='width:100;' /></td></tr>" +

        "<tr><td colspan='3' class='subfeatureName'>NAP Guild Tags<a href='#foot2'><sup class='footnote'>2</sup></a>: <input type='text' id='config_nappedGuilds' style='width:90%;' /></td>" +
        "<td class='subFeatureName' width='200'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup></a>: <input type='text' id='config_nappedGuildColour' style='width:100;' /></td></tr>" +

        "<tr><td colspan='3' class='subfeatureName'>Enemy Guild Tags<a href='#foot2'><sup class='footnote'>2</sup></a>: <input type='text' id='config_enemyGuilds' style='width:90%;' /></td>" +
        "<td class='subFeatureName' width='200'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup></a>: <input type='text' id='config_enemyGuildColour' style='width:100;' /></td></tr>" +

        "<tr><td colspan='4' class='subfeatureName'>Individual Player Colour Overrides<a href='#foot2'><sup class='footnote'>3</sup></a>: <input type='text' id='config_playerColors' style='width:90%;' /></td></tr>" +

        "<tr><td><input type='checkbox' id='config_nameLocations' /></td><td class='featureName'>Name Locations</td><td style='padding-left:20'>Replaces location link text with location names.</td>" +
        "<td style='padding-left:20'>All Except bookmarks</td></tr>" +

        "<tr><td colspan='4' class='subfeatureName'>Base Names<a href='#foot2'><sup class='footnote'>4</sup></a>:<br />" +
        "<input type='text' id='config_locationNames' style='width:90%;' /></td></td></tr>" +

        "<tr><td colspan='5'></td></tr>";
    //if (tab == "Map")
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Map Enhancements</td></tr>" +

        "<tr><td><input type='checkbox' id='config_cloneBaseLinks' /></td><td class='featureName'>Insert base links by map</td>" +
        "<td style='padding-left:20'>Displays base links next to galaxy map so both are visible simultaneously.</td><td style='padding-left:20'>Bases</td></tr>" +

        "<tr><td><input type='checkbox' id='config_cloneFleetLinks' /></td><td class='featureName'>Insert fleet links by map</td>" +
        "<td style='padding-left:20'>Displays fleet links next to galaxy map so both are visible simultaneously.</td><td style='padding-left:20'>Fleets</td></tr>" +

        "<tr><td><input type='checkbox' id='config_moveGalaxyLinks' /></td><td class='featureName'>Move galaxy links</td>" +
        "<td style='padding-left:20'>Moves the galaxy links above the galaxy maps to the bottom of the page.</td><td style='padding-left:20'>Fleets & Bases</td></tr>" +

        "<tr><td colspan='5'></td></tr>";
    //if (tab == "Trade")
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Trade</td></tr>" +

        "<tr><td><input type='checkbox' id='config_highlightTradePartners' /></td><td class='featureName'>Highlight trade partners</td>" +
        "<td style='padding-left:20'>Highights all links to trade partners in blue.</td><td style='padding-left:20'>All</td></tr>" +

        "<tr><td colspan='3' class='subfeatureName'>Highlight Colour<a href='#foot1'><sup class='footnote'>1</sup></a>: <input type='text' id='config_highlightPlayerColor'style='width:100;' /></td><td></td></tr>" +

        "<tr><td><input type='checkbox' id='config_highlightDuplicateTradePartners' /></td><td class='featureName'>Highlight duplicate trade partners</td>" +
        "<td style='padding-left:20'>Highlights duplicate trade partners.</td><td style='padding-left:20'>Empire trade</td></tr>" +

        "<tr><td><input type='checkbox' id='config_highlightPoorTrades' /></td><td class='featureName'>Highlight unbalanced trades</td>" +
        "<td style='padding-left:20'>Highlights eco values that are outside of the set thresholds.</td><td style='padding-left:20'>Empire trade</td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Upper threshold: <input type='text' id='config_poorTradeUpperThreshold'style='width:25;' /></td>" +
        "<td style='padding-left:20'>Trades with eco bases greater than this amount above your own are highlighted in orange.</td><td></td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Lower threshold: <input type='text' id='config_poorTradeLowerThreshold' style='width:25;' /></td>" +
        "<td style='padding-left:20'>Trades with eco bases lower than this amount below your own are highlighted in red.</td><td></td></tr>" +

        "<tr><td colspan='5'></td></tr>";

    //if (tab == "Structures")
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Structures / Bases</td></tr>" +

        "<tr><td><input type='checkbox' id='config_structuresGoals' /></td><td class='featureName'>Advanced structures page</td><td style='padding-left:20'>Colour codes structure values based on progress.</td>" +
        "<td style='padding-left:20'>Empire structures</td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Colour of started:</td>" +
        "<td class='subFeatureName'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup></a>: <input type='text' id='config_structColour1' style='width:100;' /></td><td></td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Colour of not started:</td>" +
        "<td class='subFeatureName'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup></a>: <input type='text' id='config_structColour2' style='width:100;' /></td><td></td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Colour of completed:</td>" +
        "<td class='subFeatureName'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup></a>: <input type='text' id='config_structColour3' style='width:100;' /></td><td></td></tr>" +

        "<tr><td><input type='checkbox' id='config_showPillage' /></td><td class='featureName'>Insert estimated pillage on bases</td>" +
        "<td style='padding-left:20'>Displays rough guide to amount pillage would be worth per econ.</td><td style='padding-left:20'>Bases</td></tr>" +

        "<tr><td colspan='5'></td></tr>";

    //if (tab == "Misc")
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Credits History</td></tr>" +

        "<tr><td><input type='checkbox' id='config_sumCredits' /></td><td class='featureName'>Credits Summary</td><td style='padding-left:20'>Displays a summary of credits.</td>" +
        "<td style='padding-left:20'>Credits History</td></tr>" +

        "<tr><td colspan='5'></td></tr>";

    //if (tab == "Fleet")
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Fleet</td></tr>" +

        "<tr><td><input type='checkbox' id='config_insertMovePresets' /></td><td class='featureName'>Extra movement presets</td><td style='padding-left:20'>Adds extra presets to existing 'all' and " +
        "'none'.</td><td style='padding-left:20'>Fleet move</td></tr>" +

        "<tr><td><input type='checkbox' id='config_showTotalFleetRow' /></td><td class='featureName'>Show total fleet row</td><td style='padding-left:20'>Adds a row totalling quantities of each " +
        "ship.</td><td style='padding-left:20'>Empire fleet</td></tr>" +

        "<tr><td><input type='checkbox' id='config_showFleetAttackSize' /></td><td class='featureName'>Show fleet attack size</td><td style='padding-left:20'>Attack fleet size exludes carriers, fleet " +
        "carriers, recyclers, outpost ships, and scout ships.</td><td style='padding-left:20'>Empire fleet</td></tr>" +

        "<tr><td><input type='checkbox' id='config_addFleetMoveLink' /></td><td class='featureName'>Insert fleet move link</td><td style='padding-left:20'>Makes fleet size(s) a link directly " +
        "to the fleet movement screen.</td><td style='padding-left:20'>Empire fleet</td></tr>" +

        "<tr><td><input type='checkbox' id='config_sumFleets' /></td><td class='featureName'>Sum guild fleets</td><td style='padding-left:20'>Inserts a table with fleet totals by guild.</td>" +
        "<td style='padding-left:20'>Base pages</td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'><input type='checkbox' id='config_sumFleetsBase' />Show On Base Page</td>" +
        "<td style='padding-left:20'>Shows the guild fleet summary on the base overview page if checked.</td><td></td></tr>" +

        "<tr><td><input type='checkbox' id='config_fleetInfoPopUp' /></td><td class='featureName'>Fleet Info Popup</td><td style='padding-left:20'>To add a popup next to the fleet name when you hover over a fleets name. This popup contains what units are in that fleet</td><td style='padding-left:20'>Fleet, Map and Base pages</td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Popup Display Time: <input type='text' id='config_fleetInfoPopUpTime' style='width:25;' /></td>" +
        "<td style='padding-left:20'>This sets how long the popup will show before it dissapears.</td><td></td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'><input type='checkbox' id='config_fleetInfoPopUpFade' />Fade Popup In/Out</td>" +
        "<td style='padding-left:20'>This sets if the pop up will fade in and out or just appear/dissapear.</td><td></td></tr>" +

        "<tr><td><input type='checkbox' id='config_hideAlliFleets' /></td><td class='featureName'>Hide Alli Fleets On Attack Page</td><td style='padding-left:20'>Hides all Allied and NAPd guilds on the attack page, as well as your own guild.</td>" +
        "<td style='padding-left:20'>Fleet Attack pages</td></tr>" +

        "<tr><td colspan='5'></td></tr>";

    //if (tab == "ConsProd")
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Construction / Production</td></tr>" +

        "<tr><td><input type='checkbox' id='config_enableProductionPresets' /></td><td class='featureName'>Production presets</td>" +
        "<td style='padding-left:20'>This feature allows production values to be filled with customizable preset values. Time values override quantity values.</td><td style='padding-left:20'>Production</td></tr>" +

        "<tr><td><input type='checkbox' id='config_fixQueues' /></td><td class='featureName'>Enhanced queue display</td><td style='padding-left:20'>Fixes queues footer of screen so it is " +
        "always visible.</td><td style='padding-left:20'>Structures, Defenses, Production, and Research</td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Max queue size: <input type='text' id='config_maxQueues' style='width:25;' />" +
        "</td><td style='padding-left:20'>Queue list will not be fixed when queues size is greater than this number.</td><td></td></tr>" +

        "<tr><td><input type='checkbox' id='config_enhanceCons' /></td><td class='featureName'>Construction enhancer script.</td>" +
        "<td style='padding-left:20'>Removes building descriptions as well as shows you which building is the best to build for areas you wish to improve(Energy, Production, Construction etc).</td><td style='padding-left:20'>All</td></tr>" +
        "<tr><td colspan='5'></td></tr>";

    //if (tab == "Scanners")
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Reports</b></td></tr>" +

        "<tr><td><input type='checkbox' id='config_formatScanner' /></td><td class='featureName'>Format scanner</td><td style='padding-left:20'>Highlights your own bases on the scanner page." +
        "</td><td style='padding-left:20'>Scanner</td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Base highlighting colour: </td><td style='padding-left:20' class='subFeatureName'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup>" +
        "</a>: <input type='text' id='config_highlightBaseColor'style='width:100;'/></td><td style='padding-left:20'>Scanner</td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>System highlighting colour: </td><td style='padding-left:20' class='subFeatureName'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup>" +
        "</a>: <input type='text' id='config_highlightSystemColor'style='width:100;'/></td><td style='padding-left:20'>Scanner</td></tr>" +

        "<tr><td colspan='4' class='subfeatureName'>Custom Coords to highlight<a href='#foot2'><sup class='footnote'>4</sup></a>:<br />" +
        "<input type='text' id='config_customScannerCoord' style='width:90%;' /></td></td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Custom Coords highlighting colour: </td><td style='padding-left:20' class='subFeatureName'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup>" +
        "</a>: <input type='text' id='config_highlightCustomBaseColor'style='width:100;'/></td><td style='padding-left:20'>Scanner</td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Custom Coords System highlighting colour: </td><td style='padding-left:20' class='subFeatureName'>Highlight Colour<a href='#foot2'><sup class='footnote'>1</sup>" +
        "</a>: <input type='text' id='config_highlightCustomSystemColor'style='width:100;'/></td><td style='padding-left:20'>Scanner</td></tr>" +

        "<tr><td colspan='5'></td></tr>";

    //if (tab == "Misc")
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Misc</b></td></tr>" +

        "<tr><td><input type='checkbox' id='config_removeRedirect' /></td><td class='featureName' colspan='2'>Disable redirection on board links.</td>" +
        "<td style='padding-left:20'>Board/Guild pages only</td></tr>" +
        "<tr><td colspan='5'></td></tr>";

    //QB
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Quick Bar</b></td></tr>" +
        "<tr><td><input type='checkbox' id='config_quickbar' /></td><td class='featureName'>Enable Quick Bar.</td>" +
        "<td style='padding-left:20'>Select this to enable the quick bar which will appear on the left hand side of the screen.</td><td style='padding-left:20'>All</td></tr>" +

        "<tr><td><input type='checkbox' id='config_quickbarFix' /></td><td class='featureName'>Fix Quick Bar.</td>" +
        "<td style='padding-left:20'>Select this to fix the quick bar to the top of the screen (it will follow as you scroll). Disable to leave it at the top of the page (wont follow as you scroll)</td><td style='padding-left:20'>All</td></tr>" +

        "<tr><td colspan='5'></td></tr>";

    //if (tab == "Experimental")
    newbody = newbody + "<tr><td colspan='5'></td></tr>" +
        "<tr><td colspan='5' class='configHeading'>Battle Enhancements</td></tr>" +

        "<tr><td><input type='checkbox' id='config_battlecalcScript' /></td><td class='featureName'>Battlecalc on attack pages.</td>" +
        "<td style='padding-left:20'>Shows the results of a battle before you make the attack.</td><td style='padding-left:20'>All</td></tr>" +

        "<tr><td><input type='checkbox' id='config_profitsum' /></td><td class='featureName'>Display Profit/Loss calculations</td>" +
        "<td style='padding-left:20'>Select this to add a profit/loss calcualtion to the bottom of battle reports. It shows how much money the attacker gained or lost in the attack.</td><td style='padding-left:20'>Battle Reports</td></tr>" +

        "<tr><td colspan='5'></td></tr>";

    //if (tab == "Commanders")
    newbody = newbody + "<tr><td colspan='5'></td></tr>" +
        "<tr><td colspan='5' class='configHeading'>Commander Options</td></tr>" +

        "<tr><td><input type='checkbox' id='config_commanderHighlight' /></td><td class='featureName'>Highlight Commander Types</td>" +
        "<td style='padding-left:20'>Shows names of commanders of a certain task in a specified color.</td><td style='padding-left:20'>Commander, Bases</td></tr>" +

        "<tr><td colspan='2' class='subfeatureName'>Construction Commander: </td><td style='padding-left:20' class='subFeatureName'>Highlight Css<a href='#foot2'>" +
        "<sup class='footnote'>1</sup></a>: <input type='text' id='config_highlightConstuctionCom'style='width:100;'/></td><td></td></tr>" +
        "<tr><td colspan='2' class='subfeatureName'>Research Commander: </td><td style='padding-left:20' class='subFeatureName'>Highlight Css<a href='#foot2'>" +
        "<sup class='footnote'>1</sup></a>: <input type='text' id='config_highlightResearchCom'style='width:100;'/></td><td></td></tr>" +
        "<tr><td colspan='2' class='subfeatureName'>Production Commander: </td><td style='padding-left:20' class='subFeatureName'>Highlight Css<a href='#foot2'>" +
        "<sup class='footnote'>1</sup></a>: <input type='text' id='config_highlightProductionCom'style='width:100;'/></td><td></td></tr>" +
        "<tr><td colspan='2' class='subfeatureName'>Defense Commander: </td><td style='padding-left:20' class='subFeatureName'>Highlight Css<a href='#foot2'>" +
        "<sup class='footnote'>1</sup></a>: <input type='text' id='config_highlightDefenseCom'style='width:100;'/></td><td></td></tr>" +
        "<tr><td colspan='2' class='subfeatureName'>Tactical Commander: </td><td style='padding-left:20' class='subFeatureName'>Highlight Css<a href='#foot2'>" +
        "<sup class='footnote'>1</sup></a>: <input type='text' id='config_highlightTacticalCom'style='width:100;'/></td><td></td></tr>" +
        "<tr><td colspan='2' class='subfeatureName'>Logistics Commander: </td><td style='padding-left:20' class='subFeatureName'>Highlight Css<a href='#foot2'>" +
        "<sup class='footnote'>1</sup></a>: <input type='text' id='config_highlightLogisticsCom'style='width:100;'/></td><td></td></tr>" +
        "<tr><td colspan='5'></td></tr>";

    //if (tab == "Debug")
    newbody = newbody + "<tr><td colspan='5' class='configHeading'>Debug</td></tr>" +

        "<tr><td><input type='checkbox' id='config_debug' /></td><td class='featureName'>Console log</td><td style='padding-left:20'>Logs to FireBug console. Must have Firebug extension installed.</td>" +
        "<td style='padding-left:20'>All</td></tr>" +

        "<tr><td colspan='5' class='subfeatureName'>" +
        "<Input type = radio Name ='logLevel' Value = '1'>Log</input><br />" +
        "<Input type = radio Name ='logLevel' Value = '2'>Info</input><br />" +
        "<Input type = radio Name ='logLevel' Value = '3'>Warn</input><br />" +
        "<Input type = radio Name ='logLevel' Value = '4'>Error</input><br />" +
        "</tr></td>" +
        /*
            "<tr><td><input type='checkbox' id='config_notification' /></td><td class='featureName'>Notifications</td><td style='padding-left:20'>Allows you to adjust display of information.</td>"+
            "<td style='padding-left:20'>All</td></tr>"+

            "<tr><td colspan='5' class='subfeatureName'>"+
            "<Input type = radio Name ='notificationLevel' Value = '1'>Show all (default).</input><br />"+
            "<Input type = radio Name ='notificationLevel' Value = '2'>Hide full size notifications after a few seconds.</input><br />"+
            "<Input type = radio Name ='notificationLevel' Value = '3'>Hide full size notifications.</input><br />"+
            "<Input type = radio Name ='notificationLevel' Value = '4'>Hide all notifications </input><br />"+
            "</tr></td>"+
        */
        "<tr><td><input type='checkbox' id='config_showExecutionTime' /></td><td class='featureName'>Show Execution Time</td><td style='padding-left:20'>Shows script execution time at bottom of page.</td>" +
        "<td style='padding-left:20'>All</td></tr>" +

        "<tr height='15px'><td colspan='4' /></tr>";

    newbody = newbody + "<tr><td colspan='4' align='center'><input id='saveButton' type=submit name='Save' value='Save' /> - <input id='resetButton' type=submit name='Reset to defaults' value='Reset to defaults' /></td></tr>" +
        "</table>" +
        "<small>This configuration screen is for the Astro Empires Extras Greasemonkey script.</small><br /><br />" +
        "<table>" +
        "<tr><td><a name='foot1'>1.</a> Colour definitions must be in valid css colour formats. See CSS colour samples <a href='http://www.somacon.com/p142.php' target='_new'>here</a>.</td></tr>" +
        "<tr><td><a name='foot2'>2.</a> Guild definitions must be in the following format: <b>[Guildname],[Guildname2],...</b><br>Include the square brackets</td></tr>" +
        "<tr><td><a name='foot2'>3.</a> Colour definitions must be in the following format: <b>player1=csscolour,player2=csscolour2</b><br>" +
        "Do NOT include player's guild tag and DO include the '#' with css hex values.</td></tr>" +
        "<tr><td><a name='foot2'>4.</a> Location name definitions must be in the following format: <b>location=name,location2=name2</b></td></tr>" +
        "</table>" +
        "<br /><br /><a id='backLink' href='" + url + "'>Return to Astro Empires</a>" +
        "</div>";
    return newbody;
}

function showConfig(page) {
    console.log("Loading config for "+getServer());
    if (DEBUGNEWCODE) {
        if ($('Config')) {
            //console.log("Removing old notify: "+document.body.firstChild.innerHTML);
            document.body.removeChild($('Config'));
        }
        //  create a block element
        var b = document.createElement('div');
        b.id = 'Config';
        //  b.style.cssText='top:-9999px;left:-9999px;position:absolute;white-space:nowrap;';
        // Get width of normal table and extend a border around
        var width = getTableWidth();
        if (width < 900) width = 900;
        width += 40;
        //
        b.style.cssText = 'position:absolute;white-space:nowrap;z-index:5;background:black;width:' + width + 'px;';
        b.className = "config";
        //  insert block in to body
        b = document.body.insertBefore(b, document.body.firstChild);
        //  write HTML fragment to it
        b.innerHTML = configBody(page);
        //  save width/height before hiding
        var bw = b.offsetWidth;
        var bh = b.offsetHeight;
        //  hide, move and then show
        b.style.display = 'none';

        b.style.top = "20";
        b.style.left = document.body.clientWidth / 2 + document.body.scrollLeft - bw / 2;

        //console.log("window height: "+document.body.clientHeight);
        //console.log("window width: "+document.body.clientWidth);
        //console.log("window scroll x: "+document.body.scrollLeft);
        //console.log("window scroll y: "+document.body.scrollTop);

        b.style.display = 'block';
    } else {
        document.body.innerHTML = "<html><body>" + configBody(page) + "</body></html>";
    }
    loadConfig();
    $('saveButton').addEventListener('click', function(event) {
        saveConfig();
    }, true);
    $('resetButton').addEventListener('click', function(event) {
        resetConfig();
    }, true);
    $('config_highlightPoorTrades').addEventListener('change', function(event) {
        poorTradesChanged();
    }, true);

}

//==========================================
//Save/Load Config
//==========================================

function saveConfig() {
    console.log("Saving config");
    try {

        setSetting(PROFIT_SUM_KEY, document.getElementById(PROFIT_SUM_KEY).checked);
        setSetting(HIGHLIGHT_COMMANDERS_KEY, document.getElementById(HIGHLIGHT_COMMANDERS_KEY).checked);
        setSetting(HIGHLIGHT_COMMANDER_CONSTRUCTION, document.getElementById(HIGHLIGHT_COMMANDER_CONSTRUCTION).value);
        setSetting(HIGHLIGHT_COMMANDER_RESEARCH, document.getElementById(HIGHLIGHT_COMMANDER_RESEARCH).value);
        setSetting(HIGHLIGHT_COMMANDER_PRODUCTION, document.getElementById(HIGHLIGHT_COMMANDER_PRODUCTION).value);
        setSetting(HIGHLIGHT_COMMANDER_DEFENSE, document.getElementById(HIGHLIGHT_COMMANDER_DEFENSE).value);
        setSetting(HIGHLIGHT_COMMANDER_TACTICAL, document.getElementById(HIGHLIGHT_COMMANDER_TACTICAL).value);
        setSetting(HIGHLIGHT_COMMANDER_LOGISTICS, document.getElementById(HIGHLIGHT_COMMANDER_LOGISTICS).value);
        setSetting(QUICK_BAR, document.getElementById(QUICK_BAR).checked);
        setSetting(QUICK_BAR_FIX, document.getElementById(QUICK_BAR_FIX).checked);
        setSetting(HIDE_ALLI_FLEETS, document.getElementById(HIDE_ALLI_FLEETS).checked);

        setSetting(HIGHLIGHT_TRADE_PARTNERS_KEY, $(HIGHLIGHT_TRADE_PARTNERS_KEY).checked);
        setSetting(HIGHLIGHT_POOR_TRADES_KEY, $(HIGHLIGHT_POOR_TRADES_KEY).checked);
        setSetting(POOR_TRADE_UPPER_THRESHOLD_KEY, $(POOR_TRADE_UPPER_THRESHOLD_KEY).value);
        setSetting(POOR_TRADE_LOWER_THRESHOLD_KEY, $(POOR_TRADE_LOWER_THRESHOLD_KEY).value);
        setSetting(HIGHLIGHT_DUPLICATE_TRADE_PARTNERS_KEY, $(HIGHLIGHT_DUPLICATE_TRADE_PARTNERS_KEY).checked);
        setSetting(SHOW_TOTAL_FLEET_ROW_KEY, $(SHOW_TOTAL_FLEET_ROW_KEY).checked);
        setSetting(SHOW_ATTACK_SIZE_KEY, $(SHOW_ATTACK_SIZE_KEY).checked);
        setSetting(ADD_FLEET_MOVE_LINK_KEY, $(ADD_FLEET_MOVE_LINK_KEY).checked);
        setSetting(ENABLE_PRODUCTION_PRESETS_KEY, $(ENABLE_PRODUCTION_PRESETS_KEY).checked);
        setSetting(ADD_EMPIRE_SUBMENU_KEY, $(ADD_EMPIRE_SUBMENU_KEY).checked);
        setSetting(MOVE_EMPIRE_SUBMENU_KEY, $(MOVE_EMPIRE_SUBMENU_KEY).checked);
        setSetting(INSERT_BATTLECALC_LINK_KEY, $(INSERT_BATTLECALC_LINK_KEY).checked);
        setSetting(ADJUST_TITLES_KEY, $(ADJUST_TITLES_KEY).checked);
        setSetting(FIX_QUEUES_KEY, $(FIX_QUEUES_KEY).checked);
        setSetting(MAX_QUEUES_KEY, $(MAX_QUEUES_KEY).value);
        setSetting(HIGHLIGHT_PLAYERS_KEY, $(HIGHLIGHT_PLAYERS_KEY).checked);
        setSetting(PLAYER_COLORS_KEY, escape($(PLAYER_COLORS_KEY).value));
        setSetting(MY_GUILD_KEY, escape($(MY_GUILD_KEY).value));
        setSetting(MY_NAME_KEY, escape(document.getElementById(MY_NAME_KEY).value));
        setSetting(ALLIED_GUILDS_KEY, escape($(ALLIED_GUILDS_KEY).value));
        setSetting(NAPPED_GUILDS_KEY, escape($(NAPPED_GUILDS_KEY).value));
        setSetting(ENEMY_GUILDS_KEY, escape($(ENEMY_GUILDS_KEY).value));
        setSetting(MY_GUILD_COLOUR_KEY, escape($(MY_GUILD_COLOUR_KEY).value));
        setSetting(ENEMY_GUILDS_COLOUR_KEY, escape($(ENEMY_GUILDS_COLOUR_KEY).value));
        setSetting(NAPPED_GUILDS_COLOUR_KEY, escape($(NAPPED_GUILDS_COLOUR_KEY).value));
        setSetting(ALLIED_GUILDS_COLOUR_KEY, escape($(ALLIED_GUILDS_COLOUR_KEY).value));
        setSetting(HIGHLIGHT_TRADE_COLOUR_KEY, escape($(HIGHLIGHT_TRADE_COLOUR_KEY).value));
        setSetting(HIGHLIGHT_BASE_COLOUR_KEY, escape($(HIGHLIGHT_BASE_COLOUR_KEY).value));
        setSetting(HIGHLIGHT_SYSTEM_COLOUR_KEY, escape($(HIGHLIGHT_SYSTEM_COLOUR_KEY).value));
        setSetting(HIGHLIGHT_CUS_SCANNER_KEY, escape($(HIGHLIGHT_CUS_SCANNER_KEY).value));
        setSetting(HIGHLIGHT_CUSBASE_COLOUR_KEY, escape($(HIGHLIGHT_CUSBASE_COLOUR_KEY).value));
        setSetting(HIGHLIGHT_CUSSYSTEM_COLOUR_KEY, escape($(HIGHLIGHT_CUSSYSTEM_COLOUR_KEY).value));
        setSetting(STRUCT_COLOUR1_KEY, escape($(STRUCT_COLOUR1_KEY).value));
        setSetting(STRUCT_COLOUR2_KEY, escape($(STRUCT_COLOUR2_KEY).value));
        setSetting(STRUCT_COLOUR3_KEY, escape($(STRUCT_COLOUR3_KEY).value));
        setSetting(SUM_FLEETS_KEY, $(SUM_FLEETS_KEY).checked);
        setSetting(SUM_FLEETS_BASE, $(SUM_FLEETS_BASE).checked);
        setSetting(FLEET_INFO_POPUP, $(FLEET_INFO_POPUP).checked);
        setSetting(FLEET_INFO_POPUP_TIMER, $(FLEET_INFO_POPUP_TIMER).value);
        setSetting(FLEET_INFO_POPUP_FADE, $(FLEET_INFO_POPUP_FADE).checked);
        setSetting(SUM_CREDITS_KEY, $(SUM_CREDITS_KEY).checked);
        setSetting(FORMAT_NUMBERS_KEY, $(FORMAT_NUMBERS_KEY).checked);
        setSetting(NUMBER_DELIMETER_KEY, escape($(NUMBER_DELIMETER_KEY).value));
        setSetting(CLONE_BASE_LINKS_KEY, $(CLONE_BASE_LINKS_KEY).checked);
        setSetting(CLONE_FLEET_LINKS_KEY, $(CLONE_FLEET_LINKS_KEY).checked);
        setSetting(MOVE_GALAXY_LINKS_KEY, $(MOVE_GALAXY_LINKS_KEY).checked);
        setSetting(STRUCTURES_GOALS_KEY, $(STRUCTURES_GOALS_KEY).checked);
        setSetting(INSERT_MOVE_PRESETS_KEY, $(INSERT_MOVE_PRESETS_KEY).checked);
        setSetting(SHOW_EXECUTION_TIME_KEY, $(SHOW_EXECUTION_TIME_KEY).checked);
        setSetting(AUTOSET_GUILD_KEY, $(AUTOSET_GUILD_KEY).checked);
        setSetting(CONSTRUCT_ENHANCE_KEY, $(CONSTRUCT_ENHANCE_KEY).checked);
        setSetting(SCRIPT_BATTLECALC_KEY, $(SCRIPT_BATTLECALC_KEY).checked);
        setSetting(AUTOSET_GUILD_NOTIFY_KEY, $(AUTOSET_GUILD_NOTIFY_KEY).checked);

        setSetting(NAME_LOCATIONS_KEY, $(NAME_LOCATIONS_KEY).checked);
        setSetting(LOCATION_NAMES_KEY, escape($(LOCATION_NAMES_KEY).value));

        setSetting(SHOW_PILLAGE_KEY, $(SHOW_PILLAGE_KEY).checked);
        setSetting(FORMAT_SCANNER_KEY, $(FORMAT_SCANNER_KEY).checked);
        setSetting(REMOVE_REDIRECT_KEY, $(REMOVE_REDIRECT_KEY).checked);
        setSetting(DEBUG_KEY, $(DEBUG_KEY).checked);

        var logLevel = LOG_LEVEL_WARN;
        var radioButtons = document.evaluate(
            "//input[@type='radio']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        //console.log(redCells.snapshotLength);
        for (var i = 0; i < radioButtons.snapshotLength; i++) {
            //console.log(radioButtons.snapshotItem(i));
            if (radioButtons.snapshotItem(i).checked == true) {
                logLevel = radioButtons.snapshotItem(i).value;
            }

        }
        setSetting(LOG_LEVEL_KEY, logLevel);
    } catch (e) {
        console.log("Save settings on " + getServer() + ": " + e);
    }
    notify("Settings successfully saved.");
}

function loadConfig() {
    try {

        document.getElementById(PROFIT_SUM_KEY).checked = getSetting(PROFIT_SUM_KEY, true);
        document.getElementById(HIGHLIGHT_COMMANDERS_KEY).checked = getSetting(HIGHLIGHT_COMMANDERS_KEY, false);
        document.getElementById(HIGHLIGHT_COMMANDER_CONSTRUCTION).value = getSetting(HIGHLIGHT_COMMANDER_CONSTRUCTION, "#FF7F00");
        document.getElementById(HIGHLIGHT_COMMANDER_RESEARCH).value = getSetting(HIGHLIGHT_COMMANDER_RESEARCH, "#7EC0EE");
        document.getElementById(HIGHLIGHT_COMMANDER_PRODUCTION).value = getSetting(HIGHLIGHT_COMMANDER_PRODUCTION, "#FFD700");
        document.getElementById(HIGHLIGHT_COMMANDER_DEFENSE).value = getSetting(HIGHLIGHT_COMMANDER_DEFENSE, "#EE00EE");
        document.getElementById(HIGHLIGHT_COMMANDER_TACTICAL).value = getSetting(HIGHLIGHT_COMMANDER_TACTICAL, "#CD0000");
        document.getElementById(HIGHLIGHT_COMMANDER_LOGISTICS).value = getSetting(HIGHLIGHT_COMMANDER_LOGISTICS, "#71C671");
        document.getElementById(QUICK_BAR).checked = getSetting(QUICK_BAR, true);
        document.getElementById(QUICK_BAR_FIX).checked = getSetting(QUICK_BAR_FIX, true);
        document.getElementById(HIDE_ALLI_FLEETS).checked = getSetting(HIDE_ALLI_FLEETS, true);

        console.log("Loading config");
        if ($(HIGHLIGHT_TRADE_PARTNERS_KEY)) $(HIGHLIGHT_TRADE_PARTNERS_KEY).checked = getSetting(HIGHLIGHT_TRADE_PARTNERS_KEY, true);
        if ($(HIGHLIGHT_POOR_TRADES_KEY)) $(HIGHLIGHT_POOR_TRADES_KEY).checked = getSetting(HIGHLIGHT_POOR_TRADES_KEY, true);
        if ($(POOR_TRADE_UPPER_THRESHOLD_KEY)) $(POOR_TRADE_UPPER_THRESHOLD_KEY).value = getSetting(POOR_TRADE_UPPER_THRESHOLD_KEY, 10);
        if ($(POOR_TRADE_LOWER_THRESHOLD_KEY)) $(POOR_TRADE_LOWER_THRESHOLD_KEY).value = getSetting(POOR_TRADE_LOWER_THRESHOLD_KEY, 10);
        if ($(HIGHLIGHT_DUPLICATE_TRADE_PARTNERS_KEY)) $(HIGHLIGHT_DUPLICATE_TRADE_PARTNERS_KEY).checked = getSetting(HIGHLIGHT_DUPLICATE_TRADE_PARTNERS_KEY, true);
        if ($(SHOW_TOTAL_FLEET_ROW_KEY)) $(SHOW_TOTAL_FLEET_ROW_KEY).checked = getSetting(SHOW_TOTAL_FLEET_ROW_KEY, true);
        if ($(SHOW_ATTACK_SIZE_KEY)) $(SHOW_ATTACK_SIZE_KEY).checked = getSetting(SHOW_ATTACK_SIZE_KEY, true);
        if ($(ADD_FLEET_MOVE_LINK_KEY)) $(ADD_FLEET_MOVE_LINK_KEY).checked = getSetting(ADD_FLEET_MOVE_LINK_KEY, true);
        if ($(ENABLE_PRODUCTION_PRESETS_KEY)) $(ENABLE_PRODUCTION_PRESETS_KEY).checked = getSetting(ENABLE_PRODUCTION_PRESETS_KEY, true);
        if ($(ADD_EMPIRE_SUBMENU_KEY)) $(ADD_EMPIRE_SUBMENU_KEY).checked = getSetting(ADD_EMPIRE_SUBMENU_KEY, true);
        if ($(MOVE_EMPIRE_SUBMENU_KEY)) $(MOVE_EMPIRE_SUBMENU_KEY).checked = getSetting(MOVE_EMPIRE_SUBMENU_KEY, true);
        if ($(INSERT_BATTLECALC_LINK_KEY)) $(INSERT_BATTLECALC_LINK_KEY).checked = getSetting(INSERT_BATTLECALC_LINK_KEY, true);
        if ($(ADJUST_TITLES_KEY)) $(ADJUST_TITLES_KEY).checked = getSetting(ADJUST_TITLES_KEY, true);
        if ($(FIX_QUEUES_KEY)) $(FIX_QUEUES_KEY).checked = getSetting(FIX_QUEUES_KEY, true);
        if ($(MAX_QUEUES_KEY)) $(MAX_QUEUES_KEY).value = getSetting(MAX_QUEUES_KEY, 5);
        if ($(HIGHLIGHT_PLAYERS_KEY)) $(HIGHLIGHT_PLAYERS_KEY).checked = getSetting(HIGHLIGHT_PLAYERS_KEY, true);
        if ($(PLAYER_COLORS_KEY)) $(PLAYER_COLORS_KEY).value = unescape(getSetting(PLAYER_COLORS_KEY, "Drekons=#FF82AB,United Colonies=#7FFF00"));
        if ($(MY_GUILD_KEY)) $(MY_GUILD_KEY).value = unescape(getSetting(MY_GUILD_KEY, "[MyGuild]"));
        if ($(MY_GUILD_COLOUR_KEY)) $(MY_GUILD_COLOUR_KEY).value = unescape(getSetting(MY_GUILD_COLOUR_KEY, "#9999FF"));
        document.getElementById(MY_NAME_KEY).value = unescape(getSetting(MY_NAME_KEY, ""));
        if ($(ENEMY_GUILDS_KEY)) $(ENEMY_GUILDS_KEY).value = unescape(getSetting(ENEMY_GUILDS_KEY, "[Enemy1],[Enemy2]"));
        if ($(NAPPED_GUILDS_KEY)) $(NAPPED_GUILDS_KEY).value = unescape(getSetting(NAPPED_GUILDS_KEY, "[Nap1],[Nap2]"));
        if ($(ALLIED_GUILDS_KEY)) $(ALLIED_GUILDS_KEY).value = unescape(getSetting(ALLIED_GUILDS_KEY, "[Ally1],[Ally2]"));
        if ($(ENEMY_GUILDS_COLOUR_KEY)) $(ENEMY_GUILDS_COLOUR_KEY).value = unescape(getSetting(ENEMY_GUILDS_COLOUR_KEY, "red"));
        if ($(NAPPED_GUILDS_COLOUR_KEY)) $(NAPPED_GUILDS_COLOUR_KEY).value = unescape(getSetting(NAPPED_GUILDS_COLOUR_KEY, "#CCCC00"));
        if ($(ALLIED_GUILDS_COLOUR_KEY)) $(ALLIED_GUILDS_COLOUR_KEY).value = unescape(getSetting(ALLIED_GUILDS_COLOUR_KEY, "#9999FF"));
        if ($(HIGHLIGHT_TRADE_COLOUR_KEY)) $(HIGHLIGHT_TRADE_COLOUR_KEY).value = unescape(getSetting(HIGHLIGHT_TRADE_COLOUR_KEY, "#8B0000"));
        if ($(HIGHLIGHT_BASE_COLOUR_KEY)) $(HIGHLIGHT_BASE_COLOUR_KEY).value = unescape(getSetting(HIGHLIGHT_BASE_COLOUR_KEY, "red"));
        if ($(HIGHLIGHT_SYSTEM_COLOUR_KEY)) $(HIGHLIGHT_SYSTEM_COLOUR_KEY).value = unescape(getSetting(HIGHLIGHT_SYSTEM_COLOUR_KEY, "orange"));
        if ($(HIGHLIGHT_CUS_SCANNER_KEY)) $(HIGHLIGHT_CUS_SCANNER_KEY).value = unescape(getSetting(HIGHLIGHT_CUS_SCANNER_KEY, "A99:99:99:99,B99:99:99:99"));
        if ($(HIGHLIGHT_CUSBASE_COLOUR_KEY)) $(HIGHLIGHT_CUSBASE_COLOUR_KEY).value = unescape(getSetting(HIGHLIGHT_CUSBASE_COLOUR_KEY, "purple"));
        if ($(HIGHLIGHT_CUSSYSTEM_COLOUR_KEY)) $(HIGHLIGHT_CUSSYSTEM_COLOUR_KEY).value = unescape(getSetting(HIGHLIGHT_CUSSYSTEM_COLOUR_KEY, "blue"));
        if ($(STRUCT_COLOUR1_KEY)) $(STRUCT_COLOUR1_KEY).value = unescape(getSetting(STRUCT_COLOUR1_KEY, "aqua"));
        if ($(STRUCT_COLOUR2_KEY)) $(STRUCT_COLOUR2_KEY).value = unescape(getSetting(STRUCT_COLOUR2_KEY, "orange"));
        if ($(STRUCT_COLOUR3_KEY)) $(STRUCT_COLOUR3_KEY).value = unescape(getSetting(STRUCT_COLOUR3_KEY, "green"));
        if ($(SUM_FLEETS_KEY)) $(SUM_FLEETS_KEY).checked = getSetting(SUM_FLEETS_KEY, true);
        if ($(SUM_FLEETS_BASE)) $(SUM_FLEETS_BASE).checked = getSetting(SUM_FLEETS_BASE, true);
        if ($(FLEET_INFO_POPUP)) $(FLEET_INFO_POPUP).checked = getSetting(FLEET_INFO_POPUP, true);
        if ($(FLEET_INFO_POPUP_TIMER)) $(FLEET_INFO_POPUP_TIMER).value = getSetting(FLEET_INFO_POPUP_TIMER, 20);
        if ($(FLEET_INFO_POPUP_FADE)) $(FLEET_INFO_POPUP_FADE).checked = getSetting(FLEET_INFO_POPUP_FADE, true);
        if ($(SUM_CREDITS_KEY)) $(SUM_CREDITS_KEY).checked = getSetting(SUM_CREDITS_KEY, true);
        if ($(FORMAT_NUMBERS_KEY)) $(FORMAT_NUMBERS_KEY).checked = getSetting(FORMAT_NUMBERS_KEY, true);
        if ($(NUMBER_DELIMETER_KEY)) $(NUMBER_DELIMETER_KEY).value = unescape(getSetting(NUMBER_DELIMETER_KEY, ","));
        if ($(CLONE_BASE_LINKS_KEY)) $(CLONE_BASE_LINKS_KEY).checked = getSetting(CLONE_BASE_LINKS_KEY, true);
        if ($(CLONE_FLEET_LINKS_KEY)) $(CLONE_FLEET_LINKS_KEY).checked = getSetting(CLONE_FLEET_LINKS_KEY, true);
        if ($(MOVE_GALAXY_LINKS_KEY)) $(MOVE_GALAXY_LINKS_KEY).checked = getSetting(MOVE_GALAXY_LINKS_KEY, false);
        if ($(STRUCTURES_GOALS_KEY)) $(STRUCTURES_GOALS_KEY).checked = getSetting(STRUCTURES_GOALS_KEY, true);
        if ($(AUTOSET_GUILD_KEY)) $(AUTOSET_GUILD_KEY).checked = getSetting(AUTOSET_GUILD_KEY, true);
        if ($(CONSTRUCT_ENHANCE_KEY)) $(CONSTRUCT_ENHANCE_KEY).checked = getSetting(CONSTRUCT_ENHANCE_KEY, false);
        if ($(SCRIPT_BATTLECALC_KEY)) $(SCRIPT_BATTLECALC_KEY).checked = getSetting(SCRIPT_BATTLECALC_KEY, true);
        if ($(AUTOSET_GUILD_NOTIFY_KEY)) $(AUTOSET_GUILD_NOTIFY_KEY).checked = getSetting(AUTOSET_GUILD_NOTIFY_KEY, true);
        if ($(INSERT_MOVE_PRESETS_KEY)) $(INSERT_MOVE_PRESETS_KEY).checked = getSetting(INSERT_MOVE_PRESETS_KEY, true);
        if ($(SHOW_EXECUTION_TIME_KEY)) $(SHOW_EXECUTION_TIME_KEY).checked = getSetting(SHOW_EXECUTION_TIME_KEY, false);


        if ($(NAME_LOCATIONS_KEY)) $(NAME_LOCATIONS_KEY).checked = getSetting(NAME_LOCATIONS_KEY, false);
        if ($(LOCATION_NAMES_KEY)) $(LOCATION_NAMES_KEY).value = unescape(getSetting(LOCATION_NAMES_KEY, "A12:12:12:12=my home base,A13:13:13:13=my other base"));

        if ($(SHOW_PILLAGE_KEY)) $(SHOW_PILLAGE_KEY).checked = getSetting(SHOW_PILLAGE_KEY, true);
        if ($(FORMAT_SCANNER_KEY)) $(FORMAT_SCANNER_KEY).checked = getSetting(FORMAT_SCANNER_KEY, true);
        if ($(REMOVE_REDIRECT_KEY)) $(REMOVE_REDIRECT_KEY).checked = getSetting(REMOVE_REDIRECT_KEY, true);
        if ($(DEBUG_KEY)) $(DEBUG_KEY).checked = getSetting(DEBUG_KEY, false);
        var logLevel = getSetting(LOG_LEVEL_KEY, LOG_LEVEL_WARN);
        //console.log("Log level: "+logLevel);
        var radioButtons = document.evaluate(
            "//input[@type='radio']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        //console.log(redCells.snapshotLength);
        for (var i = 0; i < radioButtons.snapshotLength; i++) {
            //console.log(radioButtons.snapshotItem(i));
            if (radioButtons.snapshotItem(i).value == logLevel) {
                radioButtons.snapshotItem(i).checked = true;
            }

        }

    } catch (e) {
        console.log("Config loaded: " + e);
        return;
    }
}

function resetConfig(install) {
    try {
        setSetting(PROFIT_SUM_KEY, true);

        setSetting(HIGHLIGHT_COMMANDERS_KEY, true);
        setSetting(HIGHLIGHT_COMMANDER_CONSTRUCTION, "#FF7F00");
        setSetting(HIGHLIGHT_COMMANDER_RESEARCH, "#7EC0EE");
        setSetting(HIGHLIGHT_COMMANDER_PRODUCTION, "#FFD700");
        setSetting(HIGHLIGHT_COMMANDER_DEFENSE, "#EE00EE");
        setSetting(HIGHLIGHT_COMMANDER_TACTICAL, "#CD0000");
        setSetting(HIGHLIGHT_COMMANDER_LOGISTICS, "#71C671");
        setSetting(QUICK_BAR, true);
        setSetting(QUICK_BAR_FIX, true);
        setSetting(HIDE_ALLI_FLEETS, true);

        setSetting(HIGHLIGHT_TRADE_PARTNERS_KEY, true);
        setSetting(HIGHLIGHT_POOR_TRADES_KEY, true);
        setSetting(POOR_TRADE_UPPER_THRESHOLD_KEY, 10);
        setSetting(POOR_TRADE_LOWER_THRESHOLD_KEY, 10);
        setSetting(HIGHLIGHT_DUPLICATE_TRADE_PARTNERS_KEY, true);
        setSetting(SHOW_TOTAL_FLEET_ROW_KEY, true);
        setSetting(SHOW_ATTACK_SIZE_KEY, true);
        setSetting(ADD_FLEET_MOVE_LINK_KEY, true);
        setSetting(ENABLE_PRODUCTION_PRESETS_KEY, true);
        setSetting(ADD_EMPIRE_SUBMENU_KEY, true);
        setSetting(MOVE_EMPIRE_SUBMENU_KEY, true);
        setSetting(INSERT_BATTLECALC_LINK_KEY, true);
        setSetting(ADJUST_TITLES_KEY, true);
        setSetting(FIX_QUEUES_KEY, true);
        setSetting(MAX_QUEUES_KEY, 5);
        setSetting(AUTOSET_GUILD_KEY, true);
        setSetting(CONSTRUCT_ENHANCE_KEY, true);
        setSetting(SCRIPT_BATTLECALC_KEY, true);
        setSetting(AUTOSET_GUILD_NOTIFY_KEY, true);
        setSetting(HIGHLIGHT_PLAYERS_KEY, true);
        setSetting(PLAYER_COLORS_KEY, "Drekons=#FF82AB,United Colonies=#7FFF00");
        setSetting(MY_GUILD_KEY, "");
        setSetting(MY_NAME_KEY, "Newb");
        setSetting(MY_GUILD_COLOUR_KEY, "#9999FF");
        setSetting(ENEMY_GUILDS_KEY, "[Enemy1],[Enemy2]");
        setSetting(NAPPED_GUILDS_KEY, "[Nap1],[Nap2]");
        setSetting(ALLIED_GUILDS_KEY, "[Ally1],[Ally2]");
        setSetting(ENEMY_GUILDS_COLOUR_KEY, "red");
        setSetting(NAPPED_GUILDS_COLOUR_KEY, "#CCCC00");
        setSetting(ALLIED_GUILDS_COLOUR_KEY, "#9999FF");
        setSetting(HIGHLIGHT_TRADE_COLOUR_KEY, "#8B0000");
        setSetting(HIGHLIGHT_BASE_COLOUR_KEY, "red");
        setSetting(HIGHLIGHT_SYSTEM_COLOUR_KEY, "orange");
        setSetting(HIGHLIGHT_CUS_SCANNER_KEY, "A99:99:99:99,B99:99:99:99");
        setSetting(HIGHLIGHT_CUSBASE_COLOUR_KEY, "purple");
        setSetting(HIGHLIGHT_CUSSYSTEM_COLOUR_KEY, "blue");
        setSetting(STRUCT_COLOUR1_KEY, "aqua");
        setSetting(STRUCT_COLOUR2_KEY, "orange");
        setSetting(STRUCT_COLOUR3_KEY, "green");
        setSetting(SUM_FLEETS_KEY, true);
        setSetting(SUM_FLEETS_BASE, true);
        setSetting(FLEET_INFO_POPUP, true);
        setSetting(FLEET_INFO_POPUP_TIMER, 20);
        setSetting(FLEET_INFO_POPUP_FADE, true);
        setSetting(SUM_CREDITS_KEY, true);
        setSetting(FORMAT_NUMBERS_KEY, true);
        setSetting(NUMBER_DELIMETER_KEY, ",");
        setSetting(CLONE_BASE_LINKS_KEY, true);
        setSetting(CLONE_FLEET_LINKS_KEY, true);
        setSetting(MOVE_GALAXY_LINKS_KEY, false);
        setSetting(STRUCTURES_GOALS_KEY, true);
        setSetting(INSERT_MOVE_PRESETS_KEY, true);
        setSetting(SHOW_EXECUTION_TIME_KEY, false);
        setSetting(NAME_LOCATIONS_KEY, false);
        setSetting(LOCATION_NAMES_KEY, "A12:12:12:12=my home base,A13:13:13:13=my other base");
        setSetting(REMOVE_REDIRECT_KEY, true);
        setSetting(DEBUG_KEY, false);

        setSetting(SHOW_PILLAGE_KEY, true);
        setSetting(FORMAT_SCANNER_KEY, true);
        if (install == "newInstall") {
            notify("Settings set to default for new install.");
            return;
        }
    } catch (e) {
        console.log("Config reset: " + e);
        return;
    }
    notify("Settings successfully reset reloading page to update.");

    window.location.reload();
}

//==========================================
//Start aeproject code

//Yes i'm butchering this into the code, mainly because i want options to enable/disable sections of the code but also because i don't trust someone elses work without looking at it totally.
//==========================================
// Check returned message

function node(opt) {
    if (!opt) return;
    //  console.log("node("+c+")");
    function attr(name) {
        var value = opt[name];
        delete opt[name];
        return value;
    }
    var expandos = {
        id: 1,
        className: 1,
        title: 1,
        type: 1,
        checked: 1
    };
    var id = opt.id;
    var n = $(id);
    if (!n) {
        var tag = attr("tag") || "div";
        if ("string" == typeof tag) n = document.createElement(tag);
        else {
            var t = document.createElement("div");
            t.innerHTML = tag.toXMLString();
            var ids = {};
            // for each( var n in $x('.//*[@id]', t) ) ids[n.id]=1;
            for (var n of $x('.//*[@id]', t)) ids[n.id] = 1; // Old way was deprecated
            if (!n) ids = null;
            var r = document.createRange();
            r.selectNodeContents(t);
            n = r.extractContents();
            if (n.childNodes.length == 1) n = n.firstChild;
        }
        var after = attr("after");
        var before = opt.prepend ? opt.prepend.firstChild : attr("before");
        var parent = attr("prepend") || attr("append") || (before || after || {}).parentNode;
        if (parent) {
            if (before)
                parent.insertBefore(n, before);
            else if (after)
                parent.insertBefore(n, after.nextSibling);
            else
                parent.appendChild(n);
        }
        if (id) n.id = id;
    }
    var html = attr("html");
    if ("undefined" != typeof html) n.innerHTML = html;
    var text = attr("text");
    if ("undefined" != typeof text) n.textContent = text;
    var style = attr("style");
    if (style)
        for (var prop in style) n.style[prop] = style[prop];
    for (prop in opt)
        if (expandos[prop]) n[prop] = opt[prop];
        else n.setAttribute(prop, opt[prop] + "");
    if (ids)
        for (var id in ids)
            ids[id] = $(id);
    return ids || n;
}
var EventManager = {
    _registry: null,
    Initialise: function() {
        if (this._registry == null) {
            this._registry = [];
            EventManager.Add(window, "unload", this.CleanUp)
        }
    },
    Add: function EventManager_Add(a, b, c, d) {
        //      console.log("EventManager.function("+a+","+b+","+c+","+d+")");
        this.Initialise();
        if (typeof a == "string") {
            if (!a) return false;
            a = $(a)
        }
        if (a == null || c == null) {
            return false
        }
        if (a.addEventListener) {
            a.addEventListener(b, c, d);
            this._registry.push({
                obj: a,
                type: b,
                fn: c,
                useCapture: d
            });
            return true
        }
        return false
    },
    CleanUp: function() {
        for (var i = 0; i < EventManager._registry.length; i++) {
            EventManager._registry[i].obj.removeEventListener(type, fn, useCapture);
        }
        EventManager._registry = null
    }
};

//==========================================
//End aeproject code
//==========================================

//==========================================
// Prod/cons helper script
//==========================================
// name            AE Extender Script


//////////////////////////////////////////
/// Variables ////////////////////////////
//////////////////////////////////////////
if (document.location.href.match(/(.+?)astroempires.com/)) {
    var server = document.location.href.match(/\/(.+?).astroempires.com/)[1]
    server = server.replace(/\//, "")
    var serverurl = "http://" + server + ".astroempires.com/"
}

//////////////////////////////////////////
/// Options //////////////////////////////
//////////////////////////////////////////

function getOptionDefaults() {
    return [
        'Global Options', ['o_EnableQuickLinks', 1, 'checkbox', 'Enable Quicklinks', 'Shows quicklinks bar on the right hand side and buttons beside locations'],
        ['o_ShowPopups', 1, 'checkbox', 'Show Popups', 'Retrieves information from the database on mouseover of a location'],
        ['o_SortTrades', 1, 'hide', 'Sort Trades', 'Intelligently sorts trades, showing poor trades first.'],
        ['o_SortScanner', 1, 'hide', 'Sort Scanner', 'Intelligently sorts the scanner, showing incoming fleets first.'],
        ['o_nothing', 1, 'hide', 'Nothing', 'Nothing'],
    ];
}

function popupOptions() {
    if (!$("optionDiv")) {
        optionDiv = document.createElement("div");
        optionDiv.style['position'] = "fixed";
        optionDiv.style['top'] = "20px";
        optionDiv.style['right'] = "100px";
        optionDiv.style['height'] = 200;
        optionDiv.style['width'] = "350px";
        optionDiv.style['border'] = "2px solid #272727";
        optionDiv.style['padding'] = "3px";
        optionDiv.style.backgroundImage = "url(http://graphics2.astroempires.com/skins/darkAstros/images/grad.jpg)";
        optionDiv.style.backgroundColor = "#1D1D1D";
        optionDiv.style.backgroundRepeat = "repeat-x";
        optionDiv.class = "helppage";
        optionDiv.id = "optionDiv";
        document.body.appendChild(optionDiv)

        var tr, td, table;
        var div = document.createElement('div');
        for (var o of getOptionDefaults()) {
            if (String(o).match("function")) {
                // WEIRD error - the last entry is a function array prototype.
                // Look here and see
                // console.log(o);
                continue;
            }
            if (typeof(o) == 'string') {
                var table = node({
                    tag: "table",
                    style: {
                        cssFloat: "left",
                        margin: "5px"
                    },
                    append: div
                });
                tr = node({
                    tag: 'tr',
                    append: table
                });
                var td = node({
                    tag: "th",
                    style: {
                        color: "white"
                    },
                    text: o,
                    append: tr
                });
            } else if (o[2] != 'hide') {
                tr = node({
                    tag: 'tr',
                    append: table
                });
                td = node({
                    tag: 'td',
                    html: '<label style="display:block;" title="' + o[4] + '" for="' + o[0] + '">' + o[3] + '</label>',
                    append: tr
                });
                td = node({
                    tag: 'td',
                    append: tr
                });
                if (o[2] == 'checkbox') {
                    var i = node({
                        tag: "input",
                        type: "checkbox",
                        id: o[0],
                        title: o[4],
                        checked: getState(o[0], 0) ? 'checked' : '',
                        append: td
                    });
                    EventManager.Add(i, 'change', setOptionFromCheckbox);
                    EventManager.Add(i, 'click', setOptionFromCheckbox);
                }
            }
        }

        $("optionDiv").appendChild(div);

        optionClose = document.createElement("a");
        optionClose.style['left'] = "329px";
        optionClose.style['top'] = "0px";
        optionClose.style['position'] = "absolute";
        optionClose.style['color'] = "#FF0000";
        optionClose.style['font-weight'] = "bold";
        optionClose.style['text-decoration'] = "none";
        optionClose.href = "javascript:void(1)";
        optionClose.innerHTML = "[x]";
        optionClose.id = "optionCloseDiv";
        $("optionDiv").appendChild(optionClose);
        EventManager.Add(optionClose, 'click', reloadPage);
    }

}

function setDefaultOptions() {
    for (var o of getOptionDefaults()) {
        if (typeof(o) != 'string')
            setState(o[0], getState(o[0], o[1]));
    }
}

function setOptionFromCheckbox(evt) {
    setState(this.id, this.checked ? 1 : 0);
}

function setState(id, value) {
    GM_setValue(id, value);
    return value;
}

function getState(id, def) {
    return GM_getValue(id, def);
}

function reloadPage() {
    location.href = location.href;
}
//////////////////////////////////////////
/// Misc ////////////////////////////////
/////////////////////////////////////////
if(!document.getElementById("totalsize")){
Array.prototype.inArray = function(value)
// Returns true if the passed value is found in the
// array. Returns false if it is not.
{
    var i;
    for (i = 0; i < this.length; i++) {
        // Matches identical (===), not just similar (==).
        if (this[i] === value) {
            return true;
        }
    }
    return false;
}}

function enhanceConstructionPage(reload) {
    var urbanAdjust = 0,
        solarAdjust = 0,
        gasAdjust = 0,
        fusionAdjust = 0,
        antimatterAdjust = 0,
        researchAdjust = 0,
        metalAdjust = 0,
        crystalAdjust = 0,
        roboticsAdjust = 0,
        shipyardsAdjust = 0,
        osAdjust = 0,
        spaceportsAdjust = 0,
        ccAdjust = 0,
        naniteAdjust = 0,
        androidAdjust = 0,
        economicAdjust = 0,
        terraformAdjust = 0,
        mlpAdjust = 0,
        orbitalbaseAdjust = 0,
        jgAdjust = 0,
        biosphereAdjust = 0,
        capitalAdjust = 0,
        barrackAdjust = 0,
        laserAdjust = 0,
        missileAdjust = 0,
        plasmabaseAdjust = 0,
        ionAdjust = 0,
        photonAdjust = 0,
        disruptorAdjust = 0,
        deflectionAdjust = 0,
        pshieldAdjust = 0,
        pringAdjust = 0,
        energyTech = 0,
        computerTech = 0,
        armorTech = 0,
        laserTech = 0,
        missileTech = 0,
        stellarTech = 0,
        plasmaTech = 0,
        warpTech = 0,
        shieldTech = 0,
        ionTech = 0,
        photonTech = 0,
        aiTech = 0,
        disruptorTech = 0,
        cyberTech = 0,
        tachTech = 0;
    if (!document.getElementById("base-queue"))
        return;
    table = document.getElementById("base-queue").getElementsByClassName("layout listing")[0];
    console.log("table: " + table);
    for (a = 0; a < table.rows.length - 1; a++) {
        if (!table.rows[a].innerHTML.match(/name=.item./)) {
            var itemName = table.rows[a].textContent;
            if (itemName.indexOf("Urban Structures") != -1)
                urbanAdjust++;
            else if (itemName.indexOf("Solar Plants") != -1)
                solarAdjust++;
            else if (itemName.indexOf("Gas Plants") != -1)
                gasAdjust++;
            else if (itemName.indexOf("Fusion Plants") != -1)
                fusionAdjust++;
            else if (itemName.indexOf("Antimatter Plants") != -1)
                antimatterAdjust++;
            else if (itemName.indexOf("Research Labs") != -1)
                researchAdjust++;
            else if (itemName.indexOf("Metal Refineries") != -1)
                metalAdjust++;
            else if (itemName.indexOf("Crystal Mines") != -1)
                crystalAdjust++;
            else if (itemName.indexOf("Robotic Factories") != -1)
                roboticsAdjust++;
            else if (itemName.indexOf("Shipyards") != -1 && itemName.indexOf("Orbital Shipyards") == -1)
                shipyardsAdjust++;
            else if (itemName.indexOf("Orbital Shipyards") != -1)
                osAdjust++;
            else if (itemName.indexOf("Spaceports") != -1)
                spaceportsAdjust++;
            else if (itemName.indexOf("Command Centers") != -1)
                ccAdjust++;
            else if (itemName.indexOf("Nanite Factories") != -1)
                naniteAdjust++;
            else if (itemName.indexOf("Android Factories") != -1)
                androidAdjust++;
            else if (itemName.indexOf("Economic Centers") != -1)
                economicAdjust++;
            else if (itemName.indexOf("Terraform") != -1)
                terraformAdjust++;
            else if (itemName.indexOf("Multi-Level Platforms") != -1)
                mlpAdjust++;
            else if (itemName.indexOf("Orbital Base") != -1)
                orbitalbaseAdjust++;
            else if (itemName.indexOf("Jump Gate") != -1)
                jgAdjust++;
            else if (itemName.indexOf("Biosphere Modification") != -1)
                biosphereAdjust++;
            else if (itemName.indexOf("Capital") != -1)
                capitalAdjust++;
            else if (itemName.indexOf("Energy") != -1)
                energyTech++;
            else if (itemName.indexOf("Computer") != -1)
                computerTech++;
            else if (itemName.indexOf("Armour") != -1)
                armorTech++;
            else if (itemName.indexOf("Laser") != -1)
                laserTech++;
            else if (itemName.indexOf("Missiles") != -1)
                missileTech++;
            else if (itemName.indexOf("Stellar Drive") != -1)
                stellarTech++;
            else if (itemName.indexOf("Plasma") != -1)
                plasmaTech++;
            else if (itemName.indexOf("Warp Drive") != -1)
                warpTech++;
            else if (itemName.indexOf("Shielding") != -1)
                shieldTech++;
            else if (itemName.indexOf("Ion") != -1)
                ionTech++;
            else if (itemName.indexOf("Photon") != -1)
                photonTech++;
            else if (itemName.indexOf("Artificial Intelligence") != -1)
                aiTech++;
            else if (itemName.indexOf("Disruptor") != -1)
                disruptorTech++;
            else if (itemName.indexOf("Cybernetics") != -1)
                cyberTech++;
            else if (itemName.indexOf("Tachyon Communications") != -1)
                tachTech++;
            else if (itemName.indexOf("Barracks") != -1)
                barrackAdjust++;
            else if (itemName.indexOf("Laser Turrets") != -1)
                laserAdjust++;
            else if (itemName.indexOf("Missile Turrets") != -1)
                missileAdjust++;
            else if (itemName.indexOf("Plasma Turrets") != -1)
                plasmabaseAdjust++;
            else if (itemName.indexOf("Ion Turrets") != -1)
                ionAdjust++;
            else if (itemName.indexOf("Photon Turrets") != -1)
                photonAdjust++;
            else if (itemName.indexOf("Disruptor Turrets") != -1)
                disruptorAdjust++;
            else if (itemName.indexOf("Deflection Shields") != -1)
                deflectionAdjust++;
            else if (itemName.indexOf("Planetary Shield") != -1)
                pshieldAdjust++;
            else if (itemName.indexOf("Planetary Ring") != -1)
                pringAdjust++;
        }
    }
    //remove old quelinks and best x strings)
    if (reload) {
        var bStrings = document.evaluate("//span[contains(@id,'bestSpan')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var r = 0; r < bStrings.snapshotLength; r++) {
            var bs = bStrings.snapshotItem(r);
            console.log("bs: " + bs);
            bs.parentNode.removeChild(bs);
        }
        var nStrings = document.evaluate("//font[contains(@id,'bestSpan')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var r = 0; r < nStrings.snapshotLength; r++) {
            var ns = nStrings.snapshotItem(r);
            console.log("ns: " + ns);
            ns.parentNode.removeChild(ns);
        }
        var qLinks = document.evaluate("//a[contains(@id,'queueLink_')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var r = 0; r < qLinks.snapshotLength; r++) {
            var ql = qLinks.snapshotItem(r);
            console.log("ql: " + ql);
            ql.parentNode.removeChild(ql);
        }
    }
    table = document.getElementsByClassName("layout listing")[0];
    var i_lastcolumn = 5;
    var forms = document.getElementsByTagName('form');
    console.log("forms:" + forms);
    if (!table.innerHTML.match(/The research of this base is linked to/)) {
        if (table.rows.length > 4) {
            for (var nrow = 1; nrow < table.rows.length; nrow += 2) {
                if (!table.rows[nrow].innerHTML.match(/Research Labs linked to this base research./) && table.rows[nrow]) {
                    table.rows[nrow].firstChild.setAttribute('rowspan', '1');
                }
            }
        }
        if (reload)
            techmultipliers = [0];
        else
            techmultipliers = GM_getValue(server + "techData", "0").split(",");
            console.log("Tech Multipliers: " + techmultipliers);
        var energytechmultiplier = (techmultipliers[0] * 0.05) + 1;
        console.log("Energy Multiplier: " + energytechmultiplier);
        var averageroute = GM_getValue(server + "averageRoute", "31");
        var fertility = 0,
            uspopcost = 0,
            obpopcost = 0,
            obcostparentnode = 0,
            popcost = 0;
        var areacost = 0,
            energycost = 0,
            econcost = 0,
            prodcost = 0,
            constcost = 0,
            flag = 0;
        var bestAreaSignifier = node({
            tag: 'span',
            html: ' <br /> (Best Area)',
            style: {
                fontSize: '8pt',
                verticalAlign: 'top',
                color: 'orange'
            }
        });
        bestAreaSignifier.setAttribute("id", "bestSpan");
        var bestEconSignifier = node({
            tag: 'span',
            html: ' <br /> (Best Econ)',
            style: {
                fontSize: '8pt',
                verticalAlign: 'top',
                color: 'orange'
            }
        });
        bestEconSignifier.setAttribute("id", "bestSpan");
        var bestProdSignifier = node({
            tag: 'span',
            html: ' <br /> (Best Prod)',
            style: {
                fontSize: '8pt',
                verticalAlign: 'top',
                color: 'orange'
            }
        });
        bestProdSignifier.setAttribute("id", "bestSpan");
        var bestConstSignifier = node({
            tag: 'span',
            html: ' <br /> (Best Const)',
            style: {
                fontSize: '8pt',
                verticalAlign: 'top',
                color: 'orange'
            }
        });
        bestConstSignifier.setAttribute("id", "bestSpan");
        var bestPopSignifier = node({
            tag: 'span',
            html: '<br /> (Best Pop)',
            style: {
                fontSize: '8pt',
                verticalAlign: 'top',
                color: 'orange'
            }
        });
        bestPopSignifier.setAttribute("id", "bestSpan");
        var bestEnergySignifier = node({
            tag: 'span',
            html: ' <br /> (Best Energy)',
            style: {
                fontSize: '8pt',
                verticalAlign: 'top',
                color: 'orange'
            }
        });
        bestEnergySignifier.setAttribute("id", "bestSpan");
        for (var nrow = 1; nrow < table.rows.length; nrow += 2) {
            if (!table.rows[nrow].innerHTML.match(/linked to this base research./)) {
                var cname = table.rows[nrow].childNodes[1].firstChild.firstChild.textContent;
                table.rows[nrow].childNodes[1].firstChild.firstChild.setAttribute('onclick', table.rows[nrow].getAttribute('onclick'));
                table.rows[nrow].setAttribute('onclick', '');
                if (location.indexOf('view=structures') != -1) {
                    table.rows[nrow].title = cname;
                    var td1help_res = new Array();
                    if (table.rows[nrow + 1] && !reload) {
                        var td1help_res = table.rows[nrow + 1].innerHTML.match(/(fertility|metal resource|crystals resource).\((.+?)\)/);
                        if (td1help_res) {
                            if (flag == 0) {
                                if (td1help_res[1] == "fertility") {
                                    var td1help = "&nbsp;(Fert " + td1help_res[2] + ")"
                                } else if (td1help_res[1] == "metal resource") {
                                    var td1help = "&nbsp;(Metal " + td1help_res[2] + ")"
                                } else if (td1help_res[1] == "crystals resource") {
                                    var td1help = "&nbsp;(Crystals " + td1help_res[2] + ")"
                                }
                                var d = table.rows[nrow].childNodes[1].innerHTML + td1help;
                                table.rows[nrow].childNodes[1].innerHTML = d
                            }
                        }
                    } else {
                        if (table.rows[nrow].textContent.indexOf('(Fert') != -1) {
                            var fNum = table.rows[nrow].textContent.substring(table.rows[nrow].textContent.indexOf('(Fert') + 6, table.rows[nrow].textContent.indexOf('(Fert') + 9);
                            td1help_res[2] = fNum.substring(0, fNum.indexOf(')'));
                        } else if (table.rows[nrow].textContent.indexOf('(Metal') != -1) {
                            var fNum = table.rows[nrow].textContent.substring(table.rows[nrow].textContent.indexOf('(Metal') + 7, table.rows[nrow].textContent.indexOf('(Metal') + 10);
                            td1help_res[2] = fNum.substring(0, fNum.indexOf(')'));
                        } else if (table.rows[nrow].textContent.indexOf('(Crystals') != -1) {
                            var fNum = table.rows[nrow].textContent.substring(table.rows[nrow].textContent.indexOf('(Crystals') + 10, table.rows[nrow].textContent.indexOf('(Crystals') + 13);
                            td1help_res[2] = fNum.substring(0, fNum.indexOf(')'));
                        }
                    }
                    if (cname == 'Terraform') {
                        makeAdjustments(nrow, terraformAdjust)
                        terracost = parseNum(itemcost) / 5;
                        if (areacost == 0 || areacost > terracost) {
                            areacost = terracost
                            table.rows[nrow].childNodes[2].appendChild(bestAreaSignifier);
                        }
                    } else if (cname == 'Multi-Level Platforms') {
                        adjust = mlpAdjust
                        makeAdjustments(nrow, mlpAdjust)
                        var cost = parseNum(itemcost) / 10;
                        if (cost < areacost) {
                            areacost = cost;
                            bestAreaSignifier.parentNode.removeChild(bestAreaSignifier);
                            table.rows[nrow].childNodes[2].appendChild(bestAreaSignifier);
                        }
                    } else if (cname == 'Urban Structures') {
                        makeAdjustments(nrow, urbanAdjust);
                        USLevel = table.rows[nrow].childNodes[1].innerHTML.match(/\(Level [0-9]{1,}/);
                        USLevel = parseNum(USLevel[0].replace(/\(Level /, ""));
                        fertility = parseNum(td1help_res[2]);
                        uspopcost = parseNum(itemcost);
                        uspopcost = (uspopcost + areacost) / fertility;
                        if (popcost == 0 || popcost > uspopcost) {
                            popcost = uspopcost;
                            table.rows[nrow].childNodes[2].appendChild(bestPopSignifier);
                        }
                    } else if (cname == 'Orbital Base') {
                        makeAdjustments(nrow, orbitalbaseAdjust);
                        obpopcost = parseNum(itemcost) / 10;
                        obcostparentnode = table.rows[nrow].childNodes[2];
                        if (obpopcost && obpopcost < popcost) {
                            popcost = obpopcost;
                            bestPopSignifier.parentNode.removeChild(bestPopSignifier);
                            table.rows[nrow].childNodes[2].appendChild(bestPopSignifier);
                        }
                    } else if (cname == 'Solar Plants' || cname == 'Gas Plants' || cname == 'Fusion Plants' || cname == 'Antimatter Plants') {
                        if (cname == 'Solar Plants')
                            adjust = solarAdjust
                        else if (cname == 'Gas Plants')
                            adjust = gasAdjust
                        else if (cname == 'Fusion Plants')
                            adjust = fusionAdjust
                        else if (cname == 'Antimatter Plants')
                            adjust = antimatterAdjust
                        makeAdjustments(nrow, adjust);
                        var c = parseNum(itemcost);
                        var e = parseNum(table.rows[nrow].childNodes[3].firstChild.nodeValue.slice(1));
                        c = (c + popcost + areacost) / (energytechmultiplier * e);
                        if (e > 2) {
                            if (!energycost)
                                energycost = c;
                            if (c <= energycost) {
                                energycost = c;
                                if (bestEnergySignifier.parentNode)
                                    bestEnergySignifier.parentNode.removeChild(bestEnergySignifier);
                                table.rows[nrow].childNodes[2].appendChild(bestEnergySignifier);
                            }
                        }
                    } else if (cname == "Biosphere Modification") {
                        makeAdjustments(nrow, biosphereAdjust);
                        var biopopcost = parseNum(itemcost);
                        biopopcost = (biopopcost + (24 * energycost) + areacost) / USLevel;
                        if (biopopcost < popcost) {
                            popcost = biopopcost;
                            bestPopSignifier.parentNode.removeChild(bestPopSignifier);
                            table.rows[nrow].childNodes[2].appendChild(bestPopSignifier);
                        }
                    } else if (cname == "Metal Refineries") {
                        makeAdjustments(nrow, metalAdjust);
                        var metal = parseNum(td1help_res[2]);
                        var metalcost = parseNum(itemcost);
                        metalprodcost = (metalcost + energycost + areacost + popcost) / metal;
                        metalconstcost = (metalcost + energycost + areacost + popcost) / metal;
                        metaleconcost = (metalcost + energycost + areacost + popcost);
                        if (econcost == 0 || econcost > metaleconcost) {
                            econcost = metaleconcost;
                            table.rows[nrow].childNodes[2].appendChild(bestEconSignifier);
                        }
                        if (prodcost == 0 || prodcost > metalprodcost) {
                            prodcost = metalprodcost;
                            table.rows[nrow].childNodes[2].appendChild(bestProdSignifier);
                        }
                        if (constcost == 0 || constcost > metalconstcost) {
                            constcost = metalconstcost;
                            table.rows[nrow].childNodes[2].appendChild(bestConstSignifier);
                        }

                    } else if (cname == "Crystal Mines") {
                        makeAdjustments(nrow, crystalAdjust);
                        var crystal = parseNum(td1help_res[2]);
                        var crystalcost = parseNum(itemcost);
                        crystalcost = (crystalcost + energycost + areacost) / crystal;
                        if (econcost > crystalcost) {
                            econcost = crystalcost;
                            table.rows[nrow].childNodes[2].appendChild(bestEconSignifier);
                        }

                    }
                }
                if (cname == "Robotic Factories") {
                    makeAdjustments(nrow, roboticsAdjust);
                    var robscost = parseNum(itemcost);
                    robsprodcost = (robscost + energycost + areacost + popcost) / 2;
                    robsconstcost = (robscost + energycost + areacost + popcost) / 2;
                    robseconcost = (robscost + energycost + areacost + popcost);
                    if (econcost > robseconcost) {
                        econcost = robseconcost;
                        table.rows[nrow].childNodes[2].appendChild(bestEconSignifier);
                    }
                    if (prodcost > robsprodcost) {
                        prodcost = robsprodcost;
                        table.rows[nrow].childNodes[2].appendChild(bestProdSignifier);
                    }
                    if (constcost > robsconstcost) {
                        constcost = robsconstcost;
                        table.rows[nrow].childNodes[2].appendChild(bestConstSignifier);
                    }
                } else if (cname == "Shipyards") {
                    makeAdjustments(nrow, shipyardsAdjust);
                    var shipscost = parseNum(itemcost);
                    shipsprodcost = (shipscost + energycost + areacost + popcost) / 2;
                    shipseconcost = (shipscost + energycost + areacost + popcost);
                    if (econcost > shipseconcost) {
                        econcost = shipseconcost;
                        table.rows[nrow].childNodes[2].appendChild(bestEconSignifier);
                    }
                    if (prodcost > shipsprodcost) {
                        prodcost = shipsprodcost;
                        table.rows[nrow].childNodes[2].appendChild(bestProdSignifier);
                    }
                } else if (cname == "Orbital Shipyards") {
                    makeAdjustments(nrow, osAdjust);
                    var oscost = parseNum(itemcost);
                    osprodcost = (oscost + (energycost * 12) + popcost) / 8;
                    oseconcost = (oscost + (energycost * 12) + popcost) / 2;
                    if (econcost > oseconcost) {
                        econcost = oseconcost;
                        table.rows[nrow].childNodes[2].appendChild(bestEconSignifier);
                    }
                    if (prodcost > osprodcost) {
                        prodcost = osprodcost;
                        table.rows[nrow].childNodes[2].appendChild(bestProdSignifier);
                    }
                } else if (cname == "Spaceports") {
                    makeAdjustments(nrow, spaceportsAdjust);
                    var Spcost = parseNum(itemcost);
                    Spcost = (Spcost + energycost + areacost) / 2;
                    if (econcost > Spcost) {
                        econcost = Spcost;
                        table.rows[nrow].childNodes[2].appendChild(bestEconSignifier);
                    }
                } else if (cname == "Nanite Factories") {
                    makeAdjustments(nrow, naniteAdjust);
                    var nanicost = parseNum(itemcost);
                    naniprodcost = (nanicost + (energycost * 2) + areacost + popcost) / 4;
                    naniconstcost = (nanicost + (energycost * 2) + areacost + popcost) / 4;
                    nanieconcost = (nanicost + (energycost * 2) + areacost + popcost) / 2;
                    if (econcost > nanieconcost) {
                        econcost = nanieconcost;
                        table.rows[nrow].childNodes[2].appendChild(bestEconSignifier);
                    }
                    if (prodcost > naniprodcost) {
                        prodcost = naniprodcost;
                        table.rows[nrow].childNodes[2].appendChild(bestProdSignifier);
                    }
                    if (constcost > naniconstcost) {
                        constcost = naniconstcost;
                        table.rows[nrow].childNodes[2].appendChild(bestConstSignifier);
                    }
                } else if (cname == "Android Factories") {
                    makeAdjustments(nrow, androidAdjust);
                    var andrcost = parseNum(itemcost);
                    andrprodcost = (andrcost + (energycost * 4) + areacost + popcost) / 6;
                    andrconstcost = (andrcost + (energycost * 4) + areacost + popcost) / 6;
                    andreconcost = (andrcost + (energycost * 4) + areacost + popcost) / 2;
                    if (econcost > andreconcost) {
                        econcost = andreconcost;
                        table.rows[nrow].childNodes[2].appendChild(bestEconSignifier);
                    }
                    if (prodcost > andrprodcost) {
                        prodcost = andrprodcost;
                        table.rows[nrow].childNodes[2].appendChild(bestProdSignifier);
                    }
                    if (constcost > andrconstcost) {
                        constcost = andrconstcost;
                        table.rows[nrow].childNodes[2].appendChild(bestConstSignifier);
                    }
                } else if (cname == "Economic Centers") {
                    makeAdjustments(nrow, economicAdjust);
                    var eccost = parseNum(itemcost)
                    eccost = (eccost + (energycost * 2) + areacost + popcost) / 3;
                    if (econcost > eccost) {
                        econcost = eccost;
                        table.rows[nrow].childNodes[2].appendChild(bestEconSignifier);
                    }
                } else if (cname == "Capital") {
                    makeAdjustments(nrow, capitalAdjust);
                    var eccost = parseNum(itemcost);
                    eccost = (eccost + (energycost * 12) + areacost + popcost);
                    if (econcost > eccost) {
                        econcost = eccost;
                        table.rows[nrow].childNodes[2].appendChild(bestEconSignifier);
                    }
                } else if (cname == "Research Labs")
                    makeAdjustments(nrow, researchAdjust);
                else if (cname == "Command Centers")
                    makeAdjustments(nrow, ccAdjust);
                else if (cname == "Jump Gate")
                    makeAdjustments(nrow, jgAdjust);
                if (location.indexOf('view=research') != -1) {
                    if (cname == "Energy")
                        makeAdjustments(nrow, energyTech, true);
                    else if (cname == "Computer")
                        makeAdjustments(nrow, computerTech, true);
                    else if (cname == "Armour")
                        makeAdjustments(nrow, armorTech, true);
                    else if (cname == "Laser")
                        makeAdjustments(nrow, laserTech, true);
                    else if (cname == "Missiles")
                        makeAdjustments(nrow, missileTech, true);
                    else if (cname == "Stellar Drive")
                        makeAdjustments(nrow, stellarTech, true);
                    else if (cname == "Plasma")
                        makeAdjustments(nrow, plasmaTech, true);
                    else if (cname == "Warp Drive")
                        makeAdjustments(nrow, warpTech, true);
                    else if (cname == "Shielding")
                        makeAdjustments(nrow, shieldTech, true);
                    else if (cname == "Ion")
                        makeAdjustments(nrow, ionTech, true);
                    else if (cname == "Photon")
                        makeAdjustments(nrow, photonTech, true);
                    else if (cname == "Artificial Intelligence")
                        makeAdjustments(nrow, aiTech, true);
                    else if (cname == "Disruptor")
                        makeAdjustments(nrow, disruptorTech, true);
                    else if (cname == "Cybernetics")
                        makeAdjustments(nrow, cyberTech, true);
                    else if (cname == "Tachyon Communications")
                        makeAdjustments(nrow, tachTech, true);
                } else if (location.indexOf('view=defenses') != -1) {
                    if (cname == "Barracks")
                        makeAdjustments(nrow, barrackAdjust);
                    else if (cname == "Laser Turrets")
                        makeAdjustments(nrow, laserAdjust);
                    else if (cname == "Missile Turrets")
                        makeAdjustments(nrow, missileAdjust);
                    else if (cname == "Plasma Turrets")
                        makeAdjustments(nrow, plasmabaseAdjust);
                    else if (cname == "Ion Turrets")
                        makeAdjustments(nrow, ionAdjust);
                    else if (cname == "Photon Turrets")
                        makeAdjustments(nrow, photonAdjust);
                    else if (cname == "Disruptor Turrets")
                        makeAdjustments(nrow, disruptorAdjust);
                    else if (cname == "Deflection Shields")
                        makeAdjustments(nrow, deflectionAdjust);
                    else if (cname == "Planetary Shield")
                        makeAdjustments(nrow, pshieldAdjust);
                    else if (cname == "Planetary Ring")
                        makeAdjustments(nrow, pringAdjust);
                }
                if (flag == 0) {
                    getOptionValue(cname);
                    if (v == 1) {
                        //console.log(table.rows[nrow]);
                        var queueURL = document.getElementById('base-queue').getElementsByTagName('form')[0].getAttribute("action");
                        buttontext = document.createElement("a")
                        buttontext.href = "javascript: void(0);";
                        buttontext.id = "queueLink_" + a;
                        //buttontext.setAttribute("onclick", "document.getElementsByName('item')[0].selectedIndex="+a+"; add_to_queue('"+queueURL+"');");
                        buttontext.innerHTML = "Queue"
                        if (buttontext) {
                            if (getView() == 'Research')
                                colnum = 3;
                            else
                                colnum = 5;
                            table.rows[nrow].childNodes[colnum].style.whiteSpace = ' nowrap';
                            table.rows[nrow].childNodes[colnum].appendChild(buttontext);
                            $("queueLink_" + a).addEventListener("click", function() {
                                addToQueue(this);
                            }, true);
                        }
                    }
                    if (flag == 0 && nrow == table.childNodes.length - 1) {
                        flag = 1;
                        nrow = 1;
                    }
                }
                if (!table.rows[nrow].innerHTML.match(/Research Labs linked to this base research./) && table.rows[nrow + 1]) {
                    table.rows[nrow + 1].getElementsByClassName("help comment")[0].innerHTML = "<div id='itemDetails" + ((nrow + 1) / 2) + "'></div>";
                    if (isNewStyle()) {
                        table.rows[nrow].getElementsByClassName("td_icon non-hilite")[0].firstChild.style.display = "none";
                    }
                }
            }
        }
    }
}

function addToQueue(index) {
    var id = index.id.substr(index.id.indexOf("_") + 1);
    $('item').selectedIndex = id;
    $('add-to-queue').click();
}

var oldFunction = unsafeWindow.show_success;
unsafeWindow.show_success = function() {
    oldFunction();
    enhanceConstructionPage(true);
};

function show_start() {
    $("queueLoaderTemplate").delay(1000).show(200);
}

function grabCaps() {
    capArray = $("empire_capacities").getElementsByClassName("layout listing sorttable")[0].childNodes[1];
    cons = "";
    prod = "";
    res = "";
    shipyards = "";
    os = "";
    cmdr = "";
    for (x = 0; x < capArray.rows.length; x++) {
        if (capArray.rows[x].cells[7].innerHTML.match("Production")) {
            prodcmdr = 1 + (capArray.rows[x].cells[7].innerHTML.match(/Production ([0-9]+)/)[1] / 100)
        } else {
            prodcmdr = 1
        }

        cons = cons + capArray.rows[x].cells[4].innerHTML + ","
        prod = prod + capArray.rows[x].cells[5].innerHTML.match(/[0-9]+/) + ","
        res = res + capArray.rows[x].cells[6].innerHTML.match(/[0-9]+/) + ","
        shipyards = shipyards + capArray.rows[x].cells[5].innerHTML.match(/([0-9]+)\//)[1] + ","
        os = os + capArray.rows[x].cells[5].innerHTML.match(/\/([0-9]+)/)[1] + ","
        cmdr = cmdr + prodcmdr + ","
    }

    setSetting("Construction Cap", cons)
    setSetting("Production Cap", prod)
    setSetting("Research Cap", res)
    setSetting("Shipyards", shipyards)
    setSetting("Orbital Shipyards", os)
    setSetting("Production Commanders", cmdr)
}

function makeAdjustments(nrow, adjustvar, tech) {
    try {
        adjust = adjustvar
        if (tech) {
            if (table.rows[nrow].childNodes[4].innerHTML.match(/<span id="time/)) {
                adjust++
            }
            if (adjust > 0) {
                basecost = parseNum(table.rows[nrow].childNodes[2].firstChild.nodeValue)
                time = getSeconds(table.rows[nrow].childNodes[3].firstChild.nodeValue) / basecost
                time = secsToHMS(time * (Math.round(basecost * Math.pow(1.5, adjust))))
                table.rows[nrow].childNodes[3].innerHTML = table.rows[nrow].childNodes[3].innerHTML + "<font id='bestSpan' style='color:#2B60DE'><br /> (" + time + ")</font> ";
                table.rows[nrow].childNodes[1].innerHTML = table.rows[nrow].childNodes[1].innerHTML + "<font id='bestSpan' style='color:#2B60DE'> (+" + adjust + ")</font>";
                table.rows[nrow].childNodes[2].innerHTML = table.rows[nrow].childNodes[2].innerHTML + " <font id='bestSpan' style='color:#2B60DE'> (" + Math.round((basecost * Math.pow(1.5, adjust))) + ")</font>";
                itemcost = table.rows[nrow].childNodes[2].childNodes[1].innerHTML.replace(/[,\.\ ]/g, '');
                itemcost = itemcost.replace(/\(/, "")
                itemcost = itemcost.replace(/\)/, "")
            } else {
                itemcost = parseNum(table.rows[nrow].childNodes[2].firstChild.nodeValue)
            }
        } else {
            if (table.rows[nrow].childNodes[6].innerHTML.match(/<span id="time/)) {
                adjust++
            }
            if (adjust > 0) {
                basecost = parseNum(table.rows[nrow].childNodes[2].firstChild.nodeValue)
                time = getSeconds(table.rows[nrow].childNodes[5].firstChild.nodeValue) / basecost
                time = secsToHMS(time * (Math.round(basecost * Math.pow(1.5, adjust))))
                table.rows[nrow].childNodes[5].innerHTML = table.rows[nrow].childNodes[5].innerHTML + "<font id='bestSpan' style='color:#2B60DE'><br /> (" + time + ") </font>"
                table.rows[nrow].childNodes[1].innerHTML = table.rows[nrow].childNodes[1].innerHTML + "<font id='bestSpan' style='color:#2B60DE'> (+" + adjust + ")</font>"
                table.rows[nrow].childNodes[2].innerHTML = table.rows[nrow].childNodes[2].innerHTML + "<font id='bestSpan' style='color:#2B60DE'> (" + Math.round((basecost * Math.pow(1.5, adjust))) + ")</font>"
                itemcost = table.rows[nrow].childNodes[2].childNodes[1].innerHTML.replace(/[,\.\ ]/g, '');
                itemcost = itemcost.replace(/\(/, "")
                itemcost = itemcost.replace(/\)/, "")
            } else {
                itemcost = parseNum(table.rows[nrow].childNodes[2].firstChild.nodeValue)
            }
        }
    } catch (e) {
        console.log(e + "")
    }
}

function secsToHMS(seconds) {
    secVar0 = Math.round(seconds); // The initial data, in seconds
    minVar = Math.floor(secVar0 / 60); // The minutes
    hourVar = Math.floor(minVar / 60); // The minutes
    minVar = minVar % 60;
    secVar = secVar0 % 60; // The balance of seconds
    if (hourVar != 0) {
        return hourVar + "h " + (minVar < 10 ? '0' + minVar : minVar) + "m " + (secVar < 10 ? '0' + secVar : secVar) + "s"
    } else if (minVar != 0) {
        return (minVar < 10 ? '0' + minVar : minVar) + "m " + (secVar < 10 ? '0' + secVar : secVar) + "s"
    } else {
        return (secVar < 10 ? '0' + secVar : secVar) + "s"
    }

}

function getOptionValue(obj) {
    v = 0
    x = document.getElementsByName("item")
    if (x[0]) {
        x = x[0]
        for (i = 0; i < x.length; i++) {
            if (x.options[i].text == obj) {
                v = 1;
                a = i
                i = x.length
            }
        }
    }
}

function stripProductionDescriptions() {
    var helpCells = document.evaluate(
        "//td[@class='help comment']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    //console.log(helpCells.snapshotLength);
    for (var i = 0; i < helpCells.snapshotLength; i++) {
        helpCells.snapshotItem(i).innerHTML = "";
    }
}

// Set-up to use getMouseXY function onMouseMove
document.addEventListener("mousemove", getMouseXY, true);

// Temporary variables to hold mouse x-y pos.s
var tempX = 0
var tempY = 0

// Main function to retrieve mouse x-y pos.s

function getMouseXY(e) {
    // grab the x-y pos.s if browser is NS
    tempX = e.pageX
    tempY = e.pageY
    // catch possible negative values in NS4
    if (tempX < 0) {
        tempX = 0
    }
    if (tempY < 0) {
        tempY = 0
    }
    // show the position values in the form named Show
    // in the text fields named MouseX and MouseY
    return true
}
//==========================================
// End of Prod/cons helper
//==========================================
function isConfirmPage() {
    var temp = false;
    var confirmTitle = document.evaluate(
        "//b[text() ='Confirm Attack']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    //console.log(confirmTitle.snapshotItem(0));
    if (confirmTitle.snapshotLength >= 1) {
        temp = true;
    }
    //console.log("isConfirmPage() returned "+temp+", complete.");
    return temp;
}



//==========================================
// Enhanced Production Page
//==========================================
var tableRows = 0;

function enhancedProduction() {
    var ProdTableRows = document.evaluate("//table[@class='layout listing sorttable']//tbody//tr[@align='center']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);

    var rowSelectHTML = "<select name='unit' id='unit_global' onfocus=\"selectedBox='unit_global'\">";
    var ft = false,
        bo = false,
        hm = false,
        ib = false,
        cv = false,
        rc = false,
        de = false,
        fr = false,
        iof = false,
        ss = false,
        os = false,
        cr = false,
        ca = false,
        hc = false,
        bs = false,
        fc = false,
        dn = false,
        ti = false,
        le = false,
        ds = false;

    var ProdTable = ProdTableRows.snapshotItem(0).parentNode.parentNode;
    for (var i = 0; i < ProdTableRows.snapshotLength; i++) {
        var selObject = ProdTableRows.snapshotItem(i).childNodes[3].firstChild;
        maxUnit = selObject.length;
        for (var x = 0; x < maxUnit; x++) {
            switch (selObject.childNodes[x].value) {
                case "Fighters":
                    if (!ft) {
                        rowSelectHTML += "<option value='Fighters'>Fighters</option>";
                        ft = true;
                    }
                    break;
                case "Bombers":
                    if (!bo) {
                        rowSelectHTML += "<option value='Bombers'>Bombers</option>";
                        bo = true;
                    }
                    break;
                case "Heavy Bombers":
                    if (!hm) {
                        rowSelectHTML += "<option value='Heavy Bombers'>Heavy Bombers</option>";
                        hm = true;
                    }
                    break;
                case "Ion Bombers":
                    if (!ib) {
                        rowSelectHTML += "<option value='Ion Bombers'>Ion Bombers</option>";
                        ib = true;
                    }
                    break;
                case "Corvette":
                    if (!cv) {
                        rowSelectHTML += "<option value='Corvette'>Corvette</option>";
                        cv = true;
                    }
                    break;
                case "Recycler":
                    if (!rc) {
                        rowSelectHTML += "<option value='Recycler'>Recycler</option>";
                        rc = true;
                    }
                    break;
                case "Destroyer":
                    if (!de) {
                        rowSelectHTML += "<option value='Destroyer'>Destroyer</option>";
                        de = true;
                    }
                    break;
                case "Frigate":
                    if (!fr) {
                        rowSelectHTML += "<option value='Frigate'>Frigate</option>";
                        fr = true;
                    }
                    break;
                case "Ion Frigate":
                    if (!iof) {
                        rowSelectHTML += "<option value='Ion Frigate'>Ion Frigate</option>";
                        iof = true;
                    }
                    break;
                case "Scout Ship":
                    if (!ss) {
                        rowSelectHTML += "<option value='Scout Ship'>Scout Ship</option>";
                        ss = true;
                    }
                    break;
                case "Outpost Ship":
                    if (!os) {
                        rowSelectHTML += "<option value='Outpost Ship'>Outpost Ship</option>";
                        os = true;
                    }
                    break;
                case "Cruiser":
                    if (!cr) {
                        rowSelectHTML += "<option value='Cruiser'>Cruiser</option>";
                        cr = true;
                    }
                    break;
                case "Carrier":
                    if (!ca) {
                        rowSelectHTML += "<option value='Carrier'>Carrier</option>";
                        ca = true;
                    }
                    break;
                case "Heavy Cruiser":
                    if (!hc) {
                        rowSelectHTML += "<option value='Heavy Cruiser'>Heavy Cruiser</option>";
                        hc = true;
                    }
                    break;
                case "Battleship":
                    if (!bs) {
                        rowSelectHTML += "<option value='Battleship'>Battleship</option>";
                        bs = true;
                    }
                    break;
                case "Fleet Carrier":
                    if (!fc) {
                        rowSelectHTML += "<option value='Fleet Carrier'>Fleet Carrier</option>";
                        fc = true;
                    }
                    break;
                case "Dreadnought":
                    if (!dn) {
                        rowSelectHTML += "<option value='Dreadnought'>Dreadnought</option>";
                        dn = true;
                    }
                    break;
                case "Titan":
                    if (!ti) {
                        rowSelectHTML += "<option value='Titan'>Titan</option>";
                        ti = true;
                    }
                    break;
                case "Leviathan":
                    if (!le) {
                        rowSelectHTML += "<option value='Leviathan'>Leviathan</option>";
                        le = true;
                    }
                    break;
                case "Death Star":
                    if (!ds) {
                        rowSelectHTML += "<option value='Death Star'>Death Star</option>";
                        ds = true;
                    }
                    break;
            }
        }
        tableRows++;
    }
    rowSelectHTML += "<option value='Goods'>Goods</option>";
    rowSelectHTML += "</select>";

    var l = document.createElement("tr");
    l.id = "spacer"
    ProdTable.appendChild(l);
    l = document.createElement("td");
    l.innerHTML = "<hr style='margin:0px; padding:5px; border:0px black solid;'>";
    l.colSpan = "8";
    l.align = "center";
    $("spacer").appendChild(l);

    l = document.createElement("tr");
    l.id = "globalRow";
    l.onmouseout = "rowOut(this)";
    l.onmouseover = "rowOut(this)";
    ProdTable.appendChild(l);
    l = document.createElement("td");
    l.innerHTML = "Global Settings (Affects all bases)";
    l.colSpan = "3";
    l.align = "center";
    $("globalRow").appendChild(l);
    l = document.createElement("td");
    l.innerHTML = rowSelectHTML;
    l.align = "right";
    $("globalRow").appendChild(l);

    l = document.createElement("td");
    l.innerHTML = "<input type='text' tabindex='" + (tableRows + 1) + "' onclick='cancelEvent(event);' class='input-numeric quant' onkeyup='update_row(&quot;3&quot;); rowActive(&quot;row3&quot;, this);' maxlength='5' size='5' id='quant_global'>";
    l.align = "center";
    $("globalRow").appendChild(l)

    l = document.createElement("td");
    l.innerHTML = "";
    l.colSpan = "3";
    l.align = "center";
    $("globalRow").appendChild(l);


    l = document.createElement("tr");
    l.id = "extraRow";
    l.onmouseout = "rowOut(this)";
    l.onmouseover = "rowOut(this)";
    ProdTable.appendChild(l);
    l = document.createElement("td");
    l.colSpan = "3";
    l.align = "center";
    $("extraRow").appendChild(l);

    l = document.createElement("td");
    l.align = "right";
    l.id = 'resetU';
    $("extraRow").appendChild(l);
    l = document.createElement("input");
    l.type = "reset";
    l.id = "resetValuesButton";
    l.value = "Reset Units";
    $("resetU").appendChild(l);

    l = document.createElement("td");
    l.align = "center";
    l.id = 'resetQ';
    $("extraRow").appendChild(l)
    l = document.createElement("input");
    l.type = "reset";
    l.id = "resetButton";
    l.value = "Reset Quantitys";
    $("resetQ").appendChild(l);

    l = document.createElement("td");
    l.innerHTML = "";
    l.colSpan = "3";
    l.align = "center";

    $("unit_global").addEventListener('change', function() {
        globalProdHelperEvent(ProdTable);
    }, true);
    $("quant_global").addEventListener('keyup', function() {
        globalQuantSetHelperEvent(ProdTable);
    }, true);
    $("resetButton").addEventListener('click', function() {
        resetForm(false);
    }, true);
    $("resetValuesButton").addEventListener('click', function() {
        resetForm(true);
    }, true);
}
var prodReset = false;

function resetForm(units) {
    prodReset = true;
    for (i = 1; i <= tableRows; i++) {
        if (units) {
            $("select_" + i).selectedIndex = 0;
        } else {
            $("quant_" + i).value = 0;
            update_row(i);
        }
    }
    if (units)
        $("unit_global").selectedIndex = 0;
    else
        $("quant_global").value = 0;

    prodReset = false;
}

function globalProdHelperEvent(table) {
    if (prodReset)
        return;
    var selectedDex = $("unit_global").options[$("unit_global").selectedIndex].value;
    for (var i = 0; i < table.childNodes[1].childNodes.length; i += 2) {
        if (table.childNodes[1].childNodes[i].childNodes[3]) {
            var rowData = table.childNodes[1].childNodes[i].childNodes[3].firstChild;
            if (rowData) {
                var x = rowData.options.length;
                while (x--) {
                    if (rowData.options[x].value == selectedDex) {
                        rowData.options[x].selected = true;
                        //rowData.parentNode.setAttribute("sorttable_customkey",x);
                        break;
                    }
                }
                var num = rowData.id.split("_");
                update_row(num[1]);
            }
        }
    }
}

function globalQuantSetHelperEvent(table) {
    if (prodReset)
        return;
    var selectedDex = $("unit_global").options[$("unit_global").selectedIndex].value;
    for (var i = 0; i < table.childNodes[1].childNodes.length; i += 2) {
        if (table.childNodes[1].childNodes[i].childNodes[3]) {
            var rowData = table.childNodes[1].childNodes[i].childNodes[3].firstChild;
            if (rowData) {
                if (rowData.childNodes[rowData.selectedIndex].value == selectedDex) {
                    var num = rowData.id.split("_");
                    $("quant_" + num[1]).value = $("quant_global").value;
                    update_row(num[1]);
                }
            }
        }
    }
}

function update_row(row) {
    update_row2(row);
    update_t_cred();
}

function update_row2(row) {
    var unit = "";
    var price = 0;
    var quant = 0;
    var cost = 0;
    var prod = 0;
    var time = 0;
    var start_time = 0;
    var total_time = 0;
    var quant_str = "";

    unit = document.getElementById("select_" + row).value;
    prod = Number(document.getElementById("prod_" + row).title);

    if (document.getElementById("fast").checked == true && unit != 'Goods')
        prod *= 2;

    price = shipValues[getShipIndex(unit)];

    quant_str = document.getElementById("quant_" + row).value;

    if (quant_str.indexOf("m") > 0)
        process_date(row, quant_str, prod, price)

    if (quant_str.indexOf("d") > 0)
        process_date(row, quant_str, prod, price)

    if (quant_str.indexOf("h") > 0)
        process_date(row, quant_str, prod, price)

    quant = Number(document.getElementById("quant_" + row).value);
    start_time = Number(document.getElementById("cred_" + row).title);

    cost = quant * price;

    if (cost == 0) {
        document.getElementById("cred_" + row).innerHTML = "";
        document.getElementById("prod_time_" + row).title = 0;
        document.getElementById("prod_time_" + row).innerHTML = "";
        document.getElementById("time" + row).title = start_time;
    } else {
        time = Math.round(cost * 3600 / prod);
        total_time = start_time + time;

        if (document.getElementById("fast").checked == true && unit != 'Goods')
            cost *= 2;

        document.getElementById("cred_" + row).innerHTML = cost;
        document.getElementById("prod_time_" + row).title = time;
        document.getElementById("prod_time_" + row).innerHTML = time_txt(time);
        document.getElementById("time" + row).title = total_time;
    }
}

function process_date(row, quant_str, prod, price) {
    var time = 0;
    var quant = 0;

    if (quant_str.indexOf("m") > 0) {
        time = Number(quant_str.substring(0, quant_str.indexOf("m")))
        quant = Math.round(((time / 60) * prod / price))
    }

    if (quant_str.indexOf("h") > 0) {
        time = Number(quant_str.substring(0, quant_str.indexOf("h")))
        quant = Math.round(((time) * prod / price))
    }

    if (quant_str.indexOf("d") > 0) {
        time = Number(quant_str.substring(0, quant_str.indexOf("d")))
        quant = Math.round(((time * 24) * prod / price))
    }

    document.getElementById("quant_" + row).value = quant;
}

function time_txt(s) // Write tempo string
{
    var m = 0;
    var h = 0;

    if (s > 59) m = Math.floor(s / 60);
    s = s - m * 60;
    if (m > 59) h = Math.floor(m / 60);
    m = m - h * 60;
    if (s < 10) s = "0" + s;
    if (m < 10) m = "0" + m;

    if (h > 0) return h + "h " + m + "m " + s + "s";
    if (m > 0) return m + "m " + s + "s";
    return s + "s";
}

function update_t_cred() {
    var i = 0;
    var t_rows = 0;
    var t_cred = 0;

    t_rows = Number(document.getElementById("t_rows").title);

    for (i = 1; i <= t_rows; i++) {
        t_cred += Number(document.getElementById("cred_" + i).innerHTML);
    }

    document.getElementById("t_cred").innerHTML = t_cred;
}

function change_fast() {
    var i = 0;
    var t_rows = 0;
    var t_cred = 0;

    t_rows = Number(document.getElementById("t_rows").title);

    for (i = 1; i <= t_rows; i++) {
        update_row2(i);
    }

    update_t_cred();
}

//==========================================
// End of Enhanced Production Page
//==========================================
//==========================================
// Free Account Capacity Setting Script
//==========================================
var baseIDs = new Array();

function Contains(list, obj) {
    var i = list.length;
    while (i--) {
        if (list[i] == obj) {
            return true;
        }
    }
    return false;
}

function setBaseCapInfo() {
    var baseID = parseInt(location.substring(location.indexOf("base=") + 5));
    //var baseInfo = document.evaluate("//table[@id='base_processing-capacities']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.firstChild.childNodes[1].firstChild.firstChild.firstChild;
    var baseInfo = document.evaluate("//table[@class = 'layout listing3']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(1).firstChild;
    //console.log(baseInfo);
    var playerName = getPlayerName(baseInfo.childNodes[7].childNodes[1].textContent)
    //  console.log(playerName);
    if (playerName == getSetting(MY_NAME_KEY, "Newb")) {
        var bNameS = "@class = 'base'";
        if (isNewStyle()) {
            bNameS = "@id = 'astro-details'";
        }
        var baseName = document.evaluate("//table[" + bNameS + "]/tbody/tr", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (isNewStyle()) {
            baseName = baseName.firstChild.textContent;
            if (baseName.indexOf("Astro Type:") != -1) {
                baseName = baseName.substring(0, baseName.indexOf("Astro Type:"));
            }
        } else
            baseName = baseName.childNodes[1].textContent;
        //console.log(baseName);
        var baseLoc = document.evaluate("//a[contains(@href,'map.aspx?loc=')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
        //console.log(baseLoc);
        var construct = "Construction:" + baseInfo.childNodes[0].childNodes[1].textContent;
        var prod = "Production:" + baseInfo.childNodes[1].childNodes[1].textContent;
        var res = "Research:" + baseInfo.childNodes[2].childNodes[1].textContent;
        var econ = "Economy:" + baseInfo.childNodes[4].childNodes[1].textContent;
        var ownerEcon = "Owner Income:" + baseInfo.childNodes[5].childNodes[1].textContent;
        //  console.log(construct);
        //  console.log(prod);
        //  console.log(res);
        //  console.log(econ);
        //  console.log(ownerEcon);  box_content astro-details_content

        var structureInfo = document.evaluate("//table[@id='base_resume-structures']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        structureInfo = structureInfo.getElementsByClassName('layout')[0].firstChild.childNodes[1];
        var stucts = structureInfo.childNodes[0].innerHTML.split("<br>");
        var amounts = structureInfo.childNodes[1].innerHTML.split("<br>");
        var sIdex = stucts.indexOf("Shipyards");
        var osIdex = stucts.indexOf("Orbital Shipyards");
        var rIdex = stucts.indexOf("Research Labs");
        var syards = 0;
        var osyards = 0;
        var rLabs = 0;
        if (sIdex != -1) {
            syards = amounts[sIdex];
        }
        if (osIdex != -1) {
            osyards = amounts[osIdex];
        }
        if (rIdex != -1) {
            rLabs = amounts[rIdex];
        }
        syards = "Shipyards: " + syards;
        osyards = "OrbitalShipyards: " + osyards;
        rLabs = "ResearchLabs: " + rLabs;
        //console.log(syards+" "+osyards+" "+rLabs);
        var commanderInfo = document.evaluate("//a[contains(@href,'commander.aspx?commander')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (commanderInfo)
            commanderInfo = commanderInfo.parentNode.textContent;
        else
            commanderInfo = "";
        var rSide = document.evaluate("//b[text() = 'Astro Type:']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode.innerHTML;
        var aType = "Type:" + rSide.substring(rSide.indexOf("Terrain:</b>") + 13, rSide.indexOf("<b>Area:")) + " " + rSide.substring(rSide.indexOf("</b>") + 5, rSide.indexOf("<b>Terrain"));
        //console.log(aType);
        while (aType.indexOf("<br>") != -1)
            aType = aType.replace("<br>", "");
        var saveBaseDataString = baseName + "<" + baseLoc + "<" + aType + "<" + econ + "<" + ownerEcon + "<" + construct + "<" + prod + "<" + res + "<" + commanderInfo + "<" + syards + "<" + osyards + "<" + rLabs;
        var oldBaseData = getSetting(baseID + "", "");
        //console.log(saveBaseDataString);
        var specStru = structureInfo.childNodes[2].innerHTML.split("<br>");
        var specStruAmounts = structureInfo.childNodes[3].innerHTML.split("<br>");
        var defStru = structureInfo.childNodes[4].innerHTML.split("<br>");
        var defStruAmounts = structureInfo.childNodes[5].innerHTML.split("<br>");
        var saveBaseStructString = baseName + "<";
        for (var i = 0; i < stucts.length; i++) {
            if (stucts[i] != "") {
                saveBaseStructString += stucts[i] + ":" + amounts[i];
                if (i < stucts.length - 1)
                    saveBaseStructString += "<";
            }
        }
        for (var i = 0; i < specStru.length; i++) {
            if (specStru[i] != "") {
                saveBaseStructString += specStru[i] + ":" + specStruAmounts[i];
                if (i < specStru.length - 1)
                    saveBaseStructString += "<";
            }
        }
        for (var i = 0; i < defStru.length; i++) {
            if (defStru[i] != "") {
                saveBaseStructString += defStru[i] + ":" + defStruAmounts[i];
                if (i < defStru.length - 1)
                    saveBaseStructString += "<";
            }
        }
        //console.log(saveBaseStructString);
        setSetting(baseID + "", saveBaseDataString);
        setSetting(baseID + "_structs", saveBaseStructString);
        //console.log(baseID+"_structs");
        var ids = getSetting(BASE_LIST_KEY, "");
        if (!Contains(ids.split(','), baseID + "")) {
            if (ids == "")
                ids = baseID + "";
            else
                ids += "," + baseID;
            //console.log(ids);
            setSetting(BASE_LIST_KEY, ids);
        }
    }
}

function displayStructPage() {
    var ids = getSetting(BASE_LIST_KEY, "");
    if (ids == "") {
        notify("Structures not set! Please visit your bases Overview pages.")
    } else {
        //debug('your not upgraded');
        var doc = document.evaluate("//table[@id='empire_upgraded-only']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.firstChild;
        doc.setAttribute("id", "empire_structures");
        doc.innerHTML = "<tr><th class='th_header2' style='border: 0px none ;'><font size='+1'>S</font>TRUCTURES</th></tr>";
        var innerTable = "<tr><td class='content' style='padding: 0px;'>" +
            "<table class='layout listing1'><tbody><tr align='center'>" +
            "<th width='*'/>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>U<br/>R<br/>B<br/>A<br/>N<br/><br/>S<br/>T<br/>R<br/>U<br/>C<br/>T<br/>U<br/>R<br/>E<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>S<br/>O<br/>L<br/>A<br/>R<br/> <br/>P<br/>L<br/>A<br/>N<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>G<br/>A<br/>S<br/> <br/>P<br/>L<br/>A<br/>N<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>F<br/>U<br/>S<br/>I<br/>O<br/>N<br/> <br/>P<br/>L<br/>A<br/>N<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>A<br/>N<br/>T<br/>I<br/>M<br/>A<br/>T<br/>T<br/>E<br/>R<br/> <br/>P<br/>L<br/>A<br/>N<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>R<br/>E<br/>S<br/>E<br/>A<br/>R<br/>C<br/>H<br/> <br/>L<br/>A<br/>B<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>M<br/>E<br/>T<br/>A<br/>L<br/> <br/>R<br/>E<br/>F<br/>I<br/>N<br/>E<br/>R<br/>I<br/>E<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>C<br/>R<br/>Y<br/>S<br/>T<br/>A<br/>L<br/> <br/>M<br/>I<br/>N<br/>E<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>R<br/>O<br/>B<br/>O<br/>T<br/>I<br/>C<br/> <br/>F<br/>A<br/>C<br/>T<br/>O<br/>R<br/>I<br/>E<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>S<br/>H<br/>I<br/>P<br/>Y<br/>A<br/>R<br/>D<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>O<br/>R<br/>B<br/>I<br/>T<br/>A<br/>L<br/> <br/>S<br/>H<br/>I<br/>P<br/>Y<br/>A<br/>R<br/>D<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>S<br/>P<br/>A<br/>C<br/>E<br/>P<br/>O<br/>R<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>C<br/>O<br/>M<br/>M<br/>A<br/>N<br/>D<br/> <br/>C<br/>E<br/>N<br/>T<br/>E<br/>R<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>N<br/>A<br/>N<br/>I<br/>T<br/>E<br/> <br/>F<br/>A<br/>C<br/>T<br/>O<br/>R<br/>I<br/>E<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>A<br/>N<br/>D<br/>R<br/>O<br/>I<br/>D<br/> <br/>F<br/>A<br/>C<br/>T<br/>O<br/>R<br/>I<br/>E<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>E<br/>C<br/>O<br/>N<br/>O<br/>M<br/>I<br/>C<br/> <br/>C<br/>E<br/>N<br/>T<br/>E<br/>R<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>T<br/>E<br/>R<br/>R<br/>A<br/>F<br/>O<br/>R<br/>M<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>M<br/>U<br/>L<br/>T<br/>I<br/>-<br/>L<br/>E<br/>V<br/>E<br/>L<br/> <br/>P<br/>L<br/>A<br/>T<br/>F<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>O<br/>R<br/>B<br/>I<br/>T<br/>A<br/>L<br/> <br/>B<br/>A<br/>S<br/>E<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>J<br/>U<br/>M<br/>P<br/> <br/>G<br/>A<br/>T<br/>E<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>B<br/>I<br/>O<br/>S<br/>P<br/>H<br/>E<br/>R<br/>E<br/> <br/>M<br/>O<br/>D<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>C<br/>A<br/>P<br/>I<br/>T<br/>A<br/>L<br/></th>" +
            "<th width='12'/>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>B<br/>A<br/>R<br/>R<br/>A<br/>C<br/>K<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>L<br/>A<br/>S<br/>E<br/>R<br/> <br/>T<br/>U<br/>R<br/>R<br/>E<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>M<br/>I<br/>S<br/>S<br/>I<br/>L<br/>E<br/> <br/>T<br/>U<br/>R<br/>R<br/>E<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>P<br/>L<br/>A<br/>S<br/>M<br/>A<br/> <br/>T<br/>U<br/>R<br/>R<br/>E<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>I<br/>O<br/>N<br/> <br/>T<br/>U<br/>R<br/>R<br/>E<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>P<br/>H<br/>O<br/>T<br/>O<br/>N<br/> <br/>T<br/>U<br/>R<br/>R<br/>E<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>D<br/>I<br/>S<br/>R<br/>U<br/>P<br/>T<br/>O<br/>R<br/> <br/>T<br/>U<br/>R<br/>R<br/>E<br/>T<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>D<br/>E<br/>F<br/>L<br/>E<br/>C<br/>T<br/>I<br/>O<br/>N<br/> <br/>S<br/>H<br/>I<br/>E<br/>L<br/>D<br/>S<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>P<br/>L<br/>A<br/>N<br/>E<br/>T<br/>A<br/>R<br/>Y<br/> <br/>S<br/>H<br/>I<br/>E<br/>L<br/>D<br/></th>" +
            "<th width='18' style='border: 1px solid rgb(0, 0, 102); font-family: verdana,arial; font-style: normal; font-variant: normal; font-weight: normal; font-size: 8px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; vertical-align: bottom;'>P<br/>L<br/>A<br/>N<br/>E<br/>T<br/>A<br/>R<br/>Y<br/> <br/>R<br/>I<br/>N<br/>G<br/></th>" +
            "</tr>";
        var idList = ids.split(',');
        for (var i = 0; i < idList.length; i++) {
            var baseData = getSetting(idList[i] + "_structs", "").split('<');
            if (baseData != "") {
                //console.log(baseData);
                innerTable += "<tr align='center'><td><a href='base.aspx?base=" + idList[i] + "'>" + baseData[0] + "</a>";
                var sNames = new Array("Urban Structures", "Solar Plants", "Gas Plants", "Fusion Plants", "Antimatter Plants", "Research Labs", "Metal Refineries", "Crystalk Mines", "Robotic Factories", "Shipyards", "Orbital Shipyards", "Spaceports", "Command Centers", "Nanite Factories", "Android Factories", "Economic Centers", "Terraform", "Multi-Level Platforms", "Orbital Base", "Jump Gate", "Biosphere Modification", "Capital", "", "Barracks", "Laser Turrets", "Missile Turrets", "Plasma Turrets", "Ion Turrets", "Photon Turrets", "Disruptor Turrets", "Deflection Shields", "Planetary Shield", "Planetary Ring");
                for (var x = 0; x < 33; x++) {
                    if (x != 22) {
                        var tSName = sNames[x];
                        var innerSmall = "";
                        for (var z = 1; z < baseData.length; z++) {
                            var sName = baseData[z].substring(0, baseData[z].indexOf(":"));
                            if (sName == tSName) {
                                var num = baseData[z].substring(baseData[z].indexOf(":") + 1);
                                if (num.indexOf("/") != -1)
                                    num = parseNum(num.substring(num.indexOf("/") + 2)) / 5;
                                innerSmall = "<small>" + num + "</small>";
                                break;
                            }
                        }
                        innerTable += "<td style='border-style: solid; border-color: rgb(0, 0, 102); border-width: 0pt 1px 1px;'>" + innerSmall + "</td>";
                    } else
                        innerTable += "<td></td>";
                }
                innerTable += "</td></tr>";
            }
        }
        innerTable += "</tbody></table></td></tr>";
        doc.innerHTML += innerTable;
    }
}

function displayCapPage() {
    var ids = getSetting(BASE_LIST_KEY, "");
    if (ids == "") {
        notify("Capacities not set! Please visit your bases Overview pages.")
    } else {
        var econTotal = 0;
        var ownerEconTotal = 0;
        var constTotal = 0;
        var prodTotal = 0;
        var resTotal = 0;
        var doc = document.evaluate("//table[@id='empire_upgraded-only']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.firstChild;
        doc.innerHTML = "<tr><th class='th_header2' style='border: 0px none ;'><font size='+1'>B</font>ASES PROCESSING CAPACITIES</th></tr>";
        var innerTable = "<tr><td class='content' style='padding: 0px;'>" +
            "<table class='layout listing'><tbody><tr class='listing-header'>" +
            "<th>Name</th><th>Location</th><th>Type</th><th>Economy</th><th>Construction</th><th>Production <small>(Shipyards)</small></th><th>Research <small>(Labs)</small></th></tr>";
        var idList = ids.split(',');
        for (var i = 0; i < idList.length; i++) {
            var baseData = getSetting(idList[i], "").split('<');
            if (baseData != "") {
                //console.log(baseData);
                var color = "";
                var bName = baseData[0];
                var bLoc = baseData[1];
                var bType = baseData[2].substring(baseData[2].indexOf(':') + 1).split(' ');
                var bOEcon = parseInt(baseData[3].substring(baseData[3].indexOf(':') + 1));
                var bEcon = parseInt(baseData[4].substring(baseData[4].indexOf(':') + 1));
                ownerEconTotal += bOEcon;
                econTotal += bEcon;
                var bConst = parseInt(baseData[5].substring(baseData[5].indexOf(':') + 1));
                constTotal += bConst;
                var bProd = parseInt(baseData[6].substring(baseData[6].indexOf(':') + 1));
                prodTotal += bProd;
                var bRes = parseInt(baseData[7].substring(baseData[7].indexOf(':') + 1));
                resTotal += bRes;
                var sYards = baseData[9].substring(baseData[9].indexOf(':') + 2);
                var osYards = baseData[10].substring(baseData[10].indexOf(':') + 2);
                var rLabs = baseData[11].substring(baseData[11].indexOf(':') + 2);
                if (bOEcon < bEcon)
                    color = "red";

                innerTable += "<tr align='center' style='color:" + color + "'><td><a href='base.aspx?base=" + idList[i] + "'>" + bName + "</a></td>" +
                    "<td><a href='map.aspx?loc=" + bLoc + "'>" + bLoc + "</a></td>" +
                    "<td>" + bType[0] + "<small> " + bType[1] + "</small></td>" +
                    "<td>" + bOEcon + " / " + bEcon + "</td>" +
                    "<td>" + bConst + "</td>" +
                    "<td>" + bProd + " (" + sYards + "/" + osYards + ")</td>" +
                    "<td>" + bRes + " (" + rLabs + ")</td>" +
                    "</tr>";
                innerTable += "<tr><td class='help comment' colspan='7'>" + baseData[8] + "</td></tr>";
            }
        }
        innerTable += "<tr align='center'><td/><th>Sum</th><td/><td><b>" + ownerEconTotal + "/" + econTotal + "</b></td><td><b>" + constTotal + "</b></td><td><b>" + prodTotal + "</b></td><td><b>" + resTotal + "</b></td></tr>" +
            "</tbody></table></td></tr>";
        doc.innerHTML += innerTable;
        doc.innerHTML += "<tr><td align='center'><small>Occupied bases have capacities reduced and are shown in red.</small></td></tr>";

    }
}
//==========================================
// End of Free Account Capacity Setting Script
//==========================================
//==========================================
// Quick Bar
//==========================================

function showQuickBar() {
    var fixedQB = "fixed";
    if (!getSetting(QUICK_BAR_FIX, true))
        fixedQB = "absolute";
    var qb = document.createElement("div");
    qb.id = "QuickBar";
    qb.setAttribute("style", "position:" + fixedQB + "; top:25px; left 5px; text-align:left;");
    qb.innerHTML = "<b><u>Quick Bar</u></b><br/>";
    var expandLink = document.createElement("a");
    expandLink.setAttribute("href", "javascript:void(0)");
    expandLink.innerHTML = "+ Distance Calc";
    expandLink.id = "qb_Expand";
    expandLink.addEventListener("click", function() {
        expandQB(this.id);
    }, true);
    qb.appendChild(expandLink);
    var disCalc = document.createElement("table");
    disCalc.innerHTML = "<tr><td>Start Location</td><td><input type='text' id='qb_DistCalc_Start' size='12' /></td></tr>" +
        "<tr><td>End Location</td><td><input type='text' id='qb_DistCalc_End' size='12' /></td></tr>" +
        "<tr><td>Largest Unit</td><td><select name='unit' id='qb_unitSel'>" +
        "<option value='0'>N/A</option>" +
        "<option value='12'>SS</option>" +
        "<option value='8'>CV</option>" +
        "<option value='5'>RC/DE/FR/IF</option>" +
        "<option value='4'>CR/CA</option>" +
        "<option value='3'>OS/HC/BS/FC</option>" +
        "<option value='2'>DN</option>" +
        "<option value='1'>TI/LE/DS</option>" +
        "</select></td></tr>" +
        "<tr><td>Warp Level</td><td><input type='text' id='qb_DistCalc_Warp' size='7' /></td></tr>" +
        "<tr><td>Gate Level</td><td><input type='text' id='qb_DistCalc_Gate' size='7' /></td></tr>" +
        "<tr><td>Log Com Level</td><td><input type='text' id='qb_DistCalc_Com' size='7' /></td></tr>" +
        "<tr><td>Server Arrive Time</td><td><input type='text' id='qb_DistCalc_Time' /></td></tr>" +
        "<tr><th colspan='2'>Results</th></tr>" +
        "<tr><td>Distance:</td><td><div id='qb_Distance'></div></td></tr>" +
        "<tr><td>Duration:</td><td><div id='qb_Duration'></div></td></tr>" +
        "<tr><td>Launch Time:</td><td><div id='qb_Launch'></div></td></tr>" +
        "<tr align='right'><td colspan='2'><input type='button' id='qb_DistCalc_Reset' value='Reset'/><input type='button' id='qb_DistCalc_Calc' value='Calculate'/></td></tr>";
    disCalc.id = "qb_Content";
    disCalc.setAttribute("class", "top");
    if (isNewStyle()) {
        if (document.getElementById('background-container'))
            disCalc.setAttribute("class", "box3_box-content-center box-content-center");
        else
            disCalc.setAttribute("class", "box box-full box3");
    }
    disCalc.setAttribute("width", "250px");
    disCalc.setAttribute("style", "visibility:Hidden; display:none;");
    qb.appendChild(disCalc);
    qb.appendChild(document.createElement("br"));

    var expandLink = document.createElement("a");
    expandLink.setAttribute("href", "javascript:void(0)");
    expandLink.innerHTML = "+ Script Wiki";
    expandLink.id = "qb_Wiki_Expand";
    expandLink.addEventListener("click", function() {
        expandQB(this.id);
    }, true);
    qb.appendChild(expandLink);

    var qbApp = document.createElement("table");
    qbApp.innerHTML = "<tr><th colspan='2'>AE Bits Wikipedia</th></tr><tr><td colspan='2'>This tool lets you search the script wiki for questions about the script.</td></tr>" +
        "<tr><td width='75px'>Search For:</td><td align='left'><input type='text' id='qb_Wiki_Search'/></td></tr>" +
        "<tr><td colspan='2' align='center'><input type='button' value='Search!' id='qb_Wiki_SearchButton'/></td></tr>";
    qbApp.id = "qb_wiki";
    qbApp.setAttribute("class", "top");
    if (isNewStyle()) {
        if (document.getElementById('background-container'))
            qbApp.setAttribute("class", "box3_box-content-center box-content-center");
        else
            qbApp.setAttribute("class", "box box-full box3");
    }
    qbApp.setAttribute("width", "250px");
    qbApp.setAttribute("style", "visibility:Hidden; display:none;");
    qb.appendChild(qbApp);
    qb.appendChild(document.createElement("br"));

    var expandLink = document.createElement("a");
    expandLink.setAttribute("href", "javascript:void(0)");
    expandLink.innerHTML = "+ Location Jump";
    expandLink.id = "qb_Map_Move";
    expandLink.addEventListener("click", function() {
        expandQB(this.id);
    }, true);
    qb.appendChild(expandLink);

    var qbMapMove = document.createElement("table");
    qbMapMove.innerHTML = "<tr><th colspan='2'>Enter Location To View</th></tr>" +
        "<tr><td colspan='2'><center>Format: " + getGalaxy() + "00:00:00:00</center></td></tr>" +
        "<tr><td>Location:</td><td><input type='text' id='qb_map_move'/></td></tr>" +
        "<tr><td colspan='2' align='center'><input type='button' value='Go!' id='qb_MapMpve_Go'/></td></tr>";
    qbMapMove.id = "qb_MapMove";
    qbMapMove.setAttribute("class", "top");
    if (isNewStyle()) {
        if (document.getElementById('background-container'))
            qbMapMove.setAttribute("class", "box3_box-content-center box-content-center");
        else
            qbMapMove.setAttribute("class", "box box-full box3");
    }
    qbMapMove.setAttribute("width", "250px");
    qbMapMove.setAttribute("style", "visibility:Hidden; display:none;");
    qb.appendChild(qbMapMove);
    qb.appendChild(document.createElement("br"));

    document.body.appendChild(qb);
    if ($('qb_DistCalc_Calc'))
        $('qb_DistCalc_Calc').addEventListener("click", function() {
            qbCalcDistance();
        }, true);
    if ($('qb_DistCalc_Reset'))
        $('qb_DistCalc_Reset').addEventListener("click", function() {
            resetQBData();
        }, true);

    if ($('qb_DistCalc_Start')) {
        $('qb_DistCalc_Start').addEventListener("change", function() {
            saveQBData();
        }, true);
        $('qb_DistCalc_Start').value = getSetting("qb_DistCalc_Start", "");
    }
    if ($('qb_DistCalc_End')) {
        $('qb_DistCalc_End').addEventListener("change", function() {
            saveQBData();
        }, true);
        $('qb_DistCalc_End').value = getSetting("qb_DistCalc_End", "");
    }
    if ($('qb_unitSel')) {
        $('qb_unitSel').addEventListener("change", function() {
            saveQBData();
        }, true);
        $('qb_unitSel').value = getSetting("qb_unitSel", "");
    }
    if ($('qb_DistCalc_Warp')) {
        $('qb_DistCalc_Warp').addEventListener("change", function() {
            saveQBData();
        }, true);
        $('qb_DistCalc_Warp').value = getSetting("qb_DistCalc_Warp", "");
    }
    if ($('qb_DistCalc_Gate')) {
        $('qb_DistCalc_Gate').addEventListener("change", function() {
            saveQBData();
        }, true);
        $('qb_DistCalc_Gate').value = getSetting("qb_DistCalc_Gate", "");
    }
    if ($('qb_DistCalc_Com')) {
        $('qb_DistCalc_Com').addEventListener("change", function() {
            saveQBData();
        }, true);
        $('qb_DistCalc_Com').value = getSetting("qb_DistCalc_Com", "");
    }
    if ($('qb_DistCalc_Time')) {
        $('qb_DistCalc_Time').value = getSetting("qb_DistCalc_Time", "");
        if (trim($('qb_DistCalc_Time').value, " ") == "") {
            $('qb_DistCalc_Time').value = getCurrentServerTime();
        }
        $('qb_DistCalc_Time').addEventListener("change", function() {
            saveQBData();
        }, true);
    }

    if ($('qb_Wiki_SearchButton')) {
        $('qb_Wiki_SearchButton').addEventListener("click", function() {
            searchWiki();
        }, true);
        populateWikiSearch();
    }

    if ($('qb_MapMpve_Go')) {
        $('qb_MapMpve_Go').addEventListener("click", function() {
            MapLocationJump();
        }, true);
    }
}

function saveQBData() {
    if ($('qb_DistCalc_Start').value != "") setSetting("qb_DistCalc_Start", $('qb_DistCalc_Start').value);
    if ($('qb_DistCalc_End').value != "") setSetting("qb_DistCalc_End", $('qb_DistCalc_End').value);
    if ($('qb_unitSel').value != "") setSetting("qb_unitSel", $('qb_unitSel').value);
    if ($('qb_DistCalc_Warp').value != "") setSetting("qb_DistCalc_Warp", $('qb_DistCalc_Warp').value);
    if ($('qb_DistCalc_Gate').value != "") setSetting("qb_DistCalc_Gate", $('qb_DistCalc_Gate').value);
    if ($('qb_DistCalc_Com').value != "") setSetting("qb_DistCalc_Com", $('qb_DistCalc_Com').value);
    if ($('qb_DistCalc_Time').value != "") setSetting("qb_DistCalc_Time", $('qb_DistCalc_Time').value);
}

function resetQBData() {
    $('qb_DistCalc_Start').value = "";
    setSetting("qb_DistCalc_Start", "");
    $('qb_DistCalc_End').value = "";
    setSetting("qb_DistCalc_End", "");
    $('qb_unitSel').selectedIndex = 0;
    setSetting("qb_unitSel", "");
    $('qb_DistCalc_Warp').value = "";
    setSetting("qb_DistCalc_Warp", "");
    $('qb_DistCalc_Gate').value = "";
    setSetting("qb_DistCalc_Gate", "");
    $('qb_DistCalc_Com').value = "";
    setSetting("qb_DistCalc_Com", "");
    $('qb_DistCalc_Time').value = getCurrentServerTime();
    setSetting("qb_DistCalc_Time", "");
}

function expandQB(sender) {
    if (sender == 'qb_Expand') {
        if ($('qb_Expand').innerHTML == "+ Distance Calc") {
            $('qb_Expand').innerHTML = "- Distance Calc";
            $('qb_Content').style.visibility = "visible";
            $('qb_Content').style.display = "block";
        } else {
            $('qb_Expand').innerHTML = "+ Distance Calc";
            $('qb_Content').style.visibility = "Hidden";
            $('qb_Content').style.display = "none";
        }
    }
    if (sender == 'qb_Wiki_Expand') {
        if ($('qb_Wiki_Expand').innerHTML == "+ Script Wiki") {
            $('qb_Wiki_Expand').innerHTML = "- Script Wiki";
            $('qb_wiki').style.visibility = "visible";
            $('qb_wiki').style.display = "block";
        } else {
            $('qb_Wiki_Expand').innerHTML = "+ Script Wiki";
            $('qb_wiki').style.visibility = "Hidden";
            $('qb_wiki').style.display = "none";
        }
    }
    if (sender == 'qb_Map_Move') {
        if ($('qb_Map_Move').innerHTML == "+ Location Jump") {
            $('qb_Map_Move').innerHTML = "- Location Jump";
            $('qb_MapMove').style.visibility = "visible";
            $('qb_MapMove').style.display = "block";
        } else {
            $('qb_Map_Move').innerHTML = "+ Location Jump";
            $('qb_MapMove').style.visibility = "Hidden";
            $('qb_MapMove').style.display = "none";
        }
    }
}

function qbCalcDistance() {
    var start = $('qb_DistCalc_Start').value;
    var end = $('qb_DistCalc_End').value;
    var unit = $('qb_unitSel').selectedIndex;
    if (start != "" && end != "") {
        qb_calc_distance();
    }
    if (unit != 0) {
        qb_calc_duration();
    }
    $('qb_Launch').innerHTML = getLaunchTime($('qb_DistCalc_Time').value, $('qb_Duration').textContent);
}

function qb_calc_distance() // Calc Distance Start-Target
{
    var start = "";
    var distance = 0;
    var s_gal0 = "";
    var s_gal1 = 0;
    var s_gal2 = 0;
    var s_reg0 = 0;
    var s_reg1 = 0;
    var s_sys0 = 0;
    var s_sys1 = 0;
    var s_ast0 = 0;
    var s_ast1 = 0;
    var t_gal0 = "";
    var t_gal1 = 0;
    var t_gal2 = 0;
    var t_reg0 = 0;
    var t_reg1 = 0;
    var t_sys0 = 0;
    var t_sys1 = 0;
    var t_ast0 = 0;
    var t_ast1 = 0;
    var s_sys_x = 0;
    var s_sys_y = 0;
    var t_sys_x = 0;
    var t_sys_y = 0;
    var var_gal = 0;
    var var_sys = 0;
    var var_ast0 = 0;
    var var_ast1 = 0;

    start = document.getElementById("qb_DistCalc_Start").value;
    s_gal0 = String(start.charAt(0));
    s_gal1 = Number(start.charAt(1));
    s_gal2 = Number(start.charAt(2));
    s_reg0 = Number(start.charAt(4));
    s_reg1 = Number(start.charAt(5));
    s_sys0 = Number(start.charAt(7));
    s_sys1 = Number(start.charAt(8));
    s_ast0 = Number(start.charAt(10));
    s_ast1 = Number(start.charAt(11));

    t_gal0 = String(document.getElementById("qb_DistCalc_End").value.charAt(0));
    t_gal1 = Number(document.getElementById("qb_DistCalc_End").value.charAt(1));
    t_gal2 = Number(document.getElementById("qb_DistCalc_End").value.charAt(2));
    t_reg0 = Number(document.getElementById("qb_DistCalc_End").value.charAt(4));
    t_reg1 = Number(document.getElementById("qb_DistCalc_End").value.charAt(5));
    t_sys0 = Number(document.getElementById("qb_DistCalc_End").value.charAt(7));
    t_sys1 = Number(document.getElementById("qb_DistCalc_End").value.charAt(8));
    t_ast0 = Number(document.getElementById("qb_DistCalc_End").value.charAt(10));
    t_ast1 = Number(document.getElementById("qb_DistCalc_End").value.charAt(11));

    s_sys_x = s_reg1 * 10 + s_sys1;
    s_sys_y = s_reg0 * 10 + s_sys0;
    t_sys_x = t_reg1 * 10 + t_sys1;
    t_sys_y = t_reg0 * 10 + t_sys0;

    var_gal = Math.abs((s_gal1 - t_gal1) * 19 + s_gal2 - t_gal2);

    var_sys = Math.ceil(Math.sqrt(Math.pow(t_sys_x - s_sys_x, 2) + Math.pow(t_sys_y - s_sys_y, 2)));
    var_ast0 = Math.abs(t_ast0 - s_ast0);
    var_ast1 = Math.abs(t_ast1 - s_ast1);

    if (var_gal) {
        if (t_gal1 == s_gal1) {
            distance = var_gal * 200;
        }
        if (t_gal1 > s_gal1) {
            distance = (9 - s_gal2) * 200 + 2000 + t_gal2 * 200;
        }
        if (t_gal1 < s_gal1) {
            distance = s_gal2 * 200 + 2000 + (9 - t_gal2) * 200;
        }
    } else {
        if (var_sys) {
            distance = var_sys;
        } else {
            if (var_ast0) {
                distance = var_ast0 / 5;
            } else {
                distance = 0.1;
            }
        }
    }

    if (start == document.getElementById("qb_DistCalc_End").value) distance = 0;

    document.getElementById("qb_Distance").innerHTML = distance;
    //calc_duration();
}

function qb_calc_duration() // Calc travel duration
{
    var distance = 0;
    var speed = 0;
    var logistics = trim($('qb_DistCalc_Com').value, " ");
    var duration = "";
    var warp = trim($('qb_DistCalc_Warp').value, " ");
    var gate = trim($('qb_DistCalc_Gate').value, " ");
    if (warp != "") warp = parseInt(warp);
    if (gate != "") gate = parseInt(gate);
    if (logistics != "") logistics = parseInt(logistics);
    if (isNaN(warp)) {
        $('qb_DistCalc_Warp').value = "Invalid!";
        return;
    }
    if (isNaN(gate)) {
        $('qb_DistCalc_Gate').value = "Invalid!";
        return;
    }
    if (isNaN(logistics)) {
        $('qb_DistCalc_Com').value = "Invalid!";
        return;
    }
    warp = ((warp * 5) + 100) / 100;
    distance = parseInt($("qb_Distance").innerHTML);
    speed = parseInt($('qb_unitSel').options[$('qb_unitSel').selectedIndex].value);
    if (warp > 0) speed = Math.round(speed * warp * 100) / 100;
    if (gate > 0) speed = speed * (gate + 1);
    if ((distance > 0) && (speed > 0)) {
        var s = Math.ceil((distance / speed) * 3600);
        s = Math.ceil(s * (1 - logistics * 0.01))
        var m = 0;
        var h = 0;
        if (s > 59) m = Math.floor(s / 60);
        s = s - m * 60;
        if (m > 59) h = Math.floor(m / 60);
        m = m - h * 60;
        if (s < 10) s = "0" + s;
        if (m < 10) m = "0" + m;
        if (h > 0) duration += h + "h ";
        if (m > 0) duration += m + "m ";
        duration += s + "s";
        $("qb_Duration").innerHTML = duration;
    }
}

function searchWiki() {
    var url = "http://vig.vg/AE_Wiki/index.php/Special:Search?search=" + $('qb_Wiki_Search').value + "&go=Go";
    GM_openInTab(url);
}

function populateWikiSearch() {
    var sValue = "";
    var eView = getView();
    if (location.indexOf('empire.aspx') != -1) {
        if (eView == "")
            eView = "Events";
        else if (eView.indexOf('_') != -1)
            eView = eView.substr(eView.indexOf('_') + 1);
        sValue += "Empire:" + eView;
    }
    if (location.indexOf('profile.aspx') != -1) {
        sValue = "Profile";
    }
    if (location.indexOf('credits.aspx') != -1) {
        sValue = "Credits";
    }
    if (location.indexOf('messages.aspx') != -1) {
        sValue = "Messages";
    }
    if (location.indexOf('board.aspx') != -1) {
        sValue = "Board";
    }
    if (location.indexOf('map.aspx') != -1) {
        sValue = "Map";
    }
    if (location.indexOf('guild.aspx') != -1) {
        sValue = "Guild";
    }
    if (location.indexOf('commander.aspx') != -1) {
        sValue = "Commanders";
    }
    if (location.indexOf('base.aspx') != -1) {
        sValue = "Base";
        if (location.indexOf('?') != -1) {
            if (eView == "")
                eView = "Overview";
            sValue += ":" + eView;
        }
    }
    if (location.indexOf('fleet.aspx') != -1) {
        sValue = "Fleet";
        if (location.indexOf('?') != -1) {
            if (eView == "")
                eView = "Overview";
            else if (eView.indexOf('_') != -1)
                eView = eView.replace('_', ' ');
            sValue += ":" + eView;
        }
    }
    $('qb_Wiki_Search').value = sValue;
}

function MapLocationJump() {
    if ($('qb_map_move')) {
        var loc = $('qb_map_move').value;
        loc = trim(loc);
        if (loc.match(/[A-Z]\d+:\d+:\d+/)) {
            var link = "http://" + getServer() + ".astroempires.com/map.aspx?loc=" + loc;
            window.location.href = link;
            return;
        }
    }
    notify("Invalid Location!", MESSAGE_CLASS_ERROR);
}
//==========================================
// End Quick Bar
//==========================================
//==========================================
// Main Script (execution)
//==========================================

// ==========================================================
// New switching page loader function, should reduce codesize
// ==========================================================
function cp_ae_main() {
    //profile_context.start('cp_ae_main');
    try {
        try {
            serverTimeSetup();
        } catch (e) {
            console.log("serverTimeSetup screwed up "+e+' '+e.lineNumber);
        }
        // ==========================================================
        // Send out an event for clevers script to detect my script
        // ==========================================================
        //var kashi_ev = document.createEvent('Events');
        //kashi_ev.initEvent('ae_bits_loaded', true, false);
        //document.dispatchEvent(kashi_ev);

        if (!pagetype) var pagetype = _page;

        //-----------------------------------
        // Set Capacities
        //-----------------------------------
        if (location.indexOf('view=bases_capacities') != -1) {
            if (getSetting('upgradedAccount', true)) {
                grabCaps();
            } else {
                displayCapPage();
            }
        }
        //-----------------------------------
        //Insert Empire Menu
        //-----------------------------------

        if (location.indexOf('empire.aspx') == -1) {
            if (getSetting(ADD_EMPIRE_SUBMENU_KEY, true)) {
                try {
                    insertEmpireMenu();
                    document.addEventListener('load', function() {
                        window.setTimeout(function() {
                            cleanEmpireMenus();
                        }, 300)
                    }, false);
                } catch (e) {
                    console.log("Line Number: " + e.lineNumber + "\n Failed to insert empire menu: " + e);
                }
            }
            onFeatureComplete("Insert Empire Menu");
        } else {
            if (getSetting(MOVE_EMPIRE_SUBMENU_KEY, true)) {
                try {
                    moveEmpireMenu();
                } catch (e) {
                    console.log("Line Number: " + e.lineNumber + "\n Failed to move empire menu: " + e);
                }
            }
            onFeatureComplete("Move Empire Menu");
        }

        //-----------------------------------
        //Insert config link
        //-----------------------------------
        try {
            insertCpLogo();
            console.log("Inserted config link");
        } catch (e) {
            console.log("Line Number: " + e.lineNumber + "\n Failed to insert config link: " + e);
        }
        onFeatureComplete("Insert config link");

        //-----------------------------------
        //Adjust Page Titles
        //-----------------------------------
        if (getSetting(ADJUST_TITLES_KEY, true)) {
            adjustTitles();
            onFeatureComplete("Adjust Page Titles");
        }
        //-----------------------------------
        //Show debris on astros
        //-----------------------------------
        if (document.location.href.match(/[A-Z]\d+:\d+:\d+/)) {
            debrisShow();
            onFeatureComplete("Show debris");
        }
        //-----------------------------------
        //Advanced Production Features
        //-----------------------------------
        var view = getView();
        if (location.indexOf("base.aspx") != -1 && (view == "Production" || view == "Structures" || view == "Defenses" || view == "Research")) {
            if (getSetting(FIX_QUEUES_KEY, true)) {
                fixQueues();
                onFeatureComplete("Fix Queues");
            }
            if (getView() == "Production") {
                if (getSetting(ENABLE_PRODUCTION_PRESETS_KEY, true)) {
                    try {
                        registerTextBoxEventListeners();
                        insertProductionPresetsButtons();
                    } catch (e) {
                        //debug(e,'error',{stack:true});
                    }
                    onFeatureComplete("Production Presets");
                }
                minimizeProductionPage();
            }
        }

        //-----------------------------------
        //Fleet Summary
        //-----------------------------------
        if (location.indexOf("base.aspx?base=") != -1 || location.indexOf("map.aspx?loc=") != -1) {
            if (getSetting(SUM_FLEETS_KEY, true)) {
                sumFleets();
                onFeatureComplete("Fleet Summary");
            }
        }

        //-----------------------------------
        //Calculate Pillage
        //Set Base Capacity Info if Free account
        //-----------------------------------
        if (location.indexOf("base.aspx?base=") != -1 && location.indexOf("view=structures") == -1 &&
            location.indexOf("view=defenses") == -1 && location.indexOf("view=production") == -1 &&
            location.indexOf("view=trade") == -1 && location.indexOf("view=research") == -1) {
            if (getSetting(SHOW_PILLAGE_KEY, true)) {
                attachPillage();
                onFeatureComplete("Pillage Summary");
            }
            if (!getSetting('upgradedAccount', true)) {
                setBaseCapInfo();
                onFeatureComplete("Free Account Base Capacity Grab");
            }
        }
        //-----------------------------------
        //Show total fleet on individual summery
        //-----------------------------------

        if (location.indexOf("fleet.aspx?fleet=") != -1 && location.indexOf('view=attack') == -1 && location.indexOf('view=move') == -1 && location.indexOf('view=build_base') == -1 && location.indexOf('view=disband') == -1 && location.indexOf('view=piracy') == -1) {
            if (getSetting(SUM_FLEETS_KEY, true)) {
                sumSingleFleet();
                onFeatureComplete("Single Fleet Summary");
            }
        }


        //-----------------------------------
        //Fleet/Base Page Features
        //-----------------------------------
        if (location.indexOf("base.aspx") != -1 && getView() == "" && getSetting(CLONE_BASE_LINKS_KEY, true)) {
            //copyBaseLinks(); // FIXME, it messed with the map size/shape
            onFeatureComplete("Copy Base Links");
        }
        if (location.indexOf("fleet.aspx") != -1 && getView() == "" && getSetting(CLONE_FLEET_LINKS_KEY, true)) {
            //copyFleetLinks(); // FIXME, it messed with the map size/shape
            onFeatureComplete("Copy Fleet Links");
        }
        if ((location.indexOf("base.aspx") != -1 || location.indexOf("fleet.aspx") != -1) &&
            getView() == "" && location.indexOf("?base=") == -1 && location.indexOf("?fleet=") == -1 &&
            getSetting(MOVE_GALAXY_LINKS_KEY, false)) {
            moveGalaxyList();
            onFeatureComplete("Move Galaxy Links");
        }
        if (_page == 'empire') {
            saveBaseCoords();
            onFeatureComplete("Save base coords");
        }
        //-----------------------------------
        //Advanced Structures Page
        //-----------------------------------
        if (location.indexOf('empire.aspx?view=structures') != -1) {
            if (!getSetting('upgradedAccount', true)) {
                displayStructPage();
            }
            saveBases();
            onFeatureComplete("Save Base Data");
            if (getSetting(STRUCTURES_GOALS_KEY, true)) {
                if (location.indexOf("mode=edit") != -1) insertEditRows();
                else insertBaseSettingLinks();
                onFeatureComplete("Advanced Structures Page");
            }
        }
        //-----------------------------------
        // Enhanced construction Page
        //-----------------------------------
        console.log("Enhancing Construction Page");
        console.log("getsetting: " + getSetting(CONSTRUCT_ENHANCE_KEY, true));
        if (document.location.href.match(/base.aspx\?base=[0-9]{1,}&view=structures/) ||
            document.location.href.match(/base.aspx\?base=[0-9]{1,}&view=defenses/) ||
            document.location.href.match(/base.aspx\?base=[0-9]{1,}&view=research/)) {
            if (!document.location.href.match(/&info=/) && getSetting(CONSTRUCT_ENHANCE_KEY, true)) {
                try {
                    console.log("Enhancing Construction Page");
                    console.log("getsetting: " + getSetting(CONSTRUCT_ENHANCE_KEY, true));
                    enhanceConstructionPage();
                    onFeatureComplete("Enhanced Construction Page");
                } catch (e) {
                    console.log("Enhanced Construction error: " + e)
                }
            }
        }
        //-----------------------------------
        //Sum Credits
        //-----------------------------------
        if (location.indexOf('credits.aspx') != -1 && getSetting(SUM_CREDITS_KEY, true)) {
            sumCreditsPage();
            onFeatureComplete("Credits Summary");
        }


        //-----------------------------------
        //Advanced Fleet Page
        //-----------------------------------
        if (location.indexOf('empire.aspx?view=fleets') != -1) {
            if (getSetting(SHOW_TOTAL_FLEET_ROW_KEY, true) || getSetting(SHOW_ATTACK_SIZE_KEY, true) || getSetting(ADD_FLEET_MOVE_LINK_KEY, true)) {
                sumShips();
            }
            onFeatureComplete("Advanced Fleet Page");
        }
        //-----------------------------------
        //Advanced Trade Page
        //-----------------------------------
        if (location.indexOf('empire.aspx?view=trade') != -1) {
            insertCollapsTradeLink();
            if (getSetting(HIGHLIGHT_DUPLICATE_TRADE_PARTNERS_KEY, true))
                checkTradePage();
            if (getSetting(HIGHLIGHT_POOR_TRADES_KEY, true))
                findPoorTrades();
            onFeatureComplete("Advanced Trade Page");
        }

        //-----------------------------------
        //Save Tech Data
        //-----------------------------------
        if (location.indexOf('view=technologies') != -1) {
            saveTechData();
            onFeatureComplete("Save tech data");
        }
        //-----------------------------------
        // Run new battlecalc simulation
        //-----------------------------------
        if (getSetting(SCRIPT_BATTLECALC_KEY, true) && location.indexOf('combat.aspx') != -1 && isConfirmPage()) {
            //FIXME
            highlightSupportShips();
        }
        //-----------------------------------
        // Attach Profit/Losses foot note.
        //-----------------------------------
        if (getSetting(PROFIT_SUM_KEY, true) && (location.indexOf('combat.aspx') != -1 || location.indexOf('messages.aspx') != -1 || location.indexOf('board.aspx') != -1)) {
            try {
                calcAttackProfit();
                onFeatureComplete("Attack Profit");
            } catch (e) {
                console.log("Profit/loss error: " + e)
            }
        }
        //-----------------------------------
        // Fleet Info Popup
        //-----------------------------------
        if (getSetting(FLEET_INFO_POPUP, true) && (location.indexOf("fleet.aspx") != -1 || location.indexOf("map.aspx?loc=") != -1 || location.indexOf("view=report.aspx") != -1 || location.indexOf("base.aspx?base=") != -1)) {
            if (false) {
                try {
                    fleetInfoPopUp();
                } catch (e) {
                    console.log("Fleet Info Popup error: " + e)
                }
            }
        }

        //-----------------------------------
        // Enhanced Production script
        // -----------------------------------
        if (location.indexOf("empire.aspx") != -1 && location.indexOf("view=bases_production") != -1) {
            try {
                //enhancedProduction();
            } catch (e) {
                console.log("Production Enhancements error: " + e)
            }
        }

        //-----------------------------------
        //Hide Allies On Attack Page
        //-----------------------------------
        if (getSetting(HIDE_ALLI_FLEETS, true) && location.indexOf("fleet.aspx") != -1 && location.indexOf("&view=attack") != -1) {
            try {
                hideAlliesOnAttackPage();
            } catch (e) {
                console.log("Hide Allies On Attack Page error: " + e)
            }
        }

        //-----------------------------------
        //Format Numbers
        //-----------------------------------
        if (getSetting(FORMAT_NUMBERS_KEY, true)) {
            if (location.indexOf('view=move') == -1 && location.indexOf('view=fleets') == -1 &&
                location.indexOf('view=production') == -1 && location.indexOf('view=structures') == -1 &&
                location.indexOf('view=trade') == -1 && location.indexOf('view=research') == -1) {
                formatVariousNumbers();
                onFeatureComplete("Format Numbers");
            }
        }
        //-----------------------------------
        //Add highlights on scanner page
        //-----------------------------------
        if (getSetting(FORMAT_SCANNER_KEY, true)) {
            if (location.indexOf('view=report') != -1) {
                scannerFormat();
                onFeatureComplete("Scanner highlights");
            }
        }
        //-----------------------------------
        //Autoset player guild
        //-----------------------------------
        if (_page == 'profile' && getSetting(AUTOSET_GUILD_KEY, true)) {
            setGuildHighlight();
            onFeatureComplete("Set Guild Highlight");
        }
        //-----------------------------------
        // Highlight player links
        //-----------------------------------
        if (location.indexOf('view=move') == -1) {
            if (getSetting(HIGHLIGHT_TRADE_PARTNERS_KEY, true) || getSetting(HIGHLIGHT_PLAYERS_KEY, true)) {
                highlightTradePartners();
                onFeatureComplete("Highlight Links");
            }
        }
        //-----------------------------------
        // Highlight commanders
        //-----------------------------------
        if (location.indexOf('commander.aspx') != -1 || location.indexOf('base.aspx') != -1 || location.indexOf('view=bases_capacities') != -1) {
            if (getSetting(HIGHLIGHT_COMMANDERS_KEY, false)) {
                highlightCommanders();
                onFeatureComplete("Highlight Commanders");
            }
        }
        //-----------------------------------
        //Remove redirections
        //-----------------------------------
        if ((location.indexOf('board.aspx') != -1 || location.indexOf('guild.aspx') != -1 || location.indexOf('profile.aspx') != -1) && _site == "ae") {
            if (getSetting(REMOVE_REDIRECT_KEY, true)) {
                removeRedirects();
                onFeatureComplete("Remove Redirects");
            }
        }
        //-----------------------------------
        // Show Quick Bar
        //-----------------------------------
        if (getSetting(QUICK_BAR, true)) {
            showQuickBar();
        }

        if (DEBUGNEWCODE && location.indexOf('guild.aspx') != -1) discoverPacts();
    } catch (e) {
        //debug("General exception raised cp_ae_main: "+e+' '+e.lineNumber,'error');
    }
    //profile_context.end('cp_ae_main');
}

function isBattleResultPage() {
    var result = false;
    if (location.indexOf('combat.aspx') != -1) {
        var br = document.evaluate(
            "//th[text() ='Battle Report']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        if (br.snapshotLength >= 1) {
            result = true;
        }
    } else if (location.indexOf('messages.aspx') != -1) {
        var br = document.evaluate(
            "//th[text() ='Battle Report']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        if (br.snapshotLength >= 1) {
            result = true;
        }

    } else if (location.indexOf('board.aspx') != -1) {
        var br = document.evaluate(
            "//th[text() ='Battle Report']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        if (br.snapshotLength >= 1) {
            result = true;
        }

    }
    return result;
}

function hideAlliesOnAttackPage() {
    var alliList = new Array();
    var nap = unescape(getSetting(NAPPED_GUILDS_KEY, "")).split(',');
    var alli = unescape(getSetting(ALLIED_GUILDS_KEY, "")).split(',');
    var attackList = document.evaluate(
        "//table[@id = 'fleets_attack-list']",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue.firstChild;

    if (attackList) {
        attackList = attackList.getElementsByClassName('layout listing');
        if (attackList.length > 0) {
            attackList = attackList[0].firstChild;
            for (var i = 1; i < attackList.childNodes.length; i++) {
                var node = attackList.childNodes[i].childNodes[1].firstChild.textContent;
                //var playerGuild = getGuild(node);
                if (nap.indexOf(playerGuild) != -1 || alli.indexOf(playerGuild) != -1) attackList.childNodes[i].setAttribute("style", "display:none");
            }
        }
    }
}

function calcAttackProfit() {
    if (isBattleResultPage()) {
        var bres = document.evaluate(
            "//div[@class ='battle-report']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
        for (var i = 0; i < bres.snapshotLength; i++) {
            var br = bres.snapshotItem(i);
            var reportIndex = 1;
            if (br.childNodes[reportIndex].firstChild == null) {
                for (var x = 0; x < br.childNodes.length; x++) {
                    if (br.childNodes[x].class = "red important") {
                        reportIndex = 3;
                        break;
                    }
                }
            }
            var attackPlayer = br.childNodes[reportIndex].firstChild.childNodes[5].childNodes[1].firstChild.textContent;
            if (attackPlayer.indexOf("]") != -1) {
                attackPlayer = attackPlayer.substring(attackPlayer.indexOf("]") + 2);
            }
            var attack_deff = null;
            var derbs = null;
            var pillageAmount = null;

            for (var x = 0; x < br.childNodes.length; x++) {
                if (br.childNodes[x].textContent.indexOf("units destroyed:") != -1) {
                    attack_deff = br.childNodes[x];
                } else if (br.childNodes[x].textContent.indexOf("debris in space:") != -1) {
                    derbs = br.childNodes[x];
                } else if (br.childNodes[x].textContent.indexOf("pillaging defender's base") != -1) {
                    pillageAmount = br.childNodes[x];
                }
            }
            //              console.log(attack_deff);
            //              console.log(derbs);
            //              console.log(pillageAmount);
            //              console.log("----------");
            var pn = getSetting(MY_NAME_KEY, "Newb")
            var losses = parseInt(attack_deff.textContent.substring(attack_deff.textContent.indexOf("Attacker:") + 10, attack_deff.textContent.indexOf(";") - 1));

            //console.log(losses);

            var derbGains = parseInt(derbs.textContent.substring(derbs.textContent.indexOf(":") + 2));

            //console.log(derbGains);
            var pillGains = 0;
            if (pillageAmount) {
                pillGains = parseInt(pillageAmount.textContent.substring(pillageAmount.textContent.indexOf("got") + 4, pillageAmount.textContent.indexOf("credits") - 1));
            }
            //console.log(pillGains);

            var totalProfit = (derbGains + pillGains) - losses;
            //console.log(totalProfit);
            var attPlayerLink = br.childNodes[reportIndex].firstChild.childNodes[5].childNodes[1].innerHTML;
            attPlayerLink = attPlayerLink.substring(0, attPlayerLink.indexOf("<small>") - 1);
            if (attPlayerLink == "") {
                if (br.childNodes[reportIndex].firstChild.childNodes[3].childNodes[1] == null) {
                    attPlayerLink = br.childNodes[reportIndex].firstChild.childNodes[4].childNodes[1].innerHTML;
                    attPlayerLink += "&nbsp;&nbsp;";
                } else {
                    attPlayerLink = br.childNodes[reportIndex].firstChild.childNodes[3].childNodes[1].innerHTML;
                    attPlayerLink = attPlayerLink.substring(0, attPlayerLink.indexOf("<small>") - 1);
                }
            }
            var profitHTML = "<br/><center><u>";
            if (isConfirmPage()) {
                profitHTML += "Estimated ";
            }
            profitHTML += "Profit/Losses Calculation:</u></center>";
            profitHTML += "<center> " + attPlayerLink;
            if (totalProfit > 0) {
                profitHTML += "<b><font size='2' color='green'>Gained &nbsp;</font></b> ";
            } else {
                profitHTML += "<b><font size='2' color='red'>Lost &nbsp;</font></b> ";
            }
            profitHTML += Math.abs(totalProfit) + " credits in this battle!</center><br/><br/>";
            br.innerHTML += profitHTML;
        }
    }
}

function highlightSupportShips() {
    var attackerRows = document.evaluate(
        "//table//th[contains(text(),'Attack Force') and @colspan='6']/../..//tr[@align='center']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    var badShip = false;
    for (var i = 0; i < attackerRows.snapshotLength; i++) {
        var row = attackerRows.snapshotItem(i);
        var aName = row.childNodes[NAME_INDEX].firstChild.nodeValue
        if (supportShips.indexOf(aName) != -1) {
            row.childNodes[NAME_INDEX].style.color = "red";
            badShip = true;
        }
    }
    if (badShip) {
        notify("You have Support Ships in Your Attacking Fleet!");
        setTimeout(function() {
            highlightAllyGuilds();
        }, 1000);
    } else
        highlightAllyGuilds();
}

function highlightAllyGuilds() { // tell vig
    var attackerRows = document.evaluate(
        "//table//td[contains(text(),'Player')]",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    var badShip = false;
    var allies = unescape(getSetting(ALLIED_GUILDS_KEY, ""));
    var NAPs = unescape(getSetting(NAPPED_GUILDS_KEY, ""));
    for (var i = 1; i < attackerRows.snapshotLength; i++) {
        var row = attackerRows.snapshotItem(i);
        var player = row.parentNode.childNodes[1].firstChild.textContent;
        //var guild = getGuild(player);
        if (allies.indexOf(guild) != -1 || NAPs.indexOf(guild) != -1) {
            row.parentNode.style.color = "red";
            badShip = true;
        }
    }
    if (badShip) {
        notify("You Are Attacking An Allied or NAP'd Guild!");
    }
}

function GetCommanderColor(comType) {
    var color = "";
    switch (comType) {
        case "Defesa":
        case "Defense":
            color = getSetting(HIGHLIGHT_COMMANDER_DEFENSE, "#EE00EE");
            break;
        case "Constru��o":
        case "Construction":
            color = getSetting(HIGHLIGHT_COMMANDER_CONSTRUCTION, "#FF7F00");
            break;
        case "Pesquisa":
        case "Research":
            color = getSetting(HIGHLIGHT_COMMANDER_RESEARCH, "#7EC0EE");
            break;
        case "Produ��o":
        case "Production":
            color = getSetting(HIGHLIGHT_COMMANDER_PRODUCTION, "#FFD700");
            break;
        case "T�ctico":
        case "Tactical":
            color = getSetting(HIGHLIGHT_COMMANDER_TACTICAL, "#CD0000");
            break;
        case "Logistica":
        case "Logistics":
            color = getSetting(HIGHLIGHT_COMMANDER_LOGISTICS, "#71C671");
            break;
    }
    return color;
}

function highlightCommanders() {
    if (location.indexOf('commander.aspx') != -1 && location.indexOf('commander=') == -1) {
        var commanders = document.evaluate(
            "//table[@id = 'commanders']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue.firstChild;
        if (commanders) {
            commanders = commanders.getElementsByClassName('layout listing sorttable');
            if (commanders.length > 0) {
                commanders = commanders[0].childNodes[1];
                //console.log(commanders);
                for (var i = 0; i < commanders.childNodes.length; i++) {
                    var commander = commanders.childNodes[i];
                    var comType = commander.childNodes[1].textContent.substring(0, commander.childNodes[1].textContent.indexOf(" "));
                    var color = GetCommanderColor(comType);
                    //console.log(comType +": "+color);
                    commander.firstChild.firstChild.style.color = color;
                }
            }
        }
    } else if (location.indexOf('view=bases_capacities') != -1) {
        commanders = document.evaluate(
            "//table[@class='layout listing sorttable']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
        if (commanders) {
            commanders = commanders.childNodes[1];
            //console.log(commanders.snapshotLength);
            for (i = 0; i < commanders.childNodes.length; i++) {
                commander = commanders.childNodes[i].childNodes[7];
                if (commander.textContent) {
                    comType = commander.textContent.substring(0, commander.textContent.indexOf(" "));
                    color = GetCommanderColor(comType);
                    //console.log(comType +": "+color);
                    commander.firstChild.style.color = color;
                }
            }
        }
    } else if (location.indexOf('base.aspx') != -1 && location.indexOf('base=') != -1 && (location.substring(location.indexOf("&view=")) == "&view=" || location.indexOf("&view=") == -1)) {
        commanders = document.evaluate(
            "//a[contains(@href,'commander.aspx?commander')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
        //console.log(commanders);
        if (commanders) {
            comType = commanders.parentNode.childNodes[3].textContent.substring(1, commanders.parentNode.childNodes[3].textContent.indexOf(" "));
            commanders.style.color = GetCommanderColor(comType);
        }
    }
}
// Ensure everythings loading in the proper order, stuff thats priority loads first while bulk of script can be disabled easily

function cp_ae_initalisation() {
    if (!$('AEBits_Unique')) {
        var divUnique = document.createElement('div');
        divUnique.id = "AEBits_Unique";
        document.body.appendChild(divUnique);
        divUnique = null;
    } else return;
    var pagetype = _page;
    if (_site == "ae") {
        //  Global site functions
        //  Header
        onFeatureComplete("Initialization");
        installCheck();
        // INDENTING TWICE TO SHOW THIS WHOLE SECTION IS CAPTURED FOR ERRORS

        //-----------------------------------
        //Site-wide Features
        //-----------------------------------
        var foo = true;
        if (location.indexOf('view=move') != -1) foo = false;
        if (location.indexOf('view=move_start') != -1) foo = true;
        if (foo) {
            if (getSetting(HIGHLIGHT_TRADE_PARTNERS_KEY, true) && getSetting(HIGHLIGHT_PLAYERS_KEY, true)) {
                if (getView() != "Trade") {
                    checkTradeDataAge();
                    onFeatureComplete("Check Trade Data Age");
                }
            }
            checkBaseDataAge();
            onFeatureComplete("Check Base Data Age");
            checkGuildDataAge();
            onFeatureComplete("Check Guild Data Age");
            //if (getView()!="Technologies")
            //{
            //  checkTechDataAge();
            //  onFeatureComplete("Check Tech Data Age");
            //}
            if (location.indexOf('bookmarks.aspx') == -1 && location.indexOf('empire.aspx') == -1 && getSetting(NAME_LOCATIONS_KEY, false)) {
                replaceLocationNames();
                onFeatureComplete("Named Locations");
            }
        } else {
            if (getSetting(INSERT_MOVE_PRESETS_KEY, true)) {
                insertMoveFleetLinks();
                onFeatureComplete("Insert Move Fleet Presets");
            }
        }
        //  Main
        console.log("Running cp_ae_main");
        cp_ae_main();

        //  Footer

        //if(location.match(/view=scanners/)) {displayQuickMarks();}
        //Show Execution Times
        if (getSetting(SHOW_EXECUTION_TIME_KEY, false)) displayTimes();
    }
}

//notify("test error","notifierError");
//notify("test","notifier");

//-----------------------------------
//Auto Launch count down script
//-----------------------------------
function serverTimeSetup() {
    try {
        setInterval(serverTimeAdjust, 200);
    } catch (e) {
        //debug(setInterval);
        //debug(serverTimeAdjust);
        //debug(e,'error',{stack:true});
    }
}

function timeToCounter(milliseconds) {
    milliseconds = milliseconds / 1000;
    var h = Math.floor(milliseconds / 3600);
    var m = Math.floor((milliseconds % 3600) / 60);
    var s = Math.floor((milliseconds % 3600) % 60);
    var counterString = "";
    if (h > 0)
        counterString += h + "h ";
    if (m > 0)
        counterString += m + "m ";
    if (s > 0)
        counterString += s + "s";
    return counterString;
}

function serverTimeAdjust() {
    //now = (new Date).getTime();
    //elem=document.getElementById('pageDate');
    //m=0;h=0;
    //var diff = (now - start_date) / 1000;
    //s = parseInt(elem.title) + diff;
    if (showTime > 0) showTime--;
    else if (openDiv && showTime == 0 && !hover) {
        openDiv = false;
        var fro = null;
        for (var i = 0; i <= frc; i++) {
            fro = document.getElementById('fleetinfo' + i);
            if (fro) {
                if (getSetting(FLEET_INFO_POPUP_FADE, true)) {
                    setFading(fro, 100, 20, 200, function() {
                        document.body.removeChild(fro);
                    });
                } else document.body.removeChild(fro);
            }
        }
    }
}
//-----------------------------------
//End Auto Launch count down script
//-----------------------------------
//-----------------------------------
//Fleet Detail Popup Script
//-----------------------------------
var frc = 0;
var showTime = 0;
var openDiv = false;
var hover = false;
var event;
var obj;
var tmr

function fleetInfoPopUp() {
    var links = document.getElementsByTagName("a");
    var i = 0;
    while (links[i]) {
        if (/fleet.aspx\?fleet=[0-9]{4,}$/.test(links[i].href)) {
            //links[i].addEventListener('mouseover',mkIframe,false);
            links[i].addEventListener('mouseover', startTmr, false);
            links[i].addEventListener('mouseout', stopTmr, false);

        }
        i++;
    }
}

function stopTmr() {
    hover = false;
    clearTimeout(tmr);
}

function startTmr(e) {
    hover = true;
    obj = this;
    event = e;
    tmr = setTimeout(tmrTarget, 400);
}

function tmrTarget() {
    mkIframe(obj, event);
}


function killIframes() { // used once
    var fro = null;
    for (var i = 0; i < frc; i++) {
        fro = document.getElementById('fleetinfo' + i);
        if (fro) {
            //document.body.removeChild(fro);
            if (getSetting(FLEET_INFO_POPUP_FADE, true)) {
                setFading(fro, 100, 20, 200, function() {
                    document.body.removeChild(fro);
                });
            } else {
                document.body.removeChild(fro);
            }
        }
    }
}

function mkIframe(objct, evt) { // used once
    frc++;
    var fr = document.createElement("div");
    fr.setAttribute('id', 'fleetinfo' + frc);
    var geturl = objct.href;
    GM_xmlhttpRequest({
        method: 'GET',
        url: geturl,
        onload: function(responseDetails) {
            document.body.appendChild(fr);
            var inner = responseDetails.responseText;
            inner = inner.match(/<table id=\'fleet_overview\'.*<\/table>/)[0].replace(/Travel.*<form[^>]*>.*<\/form>/, '');
            fr.innerHTML = inner;
            var divHeight = document.getElementById(fr.id).offsetHeight;
            var divWidth = 250;
            var topLY = evt.pageY,
                topLX = evt.pageX;
            if (topLX <= window.innerWidth / 2) {
                topLX = topLX - 250;
                if (topLX < 0) {
                    topLX = 0;
                }
            } else {
                topLX = topLX + 10;
                if ((topLX + divWidth) > window.innerWidth) {
                    topLX = (window.innerWidth - divWidth) + window.pageXOffset;
                }
            }
            if ((topLY + divHeight) > (window.innerHeight + window.pageYOffset)) {
                topLY = (window.innerHeight - divHeight) + window.pageYOffset;
            }
            fr.setAttribute('style', 'position: absolute; top: ' + topLY + 'px; left: ' + topLX + 'px; z-index:50; opacity:0; width:200px;');
            killIframes();
            if (getSetting(FLEET_INFO_POPUP_FADE, true)) {
                setFading(fr, 20, 100, 500, '');
            } else {
                fr.style.opacity = 100;
            }
            openDiv = true;
            showTime = getSetting(FLEET_INFO_POPUP_TIMER, 20);
        }
    });
}
try {
    console.log("Trying CP_AE now.");
    cp_ae_initalisation();
} catch (e) {
    debug("\n General error: "+e+"\nLine Number: "+e.lineNumber,'error');
    console.log("General error: " +e+ "Line Number: " +e.lineNUmber);
}
var totalEnd = new Date();
//profile_context.end('aebits global');
