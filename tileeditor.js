var savedSheet;

function getOnOff(str_type) {
    var onoff = ["",""];
    
    switch (str_type) {
        case "switch" :
        case "switchlevel":
        case "bulb":
        case "light":
        case "momentary":
            onoff = ["on","off"];
            break;
        case "contact":
        case "door":
        case "valve":
            onoff = ["open","closed"];
            break;
        case "motion":
            onoff = ["active","inactive"];
            break;
        case "lock":
            onoff = ["locked","unlocked"];
            break;
        case "piston":
            onoff = ["firing","idle"];
            break;
        case "thermofan":
            onoff = ["auto","circulate","on"];
            break;
        case "thermomode":
            onoff = ["heat","cool","auto","off"];
            break;
        case "thermostate":
            onoff = ["idle","heating","cooling","off"];
            break;
        case "musicstatus":
            onoff = ["paused","playing"];
            break;
        case "musicmute":
            onoff = ["muted","unmuted"];
            break;
        case "presence":
            onoff = ["present","absent"];
            break;
    }
    
    return onoff;
}

function getCssRuleTarget(strSection, str_type, thingindex, useall) {

    // get the scope to use
    var scope = $("#scopeEffect").val();
    if ( useall === undefined ) {
        if ( scope=== "alltypes") { useall= 1; }
        else if ( scope=== "alltiles") { useall= 2; }
        else { useall = 0; }
    } else {
        if ( !useall || useall!==1 || useall!==2 ) { useall= 0; }
    }

    if ( thingindex===null || thingindex===undefined ) {
        thingindex = 1;
    }

    var target = "";
    // use new logic for reading on/off due to multiple tile types
    // when writing both states we must determine onoff from type
    // when writing the active state we get that state from the HTML
    
	switch (strSection) {
        case "icon":
        case "icontext":
            
            // set the target to determine on/off status
            // we always use the very specific target to this tile
            var onofftarget = "div.overlay." + str_type + '.v_' + thingindex + " div."+str_type+'.p_'+thingindex;
            
            // handle music controls special case
            target = "div.overlay";
            if ( useall < 2 ) {
                if ( str_type.startsWith("music-" ) ) {
                    target+= ".music-controls";
                } else {
                    target+= "." + str_type;
                }
            }
            if ( useall < 1 ) { target+= '.v_'+thingindex; }
            
            // for everything other than levels, set the subid target
            // levels use the overlay layer only
            if ( useall < 2 && str_type!=="level" ) {
                target+= " div."+str_type;
                
                // handle special wrapper cases (music and thermostats)
                if ( str_type === "cool" || str_type==="heat" ) { 
                    onofftarget=  "div.overlay." + str_type + '.v_' + thingindex + " div."+str_type;
                    target+= "-val"; 
                } else if ( str_type.startsWith("music-") ) { 
                    onofftarget=  "div.overlay." + str_type + '.v_' + thingindex + " div."+str_type;
                }
                else if ( useall < 1 ) target+= '.p_'+thingindex;
            }
            
            // get the on/off state
            var on = $(onofftarget).html();
//            if ( !on || $.isNumeric(on) || (on.indexOf(" ") >= 0)  ) {
//                on = "."+onoff[0];
//            } else {
//                on = "."+on;
//            }
            
            if ( on && ! $.isNumeric(on) && (on.indexOf(" ") == -1) ) {
                on = "."+on;
            } else {
                on = "";
            }
            
            // if ( on==="." ) { on= ""; }
            target = target + on;
            break;
                // every sub-element is wrapped with this so size width this way
                
        case "subid":
            // set the target to determine on/off status
            // we always use the very specific target to this tile
            // get the on/off state
            var onofftarget = "div.overlay." + str_type + '.v_' + thingindex + " div."+str_type+'.p_'+thingindex;
            var on = $(onofftarget).html();
            if ( on && ! $.isNumeric(on) && (on.indexOf(" ") == -1) ) {
                on = "."+on;
            } else {
                on = "";
            }
            
            // handle music controls special case
            target = "div";
            if ( useall < 2 ) {
                if ( str_type.startsWith("music-" ) ) {
                    target+= ".music-controls";
                } else {
                    target+= "." + str_type;
                }
            }
            target = target + on;
            break;
            
        case "overlay":
            target = "div.overlay";
            if ( useall < 2 ) { target+= "." + str_type; }
            if ( useall < 1 ) { target+= '.v_'+thingindex; }
            break;
	case "text":
            target = "span.n_"+thingindex;
            break;
        case "tile":
            target = "div.thing";
            if ( useall < 2 ) { target+= "." + str_type + "-thing"; }
            if ( useall < 1 ) { target+= '.p_'+thingindex; }
            break;
        case "head":
            target = "div.thingname";
            if ( useall < 2 ) { target+= "." + str_type; }
            if ( useall < 1 ) { target+= '.t_'+thingindex; }
            break;
	};	
    return target;
}

function toggleTile(target, tile_type, thingindex) {
    var swval = $(target).html();
    var str_type = $(target).attr("subid");
    
//    alert("tile type= "+tile_type+" subid= "+str_type);
    // save the target clicked on as the target to edit
//    $("#subidTarget").html(str_type);
    
    // activate the icon click to use this
    var onoff = getOnOff(str_type, swval);
    var newsub = 0;
    if ( onoff && onoff.length > 0 ) {
        for ( var i=0; i < onoff.length; i++ ) {
            var oldsub = onoff[i];
            if ( $(target).hasClass(oldsub) ) { $(target).removeClass(oldsub); }
            if ( oldsub === swval ) {
                newsub = i+1;
                if ( newsub >= onoff.length ) { newsub= 0; }
                $(target).html( onoff[newsub] );
                break;
            }
        }
        $(target).addClass( onoff[newsub] );
//        $("#onoffTarget").html( onoff[newsub] );
        
//        alert("new onoff= " + onoff[newsub]);
//    } else {
//        $("#onoffTarget").html("");
    }
                
    initColor(tile_type, str_type, thingindex);
    
//    var on = onoff[0];
//    var off = onoff[1];
//    if ( off && swval === off ) {
//        $(target).removeClass(off);
//        $(target).addClass(on);
//        $(target).html(on);
//        $("#onoffTarget").html(on);
//    } else if ( on && (swval === on || swval === "Piston Firing...") ) {
//        $(target).removeClass(on);
//        $(target).addClass(off);
//        $(target).html(off);
//        $("#onoffTarget").html(off);
//    } else {
//        $("#onoffTarget").html("");
//    }
    // initDialogBinds(str_type, thingindex);
};

