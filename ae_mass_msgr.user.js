// ==UserScript==
// @name                AE Mass Messenger
// @namespace           http://www.astroempires.com
// @description         Mass Messenger Standalone
// @author              Ori (original), Rick (Chrome / March 2019)
// @require http://code.jquery.com/jquery-1.7.1.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_openInTab
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant GM_addStyle
// @grant               GM_xmlhttpRequest
// @include             http*://*.astroempires.com/*
// @exclude             http*://*.astroempires.com/
// @exclude             http*://*.astroempires.com/home.aspx*
// @exclude             http*://*.astroempires.com/login.aspx*
// @exclude             http*://*.astroempires.com/profile.aspx?action=*
// @exclude             http*://forum.astroempires.com/*
// @exclude             http*://support.astroempires.com/*
// @exclude             http*://wiki.astroempires.com/*
// @exclude             http*://wiki.astroempires.com/*/*
// @exclude             http*://*.astroempires.com/upgrade.aspx*
// @exclude             http*://*.astroempires.com/tables.aspx*
// @exclude             http*://*.astroempires.com/smilies.aspx*
// ==/UserScript==
/*

*/

// Anti Admin detection added by Rick
var canRun = true
'use strict';
var href = window.location.href;
var domain = href.substring(0,href.search('com')+4);
var detailHtmlInfo = "";

    //Anti-Detection
    //http://cdn.astroempires.com/javascript/js_jquery_debug_v1.0.js
    var all_js = document.getElementsByTagName('script');
    for(var i=0; i < all_js.length; i++) {
        var src = all_js[i].getAttributeNode("src");
        if(src == null) continue;
        var value = src.value;
        //Log(value);
        if(value.search("js_jquery_debug") > 0 ){
            //var debugDetection = true
            //if(debugDetection){
            canRun = false
            alert("Disabled, admins were looking.");
            return;
        }
    }
