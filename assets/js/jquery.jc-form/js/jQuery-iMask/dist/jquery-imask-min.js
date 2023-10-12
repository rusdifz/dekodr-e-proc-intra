/*!
 * jQuery iMask Plugin v0.7.0
 *
 * Licensed under the MIT License
 * Authors: Mark Kahn
 *          Fabio Zendhi Nagao (http://zend.lojcomm.com.br)
 *
 * Date: Wed Aug 24 10:50:49 2011 -0700
 */(function(a){function d(a){this.range=a.getSelectionRange(),this.len=a.domNode.value.length,this.obj=a,this[0]=this.range[0],this[1]=this.range[1]}var b=function(a){return!!a||a===0},c=function(){this.initialize.apply(this,arguments)};c.prototype={options:{maskEmptyChr:" ",validNumbers:"1234567890",validAlphas:"abcdefghijklmnopqrstuvwxyz",validAlphaNums:"abcdefghijklmnopqrstuvwxyz1234567890",groupDigits:3,decDigits:2,currencySymbol:"",groupSymbol:",",decSymbol:".",showMask:!0,stripMask:!1,lastFocus:0,number:{stripMask:!1,showMask:!1}},initialize:function(b,c){this.node=b,this.domNode=b[0],this.options=a.extend({},this.options,this.options[c.type]||{},c);var d=this;c.type=="number"&&this.node.css("text-align","right"),this.node.bind("mousedown click",function(a){a.stopPropagation(),a.preventDefault()}).bind("mouseup",function(){d.onMouseUp.apply(d,arguments)}).bind("keydown",function(){d.onKeyDown.apply(d,arguments)}).bind("keypress",function(){d.onKeyPress.apply(d,arguments)}).bind("focus",function(){d.onFocus.apply(d,arguments)}).bind("blur",function(){d.onBlur.apply(d,arguments)})},isFixed:function(){return this.options.type=="fixed"},isNumber:function(){return this.options.type=="number"},onMouseUp:function(a){a.stopPropagation(),a.preventDefault();if(this.isFixed()){var b=this.getSelectionStart();this.setSelection(b,b+1)}else this.isNumber()&&this.setEnd()},onKeyDown:function(a){if(!(a.ctrlKey||a.altKey||a.metaKey))if(a.which==13)this.node.blur(),this.submitForm(this.node);else if(a.which!=9)if(this.options.type=="fixed"){a.preventDefault();var b=this.getSelectionStart();switch(a.which){case 8:this.updateSelection(this.options.maskEmptyChr),this.selectPrevious();break;case 36:this.selectFirst();break;case 35:this.selectLast();break;case 37:case 38:this.selectPrevious();break;case 39:case 40:this.selectNext();break;case 46:this.updateSelection(this.options.maskEmptyChr),this.selectNext();break;default:var c=this.chrFromEv(a);this.isViableInput(b,c)?(this.updateSelection(a.shiftKey?c.toUpperCase():c),this.node.trigger("valid",a,this.node),this.selectNext()):this.node.trigger("invalid",a,this.node)}}else if(this.options.type=="number")switch(a.which){case 35:case 36:case 37:case 38:case 39:case 40:break;case 8:case 46:var e=this;setTimeout(function(){e.formatNumber()},1);break;default:a.preventDefault();var c=this.chrFromEv(a);if(this.isViableInput(b,c)){var f=new d(this),g=this.sanityTest(f.replaceWith(c));g!==!1&&(this.updateSelection(c),this.formatNumber()),this.node.trigger("valid",a,this.node)}else this.node.trigger("invalid",a,this.node)}},allowKeys:{8:1,9:1,13:1,35:1,36:1,37:1,38:1,39:1,40:1,46:1},onKeyPress:function(a){var b=a.which||a.keyCode;!this.allowKeys[b]&&!(a.ctrlKey||a.altKey||a.metaKey)&&(a.preventDefault(),a.stopPropagation())},onFocus:function(a){a.stopPropagation(),a.preventDefault(),this.options.showMask&&(this.domNode.value=this.wearMask(this.domNode.value)),this.sanityTest(this.domNode.value);var b=this;setTimeout(function(){b[b.options.type==="fixed"?"selectFirst":"setEnd"]()},1)},onBlur:function(a){a.stopPropagation(),a.preventDefault(),this.options.stripMask&&(this.domNode.value=this.stripMask())},selectAll:function(){this.setSelection(0,this.domNode.value.length)},selectFirst:function(){for(var a=0,b=this.options.mask.length;a<b;a++)if(this.isInputPosition(a)){this.setSelection(a,a+1);return}},selectLast:function(){for(var a=this.options.mask.length-1;a>=0;a--)if(this.isInputPosition(a)){this.setSelection(a,a+1);return}},selectPrevious:function(a){b(a)||(a=this.getSelectionStart()),a>0?this.isInputPosition(a-1)?this.setSelection(a-1,a):this.selectPrevious(a-1):this.selectFirst()},selectNext:function(a){b(a)||(a=this.getSelectionEnd());this.isNumber()?this.setSelection(a+1,a+1):a<this.options.mask.length?this.isInputPosition(a)?this.setSelection(a,a+1):this.selectNext(a+1):this.selectLast()},setSelection:function(a,b){a=a.valueOf(),!b&&a.splice&&(b=a[1],a=a[0]);if(this.domNode.setSelectionRange)this.domNode.focus(),this.domNode.setSelectionRange(a,b);else if(this.domNode.createTextRange){var c=this.domNode.createTextRange();c.collapse(),c.moveStart("character",a),c.moveEnd("character",b-a),c.select()}},updateSelection:function(a){var b=this.domNode.value,c=new d(this),e=c.replaceWith(a);this.domNode.value=e,c[0]===c[1]?this.setSelection(c[0]+1,c[0]+1):this.setSelection(c)},setEnd:function(){var a=this.domNode.value.length;this.setSelection(a,a)},getSelectionRange:function(){return[this.getSelectionStart(),this.getSelectionEnd()]},getSelectionStart:function(){var a=0,b=this.domNode.selectionStart;if(b)typeof b=="number"&&(a=b);else if(document.selection){var c=document.selection.createRange().duplicate();c.moveEnd("character",this.domNode.value.length),a=this.domNode.value.lastIndexOf(c.text),c.text==""&&(a=this.domNode.value.length)}return a},getSelectionEnd:function(){var a=0,b=this.domNode.selectionEnd;if(b)typeof b=="number"&&(a=b);else if(document.selection){var c=document.selection.createRange().duplicate();c.moveStart("character",-this.domNode.value.length),a=c.text.length}return a},isInputPosition:function(a){var b=this.options.mask.toLowerCase(),c=b.charAt(a);return!!~"9ax".indexOf(c)},sanityTest:function(b,c){var e=this.options.sanity;if(e instanceof RegExp)return e.test(b);if(a.isFunction(e)){var f=e(b,c);if(typeof f=="boolean")return f;if(typeof f!="undefined"){if(this.isFixed()){var c=this.getSelectionStart();this.domNode.value=this.wearMask(f),this.setSelection(c,c+1),this.selectNext()}else if(this.isNumber()){var g=new d(this);this.domNode.value=f,this.setSelection(g),this.formatNumber()}return!1}}},isViableInput:function(){return this[this.isFixed()?"isViableFixedInput":"isViableNumericInput"].apply(this,arguments)},isViableFixedInput:function(a,b){var c=this.options.mask.toLowerCase(),d=c.charAt(a),e=this.domNode.value.split("");e.splice(a,1,b),e=e.join("");var f=this.sanityTest(e,a);return typeof f=="boolean"?f:({9:this.options.validNumbers,a:this.options.validAlphas,x:this.options.validAlphaNums}[d]||"").indexOf(b)<0?!1:!0},isViableNumericInput:function(a,b){return!!~this.options.validNumbers.indexOf(b)},wearMask:function(a){var b=this.options.mask.toLowerCase(),c="",d={9:"validNumbers",a:"validAlphas",x:"validAlphaNums"};for(var e=0,f=0,g=b.length;e<g;e++)switch(b.charAt(e)){case"9":case"a":case"x":c+=this.options[d[b.charAt(e)]].indexOf(a.charAt(f).toLowerCase())>=0&&a.charAt(f)!=""?a.charAt(f++):this.options.maskEmptyChr;break;default:c+=b.charAt(e),a.charAt(f)==b.charAt(e)&&f++}return c},stripMask:function(){var a=this.domNode.value;if(""==a)return"";var b="";if(this.isFixed())for(var c=0,d=a.length;c<d;c++)a.charAt(c)!=this.options.maskEmptyChr&&this.isInputPosition(c)&&(b+=a.charAt(c));else if(this.isNumber())for(var c=0,d=a.length;c<d;c++)this.options.validNumbers.indexOf(a.charAt(c))>=0&&(b+=a.charAt(c));return b},chrFromEv:function(a){var b="",c=a.which;c>=96&&c<=105&&(c-=48),b=String.fromCharCode(c).toLowerCase();return b},formatNumber:function(){var a=this.domNode.value.length,b=this.stripMask(),c=b.replace(/^0+/,""),e=new d(this);b=c,c="";for(var f=b.length,g=this.options.decDigits;f<=g;f++)c+="0";c+=b,b=c.substr(c.length-this.options.decDigits),c=c.substring(0,c.length-this.options.decDigits);var h=new RegExp("(\\d+)(\\d{"+this.options.groupDigits+"})");while(h.test(c))c=c.replace(h,"$1"+this.options.groupSymbol+"$2");this.domNode.value=this.options.currencySymbol+c+this.options.decSymbol+b,this.setSelection(e)},getObjForm:function(){return this.node.getClosest("form")},submitForm:function(){var a=this.getObjForm();a.trigger("submit")}},d.prototype={valueOf:function(){var a=this.len-this.obj.domNode.value.length;return[this.range[0]-a,this.range[1]-a]},replaceWith:function(a){var b=this.obj.domNode.value,c=this.valueOf();return b.substr(0,c[0])+a+b.substr(c[1])}},a.fn.iMask=function(b){this.each(function(){new c(a(this),b)})}})(jQuery)