// activate ability to click on icons
function setupIcons(category, str_type, thingindex) {
//    $("div.cat." + category).off("click","img");
//    $("div.cat." + category).on("click","img",function() {
    $("#iconList").off("click","img");
    $("#iconList").on("click","img", function() {
        var img = $(this).attr("src");


        var subid = $("#subidTarget").html();
        var strIconTarget = getCssRuleTarget('icon', subid, thingindex);
        // alert("Clicked on img= "+img+" Category= "+category+" icontarget= "+strIconTarget+" type= "+str_type+" subid= "+subid+" index= "+thingindex);
        
        iconSelected(category, strIconTarget, img, subid, thingindex);
    });
}

function initDialogBinds(str_type, thingindex) {
	
    // set up the trigger for only the tile being edited
    // and use the real tile div as the target
    var trigger = "div"; // div." + str_type + ".p_"+thingindex;
    $("#wysiwyg").on('click', trigger, function(event) {
        // alert("toggling class= " + $(event.target).attr("class") + " id= " + $(event.target).attr("id") );
        // if ( $(event.target).attr("id") &&  $(event.target).attr("subid") ) {
        if ( $(event.target).attr("subid") ) {
            toggleTile(event.target, str_type, thingindex);
            event.stopPropagation();
//        } else if ( $(event.target).hasClass("thingname") ) {
//            toggleTile( $("#wysiwyg"), str_type, thingindex);
//            event.stopPropagation();
        }
    });
    
    $("#invertIcon").on("change",function() {
//        invertImage();
        var strInvert = "filter: invert(1);";
        var subid = $("#subidTarget").html();
        var cssRuleTarget = getCssRuleTarget('icon', subid, thingindex);
        if($("#invertIcon").is(':checked')){
            // alert(cssRuleTarget);
            addCSSRule(cssRuleTarget, strInvert, true);
        } else {
            // addCSSRule(cssRuleTarget, "", true);	
            resetInverted(cssRuleTarget);
        }
    });
        
    $('#noIcon').on('change', function() {
        var subid = $("#subidTarget").html();
        var cssRuleTarget = getCssRuleTarget('icon', subid, thingindex);
        var strEffect = getBgEffect();
        if($("#noIcon").is(':checked')){
            // alert(cssRuleTarget);
            addCSSRule(cssRuleTarget, "background-image: none" + strEffect + ";");
        } else {
            removeCSSRule(cssRuleTarget, "background-image:");
        }
    });
	
    $('#noHead').on('change', function(event) {
        var cssRuleTarget = getCssRuleTarget('head', str_type, thingindex);
        if($("#noHead").is(':checked')){
            addCSSRule(cssRuleTarget, "display: none;", true);
            $("#editName").prop("disabled", true);
        } else {
            removeCSSRule(cssRuleTarget, "display:");
            // addCSSRule(cssRuleTarget, "display: inline-block;");
            $("#editName").prop("disabled", false);
        }
        event.stopPropagation;
    });	
    var cssRuleTarget = getCssRuleTarget('head', str_type, thingindex);
    var csstext = $(cssRuleTarget).css("display");
    if ( csstext === "none" ) {
        $("#noHead").prop("checked", true);
    } else {
        $("#noHead").prop("checked", false);
    }
//    console.log ("csstarget = " + cssRuleTarget + " txt= " + csstext);
    
//    $("#editName").on('input', function (event) {
//        var target1 = "span.n_"+thingindex;
//        var target2 = "div.customname.m_"+thingindex+"::after";
//        addCSSRule(target1, "color: rgba(0,0,0,0.01);");
//        var newname = $("#editName").val();
//        // alert(newname);
//        addCSSRule(target2, "content: " + newname + ";" );
//        // event.stopPropagation;
//    });

    $("#iconSrc").on('change', function (event) {
        getIcons(str_type, thingindex);	
        event.stopPropagation;
    });
    
    if ( $("#bgSize").val()==="0" || $("#bgSize").val()===0 ) {
        $("#autoBgSize").prop("checked", true);
        $("#bgSize").prop("disabled", true);
        var subid = $("#subidTarget").html();
        updateSize(subid, thingindex);
    }

    $("#autoBgSize").on('change', function(event) {
        var subid = $("#subidTarget").html();
        updateSize(subid, thingindex);
       
        if ( $("#autoBgSize").is(":checked") ) {
            $("#bgSize").prop("disabled", true);
        } else {
            $("#bgSize").prop("disabled", false);
            if ( $("#bgSize").val()==="0" || $("#bgSize").val()===0 ) {
                $("#bgSize").val("80");
            }
        }
        event.stopPropagation;
    });
    
    $("#bgSize").on('input', function(event) {
        var subid = $("#subidTarget").html();
        updateSize(subid, thingindex);
        event.stopPropagation;
    });

    // set overall tile width and header and overlay for all subitems
    $("#tileWidth").on('input', function(event) {
        var newsize = parseInt( $("#tileWidth").val() );
        var rule = "width: " + newsize.toString() + "px;";
        addCSSRule(getCssRuleTarget('tile', str_type, thingindex), rule);
        event.stopPropagation;
    });

    // set overall tile width and header and overlay for all subitems
    $("#tileHeight").on('input', function(event) {
        var newsize = parseInt( $("#tileHeight").val() );
        var rule = "height: " + newsize.toString() + "px;";
        addCSSRule(getCssRuleTarget('tile', str_type, thingindex), rule);
        event.stopPropagation;
    });

    // set overall tile width and header and overlay for all subitems
    $("#editHeight").on('input', function(event) {
        var newsize = parseInt( $("#editHeight").val() );
        var subid = $("#subidTarget").html();
        var target = getCssRuleTarget('icontext', subid, thingindex);
        var rule = "height: " + newsize.toString() + "px;";
        addCSSRule(target, rule);
        event.stopPropagation;
    });

    // set overall tile width and header and overlay for all subitems
    $("#editWidth").on('input', function(event) {
        var newsize = parseInt( $("#editWidth").val() );
        var subid = $("#subidTarget").html();
        var target = getCssRuleTarget('icontext', subid, thingindex);
        var rule = "width: " + newsize.toString() + "px;";
        addCSSRule(target, rule);
        event.stopPropagation;
    });

    // set overall tile width and height header and overlay for all subitems
    var target = getCssRuleTarget("tile", str_type, thingindex);
    var tilesize = $(target).width();
    var tilehigh = $(target).height();
    
    tilesize = parseInt(tilesize);
    $("#tileWidth").val(tilesize);
    tilehigh = parseInt(tilehigh);
    $("#tileHeight").val(tilehigh);
    
    $("#autoTileWidth").on('change', function(event) {
        var rule;
        if($("#autoTileWidth").is(':checked')) {
            rule = "width: auto;";
            $("#tileWidth").prop("disabled", true);
        } else {
            var newsize = parseInt( $("#tileWidth").val() );
            rule = "width: " + newsize.toString() + "px;";
            $("#tileWidth").prop("disabled", false);
        }
        addCSSRule(getCssRuleTarget("tile", str_type, thingindex), rule);
        event.stopPropagation;
    });

    // set overall tile width and header and overlay for all subitems
    $("#autoTileHeight").on('change', function(event) {
        var rule;
        if($("#autoTileHeight").is(':checked')) {
            rule = "height: auto;";
            $("#tileHeight").prop("disabled", true);
        } else {
            var newsize = parseInt( $("#tileHeight").val() );
            rule = "height: " + newsize.toString() + "px;";
            $("#tileHeight").prop("disabled", false);
        }
        addCSSRule(getCssRuleTarget("tile", str_type, thingindex), rule);
        event.stopPropagation;
    });

    // set the item height
    $("#autoHeight").on('change', function(event) {
        var subid = $("#subidTarget").html();
        var rule;
        if ( $("#autoHeight").is(":checked") ) {
            // special handling for default temperature circles
            if ( subid==="temperature" || subid==="feelsLike" ) {
                rule = "height: 70px; border-radius: 50%;  padding-left: 0; padding-right: 0; ";
            } else {
                rule = "height: auto;";
            }
            $("#editHeight").prop("disabled", true);
            addCSSRule(getCssRuleTarget('icontext', subid, thingindex), rule);
            addCSSRule(getCssRuleTarget('subid', subid, thingindex), rule);
        } else {
            var newsize = parseInt( $("#editHeight").val() );
            // special handling for default temperature circles
            $("#editHeight").prop("disabled", false);
            if ( newsize === 0 ) {
                newsize = "148px;";
            } else {
                newsize = newsize.toString() + "px;";
            }
            rule = "height: " + newsize;
            addCSSRule(getCssRuleTarget('icontext', subid, thingindex), rule);
            addCSSRule(getCssRuleTarget('subid', subid, thingindex), rule);
        }
        event.stopPropagation;
    });

    // set the item width
    $("#autoWidth").on('change', function(event) {
        var subid = $("#subidTarget").html();
        var rule;
        if ( $("#autoWidth").is(":checked") ) {
            // special handling for default temperature circles
            if ( subid==="temperature" || subid==="feelsLike" ) {
                rule = "width: 70px; border-radius: 50%;  padding-left: 0; padding-right: 0; ";
            } else {
                rule = "width: 92%; padding-left: 4%; padding-right: 4%;";
            }
            $("#editWidth").prop("disabled", true);
            addCSSRule(getCssRuleTarget('icontext', subid, thingindex), rule);
            addCSSRule(getCssRuleTarget('subid', subid, thingindex), rule);
       } else {
            var newsize = parseInt( $("#editWidth").val() );
            $("#editWidth").prop("disabled", false);
            if ( newsize === 0 ) {
                rule = "width: 92%; padding-left: 4%; padding-right: 4%;";
            } else {
                newsize = newsize.toString() + "px;";
                rule = "width: " + newsize;
            }
            addCSSRule(getCssRuleTarget('icontext', subid, thingindex), rule);
            addCSSRule(getCssRuleTarget('subid', subid, thingindex), rule);
       }
        event.stopPropagation;
    });

    // set padding for selected item
    $("#topPadding").on('change', function(event) {
        var subid = $("#subidTarget").html();
        var newsize = parseInt( $("#topPadding").val() );
        if ( !newsize || newsize==="NaN" ) { 
            newsize = "0px;";
        } else {
            newsize = newsize.toString() + "px;";
        }
        var rule = "padding-top: " + newsize;
        addCSSRule(getCssRuleTarget('icontext', subid, thingindex), rule);
        event.stopPropagation;
    });

    // set padding for selected item
    $("#botPadding").on('change', function(event) {
        var subid = $("#subidTarget").html();
        var newsize = parseInt( $("#botPadding").val() );
        if ( !newsize || newsize==="NaN" ) { 
            newsize = "0px;";
        } else {
            newsize = newsize.toString() + "px;";
        }
        var rule = "padding-bottom: " + newsize;
        addCSSRule(getCssRuleTarget('icontext', subid, thingindex), rule);
        event.stopPropagation;
    });
    
}

