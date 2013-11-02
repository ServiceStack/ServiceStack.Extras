var urns = {
    ss: 'http://www.servicestack.net/',
    github: 'https://github.com/ServiceStack/',
    wiki: 'https://github.com/ServiceStack/ServiceStack/wiki/',
    mythz_blog: 'http://www.servicestack.net/mythz_blog/'
};

var parts = [
    {text: "JSON, CSV, JSV", href: "github:ServiceStack.Text", h:1},

    {text: "Virtual File System", href: "wiki:Virtual-file-system", offset: [0, -10]},
    {text: "Swagger", href: "wiki:Swagger-API", offset: [10, -20]},
    {text: "Metadata", href: "wiki:Metadata-page", offset: [20, -25]},
    {text: "Logging", href: "github:ServiceStack.Logging", h:1, offset: [20, -25]},
    {text: "Profiling", href: "wiki:Built-in-profiling", offset: [25, -15]},
    {text: "IOC", href: "wiki:The-IoC-container", offset: [20, -5]},

    {text: "HTML", href: "http://razor.servicestack.net", h:1, offset: [5, 10]},

    {text: "Markdown", href: "wiki:Markdown-Razor", offset: [-30, -5]},
    {text: "Validation", href: "wiki:Validation", offset: [-30, -20]},
    {text: "Code-first ORM", href: "github:ServiceStack.OrmLite", h:1, offset: [-25, -30]},
    {text: "Configuration", href: "wiki:Config-API", offset: [-25, -30]},
    {text: "Dump utils", href: "mythz_blog:?p=202", offset: [-20, -25]},
    {text: "Auto mapping", href: "wiki:Auto-mapping", offset: [-10, -15]},

    {text: "Redis Client", href: "github:ServiceStack.Redis", h:1},

    {text: "Messaging", href: "wiki:Messaging-and-Redis", offset: [-5, 15]},
    {text: "Security", href: "wiki:Security", offset: [-10, 25]},
    {text: "Authentication", href:"wiki:Authentication-and-authorization", h:1, offset: [-20, 30]},
    {text: "Session", href: "wiki:Sessions", offset: [-35, 30]},
    {text: "Caching", href: "wiki:Caching", h:1, offset: [-50, 25]},
    {text: "OpenId", href: "wiki:OpenId", offset: [-55, 15]},

    {text: "REST, SOAP & MQ Services", href:"github:ServiceStack", h:1, offset: [-10, -10]},

    {text: "HTTP utils", href: "wiki:Http-Utils", offset: [55, 15]},
    {text: "Typed Clients", href: "wiki:Clients-overview", h:1, offset: [50, 25]},
    {text: "MVC Integration", href: "ss:mvc-powerpack", offset: [40, 35]},
    {text: "Bundling", href: "github:Bundler", h:1, offset: [30, 35]},
    {text: "MsgPack", href: "wiki:MessagePack-Format", offset: [10, 30]},
    {text: "Protocol Buffers", href: "wiki:Protobuf-format", offset: [10, 15]},
];

var partsMap = {};

var x0=350, y0=350, r = 270;
var paper = Raphael(document.getElementById("paper"), 800, 800);
var origScale = .5;
var set_texts = paper.set();
var hasAnimated = false;
var activeLabelSize = 18;
var defaultColor = "#060";
var activeColor = "#000";
var disabledColor = "#ccc";

function resized(part, scale) {
    var xoff = part.x - x0, yoff = part.y - y0;
    var movx = part.x - (xoff * (1 - scale));
    var movy = part.y - (yoff * (1 - scale));
    return {x: movx, y: movy, opacity: scale == origScale ? 0 : 1};
}
paper.customAttributes.expand = function(scale){
    return resized(partsMap[this.id], scale);
};

//var attr = {stroke: "#f1f1f1",
//         "stroke-width": 2,
//         "stroke-dasharray": '- ',
//         "stroke-linejoin": "round"};
//
//var circle=paper.circle(x0,y0,r).attr(attr);
//paper.circle(x0,y0,20).attr({
//    stroke: "#666",
//    "stroke-linejoin": "round",
//    fill:"#bda4a0"
//})
//.click(animateSSBox);

var infoArea = paper.circle(x0,y0,r *.75).attr({
    stroke: "#eee",
    "stroke-width": 0,
    fill: "#fff",
    opacity:0
});

var infoHoverAreaOuter = paper.circle(x0,y0,r + 80).attr({ opacity:0.1, "stroke-width":0 })
    .hover(function(e){
        toggleInfo(e, false);
    }, function(e){
        toggleInfo(e, false);
    });

var infoHoverArea = paper.circle(x0,y0,r + 50).attr({ opacity:0.1, "stroke-width":0 })
    .mouseout(function(e){
        toggleInfo(e, false);
    })
    .hover(function(e){
        toggleInfo(e, true);
    }, function(e){
        toggleInfo(e, false);
    });

var clickBoxArea = paper.circle(x0,y0,110).attr({
    fill:"#bda4a0",
    opacity:0,
    cursor: "pointer"
})
    .click(animateSSBox);

var paperOffsetX = $('#paper').offset().left;
var paperOffsetY = $('#paper').offset().top;

function any(arr, fn){
    if (!arr || !arr.length || !fn) return false;
    for (var i=0; i<arr.length; i++)
        if (fn(arr[i])) return true;
    return false;
}

function safeVar(txt){
    var safe = txt.toLowerCase().replace(/[^a-z\-\s]/g, "").replace(/\s+/g, "-");
//    console.log(txt, safe);
    return safe;
}

var delay = 200;
var $showingInfo = null;
var timeoutId = null;

var offOpacity = .95;

