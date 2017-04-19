function bindEvent(obj, events, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(events, function(ev) {
            if (fn() == false) {
                ev.preventDefault();
                ev.cancelBubble = true;
            }
        }, false);
    } else {
        obj.attachEvent('on' + events, function(){
			
			if( fn() == false ){
				window.event.cancelBubble = true;
				return false;
			}	
		});
    }
}

function toArray(elems) {
    var arr = [];
    for (var i = 0; i < elems.length; i++) {
        arr.push(elems[i]);
    }
    return arr;
}

function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}

function Zquery(zArg) {
    this.elements = []; //选择元素的这样一个集合
    switch (typeof zArg) {
        case 'function':
            bindEvent(window, 'load', zArg)
            break;
        case 'string':
            switch (zArg.charAt(0)) {
                case '#': //id
                    this.elements.push(document.getElementById(zArg.substring(1)));
                    break;
                case '.': //class
                    this.elements = toArray(document.getElementsByClassName(zArg.substring(1)));
                    break;
                default: //tag
                    this.elements = toArray(document.getElementsByTagName(zArg));
                    break;
            }
            break;
        case 'object':
            if (zArg.constructor == Array) {
                this.elements = zArg;
            } else {
                this.elements.push(zArg);
            }
            break;
    }

}
Zquery.prototype.css = function(attr, value) {
    if (arguments.length == 2) { //设置
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style[attr] = value;
        }
    } else if (arguments.length == 1) { //获取
        if (typeof attr == 'object') {
            for (var j in attr) {
                for (var i = 0; i < this.elements.length; i++) {
                    this.elements[i].style[j] = attr[j];
                }
            }
        } else {
            return getStyle(this.elements[0], attr);
        }
    }
    return this;
};
Zquery.prototype.attr = function(attr, value) {
    if (arguments.length == 2) { //设置
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].setAttribute(attr, value);
        }
    } else if (arguments.length == 1) { //获取
        return this.elements[0].getAttribute(attr);
    }
    return this;
};
Zquery.prototype.eq = function(num) {
    return $(this.elements[num]);
};
Zquery.prototype.index = function() {
    var elems = this.elements[0].parentNode.children;
    for (var i = 0; i < elems.length; i++) {
        if (elems[i] == this.elements[0]) {
            return i;
        }
    }
    return this;
};
Zquery.prototype.find = function(sel) {
    var arr = [];
    if (sel.charAt(0) == '.') { //class
        for (var i = 0; i < this.elements.length; i++) {
            arr = arr.concat(toArray(this.elements[i].getElementsByClassName(sel.substring(1))));
        }
    } else { //tag
        for (var i = 0; i < this.elements.length; i++) {
            arr = arr.concat(toArray(this.elements[i].getElementsByTagName(sel)));
        }
    }
    return $(arr);
};
Zquery.prototype.html = function(str) {
    if (str) { //设置
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].innerHTML = str;
        }
    } else { //获取
        return this.elements[0].innerHTML;
    }
    return this;
};

Zquery.prototype.mouseover = function(fn) {
    this.on('mouseover', fn);
    return this;
};
Zquery.prototype.click = function(fn) {
    this.on('click', fn);
    return this;

};
Zquery.prototype.on = function(events, fn) {
    for (var i = 0; i < this.elements.length; i++) {
        bindEvent(this.elements[i], events, fn);
    }
    return this;
};
Zquery.prototype.hide = function() {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
    }
    return this;
};
Zquery.prototype.show = function() {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block';
    }
    return this;
};
Zquery.prototype.hover = function(fnOver, fnOut) {

    this.on('mouseover', fnOver);
    this.on('mouseout', fnOut);
    return this;
};

function $(zArg) {

    return new Zquery(zArg)
}
$.trim = function(str){
	return str.replace(/^\s+|\s+$/g,'');
};
$.extend = function(json){
	
	for(var attr in json){
		$[attr] = json[attr];
	}
	
};
$.fn={};
$.fn.extend = function(json){
	
	for(var attr in json){
		Zquery.prototype[attr] = json[attr];
	}
	
};