function iconlist() {
    var dh = "";
	dh += "<div id='editicon'>";
	dh += "<div id='iconChoices'>";
	dh += "<select name=\"iconSrc\" id=\"iconSrc\" class=\"ddlDialog\"></select>";
//	dh += "<input type=\"checkbox\" id=\"invertIcon\">";
//	dh += "<label class=\"iconChecks\" for=\"invertIcon\">Invert</label>";	
	dh += "<input type='checkbox' id='noIcon'>";
	dh += "<label class=\"iconChecks\" for=\"noIcon\">None</label>";
	dh += "</div>";
	dh += "<div id='iconList'></div>";
	dh += "</div>";
    return dh;
}

function editSection(str_type, thingindex) {
    var dh = "";
        dh += "<div id='editSection'>";
        dh += effectspicker(str_type, thingindex);
        dh += sizepicker(str_type, thingindex);
        dh += "</div>";
    return dh;
}

function effectspicker(str_type, thingindex) {
    var dh = "";
    var target = "div." + str_type + "-thing span.n_" + thingindex;
    var name = $(target).html();

    // Title changes and options
	dh += "<div class='colorgroup'><label>Title:</label><input name=\"editName\" id=\"editName\" class=\"ddlDialog\" value=\"" + name +"\"></div>";
	dh += "<div class='editSection_input'><input type='checkbox' id='noHead'><label class=\"iconChecks\" for=\"noHead\">No Header?</label></div>";
	dh += "<div class='editSection_input'><input type='checkbox' id='invertIcon'><label class=\"iconChecks\" for=\"invertIcon\">Invert Element?</label></div>";
        
	//Effects
	dh += "<div class='colorgroup'><label>Effect Scope:</label>";
	dh += "<select name=\"scopeEffect\" id=\"scopeEffect\" class=\"ddlDialog\">";
	dh += "<option value=\"thistile\" selected>This Tile</option>";
	dh += "<option value=\"alltypes\">All " + str_type + "</option>";
	dh += "<option value=\"alltiles\">All Tiles</option>";
	dh += "</select>";
	dh += "</div>";
    return dh;    
}