if (canRun){
var totalStart = new Date();
var MESSAGE_CLASS = "notifier";
var MESSAGE_CLASS_ERROR = "notifierError";
var DEBUGNEWCODE;
var wlh=window.location.href;
var twidth = getTableWidth();
var notifycount = 1;
var myServer = location.href.split(/\./)[0].split(/\//)[2];
var gDSISSendPM = null;
}
function getTableWidth(){
    var tables = document.evaluate("//table[@class='top']",document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    if(tables.snapshotLength==0) return 900;
    var topTable = tables.snapshotItem(0);
    return topTable.getAttribute("width");
}
if (canRun){
if (wlh.match(/loc=[A-Z][0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{2}/)) { // astro
    addMassMessenger();
} else if (wlh.match(/loc=[A-Z][0-9]{2}:[0-9]{2}/)) { // region
    addMassMessenger(true);
} else if (wlh.match(/http:\/\/(.+?)\.astroempires\.com\/empire\.aspx$/)) { // empire events
    addMassMessenger(true);
} else if (wlh.match(/http:\/\/(.+?)\.astroempires\.com\/base\.aspx\?base=[0-9]+$/)) { // base overview
    addMassMessenger();
} else if ( (wlh.indexOf('contacts.aspx')!=-1) || (wlh.indexOf('ranks.aspx')!=-1) ) { // contacts, ranks
    addMassMessenger();
} else if ((wlh.indexOf('guild.aspx')!=-1) && (wlh.indexOf('guild.aspx?')==-1) ){ // guild overview
    addMassMessenger();
}}

function addMassMessenger(hide_stuff) {
    var member;
    var message;
    var currentID;
    function createEl(elObj, parent) {
        var el;
        if (typeof elObj == 'string') {
            el = document.createTextNode(elObj);
        }
        else {
            el = document.createElement(elObj.n);
            if (elObj.a) {
                var attributes = elObj.a;
                for (var key in attributes) {
                    if (attributes.hasOwnProperty(key)) {
                        if (key.charAt(0) == '@') {
                            el.setAttribute(key.substring(1), attributes[key]);
                        }
                        else {
                            el[key] = attributes[key];
                        }
                    }
                }
            }
            if (elObj.evl) {
                el.addEventListener(elObj.evl.type, elObj.evl.f, elObj.evl.bubble);
            }
            if (elObj.c) {
                elObj.c.forEach(function (v, i, a) { createEl(v, el); });
            }
        }
        if (parent) {
            parent.appendChild(el);
        }
        return el;
    }
    function toggleAll() {
        var chkMember = document.getElementsByName('chkMember');
        for (var x = 0; x < chkMember.length; x++){
            // only check visable check boxes
            //alert(chkMember[x].parentNode.parentNode.getAttribute('style'));
            if (chkMember[x].parentNode.parentNode.getAttribute('style') != 'display: none; visibility: hidden;' ) {
                    if (chkMember[x].checked) {
                        chkMember[x].checked = false;
                    } else {
                        chkMember[x].checked = true;
                    }
            }
        }
    }
    function insert(txt) // Insert BBCode in Body
    {
         txt=txt.replace("$","'");
         txt=txt.replace("$","'");
         document.getElementById("body").value += txt;
         document.getElementById("body").focus();
    }
    function countChars(inputField) {
        var body = document.getElementById(inputField).value;
        var max = document.getElementById("counter").title;
        body = body.replace(/&/g,'&amp;');
        body = body.replace(/</g,'&lt;');
        body = body.replace(/>/g,'&gt;');
        body = body.replace(/"/g,'&quot;');
        body = body.replace(/'/g,'&#39;');
        body = body.replace(/\n/g,'**');
        var size = body.length;
        var left = max - size;
        document.getElementById("counter").innerHTML= '(chars left: ' +left +')';
    }
    function MessageBox(){
         var bbcode =  "<td width='20%' align='center'><b><a target='_blank' href='bbcode.aspx'>BBCode</a></b><br><br><small>"+
                    "<a href='javascript:doAddTags(&quot;[b]&quot;,&quot;[/b]&quot;);countChars(&quot;body&quot;);'>[b]</a> - "+
                    "<a href='javascript:doAddTags(&quot;[u]&quot;,&quot;[/u]&quot;);countChars(&quot;body&quot;);'>[u]</a> - "+
                    "<a href='javascript:doAddTags(&quot;[i]&quot;,&quot;[/i]&quot;);countChars(&quot;body&quot;);'>[i]</a><br>"+
                    "<a href='javascript:doAddTags(&quot;[code]&quot;,&quot;[/code]&quot;);countChars(&quot;body&quot;);'>[code]</a> "+
                    "<a href='javascript:doAddTags(&quot;[quote]&quot;,&quot;[/quote]&quot;);countChars(&quot;body&quot;);'>[quote]</a><br>"+
                    "<a href='javascript:doAddTags(&quot;[list]&quot;,&quot;[/list]&quot;);countChars(&quot;body&quot;);'>[list]</a> "+
                    "<a href='javascript:doAddTags(&quot;[list=]&quot;,&quot;[/list]&quot;);countChars(&quot;body&quot;);'>[list=]</a> "+
                    "<a href='javascript:insert(&quot;[*]&quot);countChars(&quot;body&quot;);'>[*]</a><br>"+
                    "<a href='javascript:doAddTags(&quot;[url]&quot;,&quot;[/url]&quot;);countChars(&quot;body&quot;);'>[url]</a> "+
                    "<a href='javascript:doAddTags(&quot;[url=]&quot;,&quot;[/url]&quot;);countChars(&quot;body&quot;);'>[url=]</a><br>"+
                    "<a href='javascript:doAddTags(&quot;[img]&quot;,&quot;[/img]&quot;);countChars(&quot;body&quot;);'>[img]</a> "+
                    "<a href='javascript:doAddTags(&quot;[size=]&quot;,&quot;[/size]&quot;);countChars(&quot;body&quot;);'>[size=]</a><br>"+
                    "<a href='javascript:doAddTags(&quot;[left]&quot;,&quot;[/left]&quot;);countChars(&quot;body&quot;);'>[left]</a> "+
                    "<a href='javascript:doAddTags(&quot;[center]&quot;,&quot;[/center]&quot;);countChars(&quot;body&quot;);'>[center]</a> "+
                    "<a href='javascript:doAddTags(&quot;[right]&quot;,&quot;[/right]&quot;);countChars(&quot;body&quot;);'>[right]</a>"+
                    "<br>"+
                    "<a href='javascript:doAddTags(&quot;[color=]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);'>[color=]</a>"+
                    "<br>"+
                    "<br>"+
                    "<a onclick='document.getElementById(&quot;bbcode-colors&quot;).style.visibility=&quot;visible&quot;; return false;' href='javascript:void;'>Colors</a> "+
                    "<a onclick='javascript:window.open(&quot;smilies.aspx&quot;,&quot;Smilies&quot;,&quot;height=300,resizable=yes,scrollbars=yes,width=300&quot;); return false;' href='smilies.aspx'>Smilies</a></small><br>"+
                    '<div id="bbcode-colors" style="visibility: hidden;">'+
                    '<a href="javascript:doAddTags(&quot;[color=#000000]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);"><img width="10" height="10" align="absmiddle" style="background-color: rgb(0, 0, 0); margin: 1px;" src="http://cdn.astroempires.com/images/spacer.gif"></a>'+
                    '<a href="javascript:doAddTags(&quot;[color=#ff0000]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);"><img width="10" height="10" align="absmiddle" style="background-color: rgb(255, 0, 0); margin: 1px;" src="http://cdn.astroempires.com/images/spacer.gif"></a>'+
                    '<a href="javascript:doAddTags(&quot;[color=#00ff00]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);"><img width="10" height="10" align="absmiddle" style="background-color: rgb(0, 255, 0); margin: 1px;" src="http://cdn.astroempires.com/images/spacer.gif"></a>'+
                    '<a href="javascript:doAddTags(&quot;[color=#0000ff]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);"><img width="10" height="10" align="absmiddle" style="background-color: rgb(0, 0, 255); margin: 1px;" src="http://cdn.astroempires.com/images/spacer.gif"></a>'+
                    '<a href="javascript:doAddTags(&quot;[color=#ffff00]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);"><img width="10" height="10" align="absmiddle" style="background-color: rgb(255, 255, 0); margin: 1px;" src="http://cdn.astroempires.com/images/spacer.gif"></a>'+
                    '<a href="javascript:doAddTags(&quot;[color=#00ffff]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);"><img width="10" height="10" align="absmiddle" style="background-color: rgb(0, 255, 255); margin: 1px;" src="http://cdn.astroempires.com/images/spacer.gif"></a>'+
                    '<a href="javascript:doAddTags(&quot;[color=#ff00ff]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);"><img width="10" height="10" align="absmiddle" style="background-color: rgb(255, 0, 255); margin: 1px;" src="http://cdn.astroempires.com/images/spacer.gif"></a>'+
                    '<a href="javascript:doAddTags(&quot;[color=#ffffff]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);"><img width="10" height="10" align="absmiddle" style="background-color: rgb(255, 255, 255); margin: 1px;" src="http://cdn.astroempires.com/images/spacer.gif"></a>'+
                    '<a href="javascript:doAddTags(&quot;[color=#666666]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);"><img width="10" height="10" align="absmiddle" style="background-color: rgb(102, 102, 102); margin: 1px;" src="http://cdn.astroempires.com/images/spacer.gif"></a>'+
                    '<a href="javascript:doAddTags(&quot;[color=#999999]&quot;,&quot;[/color]&quot;);countChars(&quot;body&quot;);"><img width="10" height="10" align="absmiddle" style="background-color: rgb(153, 153, 153); margin: 1px;" src="http://cdn.astroempires.com/images/spacer.gif"></a></div>'+
                    "<br><i align=center class=help comment title=5000 id=counter>(chars left: 5000)</i></td>";
        var element = document.createElement('script');
                element.setAttribute('src', 'http://cdn.astroempires.com/javascript/js_bbcode_v1.1.js');
                element.type = 'text/javascript';
        document.body.appendChild(element);
            element = document.createElement('script');
                element.setAttribute('src', 'http://cdn.astroempires.com/javascript/js_chars_count.js');
                element.type = 'text/javascript';
        document.body.appendChild(element);
         var c=(document.getElementById('notePadDiv'))?document.getElementById('notePadDiv'):document.createElement('div');
         c.setAttribute('id','notePadDiv');
          var dbo = document.body.offsetWidth;
          var dboC = (dbo/2)-336;
          var dboW = (twidth * .9);
          var x0 = GM_getValue('sidebarX_notePadDiv',dboC+'px');
          var y0 = GM_getValue('sidebarY_notePadDiv','139px');
         c.setAttribute('style',"z-index:10;position:fixed;top:"+y0+";left:"+x0+";border:1px solid #FF6464;background:rgba(0,0,0,.7) none;width:"+dboW+"+px;margin:0 auto;");
         c.innerHTML="<input type='button' class='AETbut' style='display:inline-block;padding-bottom:1px;margin:10px;float:right;font-size:11px;' onclick='document.getElementById(\"notePadDiv\").parentNode.removeChild(document.getElementById(\"notePadDiv\"));' value='Cancel'><div style='margin-top:10px;text-align:center;font:italic 900 16px verdana,tahoma,arial,sans-serif;'><span style='background:#000 none;'></span></div><table class=layout><tr>"+bbcode+"<td><textarea id='body' focused=false style='width:"+parseInt(twidth * .65)+"px;margin:0 24px;padding:6px;' onchange=\"countChars(&quot;body&quot;)\" onkeyup=\"countChars(&quot;body&quot;)\" onblur=\"this.setAttribute('focused',false);\" onfocus=\"this.setAttribute('focused',true);\"></textarea></td></tr></table><div id='notePadSave' style='text-align:right;margin:8px -15px 12px 0pt;'></div>";
         if(!document.getElementById('notePadDiv')){
           if(document.getElementById('quicklinksD')) document.getElementById('quicklinksD').insertBefore(c,document.getElementById('quicklinksD').firstChild);
           else document.body.insertBefore(c,document.evaluate("//table[@class='top']",document,null,9,null).singleNodeValue);
         }
         var a=document.createElement('input');
             a.type='button';
             a.setAttribute('style','font-size:12px;font-weight:900;padding-bottom:1px;display:inline-block;margin-right:30px;');
             a.className='AETbut';
             document.getElementById('notePadSave').appendChild(a);
         a.value='Send PM';
             a.addEventListener('click',function(){
                if(document.getElementById('body').value==''){
                    notify('Note has not been saved');
                }else{
                    notify('Starting Messenger Service');
                }
                SendPM();
            },false);
             document.getElementById('body').style.height='250px';
        refreshloc();
    }
    function SendPM(){
        member = [];
        message = document.getElementById('body').value;
        if (message == null || message == '') {
            alert('Cannot send blank message.');
            return;
        }
        message = message.replace(/&/g,'%26');
        //message = message.replace(/\n\n/gim,'[left]%20[/left]%20[right]%20[/right][left]%20[/left]');
        message = message.replace(/\n/g,'[left]\n[/left]');
        document.getElementById("notePadDiv").parentNode.removeChild(document.getElementById("notePadDiv"));
        var chkMember = document.getElementsByName('chkMember');
        currentID=0;
        var uniq ='#';
        var uniq_id = null;
        for (var x = 0; x < chkMember.length; x++){
            if (chkMember[x].checked) {
                uniq_id = chkMember[x].getAttribute('id');
                if (!uniq.match("#"+uniq_id+"#")) {
                    member[currentID] = {};
                    uniq = uniq + '#'+ uniq_id + '#';
                        member[currentID]['account'] = chkMember[x].getAttribute('id');
                    document.getElementById(member[currentID]['account']).parentNode.parentNode.style.backgroundColor = 'gray';
                    currentID++;
                }
            }
       }
       if(0 < currentID){
            currentID=0;
            submitMessage();
        } else {
            alert('Need to check members to send message to.');
        }
    }
    function DSISSendPM(msg,targets) {
        member = [];
        message = msg;
        message = message.replace(/&/g,'%26');
        message = message.replace(/\n/g,'[left]\n[/left]');
        for (var x = 0; x < targets.length; x++) {
            var obj = {};
            obj.account = targets[x];
            member.push(obj);
        }
        currentID=0;
        submitMessage();
    }
    gDSISSendPM = DSISSendPM;
    function submitMessage() {
        if(currentID < member.length){
            var currentMember = member[currentID ]['account'];
            var msgurl = 'http://' + myServer + '.astroempires.com/messages.aspx?msg=' + currentMember+ '&reply=0';
            var urlPrep = 'http://' + myServer + '.astroempires.com/messages.aspx?msg=' + currentMember;
            var time1 = 1700 + Math.floor(Math.random() * 1701);
            var time2 = time1 + Math.floor(Math.random() * 5501);
            var time3 = time2 + Math.floor(Math.random() * 1501);
            var urlProfile = 'http://' + myServer + '.astroempires.com/profile.aspx?player=' + currentMember;
            //Generate appropriate pause before sending message.
            window.setTimeout(function() {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: 'http://' + myServer + '.astroempires.com/messages.aspx?msg=' + currentMember,
                    onreadystatechange: function(xhr) {
                        if (xhr.readyState == "4") {
                            //Do nothing: just sending "hit" to the appropriate page before sending message.
                            document.getElementById(currentMember).parentNode.parentNode.style.backgroundColor = 'yellow';
                        }
                    }
                });
            }, time1);
            window.setTimeout(function () {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: 'http://' + myServer + '.astroempires.com/messages.aspx?msg=' + currentMember,
                    headers: {'Content-type' : 'application/x-www-form-urlencoded'},
                    data:"submit=Send&body=" + message,
                    onload:function(response) {
                        var ScriptFeedBackHTML = response.responseText;
                        var mValue = ScriptFeedBackHTML.match("Message Sent");
                        if (mValue == "Message Sent") {
                            //pm_sent(currentMember);
                            document.getElementById(currentMember).parentNode.parentNode.style.backgroundColor = 'green';
                        } else {
                            document.getElementById(currentMember).parentNode.parentNode.style.backgroundColor = 'red';
                        }
                    }
                });
            }, time2);
            var msg = 'Message sent to '+currentMember;
            notify(msg);
            currentID++;
            }
            if(currentID < member.length){
                window.setTimeout(function () {submitMessage()}, time3);
            }
    }
    if (hide_stuff) {
    } else {
        if (!document.evaluate("//tr[@class='listing-header sorttable_header']",document,null,9,null).singleNodeValue) {
            if (!document.evaluate("//th[@class='th_header2 dropcap']",document,null,9,null).singleNodeValue) return;
            else var tr= document.evaluate("//th[@class='th_header2 dropcap']",document,null,9,null).singleNodeValue.parentNode
        } else var tr = document.evaluate("//tr[@class='listing-header sorttable_header']",document,null,9,null).singleNodeValue
        var thAll = createEl({n: 'span', c: [
            {n: 'input', a: {'type' : 'checkbox', 'id' : 'chkMemberAll', 'name' : 'chkMemberAll', 'checked' : false,
            'title' : 'Check to select or unselect all members from Messenager'},
             evl: {type : 'click', f: toggleAll, bubble: false}}
            ]});
        tr.appendChild(thAll);
        var table = document.querySelector('#map_fleets tbody tr td.content table.layout.listing.sorttable,'+
                '#base_fleets table,'+
                '#guild_members table,'+
                '#contacts-table table');

        var myMap = document.createElement('div');
        myMap.setAttribute('align','right');
        if(window.location.href.indexOf("contacts.aspx")!=-1) {
            table.parentNode.parentNode.parentNode.parentNode.firstChild.firstChild.appendChild(myMap);
        } else {
            table.parentNode.parentNode.parentNode.firstChild.firstChild.appendChild(myMap);
        }
        var alink = document.createElement('a');
        alink.setAttribute('href','javascript:void(0)');
        alink.setAttribute('align','center');
        alink.setAttribute('id','GM_TH_myMessage');
        alink.innerHTML = "</br>Mass Messenger";
        var br = document.createElement('br');
        myMap.appendChild(alink);
        document.getElementById('GM_TH_myMessage').addEventListener("click", MessageBox, true);
        var playerID=null;
        for (var nrow = 1; nrow < table.rows.length; nrow++) {
            var row = table.rows[nrow];
                if(window.location.href.indexOf("guild.aspx")!=-1) {
                    playerID = row.firstChild.textContent;
            } else {
                playerID = row.childNodes[1].lastChild.href.split('=')[1];
            }
            var td = createEl({n: 'td', c: [{n: 'input', a: {'type' : 'checkbox', 'id' : playerID, 'name' : 'chkMember', 'checked' : false}}]});
            row.appendChild(td);
        }
    }
}
function notify(m,c){
    if($$('Message')){
        document.body.removeChild($$('Message'));
    }
    var b=document.createElement('div');
    b.id='Message';
    b.className=c||'';
    b.style.cssText='position:absolute;white-space:nowrap;z-index:10;';
    if(b.className.length==0){
        b.className = "notifier";
    }
    b=document.body.insertBefore(b,document.body.firstChild);
    b.innerHTML=m;
    var bw=b.offsetWidth;
    var bh=b.offsetHeight;
    b.style.display='none';
    b.style.top = (document.body.clientHeight/2 + document.body.scrollTop - bh/2)+'px';
    b.style.left = (document.body.clientWidth/2 + document.body.scrollLeft - bw/2)+'px';
    b.style.display='block';
    var duration = 2000;
    var endOpacity = 0;
    if(c==MESSAGE_CLASS_ERROR){
        b.className = "notifierError";
        b.id='errorMessage';
        var pos = notifycount * 40;
        b.style.top = (document.body.clientHeight/2 + document.body.scrollTop - bh/2) - (400 - pos);
        duration = 4000;
        if(DEBUGNEWCODE) duration = 8000;
        endOpacity = 50;
    }
    notifycount++;
    setFading(b,100,endOpacity,duration,function(){document.body.removeChild(b);});
}
function setFading(o,b,e,d,f){
    var t=setInterval(function(){
        b=stepFX(b,e,2);
        setOpacity(o,b/100);
        if(b==e){
            if(t){
                clearInterval(t);
                t=null;
            }
            if(typeof f=='function'){
                f();
            }
        }
    },d/50);
}
function setOpacity(e,o){
    e.style.filter='alpha(opacity='+o*100+')';
    e.style.opacity=o;
}
function stepFX(b,e,s){
    return b>e?b-s>e?b-s:e:b<e?b+s<e?b+s:e:b;
}
function refreshloc(){
    if (document.getElementById("myTradeLink")) {
            var dragID="myTradeLink";
    }
    if (document.getElementById("notePadDiv")) {
            var dragID="notePadDiv";
    }
    var iamdragging=false;
    var dragx0,dragy0; // remember functions in javascript are static
    document.addEventListener("mousemove",function(event) {
        var x=event.pageX;
        var y=event.pageY;
        if (iamdragging){
            var x0 = x - dragx0;
            var y0 = y - dragy0;
            var dragw=document.getElementById(dragID).style.width; //['width'];
            var dragh=document.getElementById(dragID).style.height; //['height'];
            if (document.getElementById("myTradeLink")) {
                document.getElementById(dragID).setAttribute('style',"cursor: move;border: 2px ridge rgb(153, 153, 255);background-color: rgb(0, 0, 0);position:fixed;left:"+ x0 +"px;top:"+ y0 +"px;");
            }
            if (document.getElementById("notePadDiv")) {
                document.getElementById(dragID).setAttribute('style',"z-index:10;position:fixed;top:"+y0+"px;left:"+x0+"px;border:1px solid #FF6464;background:rgba(0,0,0,.7) none;margin:0 auto;");
            }
            document.getElementById(dragID).style.width=dragw;
            document.getElementById(dragID).style.height=dragh;
        }

    },true);
    document.getElementById(dragID).addEventListener("mousedown",function(event) {
        dragx0=event.pageX - 1*(document.getElementById(dragID).style['left'].replace("px",""));
        dragy0=event.pageY - 1*(document.getElementById(dragID).style['top'].replace("px",""));
        iamdragging=true;
        if (document.getElementById("notePadDiv")) {
            if (document.getElementById("body").getAttribute('focused') == 'true') {
                //alert(document.getElementById("body").getAttribute('focused'));
                iamdragging=false;
            }
        }
    },true);
    document.addEventListener("mouseup",function(event) {
        iamdragging=false;
        GM_setValue("sidebarX_"+dragID,document.getElementById(dragID).style['left'] ) ;
        GM_setValue("sidebarY_"+dragID,document.getElementById(dragID).style['top'] );
    },true)
}
function $$(variable){
    if(!variable) return;
    if (document.getElementById(variable)) return document.getElementById(variable);
}
var totalEnd = new Date();