function showInfo($showInfo)
{
    timeoutId = null;
    if (infoArea.attr('opacity') == 0){
        hideInfo();
        return;
    }
    if ($showingInfo && $showingInfo[0]) {
        $(".ssinfos div").not($showingInfo).hide();
        $showingInfo.fadeIn('slow', function(){
            $(".ssinfos div").not($showingInfo).hide(); //fix race-condition
            if (infoArea.attr('opacity') == 0) {
                if ($showingInfo) $showingInfo.hide();
            }
        });
    }
}
function hideInfo()
{
    $(".ssinfos div").hide();
}

function toggleInfo(e, show, id){
    if (!hasAnimated) return;

    var posx = e.pageX - paperOffsetX;
    var posy = e.pageY - paperOffsetY;

    if (show == null)
        show = infoHoverArea.isPointInside(posx, posy);

    if (timeoutId)
        window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(function() { showInfo($showingInfo);}, delay);

    if (!show) {
        set_texts.attr({fill:defaultColor});
        hideInfo();
        timeoutId = null;
    }
    var opacity = show ? offOpacity : 0;
    infoArea.attr({opacity: opacity});
}

function animateSSBox()
{
    if (hasAnimated) return;
    hasAnimated = true;

    $("#jplayer-open").jPlayer("play");
    $("#ss-info #img").css("backgroundPosition","0 -150px");
    $("#ss-info h3").html("Simple, Fast, <br/>Lightweight Parts");
    $("#ss-info h4").html("Simplicity at Speed!");
    $("#ssbox #ssbox-summary").slideDown();

    set_texts.animate({expand:1}, 1000, 'bounce', function(){

        for(var i= 0; i<set_texts.length; i++){
            var txt = set_texts[i];
            var part = partsMap[txt.id];
            var ctx = { part: part, txt: txt };
            var clickArea = paper.rect().attr(expand(txt.getBBox(), 40, 30)).attr({
                fill: "#000",
                opacity: 0,
                cursor: "pointer",
                'text-anchor:': 'start',
                href: href(part.href)
            })
            .hover(function(e) {
                set_texts.attr({fill: disabledColor});
                this.txt.animate({ "font-size": activeLabelSize, fill:activeColor }, 100, 'bounce');
                $showingInfo = $(".ssinfos ." + safeVar(this.part.text));
                toggleInfo(e, true);
            }, function(e) {
                var size = this.part.h == 1 ? 15 : 13;
                this.txt.animate({ "font-size": size }, 100, 'bounce');
                toggleInfo(e);
            }, ctx, ctx);
        }
    });
}

function href(urn) {
    for (var scheme in urns) {
        urn = urn.replace(scheme + ":", urns[scheme]);
    }
    return urn;
}

function expand(bbox, addW, addH){
    return {
        x: bbox.x - Math.round(addW/2),
        y: bbox.y - Math.round(addH/2),
        x2: bbox.x + addW,
        y2: bbox.x + addH,
        height: bbox.height + addH,
        width: bbox.width + addW
    }
}

function drawTextMap(parts, x0, y0, origScale){
    for (var i=0;i<parts.length;i++){
        var part = parts[i], steps = parts.length;

        var x = Math.round(x0 + r * Math.cos(2 * Math.PI * i / steps));
        var y = Math.round(y0 + r * Math.sin(2 * Math.PI * i / steps));

        //var txt = r.print(x, y, "print", r.getFont("Times"), 30).transform('r' + angle).attr({fill: "#fff"});
        var font = part.h == 1 ? "bold 15px Tahoma" : "13px Tahoma";

        part.x = x + (part.offset ? part.offset[0] : 0);
        part.y = y + (part.offset ? part.offset[1] : 1);

        var origPoint = resized(part, origScale);
        var txt = paper.text(origPoint.x, origPoint.y, part.text)
            .attr({
                font : font,
                fill : '#060',
                opacity:0
            });

        part.id = txt.id;
        partsMap[part.id] = part;
        txt.attr({expand: origScale});

        set_texts.push(txt);
    }
}

drawTextMap(parts, x0, y0, origScale);

var sounds = [
    'beep-digital.mp3',
    'drop-water.mp3',
    'futuristic-transition.mp3',
    'futuristic-transition2.mp3',
    'good-idea.mp3',
    'impact-cinematic.mp3',
    'impact-deep.mp3',
    'impact-deep2.mp3',
    'impact-epic.mp3',
    'impact-hollow-boom.mp3',
    'magic-cartoon.mp3',
    'magic-cartoon2.mp3',
    'magic-shimmer.mp3',
    'open-lock-deadbolt.mp3',
    'open-lock-deadbolt2.mp3',
    'open-lock.mp3',
    'shoosh-deep.mp3',
    'swhoosh-particle.mp3',
    'swish-quick.mp3',
    'swish-quick2.mp3',
    'swosh-hollow.mp3',
    'transition-wood-tap.mp3',
    'whoosh-soft.mp3'
];

var randIndex = Math.floor(Math.random() * sounds.length);

$("#jplayers").append('<div id="jplayer-open" data-mp3="ssbox/sounds/' + sounds[randIndex] + '" data-volume=".5"></div>');

$.fn.initSounds = function(){
    return this.each(function(){
        var volume = parseFloat($(this).data("volume") || 1);
        $(this).jPlayer({
            ready: function(){
                $(this).jPlayer("setMedia", {
                    mp3: $(this).data("mp3")
                });
            },
            ended: function(){
                if ($(this).attr('id') == "jplayer-open"){
                    $("#jplayer-bg").jPlayer("play");
                }
            },
            volume: volume,
            loop: $(this).data("loop") == "true",
            swfPath: "ssbox/Jplayer.swf",
            solution: "html,flash",
            preload: "auto"
        });
    });
};

$("[data-mp3]").initSounds();