function sizepicker(str_type, thingindex) {
    var dh = "";

    var subid = setsubid(str_type);
    var target = getCssRuleTarget("icon",subid, thingindex);  // "div.thing";
    var size = $(target).css("background-size");
    // alert("old size: " + size);
    if ( size===undefined || size==="auto" ) { 
        size= 0; 
    } else {
        size = parseInt(size);
    }
    
    // icon size effects
    dh += "<div class='sizeText'></div>";
    dh += "<div class='editSection_input'>";
    dh += "<label for='bgSize'>Icon Size: </label>";
    dh += "<input size='8' type=\"number\" min='10' max='400' step='10' id=\"bgSize\" value=\"" + size + "\"/>";
    dh += "</div>";
    dh += "<div class='editSection_input'><input type='checkbox' id='autoBgSize'><label class=\"iconChecks\" for=\"autoBgSize\">Auto?</label></div>";

    // overall tile size effect
    var target2 = "div.thing."+str_type+"-thing";
    var th = $(target2).css("height");
    var tw = $(target2).css("width");
    if ( !th || th.indexOf("px") === -1 ) { 
        th= 0; 
    } else {
        th = parseInt(th);
    }
    if ( tw==="auto" || !tw || tw.indexOf("px") === -1 ) { 
        tw= 0; 
    } else {
        tw = parseInt(tw);
    }
    
    var h = $(target).css("height");
    var w = $(target).css("width");
    if ( !h || !h.hasOwnProperty("indexOf") || h.indexOf("px") === -1 ) { 
        h= 0; 
    } else {
        h = parseInt(h);
    }
    if ( !w || !w.hasOwnProperty("indexOf") ||  w.indexOf("px") === -1 ) { 
        w= 0; 
    } else {
        w = parseInt(w);
    }
    
    // alert("target= "+target+" w= "+w+" h= "+h);
    dh += "<div class='sizeText'>Overall Tile Size</div>";
    dh += "<div class='editSection_input'>";
    dh += "<label for='tileHeight'>Tile H: </label>";
    dh += "<input size='8' type=\"number\" min='10' max='800' step='10' id=\"tileHeight\" value=\"" + th + "\"/>";
    dh += "</div>";
    dh += "<div class='editSection_input autochk'>";
    dh += "<label for='tileWidth'>Tile W: </label>";
    dh += "<input size='8' type=\"number\" min='10' max='800' step='10' id=\"tileWidth\" value=\"" + tw + "\"/>";
    dh += "</div>";
    dh += "<div class='editSection_input autochk'><input type='checkbox' id='autoTileHeight'><label class=\"iconChecks\" for=\"autoTileHeight\">Auto H?</label></div>";
    dh += "<div class='editSection_input autochk'><input type='checkbox' id='autoTileWidth'><label class=\"iconChecks\" for=\"autoTileWidth\">Auto W?</label></div>";

    dh += "<div class='sizeText'><p>Text Size & Position:</p></div>";
    dh += "<div class='editSection_input autochk'>";
    dh += "<label for='editHeight'>Text H: </label>";
    dh += "<input size='4' type=\"number\" min='5' max='400' step='5' id=\"editHeight\" value=\"" + h + "\"/>";
    dh += "</div>";
    dh += "<div>";
    dh += "<div class='editSection_input autochk'>";
    dh += "<label for='editWidth'>Text W: </label>";
    dh += "<input size='4' type=\"number\" min='5' max='400' step='5' id=\"editWidth\" value=\"" + w + "\"/>";
    dh += "</div>";
    dh += "</div>";
    dh += "<div class='editSection_input autochk'><input type='checkbox' id='autoHeight'><label class=\"iconChecks\" for=\"autoHeight\">Auto H?</label></div>";
    dh += "<div class='editSection_input autochk'><input type='checkbox' id='autoWidth'><label class=\"iconChecks\" for=\"autoWidth\">Auto W?</label></div>";

    // font size (returns px not pt)
    var ptop = parseInt($(target).css("padding-top"));
    var pbot = parseInt($(target).css("padding-bottom"));
    
    if ( !ptop || ptop==="NaN" ) { ptop = 0; }
    if ( !pbot || pbot==="NaN" ) { pbot = 0; }
    dh += "<div class='editSection_input'>";
    dh += "<label for='topPadding'>Top gap:</label>\t";
    dh += "<input size='4' type=\"number\" min='0' max='100' step='5' id=\"topPadding\" value=\"" + ptop + "\"/>";
    dh += "</div>";    dh += "<div class='editSection_input'>";
    dh += "<label for='botPadding'>Bottom gap:</label>\t";
    dh += "<input size='4' type=\"number\" min='0' max='100' step='5' id=\"botPadding\" value=\"" + pbot + "\"/>";
    dh += "</div>";
    
    return dh;
}

function colorpicker(str_type, thingindex) {
    var dh = "";
    // dh += "<div id='pickerWrapper'>";
//    dh += "<button id='editReset' type='button'>Reset</button>";
//    dh += "<div class='dlgtext'>Setting Icon: </div><div id='subidTarget' class='dlgtext'>" + str_type + "</div>";
//    dh += "<div id='onoffTarget' class='dlgtext'>" + "" + "</div>";
    
    // this section is loaded later with a bunch of color pickers
    // including script to respond to picked color
    dh += "<div id='colorpicker'></div>";
    return dh;
}

// popup dialog box now uses createModal
function editTile(str_type, thingindex, htmlcontent) {  

    // save the sheet upon entry for cancel handling
    savedSheet = document.getElementById('customtiles').sheet;
    
    // * DIALOG START *	
    var dialog_html = "<div id='tileDialog' class='tileDialog'>";
	
    // header
    dialog_html += "<div id='editheader'>Editing Tile #" + thingindex + " of Type: " + str_type + "</div>";

    // option on the left side - colors and options
    dialog_html += colorpicker(str_type, thingindex);
    dialog_html += editSection(str_type, thingindex);
    
    // icons on the right side
    dialog_html += iconlist();
    
    // tileEdit display on the far right side 
    dialog_html += "<div id='tileDisplay' class='tileDisplay'>";
    
    // we either use the passed in content or make an Ajax call to get the content
    var jqxhr = null;
    if ( htmlcontent ) {
        dialog_html += "<div class=\"thing " + str_type + " " + str_type + "-thing p_" + thingindex+"\" id='wysiwyg'>" + htmlcontent + "</div>";
    } else {
        // put placeholder and populate after Ajax finishes retrieving true wysiwyg content
        dialog_html += "<div class=\"thing " + str_type + " " + str_type + "-thing p_"+thingindex+"\" id='wysiwyg'></div>";
        jqxhr = $.post("housepanel.php", 
            {useajax: "wysiwyg", id: '', type: '', tile: thingindex, value: '', attr: ''},
            function (presult, pstatus) {
                if (pstatus==="success" ) {
                    htmlcontent = presult;
                }
            }
        );
    }
    dialog_html += "</div>";
    
    // * DIALOG_END *
    dialog_html += "</div>";
    
    // create a function to display the tile
    var dodisplay = function() {
        var pos = {top: 100, left: 200};
        createModal( dialog_html, "body", true, pos, 
            // function invoked upon leaving the dialog
            function(ui, content) {
                var clk = $(ui).attr("name");
                // alert("clk = "+clk);
                if ( clk==="okay" ) {
                    saveTileEdit();
                } else if ( clk==="cancel" ) {
                    cancelTileEdit(str_type, thingindex);
                }
            },
            // function invoked upon starting the dialog
            function(hook, content) {
                // alert("Displayed content");
                // find the first clickable item
                var subid = setsubid(str_type);
                getIcons(str_type, thingindex);	
                initColor(str_type, subid, thingindex);
                initDialogBinds(str_type, thingindex);
//                var target = $("#wysiwyg div." + str_type + "[subid='" + subid + "']"   );
//                console.log(" startup target html= " + $(target).html() );
//                toggleTile(target, subid, thingindex);
                $("#modalid").draggable();
            }
        );
    };
    
    if ( jqxhr ) {
        jqxhr.done(function() {
            dodisplay();
            $("#wysiwyg").html(htmlcontent);
        });
    } else {
        dodisplay();
    }

}

function setsubid(str_type) {
    var subid = str_type;
    switch(str_type) {
        case "bulb":
        case "light":
        case "switch":
        case "valve":
        case "switchlevel":
            subid = "switch";
            break;

        case "thermostat":
        case "temperature":
        case "weather":
            subid = "temperature";
            break;

        case "music":
            subid = "track";
            break;

        case "clock":
            subid = "time";
            break;
    }
    $("#subidTarget").html(subid);
    return subid;
}

function saveTileEdit(str_type, thingindex) {
    var returnURL;
    try {
        returnURL = $("input[name='returnURL']").val();
    } catch(e) {
        returnURL = "housepanel.php";
    }

    // get all custom CSS text
    var sheet = document.getElementById('customtiles').sheet;
    var sheetContents = "";
    c=sheet.cssRules;
    for(j=0;j<c.length;j++){
        sheetContents += c[j].cssText;
    };
    var regex = /[{;}]/g;
    var subst = "$&\n";
    sheetContents = sheetContents.replace(regex, subst);
    
    // post changes to save them in a custom css file
    $.post(returnURL, 
        {useajax: "savetileedit", id: "0", type: str_type, value: sheetContents, attr: thingindex},
        function (presult, pstatus) {
            if (pstatus==="success" ) {
                console.log("POST success"); // Custom CSS saved:\n"+ presult );
            } else {
                console.log("POST error= " + pstatus);
            }
        }
    );
}

function cancelTileEdit(str_type, thingindex) {
    resetCSSRules(str_type, thingindex);
    document.getElementById('customtiles').sheet = savedSheet;
    
    // location.reload(true);
}

function resetInverted(selector) {
    //Searching of the selector matching cssRules
    // var selector = getCssRuleTarget('icon', str_type, thingindex);
    var sheet = document.getElementById('customtiles').sheet; // returns an Array-like StyleSheetList
    for (var i=sheet.cssRules.length; i--;) {
        var current_style = sheet.cssRules[i];
        if(current_style.selectorText === selector){
            if(current_style.cssText.indexOf("invert") !== -1) {
                current_style.style.filter="";	
            }	  		
        }
    }
}

// add all the color selectors to the colorpicker div
function initColor(tile_type, str_type, thingindex) {

   
    var target = getCssRuleTarget("icon", str_type, thingindex, 0);
    var swval = $(target).html();
    
    // activate the icon click to use this
    var onoff = getOnOff(str_type, swval);
    // $("#onoffTarget").html("");
    var newonoff = "";
    if ( onoff && onoff.length > 0 ) {
        for ( var i=0; i < onoff.length; i++ ) {
            var oldsub = onoff[i];
            if ( $(target).html() === oldsub ) {
//                $("#onoffTarget").html( oldsub );
                newonoff = oldsub;
//                alert("oldsub= "+oldsub);
                break;
            }
        }
    }
//    alert( "onoff= " + $("#onoffTarget").html() );
    
//    var onoff = getOnOff(str_type, swval);
//    $("#onoffTarget").html("");
//    if (tile_type!=="thermostat" && (onoff[0] || onoff[1]) ) {
//        if ( onoff[0] && $(target).html()===onoff[0] ) {
//            $("#onoffTarget").html(swval);
//        } else if ( onoff[1] && swval === onoff[1] ) {
//            $("#onoffTarget").html(swval);
//        }
//    }

    var generic = "none";

    target = getCssRuleTarget("icon", str_type, thingindex, 0);
    var onstart = $(target).css("background-color");
    if ( !onstart || onstart==="rgba(0, 0, 0, 0)" ) {
        generic = getCssRuleTarget("icon", str_type, thingindex, 1);
        onstart = $(generic).css("background-color");
        if ( !onstart || onstart==="rgba(0, 0, 0, 0)" ) { onstart = $("div.thing").css("background-color"); }
        if ( !onstart || onstart==="rgba(0, 0, 0, 0)" ) { onstart = "rgba(0,51,204,0.6)"; }
    }
    // alert("target= " + target+" generic= "+generic+" onstart= "+onstart);
    console.log("icon target= "+ target+ " color= "+onstart);
    var iconback = '<div class="colorgroup"> \
                  <label for="iconColor">Background Color</label> \
                  <input type="text" id="iconColor" \
                  caller="icon" target="' + target + '" \
                  class="colorset" value="' + onstart + '"> \
                  </div>';

    // icon foreground colors
    var ictarget = getCssRuleTarget("icontext", str_type, thingindex, 0);
    var onstart = $(target).css("color");
    if ( !onstart || onstart==="rgba(0, 0, 0, 0)" ) {
        generic = getCssRuleTarget("icontext", str_type, thingindex, 1);
        onstart = $(generic).css("color");
        if ( !onstart || onstart==="rgba(0, 0, 0, 0)" ) { onstart = $("div.thing").css("color"); }
        if ( !onstart || onstart==="rgba(0, 0, 0, 0)" ) { onstart = "rgba(255, 255, 255, 1)"; }
    }
    console.log("icontext target= "+ ictarget+ " color= "+onstart);
    var iconfore = '<div class="colorgroup"> \
                  <label for="iconFore">Foreground Color</label> \
                  <input type="text" id="iconFore" \
                  caller="icontext" target="' + ictarget + '" \
                  class="colorset" value="' + onstart + '"> \
                  </div>';

    // header background colors
    target = getCssRuleTarget("head", tile_type, thingindex, 0);
    var onstart = $(target).css("background-color");
    console.log("head target= "+ target+ " color= "+onstart);
    var headback = '<div class="colorgroup"> \
                  <label for="headBackground">Header Background</label> \
                  <input type="text" id="headBackground" \
                  caller="head" target="' + target + '" \
                  class="colorset" value="' + onstart + '"> \
                  </div>';

    // header foreground colors
    target = getCssRuleTarget("text", tile_type, thingindex, 0);
    var onstart = $(target).css("color");
    console.log("text target= "+ target+ " color= "+onstart);
    var headfore = '<div class="colorgroup"> \
                  <label for="headFore">Header Foreground</label> \
                  <input type="text" id="headFore" \
                  caller="text" target="' + target + '" \
                  class="colorset" value="' + onstart + '"> \
                  </div>';

    var ceffect = "";
    ceffect += "<div class='colorgroup'><label>Background Effect:</label>";
    ceffect += "<select name=\"editEffect\" id=\"editEffect\" class=\"ddlDialog\">";
    ceffect += "<option value=\"none\" selected>No Effect</option>";
    ceffect += "<option value=\"hdark\">Horiz. Dark</option>";
    ceffect += "<option value=\"hlight\">Horiz. Light</option>";
    ceffect += "<option value=\"vdark\">Vertical Dark</option>";
    ceffect += "<option value=\"vlight\">Vertical Light</option>";
    ceffect += "</select>";
    ceffect += "</div>";

    // font size (returns px not pt)
    // get the default font
    var ffamily = $(ictarget).css("font-family");
    var fweight = $(ictarget).css("font-weight");
    var fstyle = $(ictarget).css("font-style");
    var fontdef;
    if ( ffamily==="serif" || ffamily==="Times New Roman" || ffamily==="Raleway" || ffamily==="Times" ) {
        fontdef = "serif";
    } else if ( ffamily==="Courier" || ffamily==="monospace") {
        fontdef = "mono";
    } else {
        fontdef = "sans";
    }
    if ( fweight==="bold") {
        fontdef+= "b";
    }
    if ( fstyle==="italic") {
        fontdef+= "i";
    }
        
    var fe = "";
    fe += "<div class='colorgroup font'><label>Font Type:</label>";
    fe += "<select name=\"fontEffect\" id=\"fontEffect\" class=\"ddlDialog\">";
    
    var fonts = {sans:"Sans", sansb:"Sans Bold", sansi:"Sans Italic", sansbi:"Sans Bold+Italic",
                 serif:"Serif", serifb:"Serif Bold", serifi:"Serif Italic", serifbi:"Serif Bold+Italic",
                 mono:"Monospace", monob:"Mono Bold", monoi:"Mono Italic", monobi:"Mono Bold+Italic" };
    for ( var key in fonts ) {
        if ( fonts.hasOwnProperty(key) ) {
            var checked = "";
            if ( key===fontdef) {
                checked = " selected";
            }
            fe += "<option value=\"" + key + "\"" + checked + ">" + fonts[key] + "</option>";
        }
    }
    fe += "</select>";
    fe += "</div>";
    
    var f = $(ictarget).css("font-size");
    f = parseInt(f);
       
    fe += "<div class='colorgroup font'><label>Font Size (px):</label>";
    fe += "<select name=\"fontEffect\" id=\"editFont\" class=\"ddlDialog\">";
    var sizes = [8,9,10,11,12,14,16,18,20,24,28,32,40,48,60,80,100,120];
    sizes.forEach( function(sz, index, arr) {
        sz = parseInt(sz);
        var checked = "";
        if ( f === sz ) { checked = " selected"; }
        fe+= "<option value=\"" + sz + "px;\"" + checked + ">" + sz + "</option>";
    });
    fe += "</select>";
    fe += "</div>";

    var align = "";
    align += "<div id='alignEffect' class='colorgroup'><label>Text Alignment:</label><div class='editSection_input'>";
    align+= '<input id="alignleft" type="radio" name="align" value="left"><label for="alignleft">Left</label>';
    align+= '<input id="aligncenter" type="radio" name="align" value="center" checked><label for="aligncenter">Center</label>';
    align+= '<input id="alignright" type="radio" name="align" value="right"><label for="alignright">Right</label>';
    align += "</div></div>";

    var dh= "";
    dh += "<button id='editReset' type='button'>Reset</button>";
    // dh += "<div class='dlgtext'>Item: </div>";
    dh += "<div id='subidTarget' class='dlgtext'>" + str_type + "</div>";
    dh += "<div id='onoffTarget' class='dlgtext'>" + newonoff + "</div>";

    // insert the color blocks
    $("#colorpicker").html(dh + iconback + ceffect + iconfore + headback + headfore + fe + align);

    // turn on minicolor for each one
    $('#colorpicker .colorset').each( function() {
        var strCaller = $(this).attr("caller");
        // alert("caller= "+strCaller);
        var startColor = $(this).val();
        // var startTarget = $(this).attr("target");
        $(this).minicolors({
            control: "hue",
            position: "bottom left",
            defaultValue: startColor,
            theme: 'default',
            opacity: true,
            format: 'rgb',
            change: function(strColor) {
                updateColor(strCaller, tile_type, thingindex, strColor);
            }
        });
    });
    
    $("#editReset").off('change');
    $("#editReset").on('click', function (event) {
        // alert("Reset type= "+tile_type+" thingindex= "+thingindex);
        resetCSSRules(str_type, thingindex);
        event.stopPropagation;
    });

    $("#editEffect").off('change');
    $("#editEffect").on('change', function (event) {
        var editEffect = getBgEffect( $(this).val() );
        var subid = $("#subidTarget").html();
        var target = getCssRuleTarget('icon', subid, thingindex);
        var priorEffect = "background-image: " + $(target).css("background-image");
        var idx = priorEffect.indexOf(", linear-gradient");
        if ( idx !== -1 ) {
            priorEffect = priorEffect.substring(0,idx);
        }
        editEffect = priorEffect + editEffect;
        // alert("Changing effect to: "+editEffect);
        addCSSRule(target, editEffect);
        event.stopPropagation;
    });

    $("#fontEffect").off('change');
    $("#fontEffect").on('change', function (event) {
        var subid = $("#subidTarget").html();
        var target = getCssRuleTarget('icontext', subid, thingindex);
        var fontstyle = $(this).val();
        var fontstr = "";
        if ( fontstyle.startsWith("sans" ) ) {
            fontstr+= "font-family: \"Droid Sans\", Arial, Helvetica, sans-serif; ";
        } else if ( fontstyle.startsWith("serif" ) ) {
            fontstr+= "font-family: \"Raleway\", \"Times New Roman\", Times, serif; ";
        } else if ( fontstyle.startsWith("mono" ) ) {
            fontstr+= "font-family: Courier, monospace; ";
        } else {
            fontstr+= "font-family: \"Droid Sans\", Arial, Helvetica, sans-serif; ";
        }
        
        // handle italics
        if ( fontstyle.endsWith("i" ) ) {
            fontstr+= "font-style: italic; ";
        } else {
            fontstr+= "font-style: normal; ";
        }
        
        // handle bolding
        if ( fontstyle.endsWith("b") || fontstyle.endsWith("bi") ) {
            fontstr+= "font-weight: bold; ";
        } else {
            fontstr+= "font-weight: normal; ";
        }
        
        // alert("Changing font effect target= " + target + " to: "+fontstr);
        addCSSRule(target, fontstr);
        event.stopPropagation;
    });
    
    // font size handling
    $("#editFont").off('change');
    $("#editFont").on('change', function (event) {
        var subid = $("#subidTarget").html();
        var target = getCssRuleTarget('icontext', subid, thingindex);
        var fontsize = $(this).val();
        var fontstr= "font-size: " + fontsize;
        
        // alert("Changing font effect target= " + target + " to: "+fontstr);
        addCSSRule(target, fontstr);
        event.stopPropagation;
    });
    
    // font size handling
    $("#alignEffect").off('change', "input");
    $("#alignEffect").on('change', "input", function (event) {
        var subid = $("#subidTarget").html();
        var target = getCssRuleTarget('icontext', subid, thingindex);
        var aligneffect = $(this).val();
        var fontstr= "text-align: " + aligneffect;
//        alert("Align effect= " + fontstr);
        addCSSRule(target, fontstr);
        event.stopPropagation;
    });
    
    var cssRuleTarget = getCssRuleTarget('icon', str_type, thingindex);
    console.log ( "target= " + cssRuleTarget + " css= " + $(cssRuleTarget).css("filter") );
    if ( $(cssRuleTarget).css("filter") && $(cssRuleTarget).css("filter").startsWith("invert") ) {
        $("#invertIcon").prop("checked",true);
    } else {
        $("#invertIcon").prop("checked",false);
    }
    
}

// main routine that sets the color of items
function updateColor(strCaller, str_type, thingindex, strColor) {
    if ( strCaller === "icon" ||  strCaller === "icontext") {
        str_type = $("#subidTarget").html();
    }
    var cssRuleTarget;
    console.log("caller= "+strCaller+" rule= "+cssRuleTarget+" str_type= "+str_type);
    switch (strCaller) {
        case 'text':
                cssRuleTarget = getCssRuleTarget(strCaller, str_type, thingindex);
                console.log("caller= "+strCaller+" rule= "+cssRuleTarget+" str_type= "+str_type);
                addCSSRule(cssRuleTarget, "color: " + strColor + ";");	
//                $(cssRuleTarget).css( "color: " + strColor + ";" );
                break;
                
        case 'icontext':
            
            if ( str_type ==="level" ) {
                cssRuleTarget = getCssRuleTarget("overlay", str_type, thingindex);
                var sliderTarget= cssRuleTarget + " .ui-slider-handle.ui-state-default";
                console.log("caller= "+strCaller+" rule= "+sliderTarget+" str_type= "+str_type);
                addCSSRule(sliderTarget, "background-color: " + strColor + ";");		
//                $(sliderTarget).css( "background-color: " + strColor + ";" );
                sliderTarget = cssRuleTarget + " .ui-slider-horizontal.ui-widget-content";
                console.log("caller= "+strCaller+" rule= "+sliderTarget+" str_type= "+str_type);
                addCSSRule(sliderTarget, "background-color: " + strColor + ";");		
//                $(sliderTarget).css( "background-color: " + strColor + ";" );
            } else {
                cssRuleTarget = getCssRuleTarget(strCaller, str_type, thingindex);
                console.log("caller= "+strCaller+" rule= "+cssRuleTarget+" str_type= "+str_type);
                addCSSRule(cssRuleTarget, "color: " + strColor + ";");	
//                $(cssRuleTarget).css( "color: " + strColor + ";" );
            }
            break;
            
        case "icon":
            if ( str_type ==="level" ) {
                cssRuleTarget = getCssRuleTarget("overlay", str_type, thingindex);
            } else {
                cssRuleTarget = getCssRuleTarget(strCaller, str_type, thingindex);
            }
            console.log("caller= "+strCaller+" rule= "+cssRuleTarget+" str_type= "+str_type);
            addCSSRule(cssRuleTarget, "background-color: " + strColor + ";");		
//            $(cssRuleTarget).css( "background-color: " + strColor + ";" );
            break;
            
        default:
            cssRuleTarget = getCssRuleTarget(strCaller, str_type, thingindex);
            console.log("caller= "+strCaller+" rule= "+cssRuleTarget+" str_type= "+str_type);
            addCSSRule(cssRuleTarget, "background-color: " + strColor + ";");		
//            $(cssRuleTarget).css( "background-color: " + strColor + ";" );
            break;
    }
}

function getIconCategories() {
	var iconDoc = 'iconlist.txt';
	var arrCat = ['Local_Storage','Local_Media'];
	$.ajax({
        url:iconDoc,
        type:'GET',
        success: function (data) {
            var arrIcons = data.toString().replace(/[\t\n]+/g,'').split(',');
            $.each(arrIcons, function(index, val) {
                var iconCategory = val.substr(0, val.indexOf('|'));
                iconCategory = $.trim(iconCategory).replace(/\s/g, '_');	
                arrCat.push(iconCategory);					
            }); //end each Icon
            arrCat = makeUnique(arrCat);
            $.each(arrCat, function(index, iconCat) {
                var catText = iconCat.replace(/_/g, ' ')
                $('#iconSrc').append($('<option></option>').val(iconCat).text(catText));
            }); 
        } //end function()
	}); //end ajax
}

function getIcons(str_type, thingindex) {
    getIconCategories();
    var iCategory = $("#iconSrc").val();
    var skindir = $("#skinid").val();
    var localPath = skindir + '/icons/';
    
    // change to use php to gather icons in an ajax post call
    // this replaces the old method that fails on GoDaddy
    if ( !iCategory ) { iCategory = 'Local_Storage'; }
    if( iCategory === 'Local_Storage' || iCategory==='Local_Media') {
        if ( iCategory === 'Local_Media') {
            localPath = skindir + '/media/';
        }
        $.post("getdir.php", 
            {useajax: "geticons", attr: localPath},
            function (presult, pstatus) {
                if (pstatus==="success" ) {
                    console.log("reading icons from local path= "+localPath);
                    $('#iconList').html(presult);
                    setupIcons(iCategory, str_type, thingindex);
                } else {
                    $('#iconList').html("<div class='error'>Error reading icons from local path= " + localPath + "</div>");
                }
            }
        );
    } else {
        var icons = '';
        var iconDoc = 'iconlist.txt';
        $.ajax({
            url:iconDoc,
            type:'GET',
            success: function (data) {
                var arrIcons = data.toString().replace(/[\t\n]+/g,'').split(',');
                $.each(arrIcons, function(index, val) {
                    var iconCategory = val.substr(0, val.indexOf('|'));
                    iconCategory = $.trim(iconCategory).replace(/\s/g, '_');	
                    if(iconCategory === iCategory) {
                        var iconPath = val.substr(1 + val.indexOf('|'));
                        icons+='<div>';
                        icons+='<img class="icon" src="' + iconPath + '"></div>';
                    }
                }); //end each Icon			
                $('#iconList').html(icons);
                setupIcons(iCategory, str_type, thingindex);
            } //end function()
        }); //end ajax
    }
}

function makeUnique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function getBgEffect(effect) {
    var strEffect = '';
    if ( !effect ) {
        effect = $('#editEffect').val();
    }

    switch (effect) {
        case "hdark":
            strEffect = ', linear-gradient(to right, rgba(0,0,0,.5) 0%,rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)';
            break;
                
        case "hlight":
            strEffect = ', linear-gradient(to right, rgba(255,255,255,.4) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,.4) 100%)';
            break;
                
        case "vdark":
            strEffect = ', linear-gradient(to bottom, rgba(0,0,0,.5) 0%,rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)';
            break;
                
        case "vlight":
            strEffect = ', linear-gradient(to bottom, rgba(255,255,255,.4) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,.4) 100%)';
            break;
    };	
    return strEffect;
}

// main routine that sets the icon of things
function iconSelected(category, cssRuleTarget, imagePath, str_type, thingindex) {

    // get scope
//    var scope = $("#scopeEffect").val();
//    alert("Icon set to scope= " + scope);
    
    console.log("Setting icon: category= " + category + " target= "+cssRuleTarget+" icon= " + imagePath + " type= "+str_type+" index= "+thingindex);
    $("#noIcon").attr('checked', false);
    
    var strEffect = getBgEffect();
    var imgurl = "background-image: url(" + imagePath + ")";
    addCSSRule(cssRuleTarget, imgurl + strEffect + ";");

    // updateSize(str_type, thingindex);
//
//    if ( $("#invertIcon").is(':checked') ) {
//        addCSSRule(cssRuleTarget, "filter: invert(1);");
//        addCSSRule(cssRuleTarget, "-webkit-filter: invert(1);");
//    } else {
//        resetInverted(cssRuleTarget);
//    }
}

function updateSize(subid, thingindex) {
    var cssRuleTarget = getCssRuleTarget("icon", subid, thingindex);
    // alert("size target= "+cssRuleTarget);
    if ( $("#autoBgSize").is(":checked") ) {
        addCSSRule(cssRuleTarget, "background-size: auto;");
    } else {
        var iconsize = $("#bgSize").val();
        if ( iconsize===0 || iconsize==="0" ) {
            addCSSRule(cssRuleTarget, "background-size: auto;");
        } else if ( ! $.isNumeric(iconsize)  ) {
            addCSSRule(cssRuleTarget, "background-size: " + iconsize + ";");
        } else {
            var newsize = parseInt( iconsize );
            var rule = newsize.toString() + "px;";
            addCSSRule(cssRuleTarget, "background-size: " + rule);
        }
    }
}

function addCSSRule(selector, rules, resetFlag){
    //Searching of the selector matching cssRules
    // alert("Adding rules: " + rules);
    
    var sheet = document.getElementById('customtiles').sheet; // returns an Array-like StyleSheetList
    var index = -1;
    for(var i=sheet.cssRules.length; i--;){
        var current_style = sheet.cssRules[i];
        if(current_style.selectorText === selector){
            //Append the new rules to the current content of the cssRule;
            if( !resetFlag ){
                rules=current_style.style.cssText + rules;			
            }
            sheet.deleteRule(i);
            index=i;
        }
    }
    if(sheet.insertRule){
        if(index > -1) {
            sheet.insertRule(selector + "{" + rules + "}", index);		  
        } else {
            sheet.insertRule(selector + "{" + rules + "}");			  
        }
    }
    else{
        if(index > -1) {
            sheet.addRule(selector, rules, index);	  
        } else {
            sheet.addRule(selector, rules);	  
        }
    }
}

function resetCSSRules(str_type, thingindex){

        var ruletypes = ['icon','subid','tile','head','text'];
        ruletypes.forEach( function(rule, idx, arr) {
            var strIconTarget = getCssRuleTarget(rule, str_type, thingindex);
            // alert("rule= " + rule + " type= "+ str_type + " thingindex" + thingindex + "target= "+strIconTarget);
            removeCSSRule(strIconTarget, thingindex, null, 0);
            removeCSSRule(strIconTarget, thingindex, null, 2);
        });

        // remove all the subs
        var onoff = getOnOff(str_type);
        var target = "div.overlay." + str_type + ".v_" + thingindex + " div."+str_type + '.p_'+thingindex;
        if ( onoff && onoff.length ) {
            for (var i= 0; i < onoff.length; i++) {
                var subtarget = target + "." + onoff[i];
                removeCSSRule(subtarget, thingindex, null, 0);
            }
        }
        
        document.getElementById('customtiles').sheet = savedSheet;
}

function removeCSSRule(strMatchSelector, thingindex, target, ignoreall){
    var scope = $("#scopeEffect").val();
    var useall = 0;
    
    if ( ignoreall ) {
        if ( ignoreall===0 || ignoreall===1 || ignoreall===2 ) {
            useall = ignoreall;
        }
    } else {
        if ( scope=== "alltypes") { useall= 1; }
        else if ( scope=== "alltiles") { useall= 2; }
        else { useall = 0; }
    }
    
    var sheet = document.getElementById('customtiles').sheet; // returns an Array-like StyleSheetList
    //Searching of the selector matching cssRules
    console.log("Remove rule: " + strMatchSelector );
    for (var i=sheet.cssRules.length; i--;) {
        var current_style = sheet.cssRules[i];
        // alert(current_style.style.cssText );
//        console.log("Del: " + current_style.selectorText );
        if ( useall===2 || ( thingindex && current_style.selectorText.indexOf("_"+thingindex) !== -1 ) || 
             (current_style.selectorText === strMatchSelector &&
               ( !target || current_style.style.cssText.indexOf(target) !== -1 ) ) ) {
            sheet.deleteRule (i);
            console.log("Removing rule: " + current_style.selectorText);
        }
    }  
}
		 
function invertImage(){
    //Searching of the selector matching cssRules
    var selector = ".icon";
    var rules = "float: left;\nmargin: 2px;\nmax-height: 40px;\nobject-fit: contain;";
    var sheet = document.getElementById('tileeditor').sheet; // returns an Array-like StyleSheetList
    var index = -1;
    for(var i=sheet.cssRules.length; i--;){
        var current_style = sheet.cssRules[i];
        if (current_style.selectorText === selector) {
            //Append the new rules to the current content of the cssRule;
            sheet.deleteRule(i);
            index=i;
        }
    }
    
    if($("#invertIcon").is(':checked')) {
        rules = rules + "\nfilter: invert(1);\n-webkit-filter: invert(1);";
    }

    if (sheet.insertRule) {
        if (index > -1) {
            sheet.insertRule(selector + "{" + rules + "}", index);		  
        } else {
            sheet.insertRule(selector + "{" + rules + "}");			  
        }
    }
    else{
        if (index > -1) {
            sheet.addRule(selector, rules, index);	  
        } else {
            sheet.addRule(selector, rules);	  
        }
    }	
}
