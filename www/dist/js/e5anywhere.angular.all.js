/*
 * Initial e5anywhere module definition
 * 
 * This MUST come first in the javascript file
 */
(function () {
    angular
        .module('e5AnywhereServices', []);

    angular
        .module('e5Anywhere', ['e5AnywhereServices', 'kendo.directives', 'ngSanitize', 'ngToast', 'pascalprecht.translate', 'ngStorage', 'angularMoment', 'ngAnimate', 'ngMaterial', 'angularFileUpload'])
        .constant('e5Config', {});
})();

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
};

String.prototype.endsWith = function (suffix) {
    return (this.substr(this.length - suffix.length) === suffix);
};

String.prototype.startsWith = function(prefix) {
    return (this.substr(0, prefix.length) === prefix);
};

function base64ArrayBuffer(arrayBuffer) {
    var base64 = '';
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;

    var a, b, c, d;
    var chunk;

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63;               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder === 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
}

function base64Encode(str) {
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out = "", i = 0, len = str.length, c1, c2, c3;
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i === len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i === len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += CHARS.charAt(c3 & 0x3F);
    }
    return out;
}

function queryStringParam(key, url) {
	if(!url)
		url = location.search;
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = url.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)", 'i'));
    return match && match[1].replace(/\+/g, " ");
}



function addQueryStringParam(url, key, newValue) {
    var match = url.match(new RegExp("[?]", 'i'));
    if (match === null || match.length === 0)
        return url + '?' + key + '=' + newValue;
    else
        return url + '&' + key + '=' + newValue;
}

function setNewQueryStringParam(url, key, newValue) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = url.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)", 'i'));
    match = match && match[1].replace(/\+/g, " ");
    if (match === null || match.length === 0)
        return addQueryStringParam(url, key, newValue);

    return url.replace(match, newValue);
}
/*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function() {
/*jshint eqeqeq:false curly:false latedef:false */
"use strict";

	function setup($) {
		$.fn._fadeIn = $.fn.fadeIn;

		var noOp = $.noop || function() {};

		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
		// confusing userAgent strings on Vista)
		var msie = /MSIE/.test(navigator.userAgent);
		var ie6  = /MSIE 6.0/.test(navigator.userAgent) && ! /MSIE 8.0/.test(navigator.userAgent);
		var mode = document.documentMode || 0;
		var setExpr = $.isFunction( document.createElement('div').style.setExpression );

		// global $ methods for blocking/unblocking the entire page
		$.blockUI   = function(opts) { install(window, opts); };
		$.unblockUI = function(opts) { remove(window, opts); };

		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
		$.growlUI = function(title, message, timeout, onClose) {
			var $m = $('<div class="growlUI"></div>');
			if (title) $m.append('<h1>'+title+'</h1>');
			if (message) $m.append('<h2>'+message+'</h2>');
			if (timeout === undefined) timeout = 3000;

			// Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
			var callBlock = function(opts) {
				opts = opts || {};

				$.blockUI({
					message: $m,
					fadeIn : typeof opts.fadeIn  !== 'undefined' ? opts.fadeIn  : 700,
					fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
					timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
					centerY: false,
					showOverlay: false,
					onUnblock: onClose,
					css: $.blockUI.defaults.growlCSS
				});
			};

			callBlock();
			var nonmousedOpacity = $m.css('opacity');
			$m.mouseover(function() {
				callBlock({
					fadeIn: 0,
					timeout: 30000
				});

				var displayBlock = $('.blockMsg');
				displayBlock.stop(); // cancel fadeout if it has started
				displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
			}).mouseout(function() {
				$('.blockMsg').fadeOut(1000);
			});
			// End konapun additions
		};

		// plugin method for blocking element content
		$.fn.block = function(opts) {
			if ( this[0] === window ) {
				$.blockUI( opts );
				return this;
			}
			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
			this.each(function() {
				var $el = $(this);
				if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
					return;
				$el.unblock({ fadeOut: 0 });
			});

			return this.each(function() {
				if ($.css(this,'position') == 'static') {
					this.style.position = 'relative';
					$(this).data('blockUI.static', true);
				}
				this.style.zoom = 1; // force 'hasLayout' in ie
				install(this, opts);
			});
		};

		// plugin method for unblocking element content
		$.fn.unblock = function(opts) {
			if ( this[0] === window ) {
				$.unblockUI( opts );
				return this;
			}
			return this.each(function() {
				remove(this, opts);
			});
		};

		$.blockUI.version = 2.70; // 2nd generation blocking at no extra cost!

		// override these in your code to change the default behavior and style
		$.blockUI.defaults = {
			// message displayed when blocking (use null for no message)
			message:  '<h1>Please wait...</h1>',

			title: null,		// title string; only used when theme == true
			draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)

			theme: false, // set to true to use with jQuery UI themes

			// styles for the message when blocking; if you wish to disable
			// these and use an external stylesheet then do this in your code:
			// $.blockUI.defaults.css = {};
			css: {
				padding:	0,
				margin:		0,
				width:		'30%',
				top:		'40%',
				left:		'35%',
				textAlign:	'center',
				color:		'#000',
				border:		'3px solid #aaa',
				backgroundColor:'#fff',
				cursor:		'wait'
			},

			// minimal style set used when themes are used
			themedCSS: {
				width:	'30%',
				top:	'40%',
				left:	'35%'
			},

			// styles for the overlay
			overlayCSS:  {
				backgroundColor:	'#000',
				opacity:			0.6,
				cursor:				'wait'
			},

			// style to replace wait cursor before unblocking to correct issue
			// of lingering wait cursor
			cursorReset: 'default',

			// styles applied when using $.growlUI
			growlCSS: {
				width:		'350px',
				top:		'10px',
				left:		'',
				right:		'10px',
				border:		'none',
				padding:	'5px',
				opacity:	0.6,
				cursor:		'default',
				color:		'#fff',
				backgroundColor: '#000',
				'-webkit-border-radius':'10px',
				'-moz-border-radius':	'10px',
				'border-radius':		'10px'
			},

			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
			// (hat tip to Jorge H. N. de Vasconcelos)
			/*jshint scripturl:true */
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

			// force usage of iframe in non-IE browsers (handy for blocking applets)
			forceIframe: false,

			// z-index for the blocking overlay
			baseZ: 1000,

			// set these to true to have the message automatically centered
			centerX: true, // <-- only effects element blocking (page block controlled via css above)
			centerY: true,

			// allow body element to be stetched in ie6; this makes blocking look better
			// on "short" pages.  disable if you wish to prevent changes to the body height
			allowBodyStretch: true,

			// enable if you want key and mouse events to be disabled for content that is blocked
			bindEvents: true,

			// be default blockUI will supress tab navigation from leaving blocking content
			// (if bindEvents is true)
			constrainTabKey: true,

			// fadeIn time in millis; set to 0 to disable fadeIn on block
			fadeIn:  200,

			// fadeOut time in millis; set to 0 to disable fadeOut on unblock
			fadeOut:  400,

			// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
			timeout: 0,

			// disable if you don't want to show the overlay
			showOverlay: true,

			// if true, focus will be placed in the first available input field when
			// page blocking
			focusInput: true,

            // elements that can receive focus
            focusableElements: ':input:enabled:visible',

			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
			// no longer needed in 2012
			// applyPlatformOpacityRules: true,

			// callback method invoked when fadeIn has completed and blocking message is visible
			onBlock: null,

			// callback method invoked when unblocking has completed; the callback is
			// passed the element that has been unblocked (which is the window object for page
			// blocks) and the options that were passed to the unblock call:
			//	onUnblock(element, options)
			onUnblock: null,

			// callback method invoked when the overlay area is clicked.
			// setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
			onOverlayClick: null,

			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
			quirksmodeOffsetHack: 4,

			// class name of the message block
			blockMsgClass: 'blockMsg',

			// if it is already blocked, then ignore it (don't unblock and reblock)
			ignoreIfBlocked: false
		};

		// private data and functions follow...

		var pageBlock = null;
		var pageBlockEls = [];

		function install(el, opts) {
			var css, themedCSS;
			var full = (el == window);
			var msg = (opts && opts.message !== undefined ? opts.message : undefined);
			opts = $.extend({}, $.blockUI.defaults, opts || {});

			if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
				return;

			opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
			if (opts.onOverlayClick)
				opts.overlayCSS.cursor = 'pointer';

			themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
			msg = msg === undefined ? opts.message : msg;

			// remove the current block (if there is one)
			if (full && pageBlock)
				remove(window, {fadeOut:0});

			// if an existing element is being used as the blocking content then we capture
			// its current place in the DOM (and current display style) so we can restore
			// it when we unblock
			if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
				var node = msg.jquery ? msg[0] : msg;
				var data = {};
				$(el).data('blockUI.history', data);
				data.el = node;
				data.parent = node.parentNode;
				data.display = node.style.display;
				data.position = node.style.position;
				if (data.parent)
					data.parent.removeChild(node);
			}

			$(el).data('blockUI.onUnblock', opts.onUnblock);
			var z = opts.baseZ;

			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
			// layer1 is the iframe layer which is used to supress bleed through of underlying content
			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
			// layer3 is the message content that is displayed while blocking
			var lyr1, lyr2, lyr3, s;
			if (msie || opts.forceIframe)
				lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>');
			else
				lyr1 = $('<div class="blockUI" style="display:none"></div>');

			if (opts.theme)
				lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>');
			else
				lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

			if (opts.theme && full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (opts.theme) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
			}
			else {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
			}
			lyr3 = $(s);

			// if we have a message, style it
			if (msg) {
				if (opts.theme) {
					lyr3.css(themedCSS);
					lyr3.addClass('ui-widget-content');
				}
				else
					lyr3.css(css);
			}

			// style the overlay
			if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
				lyr2.css(opts.overlayCSS);
			lyr2.css('position', full ? 'fixed' : 'absolute');

			// make iframe layer transparent in IE
			if (msie || opts.forceIframe)
				lyr1.css('opacity',0.0);

			//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
			var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
			$.each(layers, function() {
				this.appendTo($par);
			});

			if (opts.theme && opts.draggable && $.fn.draggable) {
				lyr3.draggable({
					handle: '.ui-dialog-titlebar',
					cancel: 'li'
				});
			}

			// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
			var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
			if (ie6 || expr) {
				// give body 100% height
				if (full && opts.allowBodyStretch && $.support.boxModel)
					$('html,body').css('height','100%');

				// fix ie6 issue when blocked element has a border width
				if ((ie6 || !$.support.boxModel) && !full) {
					var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
					var fixT = t ? '(0 - '+t+')' : 0;
					var fixL = l ? '(0 - '+l+')' : 0;
				}

				// simulate fixed position
				$.each(layers, function(i,o) {
					var s = o[0].style;
					s.position = 'absolute';
					if (i < 2) {
						if (full)
							s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"');
						else
							s.setExpression('height','this.parentNode.offsetHeight + "px"');
						if (full)
							s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
						else
							s.setExpression('width','this.parentNode.offsetWidth + "px"');
						if (fixL) s.setExpression('left', fixL);
						if (fixT) s.setExpression('top', fixT);
					}
					else if (opts.centerY) {
						if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
						s.marginTop = 0;
					}
					else if (!opts.centerY && full) {
						var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
						var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
						s.setExpression('top',expression);
					}
				});
			}

			// show the message
			if (msg) {
				if (opts.theme)
					lyr3.find('.ui-widget-content').append(msg);
				else
					lyr3.append(msg);
				if (msg.jquery || msg.nodeType)
					$(msg).show();
			}

			if ((msie || opts.forceIframe) && opts.showOverlay)
				lyr1.show(); // opacity is zero
			if (opts.fadeIn) {
				var cb = opts.onBlock ? opts.onBlock : noOp;
				var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
				var cb2 = msg ? cb : noOp;
				if (opts.showOverlay)
					lyr2._fadeIn(opts.fadeIn, cb1);
				if (msg)
					lyr3._fadeIn(opts.fadeIn, cb2);
			}
			else {
				if (opts.showOverlay)
					lyr2.show();
				if (msg)
					lyr3.show();
				if (opts.onBlock)
					opts.onBlock.bind(lyr3)();
			}

			// bind key and mouse events
			bind(1, el, opts);

			if (full) {
				pageBlock = lyr3[0];
				pageBlockEls = $(opts.focusableElements,pageBlock);
				if (opts.focusInput)
					setTimeout(focus, 20);
			}
			else
				center(lyr3[0], opts.centerX, opts.centerY);

			if (opts.timeout) {
				// auto-unblock
				var to = setTimeout(function() {
					if (full)
						$.unblockUI(opts);
					else
						$(el).unblock(opts);
				}, opts.timeout);
				$(el).data('blockUI.timeout', to);
			}
		}

		// remove the block
		function remove(el, opts) {
			var count;
			var full = (el == window);
			var $el = $(el);
			var data = $el.data('blockUI.history');
			var to = $el.data('blockUI.timeout');
			if (to) {
				clearTimeout(to);
				$el.removeData('blockUI.timeout');
			}
			opts = $.extend({}, $.blockUI.defaults, opts || {});
			bind(0, el, opts); // unbind events

			if (opts.onUnblock === null) {
				opts.onUnblock = $el.data('blockUI.onUnblock');
				$el.removeData('blockUI.onUnblock');
			}

			var els;
			if (full) // crazy selector to handle odd field errors in ie6/7
				els = $('body').children().filter('.blockUI').add('body > .blockUI');
			else
				els = $el.find('>.blockUI');

			// fix cursor issue
			if ( opts.cursorReset ) {
				if ( els.length > 1 )
					els[1].style.cursor = opts.cursorReset;
				if ( els.length > 2 )
					els[2].style.cursor = opts.cursorReset;
			}

			if (full)
				pageBlock = pageBlockEls = null;

			if (opts.fadeOut) {
				count = els.length;
				els.stop().fadeOut(opts.fadeOut, function() {
					if ( --count === 0)
						reset(els,data,opts,el);
				});
			}
			else
				reset(els, data, opts, el);
		}

		// move blocking element back into the DOM where it started
		function reset(els,data,opts,el) {
			var $el = $(el);
			if ( $el.data('blockUI.isBlocked') )
				return;

			els.each(function(i,o) {
				// remove via DOM calls so we don't lose event handlers
				if (this.parentNode)
					this.parentNode.removeChild(this);
			});

			if (data && data.el) {
				data.el.style.display = data.display;
				data.el.style.position = data.position;
				data.el.style.cursor = 'default'; // #59
				if (data.parent)
					data.parent.appendChild(data.el);
				$el.removeData('blockUI.history');
			}

			if ($el.data('blockUI.static')) {
				$el.css('position', 'static'); // #22
			}

			if (typeof opts.onUnblock == 'function')
				opts.onUnblock(el,opts);

			// fix issue in Safari 6 where block artifacts remain until reflow
			var body = $(document.body), w = body.width(), cssW = body[0].style.width;
			body.width(w-1).width(w);
			body[0].style.width = cssW;
		}

		// bind/unbind the handler
		function bind(b, el, opts) {
			var full = el == window, $el = $(el);

			// don't bother unbinding if there is nothing to unbind
			if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
				return;

			$el.data('blockUI.isBlocked', b);

			// don't bind events when overlay is not in use or if bindEvents is false
			if (!full || !opts.bindEvents || (b && !opts.showOverlay))
				return;

			// bind anchors and inputs for mouse and key events
			var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
			if (b)
				$(document).bind(events, opts, handler);
			else
				$(document).unbind(events, handler);

		// former impl...
		//		var $e = $('a,:input');
		//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
		}

		// event handler to suppress keyboard/mouse events when blocking
		function handler(e) {
			// allow tab navigation (conditionally)
			if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
				if (pageBlock && e.data.constrainTabKey) {
					var els = pageBlockEls;
					var fwd = !e.shiftKey && e.target === els[els.length-1];
					var back = e.shiftKey && e.target === els[0];
					if (fwd || back) {
						setTimeout(function(){focus(back);},10);
						return false;
					}
				}
			}
			var opts = e.data;
			var target = $(e.target);
			if (target.hasClass('blockOverlay') && opts.onOverlayClick)
				opts.onOverlayClick(e);

			// allow events within the message content
			if (target.parents('div.' + opts.blockMsgClass).length > 0)
				return true;

			// allow events for content that is not being blocked
			return target.parents().children().filter('div.blockUI').length === 0;
		}

		function focus(back) {
			if (!pageBlockEls)
				return;
			var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
			if (e)
				e.focus();
		}

		function center(el, x, y) {
			var p = el.parentNode, s = el.style;
			var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
			var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
			if (x) s.left = l > 0 ? (l+'px') : '0';
			if (y) s.top  = t > 0 ? (t+'px') : '0';
		}

		function sz(el, p) {
			return parseInt($.css(el,p),10)||0;
		}

	}


	/*global define:true */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}

})();

(function() {
    'use strict';

    var e5translateUrl = "";
    $('script').each(function () {
        if (this.src.length < 200 && this.src.indexOf('/dist/js/e5anywhere.angular.all.js') !== -1) { //dist
            e5translateUrl = this.src.replace('/js/e5anywhere.angular.all.js', '/translate/');
            return false;
        }
    });
    if (e5translateUrl === "")
        e5translateUrl = "/Web/dist/translate/";

   
    /**
    * @name e5translate
    * @desc Provides configuration of the angular-translate library - more information can be found at https://github.com/angular-translate and https://angular-translate.github.io/docs/#/guide
    * @param {object} $translateProvider - the angular-translate provider
    */
    angular
        .module('e5Anywhere')
        .config(['$translateProvider', function ($translateProvider) {
                // add translation tables
            $translateProvider
                .useStaticFilesLoader({
                    prefix: e5translateUrl,
                    suffix: '.json'
                })
                .useMissingTranslationHandlerLog()
                .useSanitizeValueStrategy('sanitize')
                .preferredLanguage('en');
                //.fallbackLanguage('en')
                //.determinePreferredLanguage(); //This requires the correct file to be available otherwise it throws an error.

            /*Example language override - can be used in any downstream angular.module('app').config() */
            //var enSlang_translations = {
            //        Save: 'Pop it!',
            //        'Due': 'Time\'s Up'
            //};

            //$translateProvider
            //.translations('en_Slang', enSlang_translations)
            //.preferredLanguage('en_Slang');

        }])
        .factory('e5translate', e5translate);

    e5translate.$inject = ['$translate'];

    function e5translate($translate) {
        var service = {};
        return service;
    }

})();
/*
 *  (c) Copyright 2017 e5 Workflow
 *
 *  
 */
(function () {
    //'use strict';
    angular
        .module('e5Anywhere')
        .filter("trust", ['$sce', function($sce) {
            return function(htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            };
        }]) ;
});

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular endpoint service generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices') 
       .factory('e5Endpoints', e5Endpoints); 
   e5Endpoints.$inject = ['$log','e5Config']; 
   function e5Endpoints($log, e5Config) { 
       if (!e5Config.webApiBase) 
           $log.error('e5Config.webApiBase is not defined... unable to access any e5 web services.'); 
       var prefix = e5Config.webApiBase || 'http://e5Config.webApiBase.is.undefined/'; 
       prefix += ((prefix.indexOf('/', prefix.length - 1) > 0) ? '' : '/'); 
       var settingsPrefix = e5Config.webApiSettingsBase || 'http://e5Config.webApiSettingsBase.is.undefined/'; 
       settingsPrefix += ((settingsPrefix.indexOf('/', settingsPrefix.length - 1) > 0) ? '' : '/'); 
       return { 
           attachmentGetAttachmentRoute :  prefix + 'Attachment/{0}?attachmentId={1}&attachmentTypeId={2}', // GET /{site}/api/Attachment/{workId}?attachmentId={attachmentId}&attachmentTypeId={attachmentTypeId} 
           attachmentGetBinaryRoute :  prefix + 'Attachment/GetBinary/{0}', // GET /{site}/api/Attachment/GetBinary/{attachmentId} 
           attachmentGetConvertTargetsRoute :  prefix + 'Attachment/GetConvertTargets/{0}', // GET /{site}/api/Attachment/GetConvertTargets/{attachmentId} 
           attachmentAddRoute :  prefix + 'Attachment/Add/{0}', // POST /{site}/api/Attachment/Add/{workId} 
           attachmentAddBase64Route: prefix + 'Attachment/AddBase64/{0}', // POST /{site}/api/Attachment/Add/{workId} 
           attachmentAttachRoute :  prefix + 'Attachment/Attach/{0}/{1}', // PUT /{site}/api/Attachment/Attach/{workId}/{attachmentId} 
           attachmentDetachRoute :  prefix + 'Attachment/Detach/{0}/{1}', // PUT /{site}/api/Attachment/Detach/{workId}/{attachmentId} 
           attachmentConvertRoute :  prefix + 'Attachment/Convert/{0}/{1}/{2}', // PUT /{site}/api/Attachment/Convert/{workId}/{attachmentId}/{targetFormat} 
           attachmentChangeTypeRoute :  prefix + 'Attachment/ChangeType/{0}/{1}/{2}', // PUT /{site}/api/Attachment/ChangeType/{workId}/{attachmentId}/{targetAttachmentType} 
           attachmentSplitRoute :  prefix + 'Attachment/Split/{0}/{1}', // PUT /{site}/api/Attachment/Split/{workId}/{attachmentId} 
           attachmentTearOffRoute :  prefix + 'Attachment/TearOff/{0}/{1}', // PUT /{site}/api/Attachment/TearOff/{workId}/{attachmentId} 
           attachmentEmailRoute :  prefix + 'Attachment/Email/{0}/{1}?attachmentId={2}', // PUT /{site}/api/Attachment/Email/{workId}/{attachmentId}?attachmentId={attachmentId} 
           attachmenttypeGetAttachmentTypeRoute :  prefix + 'AttachmentType/{0}', // GET /{site}/api/AttachmentType/{workId} 
           casenoteAddRoute :  prefix + 'CaseNote/Add/{0}/{1}', // POST /{site}/api/CaseNote/Add/{workId}/{caseNoteField} 
           casenoteGetCaseNoteRoute :  prefix + 'CaseNote/{0}?includeRelated={1}&ofTypeId={2}&page={3}&pageSize={4}&orderBy={5}', // POST /{site}/api/CaseNote/{workId}?includeRelated={includeRelated}&ofTypeId={ofTypeId}&page={page}&pageSize={pageSize}&orderBy={orderBy} 
           casenoteExportRoute :  prefix + 'CaseNote/Export/{0}', // GET /{site}/api/CaseNote/Export/{workId} 
           casenotetypeGetRoute :  prefix + 'CaseNoteType', // GET /{site}/api/CaseNoteType 
           categorisationGetCategory1Route :  prefix + 'Categorisation/GetCategory1?activeOnly={0}', // GET /{site}/api/Categorisation/GetCategory1?activeOnly={activeOnly} 
           categorisationGetCategory2Route :  prefix + 'Categorisation/GetCategory2/{0}?activeOnly={1}', // GET /{site}/api/Categorisation/GetCategory2/{category1Id}?activeOnly={activeOnly} 
           categorisationGetCategory3Route :  prefix + 'Categorisation/GetCategory3/{0}?activeOnly={1}', // GET /{site}/api/Categorisation/GetCategory3/{category2Id}?activeOnly={activeOnly} 
           conversationGetConversationRoute :  prefix + 'Conversation/{0}', // GET /{site}/api/Conversation/{workId} 
           conversationGetTotalEmailCountRoute :  prefix + 'Conversation/GetTotalEmailCount/{0}', // GET /{site}/api/Conversation/GetTotalEmailCount/{workId} 
           conversationGetUniqueEmailAsMhtmlRoute :  prefix + 'Conversation/GetUniqueEmailAsMhtml/{0}/{1}', // GET /{site}/api/Conversation/GetUniqueEmailAsMhtml/{workId}/{workAttachmentId} 
           conversationSendEmailRoute :  prefix + 'Conversation/SendEmail/{0}', // POST /{site}/api/Conversation/SendEmail/{workId} 
           documentGetDocumentTemplatesRoute :  prefix + 'Document/GetDocumentTemplates/{0}?filter={1}', // GET /{site}/api/Document/GetDocumentTemplates/{workId}?filter={filter} 
           documentCreateRoute :  prefix + 'Document/Create/{0}/{1}/{2}?documentName={3}', // GET /{site}/api/Document/Create/{workId}/{templateId}/{attachmentTypeId}?documentName={documentName} 
           fieldGetFieldRoute: prefix + 'Field/{0}?taskId={1}&tabId={2}&fieldSetId={3}&fieldId={4}', // GET /{site}/api/Field/{workId}?taskId={taskId}&tabId={tabId}&fieldSetId={fieldSetId}&fieldId={fieldId} 
           fieldGetListItemsRoute: prefix + 'Taxonomy/Field/GetListItems/{0}?parentListId=-1&parentListItemId=-1', // GET /{site}/api/Field/GetListItems/{listId}?parentListId={parentListId}&parentListItemId={parentListItemId} 
           fieldGetListFilteredItemsRoute: prefix + 'Taxonomy/Field/GetListFilteredItems/{0}?filterText={1}&maxRecordsToSuggest={2}&parentListId={3}&parentListItemId={4}', // GET /{site}/api/Field/GetListFilteredItems/{listId}?filterText={filterText}&maxRecordsToSuggest={maxRecordsToSuggest}&parentListId={parentListId}&parentListItemId={parentListItemId} 
           findworkitemGetFindWorkItemRoute: prefix + 'FindWorkItem/{0}?includeArchives={1}&includeSLA={2}&includeAttachmentCount={3}&includeNextDueTask={4}&customProcedure=%20&attachmentTypeFilter=0&select={7}&orderBy={8}&siteGroupsFilter=%20&page={10}&pageSize={11}', // POST /{site}/api/FindWorkItem/{findClassId}?includeArchives={includeArchives}&includeSLA={includeSLA}&includeAttachmentCount={includeAttachmentCount}&includeNextDueTask={includeNextDueTask}&customProcedure={customProcedure}&attachmentTypeFilter={attachmentTypeFilter}&select={select}&orderBy={orderBy}&siteGroupsFilter={siteGroupsFilter}&page={page}&pageSize={pageSize} 
           instanceGetAllRoute :  settingsPrefix + 'Instance', // GET /api/Instance 
           instanceGetRoute :  settingsPrefix + 'Instance/{0}', // GET /api/Instance/{id} 
           menuitemGetMenuItemRoute :  prefix + 'MenuItem/GetMenuItem/{0}?taskId={1}&menuItemCode={2}', // GET /{site}/api/MenuItem/GetMenuItem/{workId}?taskId={taskId}&menuItemCode={menuItemCode} 
           menuitemInvokeMenuItemRoute :  prefix + 'MenuItem/InvokeMenuItem/{0}/{1}?taskId={2}&menuItemCode={3}', // PUT /{site}/api/MenuItem/InvokeMenuItem/{workId}/{menuItemId}?taskId={taskId}&menuItemCode={menuItemCode} 
           sectionsGetSectionsRoute :  settingsPrefix + 'Configuration/Sections', // GET /api/Configuration/Sections 
           sectionsGetSectionRoute :  settingsPrefix + 'Configuration/Sections/{0}', // GET /api/Configuration/Sections/{id} 
           sectionsCreateRoute :  settingsPrefix + 'Configuration/Sections/Create', // POST /api/Configuration/Sections/Create 
           settingsGetSettingsRoute :  settingsPrefix + 'Configuration/Settings', // GET /api/Configuration/Settings 
           settingsGetFilteredSettingsRoute :  settingsPrefix + 'Configuration/Settings/{0}/{1}/{2}', // GET /api/Configuration/Settings/{application}/{section}/{key} 
           settingsGetSettingRoute :  settingsPrefix + 'Configuration/Settings/{0}', // GET /api/Configuration/Settings/{id} 
           settingsCreateRoute :  settingsPrefix + 'Configuration/Settings/Create', // POST /api/Configuration/Settings/Create 
           settingsUpdateRoute :  settingsPrefix + 'Configuration/Settings/Update', // PUT /api/Configuration/Settings/Update 
           taskGetTaskRoute :  prefix + 'Task/{0}?taskId={1}&lockWorkItem={2}', // GET /{site}/api/Task/{workId}?taskId={taskId}&lockWorkItem={lockWorkItem} 
           taskGetPrescribableRoute :  prefix + 'Task/GetPrescribable/{0}', // GET /{site}/api/Task/GetPrescribable/{workId} 
           taskPrescribeRoute :  prefix + 'Task/Prescribe/{0}/{1}', // PUT /{site}/api/Task/Prescribe/{workId}/{prescribeTaskId} 
           taskSaveRoute :  prefix + 'Task/Save/{0}/{1}', // PUT /{site}/api/Task/Save/{workId}/{taskId} 
           taskCompleteRoute :  prefix + 'Task/Complete/{0}/{1}', // PUT /{site}/api/Task/Complete/{workId}/{taskId} 
           workitemGetWorkItemRoute :  prefix + 'WorkItem/{0}', // GET /{site}/api/WorkItem/{workId} 
           workitemGetNextRoute :  prefix + 'WorkItem/GetNext', // GET /{site}/api/WorkItem/GetNext 
           workitemLockRoute :  prefix + 'WorkItem/Lock/{0}', // PUT /{site}/api/WorkItem/Lock/{workId} 
           workitemUnlockRoute :  prefix + 'WorkItem/Unlock/{0}', // PUT /{site}/api/WorkItem/Unlock/{workId} 
           workitemCreateRoute :  prefix + 'WorkItem/Create/{0}/{1}/{2}', // POST /{site}/api/WorkItem/Create/{category1Id}/{category2Id}/{category3Id} 
           workitemUpdateRoute :  prefix + 'WorkItem/Update/{0}', // PUT /{site}/api/WorkItem/Update/{workId} 
           workitemInvokeActionRoute :  prefix + 'WorkItem/InvokeAction/{0}/{1}', // PUT /{site}/api/WorkItem/InvokeAction/{processAction}/{workId} 
           workitemGetDiariseReasonsRoute :  prefix + 'WorkItem/GetDiariseReasons/{0}', // GET /{site}/api/WorkItem/GetDiariseReasons/{workId} 
           workitemGetAssignableUsersRoute :  prefix + 'WorkItem/GetAssignableUsers/{0}', // GET /{site}/api/WorkItem/GetAssignableUsers/{workId} 
           workitemGenerateHtmlRoute :  prefix + 'WorkItem/GenerateHtml/{0}/{1}', // GET /{site}/api/WorkItem/GenerateHtml/{workId}/{templateId} 
           // Custom enpoints added here
           workitemAttachmentsRoute: prefix + 'UIAttachments/{0}',
           integration_BySiteApiIntegrationYammerYammerMessagesPostWorkItemMessageByWorkIdPostRoute: prefix + 'Integration/Yammer/YammerMessages/PostWorkItemMessage/{0}?message={1}&groups={2}&topics={3}&action={4}', 
           propertyGetRoute : prefix + 'Property/{0}/{1}?resolveLookup={2}',  // GET /{site}/api/Property/{workId}/{propertyId}?resolveLookup={resolveLookup}
       }; 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for attachment API generated 2017-05-11T03:25:44.241Z. 
 */
(function () {
    'use strict';
    angular
        .module('e5AnywhereServices')
        .factory('attachmentdata', attachmentdata);
    attachmentdata.$inject = ['$http', '$location', 'ngToast', 'e5UtilsService', 'e5Endpoints'];
    function attachmentdata($http, $location, ngToast, util, endpoints) {
        var $q = angular.injector(['ng']).get('$q');
        var service = {
            getAttachment: _getAttachment,
            getBinary: _getBinary,
            getConvertTargets: _getConvertTargets,
            add: _add,
            attach: _attach,
            detach: _detach,
            convert: _convert,
            changeType: _changeType,
            split: _split,
            tearOff: _tearOff,
            email: _email,
        };
        $http.defaults.useXDomain = true;
        return service;

        function _getAttachment(workId, attachmentId, attachmentTypeId) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            if (typeof (attachmentId) === 'undefined') attachmentId = '';
            if (typeof (attachmentTypeId) === 'undefined') attachmentTypeId = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentGetAttachmentRoute, workId, attachmentId, attachmentTypeId));
            return $http.get(url, { withCredentials: true });
        }

        function _getBinary(attachmentId) {
            if (typeof (attachmentId) === 'undefined') attachmentId = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentGetBinaryRoute, attachmentId));
            return $http.get(url, { withCredentials: true });
        }

        function _getConvertTargets(attachmentId) {
            if (typeof (attachmentId) === 'undefined') attachmentId = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentGetConvertTargetsRoute, attachmentId));
            return $http.get(url, { withCredentials: true });
        }

        function _add(workId) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentAddRoute, workId));
            return $http.post(url, {}, { withCredentials: true });
        }

        function _attach(workId, attachmentId) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            if (typeof (attachmentId) === 'undefined') attachmentId = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentAttachRoute, workId, attachmentId));
            return $http.put(url, {}, { withCredentials: true });
        }

        function _detach(workId, attachmentId) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            if (typeof (attachmentId) === 'undefined') attachmentId = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentDetachRoute, workId, attachmentId));
            return $http.put(url, {}, { withCredentials: true });
        }

        function _convert(workId, attachmentId, targetFormat) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            if (typeof (attachmentId) === 'undefined') attachmentId = '';
            if (typeof (targetFormat) === 'undefined') targetFormat = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentConvertRoute, workId, attachmentId, targetFormat));
            return $http.put(url, {}, { withCredentials: true });
        }

        function _changeType(workId, attachmentId, targetAttachmentType) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            if (typeof (attachmentId) === 'undefined') attachmentId = '';
            if (typeof (targetAttachmentType) === 'undefined') targetAttachmentType = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentChangeTypeRoute, workId, attachmentId, targetAttachmentType));
            return $http.put(url, {}, { withCredentials: true });
        }

        function _split(workId, attachmentId, putdata) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            if (typeof (attachmentId) === 'undefined') attachmentId = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentSplitRoute, workId, attachmentId));
            return $http.put(url, putdata || {}, { withCredentials: true });
        }

        function _tearOff(workId, attachmentId, putdata) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            if (typeof (attachmentId) === 'undefined') attachmentId = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentTearOffRoute, workId, attachmentId));
            return $http.put(url, putdata || {}, { withCredentials: true });
        }

        function _email(workId, attachmentId, putdata) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            if (typeof (attachmentId) === 'undefined') attachmentId = '';
            var url = util.addCacheBusterParam(String.format(endpoints.attachmentEmailRoute, workId, attachmentId, attachmentId));
            return $http.put(url, putdata || {}, { withCredentials: true });
        }
    }
})();

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for attachmenttype API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('attachmenttypedata', attachmenttypedata); 
   attachmenttypedata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function attachmenttypedata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getAttachmentType : _getAttachmentType, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getAttachmentType(workId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.attachmenttypeGetAttachmentTypeRoute, workId)); 
           return $http.get(url, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for casenote API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('casenotedata', casenotedata); 
   casenotedata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function casenotedata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           add : _add, 
           getCaseNote : _getCaseNote, 
           export : _export, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _add(workId, caseNoteField,  postdata) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(caseNoteField) === 'undefined') caseNoteField = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.casenoteAddRoute, workId, caseNoteField)); 
           return $http.post(url, postdata || {}, { withCredentials: true }); 
       } 

       function _getCaseNote(workId, includeRelated, ofTypeId, page, pageSize, orderBy,  postdata) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(includeRelated) === 'undefined') includeRelated = ''; 
            if (typeof(ofTypeId) === 'undefined') ofTypeId = ''; 
            if (typeof(page) === 'undefined') page = ''; 
            if (typeof(pageSize) === 'undefined') pageSize = ''; 
            if (typeof(orderBy) === 'undefined') orderBy = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.casenoteGetCaseNoteRoute, workId, includeRelated, ofTypeId, page, pageSize, orderBy)); 
           return $http.post(url, postdata || {}, { withCredentials: true }); 
       } 

       function _export(workId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.casenoteExportRoute, workId)); 
           return $http.get(url, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for casenotetype API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('casenotetypedata', casenotetypedata); 
   casenotetypedata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function casenotetypedata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           get : _get, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _get() { 
           var url = util.addCacheBusterParam(String.format(endpoints.casenotetypeGetRoute)); 
           return $http.get(url, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for categorisation API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('categorisationdata', categorisationdata); 
   categorisationdata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function categorisationdata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getCategory1 : _getCategory1, 
           getCategory2 : _getCategory2, 
           getCategory3 : _getCategory3, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getCategory1(activeOnly) { 
            if (typeof(activeOnly) === 'undefined') activeOnly = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.categorisationGetCategory1Route, activeOnly)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getCategory2(category1Id, activeOnly) { 
            if (typeof(category1Id) === 'undefined') category1Id = ''; 
            if (typeof(activeOnly) === 'undefined') activeOnly = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.categorisationGetCategory2Route, category1Id, activeOnly)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getCategory3(category2Id, activeOnly) { 
            if (typeof(category2Id) === 'undefined') category2Id = ''; 
            if (typeof(activeOnly) === 'undefined') activeOnly = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.categorisationGetCategory3Route, category2Id, activeOnly)); 
           return $http.get(url, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for conversation API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('conversationdata', conversationdata); 
   conversationdata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function conversationdata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getConversation : _getConversation, 
           getTotalEmailCount : _getTotalEmailCount, 
           getUniqueEmailAsMhtml : _getUniqueEmailAsMhtml, 
           sendEmail : _sendEmail, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getConversation(workId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.conversationGetConversationRoute, workId)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getTotalEmailCount(workId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.conversationGetTotalEmailCountRoute, workId)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getUniqueEmailAsMhtml(workId, workAttachmentId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(workAttachmentId) === 'undefined') workAttachmentId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.conversationGetUniqueEmailAsMhtmlRoute, workId, workAttachmentId)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _sendEmail(workId,  postdata) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.conversationSendEmailRoute, workId)); 
           return $http.post(url, postdata || {}, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for document API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('documentdata', documentdata); 
   documentdata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function documentdata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getDocumentTemplates : _getDocumentTemplates, 
           create : _create, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getDocumentTemplates(workId, filter) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(filter) === 'undefined') filter = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.documentGetDocumentTemplatesRoute, workId, filter)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _create(workId, templateId, attachmentTypeId, documentName) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(templateId) === 'undefined') templateId = ''; 
            if (typeof(attachmentTypeId) === 'undefined') attachmentTypeId = ''; 
            if (typeof(documentName) === 'undefined') documentName = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.documentCreateRoute, workId, templateId, attachmentTypeId, documentName)); 
           return $http.get(url, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for field API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('fielddata', fielddata); 
   fielddata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function fielddata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getField : _getField, 
           getListItems : _getListItems, 
           getListFilteredItems : _getListFilteredItems, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getField(workId, taskId, tabId, fieldSetId, fieldId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(taskId) === 'undefined') taskId = ''; 
            if (typeof(tabId) === 'undefined') tabId = ''; 
            if (typeof(fieldSetId) === 'undefined') fieldSetId = ''; 
            if (typeof(fieldId) === 'undefined') fieldId = ''; 
            var url = util.addCacheBusterParam(String.format(endpoints.fieldGetFieldRoute, workId, taskId, tabId, fieldSetId, fieldId)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getListItems(listId, parentListId, parentListItemId) { 
            if (typeof(listId) === 'undefined') listId = ''; 
            if (typeof(parentListId) === 'undefined') parentListId = ''; 
            if (typeof(parentListItemId) === 'undefined') parentListItemId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.fieldGetListItemsRoute, listId, parentListId, parentListItemId)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getListFilteredItems(listId, filterText, maxRecordsToSuggest, parentListId, parentListItemId) { 
            if (typeof(listId) === 'undefined') listId = ''; 
            if (typeof(filterText) === 'undefined') filterText = ''; 
            if (typeof(maxRecordsToSuggest) === 'undefined') maxRecordsToSuggest = ''; 
            if (typeof(parentListId) === 'undefined') parentListId = ''; 
            if (typeof(parentListItemId) === 'undefined') parentListItemId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.fieldGetListFilteredItemsRoute, listId, filterText, maxRecordsToSuggest, parentListId, parentListItemId)); 
           return $http.get(url, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for findworkitem API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('findworkitemdata', findworkitemdata); 
   findworkitemdata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function findworkitemdata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getFindWorkItem : _getFindWorkItem, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getFindWorkItem(findClassId, includeArchives, includeSLA, includeAttachmentCount, includeNextDueTask, customProcedure, attachmentTypeFilter, select, orderBy, siteGroupsFilter, page, pageSize,  postdata) { 
            if (typeof(findClassId) === 'undefined') findClassId = ''; 
            if (typeof(includeArchives) === 'undefined') includeArchives = ''; 
            if (typeof(includeSLA) === 'undefined') includeSLA = ''; 
            if (typeof(includeAttachmentCount) === 'undefined') includeAttachmentCount = ''; 
            if (typeof(includeNextDueTask) === 'undefined') includeNextDueTask = ''; 
            if (typeof(customProcedure) === 'undefined') customProcedure = ''; 
            if (typeof(attachmentTypeFilter) === 'undefined') attachmentTypeFilter = ''; 
            if (typeof(select) === 'undefined') select = ''; 
            if (typeof(orderBy) === 'undefined') orderBy = ''; 
            if (typeof(siteGroupsFilter) === 'undefined') siteGroupsFilter = ''; 
            if (typeof(page) === 'undefined') page = ''; 
            if (typeof(pageSize) === 'undefined') pageSize = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.findworkitemGetFindWorkItemRoute, findClassId, includeArchives, includeSLA, includeAttachmentCount, includeNextDueTask, customProcedure, attachmentTypeFilter, select, orderBy, siteGroupsFilter, page, pageSize)); 
           return $http.post(url, postdata || {}, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for instance API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('instancedata', instancedata); 
   instancedata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function instancedata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getAll : _getAll, 
           get : _get, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getAll() { 
           var url = util.addCacheBusterParam(String.format(endpoints.instanceGetAllRoute)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _get(id) { 
            if (typeof(id) === 'undefined') id = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.instanceGetRoute, id)); 
           return $http.get(url, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for menuitem API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('menuitemdata', menuitemdata); 
   menuitemdata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function menuitemdata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getMenuItem : _getMenuItem, 
           invokeMenuItem : _invokeMenuItem, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getMenuItem(workId, taskId, menuItemCode) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(taskId) === 'undefined') taskId = ''; 
            if (typeof(menuItemCode) === 'undefined') menuItemCode = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.menuitemGetMenuItemRoute, workId, taskId, menuItemCode)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _invokeMenuItem(workId, menuItemId, taskId, menuItemCode,  putdata) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(menuItemId) === 'undefined') menuItemId = ''; 
            if (typeof(taskId) === 'undefined') taskId = ''; 
            if (typeof(menuItemCode) === 'undefined') menuItemCode = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.menuitemInvokeMenuItemRoute, workId, menuItemId, taskId, menuItemCode)); 
           return $http.put(url, putdata || {}, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for casenote API generated 2017-04-27T05:58:09.416Z. 
 */
(function () {
    'use strict';
    angular
        .module('e5AnywhereServices')
        .factory('propertydata', propertydata);
    propertydata.$inject = ['$http', '$location', 'ngToast', 'e5UtilsService', 'e5Endpoints'];
    function propertydata($http, $location, ngToast, util, endpoints) {
        var $q = angular.injector(['ng']).get('$q');
        var service = {
            get: _get
        };
        $http.defaults.useXDomain = true;
        return service;

        function _get(workId, propertyId, resolveValue) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            if (typeof (propertyId) === 'undefined') propertyId = '';
            if (typeof (resolveValue) === 'undefined') resolveValue = false;
            var url = util.addCacheBusterParam(String.format(endpoints.propertyGetRoute, workId, propertyId, resolveValue));
            return $http.get(url, {}, { withCredentials: true });
        }

    }
})();

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for sections API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('sectionsdata', sectionsdata); 
   sectionsdata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function sectionsdata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getSections : _getSections, 
           getSection : _getSection, 
           create : _create, 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getSections() { 
           var url = util.addCacheBusterParam(String.format(endpoints.sectionsGetSectionsRoute)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getSection(id) { 
            if (typeof(id) === 'undefined') id = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.sectionsGetSectionRoute, id)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _create( postdata) { 
           var url = util.addCacheBusterParam(String.format(endpoints.sectionsCreateRoute)); 
           return $http.post(url, postdata || {}, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for settings API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('settingsdata', settingsdata); 
   settingsdata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function settingsdata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getSettings : _getSettings, 
           getFilteredSettings : _getFilteredSettings, 
           getSetting : _getSetting, 
           create : _create, 
           update : _update, 
           getSiteSettings : _getSiteSettings 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getSettings() { 
           var url = util.addCacheBusterParam(String.format(endpoints.settingsGetSettingsRoute)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getFilteredSettings(application, section, key) { 
            if (typeof(application) === 'undefined') application = ''; 
            if (typeof(section) === 'undefined') section = ''; 
            if (typeof(key) === 'undefined') key = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.settingsGetFilteredSettingsRoute, application, section, key)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getSiteSettings() { 
           var url = util.addCacheBusterParam(String.format(endpoints.settingsGetFilteredSettingsRoute, 'e5Anywhere', 'SiteConfig', $location.host())); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getSetting(id) { 
            if (typeof(id) === 'undefined') id = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.settingsGetSettingRoute, id)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _create( postdata) { 
           var url = util.addCacheBusterParam(String.format(endpoints.settingsCreateRoute)); 
           return $http.post(url, postdata || {}, { withCredentials: true }); 
       } 

       function _update( putdata) { 
           var url = util.addCacheBusterParam(String.format(endpoints.settingsUpdateRoute)); 
           return $http.put(url, putdata || {}, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for task API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('taskdata', taskdata); 
   taskdata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function taskdata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getTask : _getTask, 
           getPrescribable : _getPrescribable, 
           prescribe : _prescribe, 
           save : _save, 
           complete : _complete, 
           getTasks : _getTasks 
       }; 
       $http.defaults.useXDomain = true;  
       return service; 

       function _getTask(workId, taskId, lockWorkItem) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(taskId) === 'undefined') taskId = ''; 
            if (typeof(lockWorkItem) === 'undefined') lockWorkItem = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.taskGetTaskRoute, workId, taskId, lockWorkItem)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getTasks(workId, lockWorkItem) { 
           var workId = util.resolveWorkId(workId); 
           if (typeof(workId) === 'undefined') workId = ''; 
           if (typeof(lockWorkItem) === 'undefined') lockWorkItem = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.taskGetTaskRoute, workId, '', lockWorkItem)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getPrescribable(workId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.taskGetPrescribableRoute, workId)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _prescribe(workId, prescribeTaskId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(prescribeTaskId) === 'undefined') prescribeTaskId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.taskPrescribeRoute, workId, prescribeTaskId)); 
           return $http.put(url, {}, { withCredentials: true }); 
       } 

       function _save(workId, taskId,  putdata) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(taskId) === 'undefined') taskId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.taskSaveRoute, workId, taskId)); 
           return $http.put(url, putdata || {}, { withCredentials: true }); 
       } 

       function _complete(workId, taskId,  putdata) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(taskId) === 'undefined') taskId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.taskCompleteRoute, workId, taskId)); 
           return $http.put(url, putdata || {}, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for workitem API generated 2017-04-27T05:58:09.416Z. 
 */ 
(function () { 
   'use strict'; 
   angular 
       .module('e5AnywhereServices')  
       .factory('workitemdata', workitemdata); 
   workitemdata.$inject = ['$http', '$location' ,'ngToast', 'e5UtilsService', 'e5Endpoints']; 
   function workitemdata($http, $location, ngToast, util, endpoints) { 
       var $q = angular.injector(['ng']).get('$q'); 
       var service = { 
           getWorkItem : _getWorkItem, 
           getNext : _getNext, 
           lock : _lock, 
           unlock : _unlock, 
           create : _create, 
           update : _update, 
           invokeAction : _invokeAction, 
           getDiariseReasons : _getDiariseReasons, 
           getAssignableUsers : _getAssignableUsers, 
           generateHtml : _generateHtml, 
       }; 
       $http.defaults.useXDomain = true;  

       //var storage = window.localStorage;
       //var accessToken = storage.getItem("accessToken");
       //if (accessToken) {
       //    console.log("accessToken from localStorage:" + accessToken);
       //    $http.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
       //}
       //else {
       //    console.error("Not Authenticated!");
       //}
       return service;

       function _getWorkItem(workId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.workitemGetWorkItemRoute, workId)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getNext() { 
           var url = util.addCacheBusterParam(String.format(endpoints.workitemGetNextRoute)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _lock(workId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.workitemLockRoute, workId)); 
           return $http.put(url, {}, { withCredentials: true }); 
       } 

       function _unlock(workId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.workitemUnlockRoute, workId)); 
           return $http.put(url, {}, { withCredentials: true }); 
       } 

       function _create(category1Id, category2Id, category3Id,  postdata) { 
            if (typeof(category1Id) === 'undefined') category1Id = ''; 
            if (typeof(category2Id) === 'undefined') category2Id = ''; 
            if (typeof(category3Id) === 'undefined') category3Id = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.workitemCreateRoute, category1Id, category2Id, category3Id)); 
           return $http.post(url, postdata || {}, { withCredentials: true }); 
       } 

       function _update(workId,  putdata) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.workitemUpdateRoute, workId)); 
           return $http.put(url, putdata || {}, { withCredentials: true }); 
       } 

       function _invokeAction(processAction, workId,  putdata) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(processAction) === 'undefined') processAction = ''; 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.workitemInvokeActionRoute, processAction, workId)); 
           return $http.put(url, putdata || {}, { withCredentials: true }); 
       } 

       function _getDiariseReasons(workId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.workitemGetDiariseReasonsRoute, workId)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _getAssignableUsers(workId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.workitemGetAssignableUsersRoute, workId)); 
           return $http.get(url, { withCredentials: true }); 
       } 

       function _generateHtml(workId, templateId) { 
           var workId = util.resolveWorkId(workId); 
            if (typeof(workId) === 'undefined') workId = ''; 
            if (typeof(templateId) === 'undefined') templateId = ''; 
           var url = util.addCacheBusterParam(String.format(endpoints.workitemGenerateHtmlRoute, workId, templateId)); 
           return $http.get(url, { withCredentials: true }); 
       } 
   } 
})(); 

/* 
 * (c) Copyright 2017 e5 Workflow 
 * 
 * Angular service for casenote API generated 2017-04-27T05:58:09.416Z. 
 */
(function () {
    'use strict';
    angular
        .module('e5AnywhereServices')
        .factory('yammerdata', yammerdata);
    yammerdata.$inject = ['$http', '$location', 'ngToast', 'e5UtilsService', 'e5Endpoints'];
    function yammerdata($http, $location, ngToast, util, endpoints) {
        var $q = angular.injector(['ng']).get('$q');
        var service = {
            addPost: _add
        };
        $http.defaults.useXDomain = true;
        return service;

        function _add(workId, message, groups, topics, action) {
            var workId = util.resolveWorkId(workId);
            if (typeof (workId) === 'undefined') workId = '';
            if (typeof (message) === 'undefined') message = '';
            if (typeof (groups) === 'undefined') groups = '';
            if (typeof (topics) === 'undefined') topics = '';
            if (typeof (action) === 'undefined') action = '';
            var url = util.addCacheBusterParam(String.format(endpoints.integration_BySiteApiIntegrationYammerYammerMessagesPostWorkItemMessageByWorkIdPostRoute, workId, message, groups, topics, action));
            return $http.post(url, {}, { withCredentials: true });
        }

    }
})();

// Called when a work item attachment click event is raised from the attachment tree list
function AttachmentResults_OnOpenTreeAttachment(sender, openerSource) { // openerSource = "FindWork"
    var workIdParameter = "";
    var viewerId = sender.getAttribute("data-viewerId"); // 6da5fd96-5462-11e6-815d-90e2ba57fbe1;23319
    if (!viewerId) return;

    // work id extraction
    if (viewerId.indexOf(";") > 0) {
        workIdParameter = viewerId.split(";")[0];
    }

    // work.js command processing delegation...
    OpenAttachmentViewer(workIdParameter, openerSource, viewerId + "|");
}

function RetrieveAttachmentViewerUrl(workid, source, attachments, winX, winY, auto, e5LegacyBase) {
    //if (typeof parent === 'undefined' || typeof parent.location === 'undefined' || parent.location.pathname.indexOf("WorkAttachmentViewer") === -1)
    //OpenAttachmentViewer(workid, source, attachments, winX, winY, auto);

//else reload current window

if (source == "" || source == null) {
    source = top.window.name; // FindWork
    }

if (auto == "" || auto == null) auto = false; // auto = false

if (attachments != null && attachments.length > 1500) {
    // IE handles ~2000 characters in the query string before truncating the remainder. Instead, indicate that the attachments are available in a local form field
    attachments = "javascript:OpenAttachmentViewer_SelectedAttachmentsForViewer";
}

var viewerUrl = e5LegacyBase +
    "_layouts/15/e5/WorkAttachmentViewer.aspx?id=" +
        workid +
        "&source=" +
        source +
        "&auto=" +
        auto +
        "&attachments=" +
        attachments;

    return viewerUrl;
}

function OpenAttachmentViewer(workid, source, attachments, winX, winY, auto) {

    if ((window.top != window.self) && (typeof (top.OpenAttachmentViewer) !== "undefined")) {
        // Send the event to the TOP window, as that is the one responsible for closing the Attachment Viewer
        return (top.OpenAttachmentViewer(workid, source, attachments, winX, winY, auto));
    }

    if (source == "" || source == null) {
        source = top.window.name;   // FindWork
    }

    if (auto == "" || auto == null) auto = false; // auto = false

    if (attachments != null && attachments.length > 1500) { // IE handles ~2000 characters in the query string before truncating the remainder. Instead, indicate that the attachments are available in a local form field
        OpenAttachmentViewer_SelectedAttachmentsForViewer = attachments;
        attachments = "javascript:OpenAttachmentViewer_SelectedAttachmentsForViewer";
    }

    var popupURL = e5LegacyBase + "_layouts/15/e5/WorkAttachmentViewer.aspx?id=" + workid + "&source=" + source + "&auto=" + auto + "&attachments=" + attachments;
    //"/sites/travel/_layouts/e5/WorkAttachmentViewer.aspx?id=6da5fd96-5462-11e6-815d-90e2ba57fbe1&source=FindWork&auto=false&attachments=6da5fd96-5462-11e6-815d-90e2ba57fbe1;23319|"

    var popupName = "AttachmentViewer" + source; // AttachmentViewerFindWork
    if (winX == null) winX = 0;
    if (winY == null) winY = 0;
    var popupFeatures = "top=" + winY + ",left=" + winX + ",width=10,height=10,directories=no,location=no,menubar=no,status=no,resizable=yes,titlebar=yes,toolbar=no";
    // top=0,left=0,width=10,height=10,directories=no,location=no,menubar=no,status=no,resizable=yes,titlebar=yes,toolbar=no
    switch (source) {
        case "FindWork":
            mwinFindWorkViewer = window.open(popupURL, workid.replace(/-/g, '_'), popupFeatures, true);
            mwinFindWorkViewer.focus();
            break;
        case "LaunchWork":
            mwinLaunchViewer = window.open(popupURL, popupName, popupFeatures, true);
            mwinLaunchViewer.focus();
            break;
        case "GetNext":
            mwinGetNextViewer = window.open(popupURL, popupName, popupFeatures, true);
            mwinGetNextViewer.focus();
            break;
        case "FindDocuments":
            mwinDocumentsViewer = window.open(popupURL, popupName, popupFeatures, true);
            mwinDocumentsViewer.focus();
            break;
        case "CloneWork":
        case "CloneWithOptions":
            mwinCloneWorkViewer = window.open(popupURL, workid.replace(/-/g, '_'), popupFeatures, true);
            mwinCloneWorkViewer.focus();
            break;
        case "GetWork":
            mwinGetWorkViewer = window.open(popupURL, popupName, popupFeatures, true);
            mwinGetWorkViewer.focus();
            break;
        case "MergeWork":
            mwinMergeWorkViewer = window.open(popupURL, popupName, popupFeatures, true);
            mwinMergeWorkViewer.focus();
            break;
        case "ChildWork":
            mwinChildWorkViewer = window.open(popupURL, popupName, popupFeatures, true);
            mwinChildWorkViewer.focus();
        default:
            mwinGetWorkViewer = window.open(popupURL, popupName, popupFeatures, true);
            mwinGetWorkViewer.focus();
            break;
    }
}
(function () {
    'use strict';

    angular
        .module('e5Anywhere')
        .config(exceptionConfig);

    exceptionConfig.$inject = ['$provide'];

    function exceptionConfig($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', 'ngToast'];

    function extendExceptionHandler($delegate, ngToast) {
        return function (exception, cause) {
            //Note - hide errors from both the console and toastr by returning before the delegate call

            $delegate(exception, cause);

            //Note - hide errors from toastr by returning here
            if ((exception.name && exception.name.indexOf("QuotaExceededError") !== -1)
                || (typeof exception === 'string' && exception.indexOf("Possibly unhandled rejection") !== -1))
                return;
            
            ngToast.danger({
                content: exception
            });

        };
    }
})();
/*
 *  (c) Copyright 2017 e5 Workflow
 *
 *  e5 Utilites AngularJS Services
 *
 *  This service provides a number of utility functions.
 */
(function () {
    //'use strict';
    angular
        .module('e5AnywhereServices')
        .service('e5UtilsService', e5UtilsService);

    e5UtilsService.$inject = ["$log", "e5Config"];
    function e5UtilsService($log, e5Config) {
        // Public functions
        return {
            /*
             *  escape(string) : escape a string so that it cane be used safely in HTML.
             */
            escape: escape,

            /*
             *  This function is used to determine the work id for the given component.
             *  The precedence is as follows
             *  1. If the url _forceWorkId is defined
             *  2. The workId passed into the getWorkId() function.
             *  3. The workId in the e5Config
             *  4. The WorkId on the current URL
             */
            resolveWorkId: resolveWorkId,

            /*
             *  This function is used to determine the task for the given component.
             *  The precedence is as follows
             *  1. If the url _forceTaskId is defined
             *  2. The taskId passed into the getTaskId() function.
             *  3. The taskId in the e5Config
             *  4. The taskId on the current URL
             */
            resolveTaskId: resolveTaskId,

            /**
            * @function showWaiting
            * @desc display the waiting (loading) overlay in a control. Will use blockUI is
            *   loaded otherwise, it will use the kendo spinner.
            * @property {element} element A angular element to load the spinner on e.g. $element.find('.e5EmailForm') .
            * @property {boolean} show true to show the spinner, false to hide it.
            * @property {string} message an optional message.
            */
            showWaiting: showWaiting,

            /**
             * @function addCacheBusterParam
             * @desc add a random query parameter value to the end of a url so that the browser and 
             * server cache will not effect the result.
             * @property {string} url the original url
             */
            addCacheBusterParam: addCacheBusterParam,

            /**
             * @function setNewQueryStringParam
             * @desc add a new query string parameter to a url. If the parameter already exists, the value is replaced.
             * @url {string} url the original url
             * @key {string} key the new query parameter 
             * @value {string} value the value of the query parameter
             */
            setNewQueryStringParam: setNewQueryStringParam,

            /**
             * @function addQueryStringParam
             * @desc add a query string parameter to a url
             * @property {string} url the original url
             * @property {string} key the new query parameter 
             * @property {string} value the value of the query parameter
             */
            addQueryStringParam: addQueryStringParam,

            /**
             * @function addQueryStringParam
             * @desc add a query string parameter to a url
             * @property {string} url the original url
             * @property {string} key the query parameter 
             */
            queryStringParam: queryStringParam
        };

        // Internal implementations
        function escape(string) {
            // Thanks to http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
            var entityMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;' };
            return String(string || "").replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        };

        function resolveWorkId(workId) {
            if (typeof (queryStringParam) === "function") {
                var forceWorkId = queryStringParam("_forceWorkId");
                if (forceWorkId)
                    return (worforceWorkIdkId);
            }
            if (workId)
                return (workId);
            if (e5Config.workId)
                return (e5Config.workId);
            if (typeof (queryStringParam) === "function") {
                var workIdParam = queryStringParam("workId");
                if (workIdParam)
                    return (workIdParam);
            }
            $log.warn("Unable to determine workId");
            return (false);
        };

        function resolveTaskId(taskId) {
            if (typeof (queryStringParam) === "function") {
                var forceTaskId = queryStringParam("_forceTaskId");
                if (forceTaskId)
                    return (worforceTaskIdkId);
            }
            if (taskId)
                return (taskId);
            if (e5Config.taskId)
                return (e5Config.taskId);
            if (typeof (queryStringParam) === "function") {
                var taskIdParam = queryStringParam("taskId");
                if (taskIdParam)
                    return (taskIdParam);
            }
            $log.warn("Unable to determine taskId");
            return (false);
        };

        function showWaiting(element, bShow, message) {
            //var jqProgress = $($element.find('.e5EmailForm'));
            var jqProgress = $(element);
            if (typeof ($(jqProgress).block) === "function") {
                if (bShow) {
                    $(jqProgress).block({
                        message: message,
                        onBlock: function (layer) {
                            $(element.find('.blockOverlay')).click(function () {
                                $(jqProgress).unblock() ;
                            });
                        }
                    });
                } else {
                    $(jqProgress).unblock();
                }
            } else {
                // default back to kendo
                kendo.ui.progress(jqProgress, bShow);
            }
        }

        function queryStringParam(key, url) {
            if (!url)
                url = location.search;
            key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
            var match = url.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)", 'i'));
            return match && match[1].replace(/\+/g, " ");
        }

        function addQueryStringParam(url, key, newValue) {
            var match = url.match(new RegExp("[?]", 'i'));
            if (match === null || match.length === 0)
                return url + '?' + key + '=' + newValue;
            else
                return url + '&' + key + '=' + newValue;
        }

        function setNewQueryStringParam(url, key, newValue) {
            key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
            var match = url.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)", 'i'));
            match = match && match[1].replace(/\+/g, " ");
            if (match === null || match.length === 0)
                return addQueryStringParam(url, key, newValue);

            return url.replace(match, newValue);
        }

        function addCacheBusterParam(url) {
            url = setNewQueryStringParam(url, 'cachebuster', Math.random());
            return url;
        }
    }
})();
/*
 *  (c) Copyright 2017 e5 Workflow
 *
 *  e5 coding parameter enforements
 *
 *  Use the e5Force service to check parameters on functions, etc.
 */
(function () {
    //'use strict';
    angular
        .module('e5AnywhereServices')
        .service('e5Enforce', e5EnfoceService);

    e5EnfoceService.$inject = ["$log"];

    function e5EnfoceService($log) {
        // Public functions
        return {
            /* 
             *  notUndefined(parameter, message) : throw an exception if the parameter is undefined.
             */
            notUndefined: notUndefined,
            /*
             *  notEmpty(parameter, message) : throw an exception if a parameter is 
             *  undefined, not a string or empty
             */
            notEmpty: notEmpty,
            /*
             *  isPositive(number, message) : throw an exception if the parameter is not a number and is
             *  less than or equals to zero
             */
            isPositive: isPositive,
            /*
             *  isFunction(function, message) : throw an exception if the parameter is not a number function.
             */
            isFunction: isFunction
        };

        // Internal implementations
        function notUndefined(parameter, message) {
            if (typeof (parameter) === "undefined")
                throw (message || "parameter must be defined");
        };

        function notEmpty(parameter, message) {
            if ((typeof (parameter) != "string") || (parameter === ""))
                throw (message || "parameter must not be empty");
        };

        function isPositive(parameter, message) {
            if ((typeof (parameter) != "number") || (parameter <= 0))
                throw (message || "parameter must be a number greater than 0");
        };

        function isFunction(parameter, message) {
            if (typeof (parameter) != "function")
                throw (message || "parameter must be a function");
        };
    }

})();
/*
 *  (C) Copyright 2017 e5 Workflow
 *
 *  e5 Event Hub Service
 *
 *  This service is used to communicate with the event hub on the page. The
 *  hub will then distribute and handle events on the page according to 
 *  either predefined or custom business login.
 *
 *  Menu events are used to send and recieve menu events on the page.
 */
(function () {
    'use strict';

    angular
        .module('e5AnywhereServices')
        .service('e5EventhubService', e5EventhubService);

    e5EventhubService.$inject = ['$rootScope', '$log', 'e5Config', 'e5Enforce'];

    function e5EventhubService($rootScope, $log, e5Config, enforce) {
        var EVENT_PREFIX_HANDLER = "e5-event-handler-";
        var EVENT_HUB = "e5-event-hub";
        var MENU_TYPE = "menu";

        // Public functions
        return {
            /*
             *  listen(type, code, callback(source, type, code, data, hubData)) - register to be notified if the 
             *  event hub handles a event of a given code. The callback will only be called if
             *  the event hub has collected all the necessary information for the
             *  event and no other handler has handled the message.
             *
             */
            listen: listen,

            /*
             *  broadcast(source, type, code, data, callback) - broadcase a message to the event hub with the
             *  data provided. The event hub will handle the event and distribute it accordingly depending
             *  on the type and code. If a callback is provided, then it will get the first opertunity to
             *  processes the event first (once confirmed).
             *
             *  MENU_TYPE : events coming from a menu.
             */
            broadcast: broadcast,

            /*
             *  This is a wrapper function to boardcast menu events. IT's the same as doing a
             *  boardcast(source, MENU_TYPE, code, ...).
             */
            menu: menu,

            /*
             * Constants
             */
            EVENT_PREFIX_HANDLER: EVENT_PREFIX_HANDLER, // prefix events out of hub to handlers
            EVENT_HUB: EVENT_HUB, // events to the hub 

            SAVE: "save", // predefined save event
            CONFIRM: "confirm", // predefined confirm event
            DIARISE: "diarise", // predefined diarise event
            ASSIGN: "assign", // predefined  assign event
            WORD: "word", // predefined  word event
            EMAIL: "email", // predefined  email event
            EMAILATTACHMENTS: "emailattachments", // predefined email with attachments event
            ALL: "*", // all messages will be sent to this

            MENU_TYPE: MENU_TYPE // All menu event types handled by the hub
        };

        // Internal implementaions
        function listen(eventType, code, callback) {
            enforce.notEmpty(eventType, "eventType must be defined in e5EventhubService.listen()");
            enforce.notEmpty(code, "code must be defined in e5EventhubService.listen()");
            enforce.isFunction(callback, "callback must be a function in e5EventhubService.listen()");

            $rootScope.$on(EVENT_PREFIX_HANDLER + eventType + "-" + code, function (event, broadcastData) {
                // broadcastData = { eventArgs: object, hubData:object }
                var ea = broadcastData.eventArgs;
                if (callback && callback(ea.source, ea.type, ea.code, ea.eventData, broadcastData.hubData))
                    event.preventDefault(); // prevent the event bubbling
            });
        };

        function broadcast(source, type, code, eventData, eventCallback) {
            enforce.notEmpty(code, "code must be defined in e5EventhubService.broadcast()");
            enforce.notEmpty(type, "type must be defined in e5EventhubService.broadcast()");

            // $emit goes up the scope, $broadcast does down
            $rootScope.$broadcast(EVENT_HUB, { source: source, type: type, code: code, eventData: eventData, eventCallback: eventCallback } /* eventArgs */);
        }

        function menu(source, code, eventData, eventCallback) {
            broadcast(source, MENU_TYPE, code, eventData, eventCallback);
        }
    }

})();
/*
 *  (c) Copyright 2017 e5 Workflow
 *
 *  e5 Event Hub Service
 *
 *  This service is used to communicate with the event hub on the page. The
 *  hub will then distribute and handle events on the page according to 
 *  either predefined or custom business login.
 *
 *  Menu events are used to send and recieve menu events on the page.
 */
(function () {
    'use strict';

    angular
        .module('e5Anywhere')
        .component('e5Eventhub', {
            transclude: false,
            bindings: {
                showLog: "=showLog", // show-log : boolean
                customHandler: "&customHandler" // custom handler                 
            },
            template:
                "<div ng-show='$ctrl.showLog'>" +
                    "<button class='btn btn-xs btn-default' ng-click='$ctrl.onClear()'>Clear</button>" +
                    "<table class='small table table-striped'>" +
                        "<thead><tr><td width='170px'>Time</td><td>event</td><td>source</td><td>type</td><td>code</td><td>data</td></tr></thead>" +
                        "<tbody>" +
                            "<tr ng-repeat='l in $ctrl.log track by $index'><td>{{l.time}}</td><td>{{l.event}}</td><td>{{l.source}}</td><td>{{l.type}}</td><td>{{l.code}}</td><td>{{l.data}}</td></tr>" +
                        "</tbody>" +
                    "</table>" +
                    "<e5-dialog-diarise control='$ctrl.dlgDiarise' message='$ctrl.dlgMessage' on-diarise='$ctrl.onDlgConfirm($eventArgs, $dialogData)' on-cancel='$ctrl.onDlgCancel($eventArgs)'></e5-dialog-diarise>" +
                    "<e5-dialog-confirm control='$ctrl.dlgConfirm' title='$ctrl.dlgTitle' message='$ctrl.dlgMessage' on-yes='$ctrl.onDlgConfirm($eventArgs, $dialogData)' on-no='$ctrl.onDlgCancel($eventArgs)'></e5-dialog-confirm>" +
                    "<e5-dialog-save control='$ctrl.dlgSave' title='$ctrl.dlgTitle' message='$ctrl.dlgMessage' on-yes='$ctrl.onDlgConfirm($eventArgs, $dialogData)' on-no='$ctrl.onDlgCancel($eventArgs)'></e5-dialog-save>" +
                    "<e5-dialog-assign control='$ctrl.dlgAssign' title='$ctrl.dlgTitle' message='$ctrl.dlgMessage' on-assign='$ctrl.onDlgConfirm($eventArgs, $dialogData)' on-cancel='$ctrl.onDlgCancel($eventArgs)'></e5-dialog-assign>" +
                    "<e5-dialog-word control='$ctrl.dlgWord' title='$ctrl.dlgTitle' message='$ctrl.dlgMessage' on-assign='$ctrl.onDlgConfirm($eventArgs, $dialogData)' on-cancel='$ctrl.onDlgCancel($eventArgs)'></e5-dialog-word>" +
                    "<e5-dialog-email control='$ctrl.dlgEmail' title='$ctrl.dlgTitle' message='$ctrl.dlgMessage' on-sent='$ctrl.onDlgConfirm($eventArgs, $dialogData)' on-cancel='$ctrl.onDlgCancel($eventArgs)'></e5-dialog-email>" +
                    // Add and new hub dialogs here (dont forget to add them to the executeEvent() function).
                "</div>",
            controller: e5EventhubComponent
        });

    e5EventhubComponent.$inject = ['$scope', '$rootScope', '$log', 'e5Config', 'e5EventhubService'];

    function e5EventhubComponent($scope, $rootScope, $log, e5Config, service) {
        var vm = this;
        var SOURCE = "eventhub";

        vm.log = [];
        //  this objects will be filled in by there corresponding components 
        //  with an "open()" method 
        vm.dlgConfirm = {};
        vm.dlgSave = {};
        vm.dlgDiarise = {};
        vm.dlgAssign = {};
        vm.dlgWord = {};
        vm.dlgEmail = {};

        function myLog(data, event, code, source, type) {
            if (vm.showLog)
                vm.log.push({ time: new Date(), event: event, code: code, data: data, source: source, type: type });
        };

        // The dialog handler has confirmed (Ok, Save, Etc) the dialog and may have
        // collected some additional dialog data that it is passing in. First pass
        // this event on the an optional callback directly on the event. If not
        // handled then pass it on the be broascasted to all event listeners.
        function confirm($eventArgs, $dialogData) {
            myLog("OK : eventArgs=" + JSON.stringify($eventArgs) + " dialogData=" + JSON.stringify($dialogData), "", $eventArgs.code);
            var code = $eventArgs.code;
            if ($eventArgs.eventCallback) {
                if ($eventArgs.eventCallback($eventArgs.source, $eventArgs.type, $eventArgs.code, $eventArgs.eventData, $dialogData))
                    return; // the callback handled the event, do nothing
            }
            // pass the event on to any hub listeners
            $rootScope.$broadcast(service.EVENT_PREFIX_HANDLER + service.MENU_TYPE + "-" + code, { eventArgs: $eventArgs, hubData: $dialogData } /* broadcastData */);
            $rootScope.$broadcast(service.EVENT_PREFIX_HANDLER + service.MENU_TYPE + "-*", { eventArgs: $eventArgs, hubData: $dialogData } /* menu type catch all */);
        }
        vm.onDlgConfirm = function ($eventArgs, $dialogData) {
            //$scope.$apply(function () {
                confirm($eventArgs, $dialogData);
            //});
        }

        // The dialog handler has canceled the dialog, so there is really nothing to do.
        vm.onDlgCancel = function ($eventArgs) {
            //$scope.$apply(function () {
                myLog("CANCEL : eventArgs=" + JSON.stringify($eventArgs), "", $eventArgs.code);
            //});
        }

        // Execute the appropriate internal dialogs or responses for required menu
        // event. This may be to popup a dialog (e.r. diarise) or just a confirmation
        // box.
        // eventArgs = { code: "string", eventData: { confirm: "boolean", ... }, eventCallback: function (optional) } 
        function executeEvent(eventType, eventCode, eventArgs) {
            var eventData = (eventArgs.eventData || {});

            // If there is a custom dialog handler associated with the event hub then
            // pass the request on to that first. If it id foinf to have it, then 
            // don't do anything else.
            if (vm.customHandler({
                $source: eventArgs.source,
                $type: eventType,
                $code: eventCode,
                $eventArgs: eventArgs,
                $confirm: confirm,
                $cancel: function (eventArgs) {
                        vm.onDlgCancel(eventArgs)
            }
            })) {
                myLog("handled by custom-dialog", "", eventCode, eventArgs.source, eventType);
                return; // handled by custom dialog
            } else {
                if (eventType === service.MENU_TYPE) {
                    // Use the standard "built-in" dialog handlers.
                    vm.dlgTitle = eventData.dialogTitle;
                    switch (eventCode) {
                        case service.CONFIRM:
                            vm.dlgMessage = eventData.confirmMessage;
                            vm.dlgConfirm.open(eventArgs);
                            break;
                        case service.SAVE:
                            vm.dlgMessage = eventData.confirmMessage;
                            vm.dlgSave.open(eventArgs);
                            break;
                        case service.DIARISE:
                            vm.dlgDiarise.open(eventArgs);
                            break;
                        case service.ASSIGN:
                            vm.dlgAssign.open(eventArgs);
                            break;
                        case service.WORD:
                            vm.dlgWord.open(eventArgs);
                            break;
                        case service.EMAIL:
                            vm.dlgEmail.open(eventArgs);
                            break;
                        case service.EMAILATTACHMENTS:
                            vm.dlgEmail.open(eventArgs, true /*showAttachments*/);
                            break;
                        default:
                            confirm(eventArgs, {}); // just process it as normal
                            break;
                    }
                } else {
                    myLog("WARNING: no type handler", "", eventCode, eventArgs.source, eventType);
                }
            }
        }

        // An event has been send from a service (somewhere on the page)
        // eventArgs = { source: "string", type:"string", code: "string", eventData: { confirm: "boolean"}, eventCallback: function (optional) } 
        $rootScope.$on(service.EVENT_HUB, function (event, eventArgs) {
            if (typeof (eventArgs) === "undefined" || typeof (eventArgs.code) != "string" || eventArgs.code === "") {
                $log.warn("e5Eventhub received event " + event + " without the required 'code' argument ");
                return; // invalid, do nothing.
            }
            if (typeof (eventArgs.type) != "string" || eventArgs.type === "") {
                $log.warn("e5Eventhub received event " + event + " without the required 'eventType' argument ");
                return; // invalid, do nothing.
            }
            var eventCode = eventArgs.code;
            var eventType = eventArgs.type || "";
            myLog(eventArgs.eventData, event.name, eventCode, eventType, eventArgs.source || "");

            if (typeof (eventArgs.eventData) === "object" && (eventArgs.eventData.confirmSelection)) {
                // A confirmation is required before the event can be processed
                //if (!confirm(eventArgs.eventData.confirmMessage || "Are you sure?")) {
                //    myLog("CANCELED : " + eventArgs.eventData, event.name, eventCode);
                //    return;
                //}
                // Use the internal "confirm" dialog to confirm this event (wheels within wheels...)
                // We could pass eventArgs via the event data, but there is no need as we are in
                // a closure.
                service.broadcast(SOURCE, service.MENU_TYPE, service.CONFIRM, {}, function (_source, _type, code, eventData, hubData) {
                    executeEvent(eventType, eventCode, eventArgs);
                });
            } else
                executeEvent(eventType, eventCode, eventArgs);
        });

        // UI handlers
        vm.onClear = function () {
            vm.log = [{ time: new Date(), data: "Log cleared" }];
        };

        myLog("Started");
    }
})();
/*
 *  (c) Copyright 2017 e5 Workflow
 *
 *  e5 Confirm Dialog
 *
 *  This component is used to display an e5 dialog popup. The dialog can be used on 
 *  it's own, but it is normally used as part of the e5 event hub.
 *
 *  References :
 *  http://demos.telerik.com/kendo-ui/dialog/index
 */
 (function () {
    'use strict';

    angular
       .module('e5Anywhere')
       .component('e5DialogConfirm', {
           transclude: false,
           bindings: {
               control: "=control", // show dialog
               title: "=title",
               message: "=message",
               onYes: "&onYes",
               onNo: "&onNo"
           },
           template:
                "<b>e5-dialog-confirm </b>" +
                "<div kendo-dialog='dialog' k-title=\"$ctrl.title||'Confirm'\" k-modal='true' k-visible='false' k-actions='$ctrl.actions' k-animation='false' k-width='300' k-closable='false'>" +
                    "{{$ctrl.message||'Are you sure?'}}" +
                "</div>", 
            controller: e5DialogConfirmComponent
       });

    e5DialogConfirmComponent.$inject = ["$scope"];

    function e5DialogConfirmComponent($scope) {
        var vm = this;

        vm.$onInit = function () {
            vm.actions = [{
                text: "Yes", primary: true, action: function () {
                    vm.onYes({ $eventArgs: vm.eventArgs });
                }
            }, {
                text: "No", action: function () {
                    vm.onNo({ $eventArgs: vm.eventArgs });
                }
            }];

            vm.control = {
                open: function (eventArgs) {
                    vm.eventArgs = eventArgs;
                    // { code: "string", eventData: { confirm: "boolean", ... }, eventCallback: function (optional) }
                    $scope.dialog.open();
                },
                close: function () {
                    $scope.dialog.close();
                },
            }
        }
    }

})();
/*
 *  (c) Copyright 2017 e5 Workflow
 *
 *  e5 Diarise Dialog
 *
 *  This component is used to display an e5 diarise dialog popup. The dialog can be used on 
 *  it's own, but it is normally used as part of the e5 event hub.
 *
 *  eventArgs = { 
 *      code: "string", 
 *      eventData: { confirm: "boolean", ... }, 
 *      eventCallback: function (optional) 
 *  } 
 */
(function () {
    'use strict';

    angular
       .module('e5Anywhere')
       .component('e5DialogDiarise', {
           transclude: false,
           bindings: {
               control: "=control", // show dialog
               title: "=title",
               onDiarise: "&onDiarise",
               onCancel: "&onCancel"
           },
           template:
                "<b>e5-dialog-diarise </b>" +
                "<div kendo-dialog='$ctrl.dialog' class='e5Dialog e5DialogDiarise' k-title='$ctrl.dlgTitle' k-modal='true' k-visible='false' k-actions='$ctrl.actions' k-animation='false' k-width='300' k-closable='false'>" +
                    "<center>" +
                        "<div class='e5DialogHeading'>{{'Diarise Reason' | translate}}</div>" +
                        "<select class='e5DiariseReasonDropDown' kendo-drop-down-list k-data-text-field='\"reason\"' k-data-value-field='\"reason\"' k-data-source='$ctrl.dsDiariseReason' ng-model='$ctrl.diariseReason'></select>" +
                        "<div class='e5DialogHeading'>{{'Diarise Until Date' | translate}}</div>" +
                        "<kendo-calendar class='e5DiariseCalendar' ng-model='$ctrl.diariseDate' min='$ctrl.minDate'></kendo-calendar>" +
                        "<input class='e5DiariseTimePicker' kendo-time-picker ng-model='$ctrl.sTime' k-ng-model='$ctrl.diariseTime'/>" +
                        "<div class='e5DialogError' ng-show='$ctrl.errorMessage'>{{$ctrl.errorMessage}}</div>" +
                    "</center>" +
                "</div>",
           controller: e5DialogDiariseComponent
       });

    e5DialogDiariseComponent.$inject = ["$scope", "$log", "$translate", "workitemdata"];

    function e5DialogDiariseComponent($scope, $log, $translate, workitemdata) {
        var vm = this;

        vm.$onInit = function () {

            vm.errorMessage = false;
            vm.dlgTitle = "Diarise";
            vm.eventArgs = {};

            vm.actions = [{
                text: $translate.instant("Diarise"), primary: true, action: function (e) {

                    // Check that the time is in the future
                    var now = new Date();
                    var dd = vm.diariseDate;
                    var dt = vm.diariseTime || new Date(dd.getFullYear(), dd.getMonth(), dd.getDay(), 0, 0); // Morning
                    var diariseDateTime = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate(), dt.getHours(), dt.getMinutes(), 0);

                    if (diariseDateTime.getTime() < now.getTime()) {
                        $scope.$apply(function () {
                            vm.errorMessage = $translate.instant("Please select a date and time in the future.");
                        });
                        if (typeof (e.preventDefault) === "function")
                            e.preventDefault(); // stop the dialog from closing
                    } else {
                        vm.onDiarise({
                            $eventArgs: vm.eventArgs, $dialogData: {
                                result: "ok",
                                // These are defined in WorkProcess.vb Diarise()
                                DiariseReason: vm.diariseReason, // Reason text
                                DiariseUntilDate: kendo.toString(diariseDateTime, "yyyy-MM-dd"), // dd/mm/yyy
                                DiariseUntilHours: dt.getHours(), // hh
                                DiariseUntilMinutes: dt.getMinutes() // mm
                            }
                        });
                    }
                }
            }, {
                text: $translate.instant("Cancel"), action: function () {
                    vm.onCancel({ $eventArgs: vm.eventArgs });
                }
            }];

            vm.control = {
                open: function (eventArgs) {
                    vm.eventArgs = eventArgs;
                    // Initilize the dialog
                    vm.diariseDate = new Date();
                    vm.diariseTime = vm.diariseDate;
                    vm.minDate = new Date();
                    vm.dlgTitle = $translate.instant(vm.title || "Diarise");
                    vm.dsDiariseReason = [];
                    vm.errorMessage = "";

                    // Get the list of diarise reasons corresponding to the work item.
                    // The work item id should be in the eventData 
                    //var workId = ((vm.eventArgs || {}).eventData || {}).workId || '00000000-0000-0000-0000-000000000000';
                    var workId = ((eventArgs || {}).eventData || {}).workId || '00000000-0000-0000-0000-000000000000';
                    $log.debug(String.format("getDiariseReasons({0})", workId));
                    workitemdata.getDiariseReasons(workId)
                        .then(function (response) {
                            vm.dsDiariseReason = response.data;
                        }, function (response) {
                            $log.error("Unable to getDiariseReasons : " + JSON.stringify(response));
                        }).finally(function () {
                        });

                    vm.dialog.open();
                },
                close: function () {
                    vm.dialog.close();
                },
            }
        }
    }

})();

/*
 *  (c) Copyright 2017 e5 Workflow
 *
 *  e5 Confirm Dialog
 *
 *  This component is used to display an e5 dialog popup. The dialog can be used on 
 *  it's own, but it is normally used as part of the e5 event hub.
 *
 *  References :
 *  http://demos.telerik.com/kendo-ui/dialog/index
 */
 (function () {
    'use strict';

    angular
       .module('e5Anywhere')
       .component('e5DialogSave', {
           transclude: false,
           bindings: {
               control: "=control", // show dialog
               title: "=title",
               message: "=message",
               onYes: "&onYes",
               onNo: "&onNo"
           },
           template:
                "<b>e5-dialog-save </b>" +
                "<div kendo-dialog='dialog' k-title=\"$ctrl.title||'Save'\" k-modal='true' k-visible='false' k-actions='$ctrl.actions' k-animation='false' k-width='300' k-closable='false'>" +
                    "{{$ctrl.message||'Would you like to save the changes to the work item?'}}" +
                "</div>", 
            controller: e5DialogSaveComponent
       });

    e5DialogSaveComponent.$inject = ["$scope"];

    function e5DialogSaveComponent($scope) {
        var vm = this;

        // Called when the component is initilized.
        // https://blog.thoughtram.io/angularjs/2016/03/29/exploring-angular-1.5-lifecycle-hooks.html
        vm.$onInit = function () {
            vm.actions = [{
                text: "Yes", primary: true, action: function () {
                    vm.onYes({ $eventArgs: vm.eventArgs });
                }
            }, {
                text: "No", action: function () {
                    vm.onNo({ $eventArgs: vm.eventArgs });
                }
            }];

            vm.control = {
                open: function (eventArgs) {
                    vm.eventArgs = eventArgs;
                    // { code: "string", eventData: { confirm: "boolean", ... }, eventCallback: function (optional) }               
                    $scope.dialog.open();
                },
                close: function () {
                    $scope.dialog.close();
                },
            }
        }
    }

})();
/*
 *  (c) Copyright 2017 e5 Workflow
 *
 *  e5 Diarise Dialog
 *
 *  This component is used to display an e5 diarise dialog popup. The dialog can be used on 
 *  it's own, but it is normally used as part of the e5 event hub.
 *
 *  eventArgs = { 
 *      code: "string", 
 *      eventData: { confirm: "boolean", ... }, 
 *      eventCallback: function (optional) 
 *  } 
 */
(function () {
    'use strict';

    angular
       .module('e5Anywhere')
       .component('e5DialogAssign', {
           transclude: false,
           bindings: {
               control: "=control", // show dialog
               title: "=title",
               onAssign: "&onAssign",
               onCancel: "&onCancel"
           },
           template:
                "<b>e5-dialog-assign </b>" +
                "<div kendo-dialog='$ctrl.dialog' class='e5Dialog e5DialogAssign' k-title='$ctrl.dlgTitle' k-modal='true' k-visible='false' k-actions='$ctrl.actions' k-animation='false' k-width='300' k-closable='false'>" +
                    "<center>" +
                        "<div class='e5DialogHeading'>{{'Assign To' | translate}}</div>" +
                        "<select class='e5DropDown e5UsersDropDown' kendo-drop-down-list='$ctrl.ddlUsers' k-data-text-field='\"name\"' k-data-value-field='\"loginName\"' k-data-source='$ctrl.dsUsers' ng-model='$ctrl.selLoginName'></select>" +
                        "<div class='e5DialogError' ng-show='$ctrl.errorMessage'>{{$ctrl.errorMessage}}</div>" +
                    "</center>" +
                "</div>",
           controller: e5DialogAssignComponent
       });

    e5DialogAssignComponent.$inject = ["$scope", "$log", "$translate", "workitemdata"];

    function e5DialogAssignComponent($scope, $log, $translate, workitemdata) {
        var vm = this;

        vm.$onInit = function () {
            vm.errorMessage = false;
            vm.dlgTitle = "Assign Work";
            vm.eventArgs = {};

            vm.actions = [{
                text: $translate.instant("Assign"), primary: true, action: function (e) {

                    var selLoginName = vm.selLoginName;
                    var selUser = false;
                    for (var i in vm.dsUsers) {
                        var user = vm.dsUsers[i];
                        if (user.loginName === selLoginName) {
                            selUser = user;
                            break;
                        }
                    }

                    if (selUser) {
                        vm.onAssign({
                            $eventArgs: vm.eventArgs, $dialogData: {
                                result: "ok",
                                // These are defined in WorkProcess.vb Assign()
                                AssignedUser: selUser.loginName,
                                AssignedUserName: selUser.name,
                                AssignedUserEmail: selUser.email
                            }
                        });
                    } else {
                        vm.errorMessage = String.format("Unable to find login name '{0}' in user list.", selLoginName);
                    }
                }
            }, {
                text: $translate.instant("Cancel"), action: function () {
                    vm.onCancel({ $eventArgs: vm.eventArgs });
                }
            }];

            vm.control = {
                open: function (eventArgs) {
                    vm.eventArgs = eventArgs;
                    // Initilize the dialog
                    vm.dlgTitle = $translate.instant(vm.title || "Assign Work");
                    vm.errorMessage = false;
                    vm.selLoginName = "";

                    // Get the list of users reasons corresponding to the work item.
                    // The work item id should be in the eventData 
                    //var workId = ((vm.eventArgs || {}).eventData || {}).workId || '00000000-0000-0000-0000-000000000000';
                    var workId = ((eventArgs || {}).eventData || {}).workId || '00000000-0000-0000-0000-000000000000';
                    $log.debug(String.format("getAssignableUsers({0})", workId));
                    workitemdata.getAssignableUsers(workId)
                        .then(function (response) {
                            response.data.unshift({ loginName: "", name: "(no one)", email: "" });
                            vm.dsUsers = response.data;
                            vm.ddlUsers.select(0);
                        }, function (response) {
                            $log.error("Unable to getAssignableUsers : " + JSON.stringify(response));
                        }).finally(function () {
                        });

                    vm.dialog.open();
                },
                close: function () {
                    vm.dialog.close();
                },
            }
        }
    }

})();

/*
 *  (c) Copyright 2017 e5 Workflow
 *
 *  e5 Word Dialog
 *
 *  This component is used to display an e5 diarise dialog popup. The dialog can be used on 
 *  it's own, but it is normally used as part of the e5 event hub.
 *
 *  eventArgs = { 
 *      code: "string", 
 *      eventData: { confirm: "boolean", ... }, 
 *      eventCallback: function (optional) 
 *  } 
 */
(function () {
    'use strict';

    angular
       .module('e5Anywhere')
       .component('e5DialogWord', {
           transclude: false,
           bindings: {
               control: "=control", // show dialog
               title: "=title",
               onCreate: "&onCreate",
               onCancel: "&onCancel"
           },
           controllerAs: "vm",
           template:
                "<b>e5-dialog-word </b>" +
                "<div kendo-dialog='vm.dialog' class='e5Dialog e5DialogWord' k-title='vm.dlgTitle' k-modal='true' k-visible='false' k-actions='vm.actions' k-animation='false' k-width='300' k-closable='false'>" +
                    "<center>" +
                        "<div class='e5DialogGroup'>" +
                            "<div class='e5DialogHeading'>{{'Template' | translate}}</div>" +
                            "<div class='k-block k-info-colored' ng-if='vm.loading'>{{'Loading...' | translate}}</div>" +
                            "<div ng-if='!vm.loading'>" +
                                "<select class='e5DropDown e5TemplateDropDown' ng-if='!vm.loading' kendo-drop-down-list='vm.ddlTemplates' k-data-text-field='\"name\"' k-data-value-field='\"id\"' k-data-source='vm.dsTemplates' k-value-primitive='true' k-ng-model='vm.templateId'></select>" +
                            "</div>" +
                        "</div>" +
                        "<div class='e5DialogGroup'>" +
                            "<div class='e5DialogHeading'>{{'Attachment Type' | translate}}</div>" +
                            "<div class='k-block k-info-colored' ng-if='vm.loading'>{{'Loading...' | translate}}</div>" +
                            "<div ng-if='!vm.loading'>" +
                                "<select class='e5DropDown e5AttachmentTypeDropDown' kendo-drop-down-list='vm.ddlAttachmentTypes' k-data-text-field='\"name\"' k-data-value-field='\"id\"' k-data-source='vm.dsAttachmentTypes' k-value-primitive='true' k-ng-model='vm.attachmentTypeId'></select>" +
                            "</div>" +
                        "</div>" +
                        "<div class='k-block k-error-colored'  ng-show='vm.errorMessage'><span class='e5Icon'>&#9888;&nbsp;</span>{{vm.errorMessage}}</div>" +
                        //"<div class='k-block k-info-colored' ng-show='vm.generating'>{{'Generating Document...' | translate}}</div>" +
                    "</center>" +
                "</div>",
           controller: e5DialogAssignComponent
       });

    e5DialogAssignComponent.$inject = ["$scope", "$log", "$translate", "$element", "e5UtilsService", "workitemdata", "documentdata", "attachmenttypedata", "ngToast"];

    function e5DialogAssignComponent($scope, $log, $translate, $element, util, workitemdata, documentdata, attachmenttypedata, ngToast) {
        var vm = this;
        var $q = angular.injector(['ng']).get('$q');

        vm.$onInit = function () {
            vm.errorMessage = false;
            vm.dlgTitle = "Create Word Document";
            vm.eventArgs = {};
            vm.actions = [{
                text: $translate.instant("Create"), primary: true, action: onCreate
            }, {
                text: $translate.instant("Cancel"), action: onCancel
            }];
            vm.control = {
                open: open,
                close: close,
            }

            /**
             *  @function onCreate
             *  @desc called when the user selects the "Create" button in the dialog action panel.
             */
            function onCreate(e) {
                var selLoginName = vm.selLoginName;
                var selUser = false;
                var eDialog = $element.find('.e5DialogWord');

                if (vm.disabled || vm.generating)
                    return; // if the dialog is disabled or already generating then just return

                $log.debug("Generating document from template " + vm.templateId + " type " + vm.attachmentTypeId);
                var promises = [
                    documentdata.create(vm.workId, vm.templateId, vm.attachmentTypeId)
                ];
                util.showWaiting(vm.dialog.element, true, $translate.instant("Generating Document"));
                $q.all(promises).then(function (response) {
                    var generateResponse = response[0]; // as in promises array
                    vm.onCreate({
                        $eventArgs: vm.eventArgs, $dialogData: generateResponse.data
                    });
                    ngToast.info({
                        content: $translate.instant("Document created.")
                    });
                    vm.dialog.close();
                }, function (response) {
                    vm.errorMessage = $translate.instant("Unable to generate document. ") + " : " + JSON.stringify(response.data);
                    $log.error(vm.errorMessage + " - " + JSON.stringify(response));
                }).finally(function () {
                    vm.generating = false;
                    $scope.$apply();
                    util.showWaiting(vm.dialog.element, false);
                });

                vm.generating = true;
                return (false); // Prevent default action (close)
            }

            /**
             *  @function onCancel
             *  @desc called when the user selects the cancel button on the dialog.
             */
            function onCancel(e) {
                vm.onCancel({ $eventArgs: vm.eventArgs });
            }

            /**
             *  @function open
             *  @desc Open the dialog with the event hub event arguments.
             *  @param {object} eventArgs the event information and optional dialog specific configuration information.
             *  in this case, an "eventData.workId" field is reaquired.
             */
            function open(eventArgs) {
                vm.eventArgs = eventArgs;
                // Initilize the dialog
                vm.dlgTitle = $translate.instant(vm.dlgTitle || "Create Word Document");
                vm.errorMessage = false;
                vm.dsTemplates = [];
                vm.dsAttachmentTypes = [];
                vm.loading = true;
                vm.templateId = 0;
                vm.attachmentTypeId = 0;
                vm.workId = "";
                vm.generating = false;
                var eventData = (eventArgs || {}).eventData || {};

                if (!eventData.workId) {
                    vm.errorMessage = $translate.instant("The e5 event hub data must contain a workId.");
                    vm.loading = false;
                    vm.dialog.open();
                    return;
                }
                // Get the list of users reasons corresponding to the work item.
                // The work item id should be in the eventData 
                //var workId = ((vm.eventArgs || {}).eventData || {}).workId || '00000000-0000-0000-0000-000000000000';
                vm.workId = eventData.workId || '00000000-0000-0000-0000-000000000000';
                var promises = [
                    documentdata.getDocumentTemplates(vm.workId),
                    attachmenttypedata.getAttachmentType(vm.workId)
                ];
                $q.all(promises).then(function (response) {
                    var templateResponse = response[0]; // as in promises array
                    if (templateResponse.data && templateResponse.data.length > 0) {
                        vm.dsTemplates = templateResponse.data; // [] of (id, name)
                        vm.templateId = templateResponse.data[0].id;
                    } else {
                        vm.errorMessage = $translate.instant("There are no templates available.");
                    }

                    var attchemtnTypeResponse = response[1]; // as in promises array
                    if (attchemtnTypeResponse.data && attchemtnTypeResponse.data.length > 0) {
                        vm.dsAttachmentTypes = attchemtnTypeResponse.data; // it's ok to have no attachment types
                    }
                }, function (response) {
                    vm.errorMessage = $translate.instant("Unable to getDocumentTemplates and getAttachmentTypes") + " : " + JSON.stringify(response)
                    $log.error(vm.errorMessage);
                }).finally(function () {
                    vm.loading = false;
                    $scope.$apply();
                });

                vm.dialog.open();
            }

            /**
             *  @function close
             *  @desc Close the dialog. This is used externally via the control object.
             */
            function close() {
                vm.dialog.close();
            }
        }
    }

})();

/*
 *  (c) Copyright 2017 e5 Workflow
 *
 *  e5 Email Dialog
 *
 *  This component is used to display an e5 email dialog popup. The dialog can be used on 
 *  it's own, but it is normally used as part of the e5 event hub. This dialog is also used
 *  to emailattachments.
 *
 *  eventArgs = { 
 *      code: "string", 
 *      eventData: { confirm: "boolean", ... }, 
 *      eventCallback: function (optional) 
 *  } 
 */
(function () {
    'use strict';

    angular
       .module('e5Anywhere')
       .component('e5DialogEmail', {
           transclude: false,
           bindings: {
               control: "=control", // show dialog
               title: "=title",
               onSent: "&onSent",
               onCancel: "&onCancel"
           },
           controllerAs: "vm",
           template:
                "<b>e5-dialog-email </b>" +
                "<div kendo-dialog='vm.dialog' class='e5Dialog e5DialogEmail' k-title='vm.dlgTitle' k-modal='true' k-visible='false' k-actions='vm.actions' k-animation='false' k-closable='false'>" +
                    "<e5-email control='vm.ctlEmail' work-id='vm.workId' use-inline-editor='true' hide-send='true' must-have-templates='true' " +
                    "from='vm.from' to='vm.to' cc='vm.cc' bcc='vm.bcc' subject='vm.subject' thread-id='vm.threadId' body-html='vm.bodyHtml' " +
                    "show-attachments='vm.showAttachments' show-templates='true' hide-cc='false' on-sent='vm.onSentCb($email)'></e5-email>" +
                "</div>",
           controller: e5DialogEmailComponent
       });

    e5DialogEmailComponent.$inject = ["$scope", "$log", "$translate", "ngToast"];

    function e5DialogEmailComponent($scope, $log, $translate, ngToast) {
        var vm = this;

        vm.$onInit = function () {

            vm.errorMessage = false;
            vm.dlgTitle = "Email";
            vm.eventArgs = {};
            vm.dialog = {};
            vm.ctlEmail = {};
            vm.useInlineEditor = true;

            vm.onSentCb = function ($email) {
                vm.dialog.close();
                ngToast.success({
                    content: $translate.instant('Email successfully sent')
                });
                vm.onSent({
                    $eventArgs: vm.eventArgs,
                    $dialogData: $email
                });
            };

            vm.actions = [{
                text: "Send", primary: true, action: function () {
                    // If the email is sent, then the controll will call "onSendCb"
                    vm.ctlEmail.send();
                    return false; // don't close
                }
            }, {
                text: "Cancel", action: function () {
                    vm.onCancel({ $eventArgs: vm.eventArgs });
                }
            }];

            vm.control = {
                open: function (eventArgs, showAttachments) {
                    vm.eventArgs = eventArgs;
                    // Initilize the dialog
                    var eventData = ((eventArgs || {}).eventData || {});
                    vm.workId = eventData.workId || '00000000-0000-0000-0000-000000000000';;
                    vm.from = eventData.from || '';
                    vm.to = eventData.to || '';
                    vm.cc = eventData.cc || '';
                    vm.bcc = eventData.bcc || '';
                    vm.subject = eventData.subject || '';
                    vm.bodyHtml = eventData.bodyHtml || '';
                    vm.showAttachments = showAttachments ? true : false;

                    vm.ctlEmail.activate(vm.workId, true /*selectFirstTemplate*/);
                    vm.dialog.open();
                },
                close: function () {
                    vm.dialog.close();
                },
            }
        }
    }

})();

/// <reference path="e5.menu.template.html" />
/**
* @file e5 Get Next Component
* @copyright e5 anywhere - e5 Workflow Pty Ltd
*/
(function () {
    'use strict';
   
    /**
    * @name e5Menu
    * @desc Angular component that adds a Menu Items to a page based on the work item or task for the current user.
    * @property {string} hidemenuitems Comma seperated list of menu items to hide.
    */
    angular.module('e5Anywhere')
        .component('e5Email', {
            transclude: true,
            bindings: {
                control: "=?control", // Interact with the control from "outside"
                workId: "=workId", // work-id
                from: "=?",
                to: "=?",
                cc: "=?",
                bcc: "=?",
                subject: "=?",
                bodyHtml: "=?",
                threadId: "=?",
                showAttachments: "=?",
                showTemplates: "=?",
                hideCc: "=?",
                onSent: "&",
                defaultTemplate: "=?", // string
                defaultAttachments: "=?", // array of int
                appendOriginal: "=?", // boolean
                originalHtml: "=?",
                hideSend: "=?",
                emailId: "=?", //string - the email id of the message being replied to or forwarded to. Null or empty for a normal email.
                messageType: "=?", //string - normal, reply, forward (default is normal)
                useInlineEditor: "=?",
                mustHaveTemplates: "=?"
            },
            controllerAs: "vm",
            template: "<div class='e5EmailForm'>" +
                        "<div class='k-block k-error-colored' ng-show='vm.errorMessage'><span class='e5Icon'>&#9888;&nbsp;</span>{{vm.errorMessage}}</div>" +
                        "<div class='k-block k-success-colored' ng-show='vm.successMessage'><span class='e5Icon'>&#10004;&nbsp;</span>{{vm.successMessage}}</div>" +
                        "<div ng-show='!vm.hideEmailSection'>" +
                            "<div class='details' ng-show='!vm.hideEmailSection'>" +
                                "<div class='e5Heading'>{{'From' | translate}}</div>" +
                                "<input class='k-textbox' type='text' ng-model='vm.from' disabled='disabled'></input>" +
                                "<div class='e5Heading'>{{'To' | translate}}</div>" +
                                "<input class='k-textbox' type='text' name='Email' ng-model='vm.to' required></input>" +
                                "<div ng-hide='vm.hideCc'>" +
                                    "<div class='e5Heading'>{{'CC' | translate}}</div>" +
                                    "<input class='k-textbox' type='text' ng-model='vm.cc'></input>" +
                                    "<div class='e5Heading'>{{'BCC' | translate}}</div>" +
                                    "<input class='k-textbox' type='text' ng-model='vm.bcc'></input>" +
                                "</div>" +
                                "<div class='e5Heading'>{{'Subject' | translate}}</div>" +
                                "<input class='k-textbox' type='text' ng-change='vm.onSubjectChange()' ng-model='vm.subject' required></input>" +

                                "<div class='e5Templates' ng-show='vm.showTemplates'>" +
                                    "<div class='e5Heading' >{{'Template' | translate}}</div>" +
                                    "<div class='k-block k-info-colored' ng-hide='vm.dsTemplates.length || vm.loading'>{{'There are no templates available.' | translate}}</div>" +
                                    "<div class='k-block k-info-colored' ng-show='vm.loading'>{{'Loading...' | translate}}</div>" +
                                    "<div ng-show='vm.dsTemplates.length'>" +
                                        "<select kendo-drop-down-list='vm.ddlTemplates' k-data-text-field='\"name\"' k-data-value-field='\"id\"' " + 
                                            "k-data-source='vm.dsTemplates' k-value-primitive='true' k-ng-model='vm.templateId' on-change='vm.onSelect(kendoEvent)'></select>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='e5Attachments' ng-show='vm.showAttachments'>" +
                                    "<div class='e5Heading'>{{'Attachments' | translate}} <span ng-show='vm.dsAttachments.length' class='e5Filter'><span class='k-icon k-i-filter'></span><input ng-model='vm.filterAttachment'/></span> </div>" +
                                    "<div class='k-block k-info-colored' ng-hide='vm.dsAttachments.length || vm.loading'>{{'There are no attachments available.' | translate}}</div>" +
                                    "<div class='k-block k-info-colored' ng-show='vm.loading'>{{'Loading...' | translate}}</div>" +
                                    "<div class='e5AttachmentList k-textbox' ng-show='vm.dsAttachments.length'>" +
                                        "<div class='item' ng-repeat='a in vm.dsAttachments  | filter: { documentName : vm.filterAttachment} track by $index'>" +
                                            "<input title='id {{a.id}}' type='checkbox' ng-model='a.selected' /><span>&nbsp;&#x1f4ce;</span> " +
                                            "<span class='name'>{{a.documentName}}</span>" + 
                                        "</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='editor' ng-if='!vm.useInlineEditor'>" +
                                "<textarea kendo-editor='vm.txtEditor' k-ng-model='vm.bodyHtml' k-options='vm.editorOptions' on-change='vm.onEditorChange()'></textarea>" +
                            "</div>" +
                            "<div class='editor' ng-if='vm.useInlineEditor'>" +
                                "<div class='e5Heading'>{{'Body' | translate}}</div>" +
                                "<div class='inline-editor' kendo-editor='vm.txtEditor' k-ng-model='vm.bodyHtml' k-options='vm.editorOptions' on-change='vm.onEditorChange()'></div>" +
                            "</div>" +
                        "</div>" + 
                        // "<small>{{vm.workId}}</small>" +
                    "</div>",
            controller: e5EmailController
        });

    e5EmailController.$inject = ['$scope', '$log', '$translate', '$element', 'e5EventhubService', 'e5UtilsService', 'workitemdata', 'attachmentdata', 'documentdata', 'conversationdata'];

    function e5EmailController($scope, $log, $translate, $element, eventhub, util, workitemdata, attachmentdata, documentdata, conversationdata) {
        var vm = this;
        var $q = angular.injector(['ng']).get('$q');
        // this seperates the new from the original
        var MARKER = "<!--#DoNotRemove-->"; 
        var SEPERATOR = MARKER ; // + "<hr/>";

        vm.$onInit = function () {
            // This "public" functions can be used to control the email component from
            // parent controls and controllers.
            // <e5-mail control="email">
            // email.setTitle("Hello World")
            vm.control = {
                initilize: initilize,
                activate: activate,
                send: send,
                loadTemplate: loadTemplate
            };
            initilize();
        }
        return vm;

        function initilize() {
            var defaultEditorOptions = {
                tools: [
                    { // This may be removed later depending on hideSend flag
                        name: "Send",
                        template: "<button class='k-button send k-primary' ng-click='vm.onSend()'>{{'Send Email' | translate}}</button>"
                    },
                    'formatting', 'bold', 'italic', 'underline', 'strikethrough', 'subscript',
                    'superscript', 'insertUnorderedList', 'insertOrderedList', 'indent',
                    'outdent', 'createLink', 'unlink',
                ]
            };

            vm.ddlTemplates = {}; // use this to access the kendo templates drop down.
            vm.txtEditor = {}; // use this to access to kendo editor
            vm.onSend = send;
        
            // If the send button is removed then a send can be initiated 
            // by using the control.send() method.
            if (vm.hideSend)
                defaultEditorOptions.tools.splice(0, 1); // remove send button
            vm.editorOptions = defaultEditorOptions;

            activate(vm.workId);
        }

        /**
         *  @function removeOriginalFromBody
         *  @desc remove the original document from the body and return the body.
         *  @returns the body without the original document
         */
        function removeOriginalFromBody() {
            var body = vm.bodyHtml;
            var iSep = body.indexOf(MARKER);
            if (iSep >= 0) 
                body = body.substring(0, iSep);
            return (body);
        }

        function showSpinner(bShow, message) {
            var jqProgress = $($element.find('.e5EmailForm'));
            if (typeof ($(jqProgress).block) === "function") {
                if (bShow) {
                    $(jqProgress).block({
                        message: message,
                        onBlock: function (layer) {
                            $($element.find('.blockOverlay')).click(function () {
                                $(jqProgress).unblock() ;
                            });
                        }
                    });
                } else {
                    $(jqProgress).unblock();
                }
            } else {
                // default back to kendo
                kendo.ui.progress(jqProgress, bShow);
            }
        }

        function loadTemplate(templateId) {
            vm.errorMessage = "";
            showSpinner(true, $translate.instant("Loading Template"));
            workitemdata.generateHtml(vm.workId, templateId).then(function (response) {
                $log.debug(response);
                vm.lastTemplateId = templateId;
                // from, to, cc, bcc, subject, bodyHtml
                var td = response.data;
                vm.to = vm.to || td.to; // Load the template value only if the field is current empty

                //Don't override with template values if it is a reply or forward
                if (!vm.subject || (!vm.subject.startsWith("RE:") && !vm.subject.startsWith("FWD:"))) {
                    vm.from = td.from;
                    vm.cc = td.cc;
                    vm.bcc = td.bcc;
                }

                vm.isDirty = false;

                if (vm.appendOriginal) {
                    var body = vm.bodyHtml;
                    var iSep = body.indexOf(MARKER) ;
                    if (iSep >= 0) {
                        // We already have a original, so reuse it
                        var original = body.substring(iSep);
                        vm.bodyHtml = td.bodyHtml + original;
                    } else 
                        vm.bodyHtml = td.bodyHtml + SEPERATOR + vm.originalHtml;
                } else {
                    vm.bodyHtml = td.bodyHtml;
                }

                // Subject
                if ((vm.subject == null) || (vm.subject == "") || !(vm.subject.startsWith("RE:") || vm.subject.startsWith("FWD:")) )
                    vm.subject = td.subject;

            }, function (response) {
                vm.errorMessage = "Unable to load template HTML.";
                $log.error(vm.errorMessage + " : " + JSON.stringify(response));
            }).finally(function () {
                showSpinner(false);
            });
        }

        function activate(workId, selectFirstTemplate) {
            $log.debug("activate() subject=" + vm.subject);
            var CANNOTSENT_MESSAGE = $translate.instant("There are no Email templates available corresponding to this work item, so you cannot send any emails at this time.")
            vm.errorMessage = "";
            vm.successMessage = "";
            vm.dsTemplates = [] ;
            vm.dsAttachments = [];
            vm.loading = true;            
            vm.isDirty = false; // The forms details have been changed
            vm.lastTemplateId = 0;
            vm.hideEmailSection = false;
            vm.workId = workId || vm.workId;

            if (!vm.workId) {
                vm.loading = false ;
                return; // If we don't have a work id, we cannot do anything.
            }

            // setup handlers
            vm.onSelect = function (e) {
                // var dropdownlist = $(vm.ddlTemplates).data("kendoDropDownList");
                if (vm.isDirty && !confirm($translate.instant("The email body or subject has been modified and switching templates will lose your changes."))) {
                    //$scope.$apply(function () {
                        vm.templateId = vm.lastTemplateId;
                    //});
                    e.preventDefault();
                } else {
                    loadTemplate(vm.templateId);
                }
            }
            vm.onEditorChange = function () {
                vm.isDirty = true;
            }
            vm.onSubjectChange = function () {
                vm.isDirty = true;
            }

            // Load data
            $log.debug("Loading data");
            var promises = [
                attachmentdata.getAttachment(vm.workId),
                documentdata.getDocumentTemplates(vm.workId, ".xslt")
            ];
            
            $q.all(promises).then(function (response) {
                $log.debug(response);
                // Attachments
                var attachmentData = response[0]; // as in promises array
                //$scope.$apply(function () {
                    var at = attachmentData.data; // attachmentId, documentName, id, metaData, parentId, workId
                    vm.dsAttachments = (at && at.length > 0) ? at : []; // id, name

                    // Select the default attachments
                    if(vm.defaultAttachments && (typeof(vm.defaultAttachments) === 'object') && (vm.defaultAttachments.length > 0) && (vm.dsAttachments.length > 0) ) {
                        for (var iAttachment in vm.dsAttachments) {
                            var attachment = vm.dsAttachments[iAttachment];
                            if (vm.defaultAttachments.indexOf(attachment.id) >= 0)
                                attachment.selected = true;
                        }
                    }
                //});
                // Templates
                var templateData = response[1]; // as in promises array
                //$scope.$apply(function () {
                    var td = templateData.data; // Id, Name
                    vm.dsTemplates = (td && td.length > 0) ? td : []; // id, name

                // Load the default template if specified
                    if (vm.mustHaveTemplates && vm.dsTemplates.length == 0) {
                        vm.hideEmailSection = true;
                        vm.errorMessage = CANNOTSENT_MESSAGE ;
                    } else if (vm.defaultTemplate && (typeof(vm.defaultTemplate) === 'string') && vm.dsTemplates && (vm.dsTemplates.length > 0)) {
                        for (var iTemplate in vm.dsTemplates) {
                            var template = vm.dsTemplates[iTemplate];
                            if (template.name && (template.name.toLowerCase().endsWith(vm.defaultTemplate.toLowerCase()))) {
                                $log.debug("Loading default template " + vm.defaultTemplate + "(" + template.id + ")");
                                vm.templateId = template.id; // select it in the list
                                loadTemplate(template.id);
                                break;
                            }
                        }
                    } else if (selectFirstTemplate) {
                        if (vm.dsTemplates.length > 0) {
                            vm.templateId = vm.dsTemplates[0].id ;
                            loadTemplate(vm.templateId);
                        }
                    }
                //});
            }, function (response) {
                $scope.$apply(function () {
                    vm.errorMessage = "Unable to load external data.";
                    $log.error(vm.errorMessage + " : " + JSON.stringify(response));
                });
            }).finally(function () {
                $scope.$apply(function () {
                    vm.loading = false;
                });
            });

            // check to see if the state of appendOriginal changes and add or remove 
            // the original email accordingly
            $scope.$watch("vm.appendOriginal", function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue) {
                        vm.bodyHtml = removeOriginalFromBody() + SEPERATOR + vm.originalHtml;
                    } else {
                        vm.bodyHtml = removeOriginalFromBody();
                    }
                }
            });

            $scope.$watch("vm.originalHtml", function (newValue) {
                if(vm.appendOriginal)
                    vm.bodyHtml = removeOriginalFromBody() + SEPERATOR + vm.originalHtml;
            });

            //If defaultAttachments change, then we must update the selected attachments.
            $scope.$watch(function () {
                return vm.defaultAttachments;
            }, function (newValue) {
                $log.debug("defaultAttachments changed: " + newValue);
                for (var iAttachment in vm.dsAttachments) {
                    var attachment = vm.dsAttachments[iAttachment];
                    if (vm.defaultAttachments.indexOf(attachment.id) >= 0)
                        attachment.selected = true;
                    else
                        attachment.selected = false;
                }
            });
        }

        function sendFailed(response) {
            vm.errorMessage = "Unable to send email.";
            $log.error(vm.errorMessage + " : " + JSON.stringify(response));
        }

        /*
         *  Send the email.
         */
        function send() {
            vm.errorMessage = "";
            vm.successMessage = "";

            if (vm.hideEmailSection) {
                ngToast.success({
                    content: CANNOTSENT_MESSAGE
                });
            }

            var jqValidate = $($element.find('.e5EmailForm'));
            var validator = $(jqValidate).kendoValidator({
                // errorTemplate: "<span class='e5InputError k-block k-error-colored'>#=message#</span>"
            }).data("kendoValidator");
            if (!validator.validate()) {
                return;
            }

            try {
                showSpinner(true, $translate.instant("Sending Email"));
                // Assemble email 
                var email = {
                    id: 0,
                    workId: vm.workId,
                    threadId: vm.threadId,
                    from: vm.from,
                    to: vm.to,
                    cc: vm.cc,
                    bcc: vm.bcc,
                    subject: vm.subject,
                    bodyHtml: vm.bodyHtml,
                    isFirst: true,
                    emailId: vm.emailId,
                    messageType: vm.messageType || "normal",
                    "attachments": []
                };
                angular.forEach(vm.dsAttachments, function (value, key) {
                    var copy;
                    if (value.selected) {
                        copy = angular.copy(value);
                        delete copy['selected']; // removed stuff we added
                        this.push(copy);
                    }
                }, email.attachments);
    
                // Send email   
                $log.debug(email) ;
                conversationdata.sendEmail(vm.workId, email)
                .then(function (response) {
                    vm.onSent({ $email: email });
                    vm.successMessage = $translate.instant("The email has been sent.");
                    //$scope.$apply(); // Not required with $httpGet
                }, function (response) {
                    showSpinner(false);
                    sendFailed(response);
                    //$scope.$apply(); // Not required with $httpGet
                }).finally(function () {
                    showSpinner(false);
                });
            } catch (err) {
                sendFailed(err);
                showSpinner(false);
                return;
            }
        }
    }
})();

/*
*   angular.module('MyModule', ['e5.services'])
*       .factory('e5ServicesApiProfiler', ['e5ServicesNotifiction', function (notify) {
*           notify.error("Something went wrong!", "Here is a stack trace") ;
*   }]) ;
*/
(function () {
    //'use strict';
    angular
        .module('e5AnywhereServices')
        .service('e5NotifictionService', e5NotifictionService);

    e5NotifictionService.$inject = ['$log', 'e5Config'];

    function e5NotifictionService($log, $config) {
        // Public interfaces to service
        var service = {
            notify: notify,
            info: info,
            success: success,                
            warning: warning,
            error: error 
        }

        function _notifyWithInfo(type, message, moreInfo) {
            alert(type + " : " + message + "\n" + JSON.stringify($config)) ;
        }

        function notify(message, extra) {
            $log.info(message + (extra ? " " + extra : ""));
            _notifyWithInfo("notification", message, extra);
        } ;
        
        function info(message, extra) {
            $log.info(message + (extra ? " " + extra : ""));
            _notifyWithInfo("info", message, extra);
        } ;

        function success(message, extra) {
            $log.info(message + (extra ? " " + extra : ""));
            _notifyWithInfo("success", message, extra);
        } ;

        function warning(message, extra) {
            $log.warn(message + (extra ? " " + extra : ""));
            _notifyWithInfo("warning", message, extra);
        } ;

        function error(message, extra) {
            $log.error(message + (extra ? " " + extra : ""));
            _notifyWithInfo("error", message, extra);
        };
        return service ;
    };
})();

/*
 *  e5 Search AngularJS Services
 *
 *  The e5-search-service  can be used to access the e5 search services. The service is designed as
 *  a wrapper for the findworkitemdata service in order to convert the network optimised results, 
 *  returned from the API, into a converted into a more javascript friendly format.
 *
 *  The wrapper converts the data format for the results, which is an 2D array of values into a easy to
 *  use javascript associative array of {"name":"value", "name2":"value", ... }.
 */
(function () {
    angular
        .module('e5AnywhereServices')
        .service('e5SearchService', e5SearchService) ;

    e5SearchService.$inject = ['$http', '$log', 'findworkitemdata'] ;
    
    function e5SearchService($http, $log, findworkitemdata) {
        // Export the service "public" interface.
        return {
            searchWorkItems: function (options) {
                return findworkitemdata.getFindWorkItem(
                    options.findClassId,
                    options.includeArchives,
                    options.includeSLA,
                    options.includeAttachmentCount,
                    options.includeNextDueTask,
                    options.customProcedure,
                    options.attachmentTypeFilter,
                    options.select,
                    options.orderBy,
                    options.siteGroupsFilter,
                    options.page,
                    options.pageSize || 1,
                    options.filterBy).then(function (response) {
                        // Reformat the results into a more javascript {"name":"value",...} format
                        var newResults = [];
                        angular.forEach(response.data.results, function (rr, key) {
                            var aRow = {};
                            angular.forEach(response.data.columns, function (column, index) {
                                aRow[column.code] = rr[index];
                            });
                            this.push(aRow);
                        }, newResults);
                        response.data.results = newResults;

                        var newColumns = {};
                        angular.forEach(response.data.columns, function (rc, key) {
                            newColumns[rc.code] = rc;
                        });
                        response.data.columns = newColumns;
                        // http://www.codelord.net/2015/09/24/%24q-dot-defer-youre-doing-it-wrong/
                        return response; // pass up the chain (magic!!!)
                    });
            }
        };
    };
})();

/*
* To use the search in your code use the following template.
*   var app = angular.module("MyApp", ["e5.directives"]);
*   app.controller("MyCtrl", function ($scope) {
*       var sServiceBase = "../../e5Rest/GroupProfiler.svc/";
*       $scope.options = {
*           servicesBaseUrl: sServiceBase,
*       };
*   }) ;
*   ...
*   <div e5-search options="options"></div>
*/
(function () {

    angular.module('e5Anywhere')
        .component('e5Search', {
            transclude: false,
            bindings: {
                options: "=", // [{Key:"", Name:""},...]
                open: "&onOpen",
                change: "&onChange",
                attachment: "&onAttachment",
                select: "&onSelect"
            },
            template: "<div class='e5-control e5-search' kendo-grid='$ctrl.kendoGrid' k-options='$ctrl.gridOptions' k-rebind='$ctrl.gridOptions' k-data-source='$ctrl.dataSource' k-selectable='true' k-on-change='$ctrl.onChange(data)'></div>",
            controller: e5SearchController
        })

    e5SearchController.$inject = ['$scope', '$log', 'e5SearchService'];

    /*
        * The search control presents the results of a e5 search in a grid. This control
        * uses the e5ServicesApiSearch to search and retrieve the results.
        *
        * <div e5-search options='options'>
        *  options = {
        *      serviceUrl = ""
        *  }
        */
    function e5SearchController($scope, $log, $service) {
        var vm = this;
        vm.dataSource = null;
        $scope.$watch("$ctrl.options", function (newValue, oldValue) {
            //$log.debug("options changed from \n" + JSON.stringify(oldValue) + " to \n" + JSON.stringify(newValue));
            if (vm.dataSource == null) {
                vm.dataSource = new kendo.data.DataSource({
                    transport: {
                        read: function (e) {
                            //$log.debug("dataSource.transport.read " + JSON.stringify(e) + "\n" + JSON.stringify(vm.options));
                            // e.g. e.data = {filter:undefined, page:0, pageSize:10, skip:40, sort:[{"field":"CreationDate","dir":"asc"}], take:10} 

                            if (vm.cachedSuccess) {
                                var temp = vm.cachedSuccess;
                                vm.cachedSuccess = null;
                                //$log.debug("Using cached data \n" + JSON.stringify(temp));
                                e.success(temp);
                                return;
                            }

                            // Map sort:[{"field":"CreationDate","dir":"asc"}] => orderBy:"+propertyCode"
                            var orderBy = "";
                            angular.forEach(e.data.sort, function (value, key) {
                                //this.push({ propertyCode: value.field, order: value.dir });
                                orderBy += (orderBy == "" ? "" : ",") + (value.dir == "asc" ? "+" : "-") + value.field;
                            });
                            // Turn selecte into a list
                            var selected = [];
                            if (vm.options.select && vm.options.select.trim() != "") {
                                angular.forEach(vm.options.select.split(","), function (value, key) {
                                    var trimmed = value.trim();
                                    if (trimmed != "")
                                        selected.push(trimmed);
                                });
                            };

                            var options = {
                                findClassId: vm.options.findClassId || 1,
                                page: Math.max(e.data.page || 1, 1) - 1, // First API page is 0
                                pageSize: Math.max(e.data.pageSize || 1, 1),
                                includeArchives: vm.options.includeArchives || false,
                                includeAttachmentCount: vm.options.includeAttachmentCount || false,
                                includeSLA: vm.options.includeSLA || false,
                                includeNextDueTask: vm.options.includeNextDueTask || false,
                                customProcedure: "",
                                select: vm.options.select,
                                orderBy: (orderBy.length > 0) ? orderBy : vm.options.orderBy,
                                filterBy: vm.options.filterBy,
                            };

                            $service.searchWorkItems(options)
                                .then(function (response) {
                                    // on success
                                    // response.data = {total:100, results:[], columns:[], page:1}
                                    // columns:{code:{label:"",type:""}, code:{label:"",type:""},...}
                                    var results = response.data;
                                    //e.success({
                                    //    data: results.results,
                                    //    total: results.total,
                                    //    errors: 0
                                    //});

                                    // Rebuild the grid with the new columns but the same data.
                                    // This is a HACK, because you cannot add a column after the data is loaded
                                    var cachedColumnDefHead = [
                                        {
                                            headerTemplate: "<button class='k-button' ng-click='$ctrl.onRefresh()'><span class='reload-icon'/>Refresh</button>",
                                            template: "<button class='k-button k-primary' ng-click='$ctrl.onOpen($event)'>Open</button>"                                            
                                        }
                                    ];
                                    var cachedColumnDef = [];
                                    var cachedColumnDefMap = {};
                                    angular.forEach(results.columns, function (value, key) {
                                        var columnDef = null;
                                        if (key == "_AttachmentCount") {
                                            cachedColumnDefHead.push({
                                                field: key,
                                                title: "Attachments",
                                                width: "100px",
                                                template: "<button class='k-button' ng-click='$ctrl.onAttachment($event)'><span class='envelope-icon'/> #:data._AttachmentCount#</button>"
                                            });
                                        } else if (key == "Id") {
                                            // Drop it
                                        } else if (key == "_SLAExpiryStatus") {
                                            cachedColumnDefHead.push({
                                                field: key,
                                                title: "SLA",
                                                width: "50px",
                                                template: "<span class='sla-#:data._SLAExpiryStatus#-icon'/> "
                                            });
                                        } else {
                                            columnDef = { field: key, title: value.label };
                                        }
                                        if (columnDef) {
                                            cachedColumnDefMap[columnDef.field] = columnDef;
                                            this.push(columnDef);
                                        }
                                    }, cachedColumnDef);
                                    if (selected.length > 0) {
                                        // Reorder them so that they match the selected options
                                        var orderedCachedColumnDef = [];
                                        angular.forEach(selected, function (value) {
                                            if (typeof (cachedColumnDefMap[value]) !== "undefined") {
                                                orderedCachedColumnDef.push(cachedColumnDefMap[value]);
                                            }
                                        });
                                        cachedColumnDef = orderedCachedColumnDef;
                                    }
                                    // the next time this runs use the cached data but the new column definition
                                    vm.cachedSuccess = {
                                        data: results.results,
                                        total: results.total,
                                        errors: 0
                                    };
                                    vm.gridOptions.columns = cachedColumnDefHead.concat(cachedColumnDef); // this will force a reload
                                    e.success({ data: ["", "", ""], total: results.total, errors: 0 });
                                }, function (response) {
                                    // Error
                                    e.error("XHR response", "500", response);
                                });
                        }
                    },
                    pageSize: vm.options.pageSize || 10,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    schema: {
                        data: 'data',
                        total: 'total',
                        errors: 'errors',
                        model: { id: "Id" }
                    }
                });

                vm.gridOptions = {
                    sortable: true,
                    pageable: true,
                    columns: []
                };
            }

            if (!angular.equals(newValue.select, oldValue.select)) {
                // if select changes we need to so a read
                vm.dataSource.read();
            } if (!angular.equals(newValue, oldValue)) {
                // if anything else changes, do a complete reload
                vm.dataSource.pageSize(newValue.pageSize); // Force a reload
                //$log.debug("forcing pageSize");
            }
        }, true /* Deepwatch */);

        vm.onChange = function (data) {
            vm.change({ $data: data });
        };

        vm.onOpen = function ($event) {
            var sender = $event.currentTarget;
            var row = angular.element(sender).closest("tr");
            var data = vm.kendoGrid.dataItem(row);
            vm.open({ $data: data });
        };
        vm.onAttachment = function ($event) {
            var sender = $event.currentTarget;
            var row = angular.element(sender).closest("tr");
            var data = vm.kendoGrid.dataItem(row);
            vm.attachment({ $data: data });
        };

        vm.onRefresh = function () {
            vm.dataSource.read();
        };
    }
})();
/*
 *  e5 Search AngularJS Services
 *
 *  The e5.service.find service can be used to access the e5 search services. The
 *  service does require an endpoint url relative to the page hosting the angular 
 *  application.
 */
(function () {
    angular
        .module('e5AnywhereServices')
        .service('e5WorkitemService', e5WorkitemService);

    e5WorkitemService.$inject = ['$http', '$log', 'e5NotifictionService', 'e5Config'];
    
    function e5WorkitemService($http, $log, notify, e5Config) {
        var sServiceName = "e5WorkitemService";

        return {
            Get : GetWorkItem,
            GetNext: GetNextWorkItem,
            Lock: LockWorkItem,
            Unlock: UnlockWorkItem,
            Create: CreateWorkItem,
            Update: UpdateWorkItem,
            AddCaseNote: AddCaseNote,
            GetCaseNoteTypes: GetCaseNoteTypes,
            GetCaseNotes: GetCaseNotes
        } ;

        function makeWebServiceCall(sMethod, sUrlSuffix, parameters, cbSuccess, cbError) {
            try {
                var sUrl =(e5Config.webApiBase || "") + sUrlSuffix ;
                sUrl += ((sUrlSuffix.indexOf('?') > 0) ? "&ts=" : "?ts=") + (new Date()).getTime(); // ts prevents server side caching
                sDescription = sServiceName + "(" + sUrl + ") " + (parameters ? (" POST " + JSON.stringify(parameters)) : "");
                var httpRequest = (((sMethod == "POST") || (sMethod == "PUT")) ?
                {
                    method: sMethod,
                    url: sUrl,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: (parameters ? parameters : null), // data is passed an undefined your get an error
                    withCredentials: true
                } : {
                    method: sMethod,
                    url: sUrl,
                    withCredentials: true
                });
                // Make the call
                $http(httpRequest).then(function (response) {
                    //$log.info(sMethod + " ok");
                    cbSuccess(response);
                }, function (response) {
                    //$log.error(sMethod + " error " + response);
                    message = "The " + sServiceName + " (" + JSON.stringify(httpRequest) + ") failed.\n" + JSON.stringify(response);
                    if (typeof (cbError) === "function")
                        cbError(response, message);
                    else 
                        notify(message)
                });

            } catch (ex) {
                message = "There was an error while trying to communicate with the " + sServiceName + " (" + JSON.stringify(httpRequest) + ") web service on the remove server.\n" + 
                    sDescription + " Exception : " + ex.message + " " + ex.stack ;
                if (typeof (cbError) === "function")
                    cbError(response, message);
                else
                    notify(message)
            }
        }

        // Public function to get a work item
        function GetWorkItem(workId, success, error) {
            if (!workId) { error({}, sServiceName + " requires a workId"); return };
            var sUrl = "/WorkItem/" + workId; // Relative to e5Config.webApiBase
            makeWebServiceCall("GET", sUrl, false, success, error);
        };

        // Public function to get the next e5 work item in the users queue
        function GetNextWorkItem(success, error) {
            var sUrl = "/WorkItem/GetNext" ; // Relative to e5Config.webApiBase
            makeWebServiceCall("GET", sUrl, false, success, error);
        };
        
        // Public function to lock a work item
        function LockWorkItem(workId, success, error) {
            if (!workId) { error({}, sServiceName + " requires a workId"); return };
            var sUrl = "/WorkItem/Lock/" + workId; // Relative to e5Config.webApiBase
            makeWebServiceCall("PUT", sUrl, false, success, error);
        };

        // Public function to unlock a work item
        function UnlockWorkItem(workId, success, error) {
            if (!workId) { error({}, sServiceName + " requires a workId"); return };
            var sUrl = "/WorkItem/Unlock/" + workId; // Relative to e5Config.webApiBase
            makeWebServiceCall("PUT", sUrl, false, success, error);
        };

        // public function to Create a work item
        function CreateWorkItem(category1, category2, category3, fieldValues, success, error) {
            if (!category1) { error({}, sServiceName + " requires a category1"); return };
            if (!category2) { error({}, sServiceName + " requires a category2"); return };
            if (!category3) { error({}, sServiceName + " requires a category3"); return };
            var sUrl = "/WorkItem/Create/" + category1 + "/" + category2 + "/" + category3 + "/"; // Relative to e5Config.webApiBase
            // Currently fieldValues maps to [{key:xx,value:yy}...] of the web service, so there is no need to do any mapping
            makeWebServiceCall("POST", sUrl, fieldValues, success, error);
        };

        // Public function to update the properties on a work item
        function UpdateWorkItem(workId, fieldValues, success, error) {
            if (!workId) { error({}, sServiceName + " requires a workId"); return }
            var sUrl = "/WorkItem/Update/" + workId; // Relative to e5Config.webApiBase
            // Currently fieldValues maps to [{key:xx,value:yy}...] of the web service, so there is no need to do any mapping
            makeWebServiceCall("PUT", sUrl, fieldValues, success, error);
        };

        // Public function to update the properties on a work item
        function AddCaseNote(workId, caseNoteField, caseNoteHtml, success, error) {
            if (!workId) { error({}, sServiceName + " requires a workId"); return }
            if (!caseNoteField) { error({}, sServiceName + " requires a caseNoteField"); return }
            if (!caseNoteHtml) { error({}, sServiceName + " requires a caseNoteHtml"); return }
            var sUrl = "/CaseNote/Add/" + workId + "/" + caseNoteField ; // Relative to e5Config.webApiBase
            // Currently fieldValues maps to [{key:xx,value:yy}...] of the web service, so there is no need to do any mapping
            var caseNoteString = "\"" + caseNoteHtml.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"";
            makeWebServiceCall("POST", sUrl, caseNoteString, success, error);
        };

        // Public function to update the properties on a work item
        function GetCaseNoteTypes(success, error) {
            var sUrl = "/CaseNoteType"; // Relative to e5Config.webApiBase
            // Currently fieldValues maps to [{key:xx,value:yy}...] of the web service, so there is no need to do any mapping
            makeWebServiceCall("GET", sUrl, null, success, error);
        };

        // Public function to update the properties on a work item
        function GetCaseNotes(workId, includeRelated, ofTypeId, page, pageSize, orderBy, filterBy, success, error) {
            if (!workId) { error({}, sServiceName + " requires a workId"); return }
            var sUrl = "/CaseNote/" + workId ; // Relative to e5Config.webApiBase
            sUrl += "?includeRelated=" + ((includeRelated) ? "1" : "0");
            sUrl += (ofTypeId) ? ("&ofTypeId=" + ofTypeId) : "" ;
            sUrl += (page) ? ("&page=" + page) : "";
            sUrl += (pageSize) ? ("&pageSize=" + pageSize) : "";
            sUrl += (orderBy) ? ("&orderBy=" + orderBy) : "";
            // Currently fieldValues maps to [{key:xx,value:yy}...] of the web service, so there is no need to do any mapping
            makeWebServiceCall("POST", sUrl, filterBy, success, error);
        };
    };
})();

/*
* This component implements the e5 work item case not grid. Note that his is JUST 
* the results grid, not the control meno for things like includeRelated, work id,
* and case note type. The paging, ording and filter is, however, controlled using
* this component so there is no controll over that externally.
*/
(function () {

    angular.module('e5Anywhere')
        .component('e5Casenotesgrid', {
            transclude: false,
            bindings: {
                options: "=", // [{Key:"", Name:""},...]
            },
            template: "<div class='e5-control e5-casenotesgrid' kendo-grid='$ctrl.kendoGrid' k-options='$ctrl.gridOptions' k-data-source='$ctrl.dataSource' ></div>",
            controller: e5CaseNoteGridController
        })

    e5CaseNoteGridController.$inject = ['$scope', '$log', '$sanitize', 'ngToast', 'casenotedata', 'casenotetypedata'];

    /*
    * The case note grid presents the results of a e5 work item case notes in a grid. This control
    * uses the e5WorkitemService to search and retrieve the results.
    *
    * <div e5-case-notes-grid options='options'>
    *  options = {
    *      serviceUrl = ""
    *  }
    *   
    *   References
    *       http://demos.telerik.com/kendo-ui/grid/filter-menu-customization
    */
    function e5CaseNoteGridController($scope, $log, $sanitize, ngToast, casenotedata, casenotetypedata) {
        var vm = this;
        vm.dataSource = null;

        // Get the list of case note types from a API as is varies
        function caseNoteTypeFilter(element) {
            var dsCaseNoteTypes = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        casenotetypedata.get()
                            .then(function (response) {
                                e.success({ data: response.data });
                            }, function (response) {
                                ngToast.danger({
                                    content: String.format("Could not get casenote types.")
                                }) ;
                            });
                    }
                },
                schema: {
                    data: 'data'
                }
            });

            element.kendoDropDownList({
                dataTextField: "name",
                dataValueField: "name",
                dataSource: dsCaseNoteTypes,
                optionLabel: "--Select Value--"
            });
        }

        vm.gridOptions = {
            sortable: true,
            pageable: {
                refresh: true
            },
            filterable: {
                extra: false,
                operators: {
                    string: {
                        eq: "Is equal to",
                        startswith: "Starts with",
                        contains: "Contains",
                        endswith: "End with",
                        neq: "Is not equal to",
                        gt: "Is greater than",
                        lt: "Is less than"
                    }
                }
            },
            columns: [
                {
                    field: "caseNoteDate",
                    title: "Date",
                    format: "{0:MM/dd/yyyy HH:mm tt}",
                    width: 200,
                    filterable: {
                        ui: "datetimepicker"
                    }
                },
                {
                    field: "caseNoteUser",
                    width: 150,
                    title: "User"
                },
                {
                    field: "caseNoteType",
                    title: "Type",
                    width: 150,
                    filterable: {
                       ui: caseNoteTypeFilter
                    }
                },
                {
                    field: "caseNote",
                    title: "Detail",
                    encoded: false
                }
            ]
        };

        $scope.$watch("$ctrl.options", function (newValue, oldValue) {
            //$log.debug("options changed from \n" + JSON.stringify(oldValue) + " to \n" + JSON.stringify(newValue));
            vm.options = newValue ;
            vm.dataSource = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        //$log.log("dataSource.transport.read " + JSON.stringify(e) + "\n" + JSON.stringify(vm.options));

                        var page = Math.max(e.data.page || 1, 1) - 1;
                        var pageSize = Math.max(e.data.pageSize || 1, 1);

                        // Turn Kendo sort into an e5 sortBy String
                        // "sort":[{"field":"caseNoteDate","dir":"desc"}]}} => -caseNoteDate
                        var sortBy = "";
                        angular.forEach(e.data.sort, function (value, key) {
                            sortBy += ((value.dir === "desc") ? "-" : "") + value.field + ",";
                        });
                        //$log.log("sortBy=" + sortBy);
                        // Turn Kendo filter into an e5 filterBy JSON
                        // "filter":{"logic":"and","filters":[{"field":"caseNoteUser","operator":"eq","value":"Peter"}]}}
                        // What a remarkable concurrence that they are the same!!! ;-)
                        var filterBy = e.data.filter || {};

                        casenotedata.getCaseNote(vm.options.workId, vm.options.includeRelated, vm.options.ofTypeId, page, pageSize, sortBy, filterBy)
                            .then(function (response) {
                                angular.forEach(response.data.results, function (value, key) {
                                    value.caseNote = $sanitize(value.caseNote);
                                });
                                e.success({ data: response.data.results, total: response.data.total, errors: 0 });
                            }, function (response) {
                                ngToast.danger({
                                    content: String.format("Could not get casenote types.")
                                });
                            }) ;
                    }
                },
                pageSize: vm.options.pageSize || 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                schema: {
                    data: 'data',
                    total: 'total',
                    errors: 'errors',
                    model: {
                        fields: {
                            work_Id: { type: "string" },
                            id: { type: "number" },
                            caseNoteDate: { type: "date" },
                            caseNoteUser: { type: "string" },
                            caseNote: { type: "string" },
                            propertyId: { type: "string" },
                            category1_Id: { type: "number" },
                            category2_Id: { type: "number" },
                            category3_Id: { type: "number" },
                            reference: { type: "number" }
                        }
                    }
                }
            });
        }, true /* deep watch */); // $watch
    }
})();
/*
*   This component implements the e5 work item case not editor component that can be used 
*   to add case notes to a work item. The control could be used as a static on a page or
*   as a control in a dialog.
*/
(function () {

    angular.module('e5Anywhere')
        .component('e5Casenoteseditor', {
            transclude: false,
            bindings: {
                options: "=", // [{Key:"", Name:""},...]
                onSaved: "&",
                onError: "&"
            },
            template: "<div class='e5CasenoteseditorComponent progress' style='position: relative;'><textarea kendo-editor k-ng-model='$ctrl.caseNoteHtml' k-options='$ctrl.editorOptions'></textarea></div>",
            controller: e5CaseNoteEditorController
        })

    e5CaseNoteEditorController.$inject = ['$scope', '$log', '$element', 'ngToast', '$translate', 'casenotedata'];

    /*
    * The case note grid presents the results of a e5 work item case notes in a grid. This control
    * uses the e5WorkitemService to search and retrieve the results.
    *
    * <div e5-casenoteseditor options='options' on-saved="onSaved($data)" on-error="onError($error)">
    *  options = {
    *      workId : "",
            caseNoteField : ""
    *  }
    *   
    *   References
    *       http://demos.telerik.com/kendo-ui/grid/filter-menu-customization
    */
    function e5CaseNoteEditorController($scope, $log, $element, ngToast, $translate, casenotedata) {
        var vm = this;
        vm.caseNoteHtml = "";
        vm.onSave = function () {
            // A little jquery 
            if (vm.caseNoteHtml == "") {
                ngToast.info({
                    content: $translate.instant('Case note must contain text.')
                });
                return;
            }
            var jqProgress = $($element.find('div.progress')) ;
            kendo.ui.progress(jqProgress, true);
            casenotedata.add(vm.options.workId, vm.options.caseNoteField, JSON.stringify(vm.caseNoteHtml) )
                .then(function(response) { // Success
                    vm.caseNoteHtml = "";
                    kendo.ui.progress(jqProgress, false);
                    vm.onSaved({ $data: { workId: vm.options.workId, field: vm.options.caseNoteField, html: vm.caseNoteHtml } });
                }, function (response) { // error 
                    ngToast.danger({
                        content: $translate.instant('Failed to add case note.')
                    });
                    $log.error(JSON.stringify(response));
                    vm.onError({ $error: response });
                }).finally(function () {
                    kendo.ui.progress(jqProgress, false);
                })
        };
        vm.editorOptions = {
            tools: [
                {
                    name: "save",
                    template: "<button class='k-button' ng-click='$ctrl.onSave()'><span class='k-icon k-i-tick'></span>Save</button>"
                },
                'formatting', 'bold', 'italic', 'underline', 'strikethrough', 'subscript',
                'superscript', 'insertUnorderedList', 'insertOrderedList', 'indent',
                'outdent', 'createLink', 'unlink',
            ]
        };
    }
})();
/// <reference path="e5.menu.template.html" />
/**
* @file e5 Get Next Component
* @copyright e5 anywhere - e5 Workflow Pty Ltd
*/
(function () {
    'use strict';

    /**
    * @name e5Menu
    * @desc Angular component that adds a Menu Items to a page based on the work item or task for the current user.
    * @property {string} hidemenuitems Comma seperated list of menu items to hide.
    */
    angular.module('e5Anywhere')
        .component('e5Menu', {
            transclude: true,
            bindings: {
                hidemenuitems: '@',
                showImages: '=',
                workId: "=workId", // work-id
                taskId: "=taskId" // task-id - If taskId is not bound it will display work menu items 
            },
            template:

            "<div id='e5MenuForm'>" +
            "<div class='buttons-wrap' ng-repeat='menuItem in menuItems'>" +
            "<kendo-button ng-style=\"$last && {'margin-right':'20px'}\" ng-class=\"{'showButtonImages': $ctrl.showImages }\" ng-if='menuItem.enabled && hidemenuitems.indexOf(menuItem.code)==-1' class='k-primary' style='float: left; margin: 0 2px 2px 2px;' ng-click='onMenuSelect(menuItem)' title='{{menuItem.label}}'><img ng-if='$ctrl.showImages' src='{{e5LegacyBase}}{{menuItem.imageUrlLarge}}'/><div class='buttonText'>{{menuItem.label}}</div></kendo-button>" +
            "</div>" +
            "</div>",
            controller: e5MenuController
        });

    e5MenuController.$inject = ['$scope', '$rootScope', '$http', '$location', 'workitemdata', 'menuitemdata', 'ngToast', '$translate', '$element', '$attrs', 'e5Config', 'e5EventhubService', 'e5UtilsService'];

    function e5MenuController($scope, $rootScope, $http, $location, workitemdata, menuitemdata, ngToast, $translate, $element, $attrs, e5Config, e5EventhubService, util) {
        var vm = this;

        // Watch for changes in the workId and reload the menu accordingly
        var workId = "";
        var taskId = "";
        var menuType = 'WORK';
        if (typeof $attrs.taskId !== 'undefined') {
            menuType = 'TASK';
        }

        vm.$onInit = function() {
            var service = {
                activate: activate,
                getMenuItems: getMenuItems
            };


            // Watch for changes in the workId and reload the menu accordingly
            $scope.$watch("$ctrl.workId",
                function(newId, oldId) {
                    if (newId && newId.length === 36 && (newId !== oldId || workId === "")) {
                        workId = newId;

                        if (!taskId && menuType.toUpperCase() === 'WORK')
                            getMenuItems(); //refresh if taskId is null 
                    }
                });

            $scope.$watch("$ctrl.taskId",
                function(newId, oldId) {
                    if (newId && newId.length === 36 && (newId !== oldId || taskId === "")) {
                        taskId = newId;
                        getMenuItems();
                    }
                });

            $scope.onMenuSelect = onMenuSelect;
            $scope.menuItems = [];
            $scope.hidemenuitems = [];
            $scope.e5LegacyBase = "";

            activate();

            return service;
        }
        return vm;

        function activate() {
            //set the hidemenuitems attribute to scope
            if (typeof $attrs.hidemenuitems !== 'undefined' && $attrs.hidemenuitems.length > 0) {
                $scope.hidemenuitems = $attrs.hidemenuitems.replace(/, /g, ",").replace(/ ,/g, ",").split(",");
            }

            if ($attrs.workId && workId.length === 36) {
                workId = $attrs.workId;
            }
            if ($attrs.taskId && taskId.length === 36) {
                taskId = $attrs.taskId;
            }

            $scope.e5LegacyBase = e5Config.e5LegacyBase;

            getMenuItems();
        }


        function onMenuSelect(menuItem) {
            var menuItemCode = menuItem.code;

            // Assemeble the event data, which is a copy of the menu item along with the work item id
            var eventData = angular.copy(menuItem);
            eventData.workId = util.resolveWorkId(workId);

            e5EventhubService.menu("e5MenuController", menuItemCode, eventData, function (source, type, code, eventData, hubData) {
                toggleSpinner(1);
                var invokeMenuItemData = {
                    WorkItemChanges: {},
                    TaskChanges: {},
                    AdditionalProperties: hubData
                };
                menuitemdata.invokeMenuItem(workId, menuItem.id, taskId, '', invokeMenuItemData)
                    .then(
                        function (response) {
                            // success - reload the menu
                            getMenuItems();
                        },
                        function (response) {
                            // failure callback

                            if (response.data.indexOf("Parameter name: assemblyString") !== -1) {
                                getMenuItems();
                                return; //Hide the error if the server-side method is not defined. It means there is no code to execute on the server.
                            }

                            ngToast.danger({
                                content: String.format("Failed to invoke menu item '{0}'", menuItem.code)
                            });
                        }
                    )
                    .finally(function () {
                        toggleSpinner(-1);
                    });
            });
        }


        function getMenuItems() {
            if (!workId || workId.length !== 36)
                return;

            toggleSpinner(1);

            menuitemdata.getMenuItem(workId, taskId)
                .then(function (response) {
                    $scope.menuItems = response.data;
                }, function (response) {
                    // There was an error so remove the only menu (just in case)
                    $scope.$apply(function () {
                        $scope.menuItems = [];
                    });
                }).finally(function () {
                    toggleSpinner(-1);
                });
        }


        /*Private Functions*/
        // ReSharper disable once JsUnreachableCode
        /*eslint no-unreachable: "error"*/
        var spinCounter = 0;
        //Show the spinner if the counter goes from 0 to 1
        //Hide the spinner if the counter goes from 1 to 0
        function toggleSpinner(counterIncrementDecrement) {

            if (typeof spinCounter === 'undefined')
                spinCounter = 0;

            spinCounter = spinCounter + counterIncrementDecrement;

            if (counterIncrementDecrement === 1 && spinCounter === 1) {
                if (!$scope.e5MenuForm || !$scope.e5MenuForm.$$element["0"] || !$scope.e5MenuForm.$$element["0"].id) return;
                kendo.ui.progress($('#' + $scope.e5MenuForm.$$element["0"].id), true);
            }
            if (counterIncrementDecrement === -1 && spinCounter === 0) {
                if (!$scope.e5MenuForm || !$scope.e5MenuForm.$$element["0"] || !$scope.e5MenuForm.$$element["0"].id) return;
                kendo.ui.progress($('#' + $scope.e5MenuForm.$$element["0"].id), false);
            }
        }

    }



})();

/*
*   This component implements the e5 work item attachment component.
*/
(function () {
    angular.module('e5Anywhere')
        .component('e5AttachmentGrid', {
            bindings: {
                dtSourceType: '@',
                workId: '=',
                debugMode: '=',
                pageSize: '='
            },
            controllerAs: "vm",
            template:
                '<div class="wide e5attachmentsGrid">' +
                '<div nv-file-drop="" uploader="vm.uploader">' +
                    '<div nv-file-over="" uploader="vm.uploader" class="drop-zone" over-class="file-over" style="height:100%" >' +
                        '<div class="upload-panel">' + 
                            '<input name="file-input" id="file-input" class="file-input" type="file" nv-file-select="" uploader="vm.uploader" multiple />' +
                            '<label for="file-input" class="upload-button k-state-selected"><i class="fa fa-upload" alt="Remove Item" aria-hidden="true"></i><span class="buttonText">Attach files</span></label>' +
                            '<div class="file-upload-list">' +
                                '<div class="upload-item" ng-repeat="item in vm.uploader.queue">' +
                                    '<i class="fa fa-trash" alt="Remove Item" aria-hidden="true" ng-click="item.remove()" style="font-size:140%"></i>&nbsp;' +
                                    '<span class="name">{{ item.file.name }}</span>&nbsp;' +
                                    '<span>({{ item.file.size/1024/1024|number:2 }} Mb)</span>' +
                                '</div>' +
                            '</div>' +
                            '<div ng-show="vm.uploader.queue.length > 0">' +
                                '<button type="button" class="btn btn-warning btn-xs" ng-click="vm.uploader.clearQueue()" ng-disabled="!vm.uploader.queue.length">' +
                                    '<span class="glyphicon glyphicon-trash"></span> Remove all' +
                                '</button>&nbsp;' +
                                '<button type="button" class="btn btn-success btn-xs" ng-click="vm.uploader.uploadAll()" ng-disabled="!vm.uploader.getNotUploadedItems().length">' +
                                    '<span class="glyphicon glyphicon-upload"></span> Upload all' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                        '<div kendo-grid="vm.grid" k-options="vm.gridOptions" k-data-source="vm.gridDataSource"> </div>' +
                        '<iframe class="download" width="0" height="0" frameborder="0" src=""></iframe>' +
                        '</div>' + 
                    '</div>' +
                '</div>',
                controller: e5AttachmentGridController
        })

    e5AttachmentGridController.$inject = ['$scope', '$log', '$element', '$http', 'e5Config', 'ngToast', 'e5UtilsService', 'e5Endpoints', 'attachmentdata', 'workitemdata', 'FileUploader'];
    /*
     *  You can add the e5 attachment component to the page using the following syntax.
     *
     */
    function e5AttachmentGridController($scope, $log, $element, $http, e5Config, ngToast, util, endpoints, attachmentdata, workitemdata, FileUploader) {
        var vm = this;

        vm.onOpen = function (attachment) {
            //  "DocAttachmentId":"36",
            //  "DocName":"Sleepy.jpg",
            //  "DocUrl":"http://vlane5dev2016:81/sites/e5dev/e5%20Attachments/2/Sleepy.jpg",
            //  "WorkItemId":"7657fec3-1e74-11e7-a2c4-00155d2aaa1d",
            //  "Extension":"jpg",
            //  "DocTypeId":2,
            //  "DocId":2005,
            //  "DocTypeName":"Public Images"

            // format URL e.g.
            // "/sites/travel/_layouts/e5/WorkAttachmentViewer.aspx?id=6da5fd96-5462-11e6-815d-90e2ba57fbe1&source=FindWork&auto=false&attachments=6da5fd96-5462-11e6-815d-90e2ba57fbe1;23319|"
            // WorkAttachmentViewer.aspx?id=13a11814-1efb-11e7-8144-000d3aa0265d&source=FindWork&auto=false&attachments=13a11814-1efb-11e7-8144-000d3aa0265d;17627|

            var url = e5Config.e5LegacyBase + // e.g http://vlane5dev2016:81/sites/e5dev/
                "_layouts/e5/WorkAttachmentViewer.aspx" +
                "?id=" + attachment.WorkItemId +
                "&source=FindWork&auto=false" +
                "&attachments=" + attachment.WorkItemId + ";" + attachment.DocId + "|" ;
            var popupFeatures = "top=0,left=0,width=10,height=10,directories=no,location=no,menubar=no,status=no,resizable=yes,titlebar=yes,toolbar=no";
            window.open(url, "E5AttachmentViewer", popupFeatures) ;
        }
        vm.getDocType = function(attachment) {
            return (attachment.DocTypeName || "") ;
        }

        //vm.AddFileToQueue = function (url) {
        //    //var url = 'api/containers/comK/download/IMG_20130731_211048.jpg';
        //    $http.get(url, { responseType: "blob" }).
        //        success(function (data, status, headers, config) {
        //            var mimetype = data.type;
        //            var file = new File([data], url.substring(url.lastIndexOf('/'), url.length), { type: mimetype });
        //            var dummy = new FileUploader.FileItem(vm.uploader, {});
        //            dummy._file = file;
        //            dummy.progress = 100;
        //            dummy.isUploaded = true;
        //            dummy.isSuccess = true;
        //            vm.uploader.queue.push(dummy);
        //        }).
        //        error(function (data, status, headers, config) {
        //            alert("The url could not be loaded...\n (network error? non-valid url? server offline? etc?)");
        //        });
        //}


        vm.$onInit = function () {
            // File Uploader
            vm.uploader = new FileUploader({
                url: util.addCacheBusterParam(String.format(endpoints.attachmentAddRoute, vm.workId)),
                withCredentials: true,
                removeAfterUpload: true
            });
            vm.uploader.onCompleteItem = function (fileItem, response, status, headers) {
                $log.info('onCompleteItem', fileItem, response, status, headers);
                vm.gridDataSource.read();
            };
            vm.uploader.onErrorItem = function (item, response, status, headers) {
                $log.error("Failed to upload " + item.file.name + " " + response);
                ngToast.danger("Failed to upload " + item.file.name);
            };
            vm.grid = {};
            vm.gridOptions = {
                sortable: true,
                resizable: true,
                pageable: {
                    refresh: true
                },
                columns : [
                    {
                        field: "",
                        title: "",
                        width: 35,
                        template: "<i class='fa fa-paperclip' aria-hidden='true' ng-click='vm.onOpen(dataItem)' style='font-size:140%'></i>",
                        attributes: { "class": "fixedColumnWidth" }
                    },
                    {
                        title: "",
                        width: 45,
                        template: "<i class='fa fa-bars e5-attach' aria-hidden='true' style='font-size:140%'> </i>"
                    },
                    {
                        field: "DocName",
                        title: "Name",
                        //template: '{{dataItem}}',
                    },
                    {
                        field: "DocTypeId",
                        title: "Type",
                        width: 150,
                        template: '{{vm.getDocType(dataItem)}}',
                        minScreenWidth: 570
                    }
                ]
            };
            $scope.$watch("vm.workId", function (newValue, oldValue) {
                vm.gridDataSource = new kendo.data.DataSource({
                    pageSize: vm.pageSize || 5 ,
                    transport: {
                        read: function (e) {
                            if (typeof(vm.workId) === "undefined" || vm.workId == "")
                                e.success({ data: [], total: 0 });
                            else {
                                var url = util.addCacheBusterParam(String.format(endpoints.workitemAttachmentsRoute, vm.workId));
                                vm.url = url;
                                $http.get(url, { withCredentials: true })
                                    .then(function (response) {
                                        $log.info(response);
                                        var results = response.data.value || [];
                                        e.success({ data: results, total: results.length });
                                    }, function (response) {
                                        ngToast.danger({
                                            content: String.format("Could not get attachment data.")
                                        });
                                        e.success({ data: [], total: 0 }); // Display nothing
                                    });
                            }
                        }
                    },
                    schema: {
                        data: 'data',
                        total: 'total'
                    }
                });
                // Uploader
                vm.uploader.url = util.addCacheBusterParam(String.format(endpoints.attachmentAddRoute, vm.workId));
            });

            // If the workitemdata.workId member changes then update the local
            $scope.$watch(angular.bind(workitemdata, function () {
                    return this.workId;
                }),
                function (newVal, oldVal) {
                    if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {
                        vm.workId = newVal;
                    }
                }, true);
        }
    }

})();


/*
{
  "workItemId": "7657fec3-1e74-11e7-a2c4-00155d2aaa1d",
  "error": false,
  "errorDescription": null,
  "securitySettings": {
    "MainMenu": {
      "AddAllowed": false,
      "EditAllowed": true,
      "Edit": {
        "DetachAllowed": false,
        "EMailAllowed": true,
        "ChangeTypeAllowed": true
      },
      "ViewAttachmentsAllowed": false,
      "AttachmentTypesAllowed": true
    },
    "ContextMenu": {
      "DownloadAllowed": true,
      "DetachAllowed": true,
      "EMailAllowed": true,
      "ChangeTypeAllowed": true,
      "ConvertAllowed": true,
      "SplitAllowed": true,
      "TearOffAllowed": true
    }
  },
  "uiSettings": {
    "gridPageSize": 10,
    "gridPageSizes": [
      {
        "text": "5",
        "value": 5
      },
      {
        "text": "10",
        "value": 10
      },
      {
        "text": "25",
        "value": 25
      },
      {
        "text": "All",
        "value": 50
      }
    ]
  },
  "attachmentTypes": [],
  "schema": {
    "WorkItemId": {
      "type": "string",
      "title": "",
      "visible": false,
      "dynamic": false,
      "width": 0
    },
    "DocId": {
      "type": "number",
      "title": "",
      "visible": false,
      "dynamic": false,
      "width": 0
    },
    "DocName": {
      "type": "bool",
      "title": "Name",
      "visible": true,
      "dynamic": false,
      "width": 0
    },
    "DocUrl": {
      "type": "string",
      "title": "Url",
      "visible": false,
      "dynamic": false,
      "width": 0
    },
    "Extension": {
      "type": "string",
      "title": "Url",
      "visible": false,
      "dynamic": false,
      "width": 0
    },
    "DocTypeId": {
      "type": "number",
      "title": "Type",
      "visible": true,
      "dynamic": false,
      "width": 0
    },
    "DocTypeName": {
      "type": "string",
      "title": "Type Name",
      "visible": false,
      "dynamic": false,
      "width": 0
    },
    "DocAttachmentId": {
      "type": "string",
      "title": "AttachmentId",
      "visible": false,
      "dynamic": false,
      "width": 0
    }
  },
  "value": [
    {
      "DocAttachmentId": "16",
      "DocName": "attachment_smile01.jpg",
      "DocUrl": "http://vlane5dev2016:81/sites/e5dev/e5%20Attachments/2/attachment_smile01.jpg",
      "WorkItemId": "7657fec3-1e74-11e7-a2c4-00155d2aaa1d",
      "Extension": "jpg",
      "DocTypeId": 0,
      "DocId": 1002,
      "DocTypeName": ""
    }
  ]
}
*/
(function() {
    'use strict';



    angular.module('e5Anywhere')
        .component('e5Classification',
        {
            transclude: true,
            bindings: {
                classification: '='
            },
            template: "<div class='Classification' ng-if='categoryLoadedCount>=3'>" +
                        "<!--<h4>Classification: {{classification.category1Id}}|{{classification.category2Id}}|{{classification.category3Id}}</h4>-->" +
                        "<input k-on-change='Cat1Changed(kendoEvent)' kendo-drop-down-list id='cat1' ng-model='classification.category1Id' k-value-primitive='true' k-data-text-field=\"'name'\" k-data-value-field=\"'categoryId'\" k-data-source='cat1data' />&nbsp;" +
                        "<input k-on-change='Cat2Changed(kendoEvent)' kendo-drop-down-list id='cat2' ng-model='classification.category2Id' k-value-primitive='true' k-data-text-field=\"'name'\" k-data-value-field=\"'categoryId'\" k-data-source='cat2data' />&nbsp;" +
                        "<input kendo-drop-down-list id='cat3' ng-model='classification.category3Id' k-value-primitive='true' k-data-text-field=\"'name'\" k-data-value-field=\"'categoryId'\" k-data-source='cat3data' />" +
                      "</div>",
            controller: e5ClassificationController
        });

    e5ClassificationController.$inject = ['$scope', '$log', '$rootScope', '$http', '$location', 'taskdata', 'workitemdata', 'ngToast', '$translate', '$element', '$attrs', 'e5Endpoints', 'e5UtilsService'];

    function e5ClassificationController($scope, $log, $rootScope, $http, $location, taskdata, workitemdata, ngToast, $translate, $element, $attrs, e5Endpoints, utils) {
        var activeOnly = false; // Show all the classifications
        var service = {
            populateListData: populateListData,
            activate: activate
        };

        $scope.Cat1Changed = cat1Changed;
        $scope.Cat2Changed = cat2Changed;


        if (!$scope.classification)
            $scope.classification = $scope.$parent.classification;

        if (!$scope.classification)
            $scope.classification = $scope.$parent.$parent.classification;

        $scope.categoryLoadedCount = 0;
        activate();

        return service;

        function activate() {
            if (!$scope.classification)
                $scope.classification = $scope.$parent.classification;

            if (!$scope.classification)
                $scope.classification = $scope.$parent.$parent.classification;

            populateListData(String.format(e5Endpoints.categorisationGetCategory1Route, activeOnly));
            populateListData(String.format(e5Endpoints.categorisationGetCategory2Route, $scope.classification.category1Id, activeOnly  ));
            populateListData(String.format(e5Endpoints.categorisationGetCategory3Route, $scope.classification.category2Id, activeOnly ));
        }

        function cat1Changed(kendoEvent) {
            if (typeof kendoEvent !== 'undefined' &&
                kendoEvent !== null &&
                typeof kendoEvent.sender !== 'undefined' &&
                typeof kendoEvent.sender.selectedIndex !== 'undefined') {
                var apiUrl = String.format(e5Endpoints.categorisationGetCategory2Route, kendoEvent.sender.value(), activeOnly);
                $scope.cat2data = [];
                $scope.cat3data = [];
                $scope.classification.category2Id = null;
                $scope.classification.category3Id = null;
                populateListData(apiUrl);
            }
        }

        function cat2Changed(kendoEvent) {
            if (typeof kendoEvent !== 'undefined' &&
                kendoEvent !== null &&
                typeof kendoEvent.sender !== 'undefined' &&
                typeof kendoEvent.sender.selectedIndex !== 'undefined') {
                var apiUrl = String.format(e5Endpoints.categorisationGetCategory3Route, kendoEvent.sender.value(), activeOnly);
                $scope.cat3data = [];
                $scope.classification.category3Id = null;
                populateListData(apiUrl);
            }
        }

        function populateListData(url) {
            var url2 = utils.addCacheBusterParam(url);
            $http.get(url2, { withCredentials: true })
                .then(function(response) {
                    if (url.indexOf('GetCategory1') !== -1) {
                        $scope.cat1data = response.data;
                        $scope.categoryLoadedCount++;
                    }
                    if (url.indexOf('GetCategory2') !== -1) {
                        $scope.cat2data = response.data;
                        $scope.categoryLoadedCount++;
                    }
                    if (url.indexOf('GetCategory3') !== -1) {
                        $scope.cat3data = response.data;
                        $scope.categoryLoadedCount++;
                    }

                });
        }
    }

})();
/**
* @file e5 Field Component
* @copyright e5 anywhere - e5 Workflow Pty Ltd
*/
(function () {
    //'use strict';

    /**
    * @name e5FieldComponent
    * @desc Displays a field 
    * @property {string} watchForWorkIdChange Whether to watch for a work id change and refresh value.
    * @property {string} workId The work id.
    * @property {string} taskId The task id.
    */
    angular.module('e5Anywhere')
        .component('e5Field', {
            transclude: true,
            bindings: {
                watchForWorkIdChange: '@',
                workId: '=',
                taskId: '=',
                fieldId: '=',
                fieldIn:'='
            },
            template: '<div class="field" style="padding:0 15px 10px 0" data-ng-field-data-type="field.fieldDataType" ng-if="field" data-ng-switch on="field.fieldDataType">'
            + ' <label class="e5-label" for="{{field.workFieldId}}" ng-bind="field.label"></label>'
            + ' <input data-ng-switch-when="2" class="form-control k-input e5-input" id="{{field.workFieldId}}" kendo-date-picker ng-disabled="field.isReadOnly" ng-model="field.resolvedValue" ng-change="onChange(field)" ng-required="field.isRequired" tooltip="{{field.tooltip}}" />'
            + ' <input data-ng-switch-when="11" class="form-control k-input e5-input" id="{{field.workFieldId}}" kendo-date-time-picker ng-disabled="field.isReadOnly" ng-model="field.resolvedValue" ng-change="onChange(field)" ng-required="field.isRequired" tooltip="{{field.tooltip}}" />'
            + ' <input data-ng-switch-when="9|10" ng-switch-when-separator="|" style="display: inline;" class="form-control k-input e5-input" id="{{field.workFieldId}}" kendo-numeric-text-box k-format="c0" ng-disabled="field.isReadOnly" data-min="field.rangeMinimum" data-max="field.rangeMaximum" validationMessage="field.validationMessage"  ng-model="field.resolvedValue" ng-change="onChange(field)" ng-required="field.isRequired" tooltip="{{field.tooltip}}" />'
            + ' <input data-ng-switch-when="7" class="form-control k-input e5-input" id="{{field.workFieldId}}" ng-disabled="field.isReadOnly" ng-model="field.resolvedValue" ng-change="onChange(field)" ng-required="field.isRequired" tooltip="{{field.tooltip}}" />'
            + ' <input data-ng-switch-default class="form-control k-input k-textbox e5-input" id="{{field.workFieldId}}" type="text" ng-disabled="field.isReadOnly" pattern="{{field.pattern}}" validationMessage="field.validationMessage" ng-model="field.resolvedValue" ng-change="onChange(field)" ng-required="field.isRequired" tooltip="{{field.tooltip}}" />'
            + ' <span data-ng-switch-when="14" class="e5-input-checkbox-span" >'
            + '    <input class="form-control k-input" id="{{field.workFieldId}}" kendo-mobile-switch type="checkbox" ng-disabled="field.isReadOnly" ng-model="field.resolvedValue" k-on-label="\'YES\'" k-off-label="\'NO\'" ng-change="onChange(field)" ng-required="field.isRequired" tooltip="{{field.tooltip}}" />'
            + ' </span>'
            + ' <textarea data-ng-switch-when="6" class="form-control k-input e5-input e5-input-textarea" id="{{field.workFieldId}}" ng-disabled="field.isReadOnly" ng-model="field.resolvedValue" ng-change="onChange(field)" ng-required="field.isRequired" tooltip="{{field.tooltip}}"></textarea>'
            +'</div>',
            controller: 'e5FieldController'
        })
        .controller('e5FieldController', e5FieldController);

    e5FieldController.$inject = ['$scope', '$rootScope', '$http', 'fielddata', 'workitemdata', 'ngToast', '$translate', 'e5Endpoints', 'e5UtilsService', 'e5EventhubService'];

    function e5FieldController($scope, $rootScope, $http, fielddata, workitemdata, ngToast, $translate, endpoints, util, e5EventhubService) {
        var vm = this;

        vm.$onInit = function () {

            var service = {
                activate: activate,
                getField: getField,
                getList: getList,
                populateList: populateList,
                toggleSpinner: toggleSpinner,
                spinCounter: spinCounter
            };

            $scope.onChange = onChange;

            activate();

            $scope.$watch("$ctrl.field", function (newValue, oldValue) {
                //$log.debug("field changed from \n" + JSON.stringify(oldValue) + " to \n" + JSON.stringify(newValue));
                vm.field = newValue;
            }, true /* deep watch */); // $watch

            if (vm.watchForWorkIdChange) {
                $scope.$watch(angular.bind(workitemdata, function () {
                    return this.workId;
                }),
                    function (newVal, oldVal) {
                        if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {
                            getField(newVal, vm.taskId, vm.fieldId);
                        }
                    }, true);
            }

            $scope.$watch(angular.bind(vm.workId, function () {
                return vm.workId;
            }),
                function (newVal, oldVal) {
                    if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {
                        $scope.workId = newVal;
                        getField(newVal, vm.taskId, vm.fieldId);
                    }
                }, true);

            $scope.$watch(angular.bind(vm.fieldId, function () {
                return vm.fieldId;
            }),
                function (newVal, oldVal) {
                    if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {
                        $scope.fieldId = newVal;
                        if (!vm.workId) return;
                        $scope.field = null;
                        getField(vm.workId, vm.taskId, newVal);
                    }
                }, true);

            return service;

        };

        // ReSharper disable once JsUnreachableCode
        /*eslint no-unreachable: "error"*/
        var spinCounter = 0;

        function activate() {
            $scope.workId = vm.workId;
            $scope.taskId = vm.taskId;

            if (vm.fieldIn) {
                $scope.field = vm.fieldIn;
                checkDefaults();
                populateList();
            }
            else
                getField(vm.workId, vm.taskId, vm.fieldId);
        }

        function onChange(field) {
            var fieldkey = field.workFieldId;

            var eventData = {
                "workId": $scope.workId, "taskId": $scope.taskId, "field": field
            };

            e5EventhubService.broadcast('field', 'onChange', fieldkey, eventData, null);
        }



        function getField(workId, taskId, fieldId) {

            if (!workId || !fieldId) {
                return;
            }

            toggleSpinner(1);

            fielddata.getField(workId, taskId, undefined, undefined, fieldId)
                .then(
                function (fieldResponse) {
                    //Fields
                    var data = fieldResponse.data;
                    if (fieldId.length > 0) {
                        $scope.field = data[0];

                        checkDefaults();
                        populateList();
                    }
                },
                function (response) {
                    // failure callback
                    ngToast.danger({
                        content: $translate.instant('Failed to get field values')
                    });
                }).finally(function () {
                    toggleSpinner(-1);
                });


        }


        function checkDefaults() {
            if (!$scope.field) return;

            if ($scope.field.resolvedValue === "" && $scope.field.value === null && $scope.field.defaultValue !== null) {
                $scope.field.resolvedValue = $scope.field.defaultValue;
            }
        }

        function populateList() {
            if (!$scope.field) return;

            var field = $scope.field;
            if (field.fieldDataType === 7) {

                if (field.workFieldId === "Category1_Id")
                    getList(String.format(endpoints.categorisationGetCategory1Route, true) + "&fieldId=" + field.workFieldId, field.value);
                else if (field.workFieldId === "Category2_Id")
                    getList(String.format(endpoints.categorisationGetCategory2Route, $rootScope.category1Id, true) + "&fieldId=" + field.workFieldId, field.value);
                else if (field.workFieldId === "Category3_Id")
                    getList(String.format(endpoints.categorisationGetCategory3Route, $rootScope.category2Id, true) + "&fieldId=" + field.workFieldId, field.value);
                else
                    getList(String.format(endpoints.fieldGetListItemsRoute, field.listId, '', '') + "&fieldId=" + field.workFieldId, field.value);
            }
        }

        //Get the lists and start populating them
        function getList(listRoute, selectedItemValue) {

            toggleSpinner(1);

            // PF : Extracted from getListsData
            $http.get(util.addCacheBusterParam(listRoute), { withCredentials: true })
                .then(function (response) {
                    //Use ClientSide filtering
                    //get the fieldId from the config url
                    var url = response.config.url;
                    var fieldId = queryStringParam("fieldId", url);
                    var valueField = "id"

                    var listData;
                    if (url.indexOf('GetCategory1') !== -1) {
                        listData = response.data;
                        fieldId = "Category1_Id"
                        valueField = "categoryId"
                    }
                    else if (url.indexOf('GetCategory2') !== -1) {
                        listData = response.data;
                        fieldId = "Category2_Id"
                        valueField = "categoryId"
                    }
                    else if (url.indexOf('GetCategory3') !== -1) {
                        listData = response.data;
                        fieldId = "Category3_Id"
                        valueField = "categoryId"
                    }
                    else {
                        listData = response.data.items
                    }

                    var dropdown = $("#" + fieldId)
                        .kendoDropDownList({
                            optionLabel: " ",
                            filter: "contains",
                            dataSource: listData,
                            dataTextField: "name",
                            dataValueField: valueField,
                            value: selectedItemValue,
                            dataBound: adjustDropDownWidth
                        });

                    //This is required to adjust the width of the list to prevent wrapping of wide list items
                    function adjustDropDownWidth(e) {
                        var listContainer = e.sender.list.closest(".k-list-container");
                        listContainer.width(listContainer.width() + 50);
                    }

                    //ServerSide with ODATA - needs support for ODATA webapi route
                    //$("#" + response.data.code).kendoDropDownList({
                    //    filter: "contains",
                    //    dataTextField: "text",
                    //    dataValueField: "value",
                    //    dataSource: {
                    //        type: "json",
                    //        serverFiltering: true,
                    //        filter: { field: "text", operator: "contains" },
                    //        transport: {
                    //            read: {
                    //                url: String.format(Routes.listfilteredroute,response.data.id, filterValue)
                    //            }
                    //        },
                    //        schema: {
                    //            type: "json",
                    //            data: "items"
                    //        }
                    //    }
                    //});
                }).finally(function () {
                    toggleSpinner(-1);
                });
        }

        //Show the spinner if the counter goes from 0 to 1
        //Hide the spinner if the counter goes from 1 to 0
        function toggleSpinner(counterIncrementDecrement) {
            if (typeof spinCounter === 'undefined')
                spinCounter = 0;

            spinCounter = spinCounter + counterIncrementDecrement;

            if (counterIncrementDecrement === 1 && spinCounter === 1) {
                if (!$("[ng-controller]")) return;
                kendo.ui.progress($("[ng-controller]"), true);
            }
            if (counterIncrementDecrement === -1 && spinCounter === 0) {
                if (!$("[ng-controller]")) return;
                kendo.ui.progress($("[ng-controller]"), false);
            }
        }

    }

})();
/**
* @file e5 FieldSet Component
* @copyright e5 anywhere - e5 Workflow Pty Ltd
*/
(function () {
    //'use strict';

    /**
    * @name e5FieldSetComponent
    * @desc Displays a FieldSet 
    * @property {string} watchForWorkIdChange Whether to watch for a workitemdata.workId change and refresh value.
    * @property {string} fieldSetType The field set type - task or work - defaults to work. If task then taskId is required.
    * @property {string} workId The work id.
    * @property {string} taskId The task id.
    * @property {string} fieldSetId The field set id.
    */
    angular.module('e5Anywhere')
        .component('e5FieldSet', {
            transclude: true,
            bindings: {
                watchForWorkIdChange: '@',
                fieldSetType: '=',
                workId: '=',
                taskId: '=',
                fieldSetId:'='
            },
            template: '<div class="fields" style="padding:0 15px 10px 0" ng-repeat="field in fields">'
            + ' <e5-field field-in="field"></e5-field>'
            +'</div>',
            controller: e5FieldSetController
        });

    e5FieldSetController.$inject = ['$scope', '$rootScope', 'fielddata', 'workitemdata', 'ngToast', '$translate'];

    function e5FieldSetController($scope, $rootScope, fielddata, workitemdata, ngToast, $translate) {
        var vm = this;
        
        vm.$onInit = function () {

            var service = {
                activate: activate,
                getFields: getFields,
                toggleSpinner: toggleSpinner,
                spinCounter: spinCounter
            };
            
            activate();

            if (vm.watchForWorkIdChange) {
                $scope.$watch(angular.bind(workitemdata, function () {
                    return this.workId;
                }),
                    function (newVal, oldVal) {
                        if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {

                            getFields(newVal, vm.taskId, vm.fieldSetId);
                        }
                    }, true);
            }

            $scope.$watch(angular.bind(vm.workId, function () {
                return vm.workId;
            }),
                function (newVal, oldVal) {
                    if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {
                        $scope.workId = newVal;
                        getFields(newVal, vm.taskId, vm.fieldSetId);
                    }
                }, true);

            $scope.$watch(angular.bind(vm.taskId, function () {
                return vm.taskId;
            }),
                function (newVal, oldVal) {
                    if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {
                        $scope.taskId = newVal;
                        getFields(vm.workId, newVal, vm.fieldSetId);
                    }
                }, true);

            $scope.$watch(angular.bind(vm.fieldSetId, function () {
                return vm.fieldSetId;
            }),
                function (newVal, oldVal) {
                    if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {
                        $scope.fieldSetId = newVal;
                        getFields(vm.workId, vm.taskId, newVal);
                    }
                }, true);

            $scope.$watch(angular.bind(vm.fieldSetType, function () {
                return vm.fieldSetType;
            }),
                function (newVal, oldVal) {
                    if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {
                        $scope.fieldSetType = newVal;
                        if ($scope.fieldSetType == "task")
                            $scope.taskIdRequired = true;
                        else
                            $scope.taskIdRequired = false;

                        getFields(vm.workId, vm.taskId, newVal);
                    }
                }, true);

            return service;

        };

        // ReSharper disable once JsUnreachableCode
        /*eslint no-unreachable: "error"*/
        var spinCounter = 0;

        function activate() {
            $scope.workId = vm.workId;
            $scope.taskId = vm.taskId;
            $scope.fieldSetId = vm.fieldSetId;

            if (vm.fieldSetType == "task")
                $scope.taskIdRequired = true;
            else
                $scope.taskIdRequired = false;

            getFields(vm.workId, vm.taskId, vm.fieldSetId);
        }
        
        function getFields(workId, taskId, fieldSetId) {

            $scope.fields = [];

            if (!workId) return;

            if (!$scope.taskIdRequired && !fieldSetId) return; //If fieldSetType == "work" then there can be only one fieldset, so fieldsetId is optional
            if ($scope.taskIdRequired && !taskId) return; 
            
            if (!taskId) taskId = '';
            if (!fieldSetId) fieldSetId = '';

            toggleSpinner(1);

            fielddata.getField(workId, taskId, undefined, fieldSetId)
                .then(
                function (fieldResponse) {
                    //Fields
                    $scope.fields = fieldResponse.data;
                },
                function (response) {
                    // failure callback
                    ngToast.danger({
                        content: $translate.instant('Failed to get field values')
                    });
                }).finally(function () {
                    toggleSpinner(-1);
                });
            
        }
        
    
        //Show the spinner if the counter goes from 0 to 1
        //Hide the spinner if the counter goes from 1 to 0
        function toggleSpinner(counterIncrementDecrement) {
            if (typeof spinCounter === 'undefined')
                spinCounter = 0;

            spinCounter = spinCounter + counterIncrementDecrement;

            if (counterIncrementDecrement === 1 && spinCounter === 1) {
                if (!$("[ng-controller]")) return;
                kendo.ui.progress($("[ng-controller]"), true);
            }
            if (counterIncrementDecrement === -1 && spinCounter === 0) {
                if (!$("[ng-controller]")) return;
                kendo.ui.progress($("[ng-controller]"), false);
            }
        }

    }

})();
/**
* @file e5 Form Component
* @copyright e5 anywhere - e5 Workflow Pty Ltd
*/
(function () {
    //'use strict';
    var templateUrl = "";
    $('script').each(function () {
        if (this.src.length < 200 && this.src.indexOf('/dist/js/e5anywhere.angular.all.js') !== -1) { //dist
            templateUrl = this.src.replace('/js/e5anywhere.angular.all.js', '/templates/e5.task.template.html');
            return false;
        }
        if (this.src.length < 200 && this.src.indexOf('/conversation/e5.conversation.view.component.js') !== -1) { //debug
            templateUrl = this.src.replace('e5.task.component.js', 'e5.task.template.html');
            return false;
        }
    });

    if (templateUrl === "")
        templateUrl = "/Web/dist/templates/e5.task.template.html";

    /**
    * @name e5TaskComponent
    * @desc Displays the task fields with a task panel for completed and due tasks.
    * @property {string} showclassification Shows the classification dropdowns. Default is false.
    * @property {string} getnextredirect If true, it will do a page redirect with the workId in the URL. Default is false.
    * @property {string} workIdIn If bound it will display this workId's tasks.
    * @property {string} taskIdIn If bound it will display this task.
    * @property {string} hideTaskPanel If true it will hide the list of tasks and only show the current task.
    */
    angular.module('e5Anywhere')
        .filter("trust", ['$sce', function ($sce) {
            return function (htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            };
        }])
        .component('e5Task', {
            transclude: true,
            bindings: {
                watchForWorkIdChange: '@',
                showclassification: '@',
                getnextredirect: '@',
                workIdIn: '=workId',
                taskIdIn: '=taskId',
                hideTaskPanel: '@'
            },
            templateUrl: templateUrl,
            controller: e5TaskController
        });

    e5TaskController.$inject = ['$scope', '$rootScope', '$http', '$location', 'taskdata', 'fielddata', 'workitemdata', 'ngToast', '$translate', '$element', '$attrs', 'e5Endpoints', 'e5UtilsService'];

    function e5TaskController($scope, $rootScope, $http, $location, taskdata, fielddata, workitemdata, ngToast, $translate, $element, $attrs, endpoints, util) {
        var vm = this;

        vm.$onInit = function () {
            var service = {
                activate: activate,
                saveTask: saveTask,
                completeTask: completeTask,
                workItemUnlock: workItemUnlock,
                onPanelItemSelect: onPanelItemSelect,
                getNextWorkId: getNextWorkId,
                getAllTasks: getAllTasks,
                getTaskAndFields: getTaskAndFields,
                getKeyValueChanges: getKeyValueChanges,
                toggleSpinner: toggleSpinner,
                spinCounter: spinCounter
            };

            activate();

            $scope.hidetaskpanel = (typeof hideTaskPanel !== 'undefined' && hideTaskPanel);
            $scope.classificationDataLoaded = false;

            $scope.saveTaskOnClick = saveTask;
            $scope.completeTaskOnClick = completeTask;
            $scope.getNextOnClick = getNextWorkId;

            //Expose methods and objects on the parent scope (
            if ($scope.$parent) {
                $scope.$parent.saveTaskOnClick = saveTask;
                $scope.$parent.completeTaskOnClick = completeTask;
                $scope.$parent.task = $scope.task;
            }

            if ($attrs.watchForWorkIdChange) {
                $scope.$watch(angular.bind(workitemdata, function () {
                    return this.workId;
                }),
                    function (newVal, oldVal) {
                        if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {
                    getAllTasks();
                        }
                    }, true);
            }

            window.onbeforeunload = function (event) {
                //Check if there are any changes, if no changes, then simply let the user leave
                if (!$scope.e5TaskForm.$dirty) {
                    return;
                }

                var message = $translate.instant('If you leave this page you will lose all unsaved changes, are you sure you want to leave?');
                if (typeof event === 'undefined') {
                    event = window.event;
                }
                if (event) {
                    event.returnValue = message;
                }

                return message;
            };

            window.onunload = function (event) {
                //Already checked if we should prevent navigation - unlock and navigate away
                workItemUnlock(true);
            };

            //Unregister the onbeforeunload event when the controller goes out of scope
            $scope.$on('$destroy', function () {
                delete window.onbeforeunload;
            });

            return service;
        };
        //Dummy data:
        //$scope.task = [{"workTaskId": 29, "assignedDate": null, "assignedUser": null, "category1Id": 7, "category2Id": 16, "category3Id": 15, "categoryActivityId": null, "completionDate": null, "completionUser": "", "description": "1. Has all the information been provided? Use Find to check for duplicate RFQs from this broker", "enableActivityPostProcessor": false, "id": "4fb07ed8-661a-43f7-ad7f-f7257e6766c1", "indexId": 16, "knowledgeBaseUrl": "", "menuId": 13, "prescription": 0, "prescriptionDate": "2016-10-19T15:19:21.317", "prescriptionUser": "DATARACT2\esaunders", "process": 1, "attributes": [{ "code": "task", "dataType": 0, "taskAttributeId": 29, "displayLabel": "TaskID_CustomAttribute", "sortOrder": 0, "value": "This is custom attribute." }], "slaMinutes": 40, "sortOrder": 1, "templateFolder": "", "type": 1, "name": "ID", "slaExpiryDate": "2016-10-19T15:59:21.317", "status": 1, "workId": "31b4b361-95b3-11e6-8112-00155d2a9f00" }];
        //$scope.fields = [{ "workFieldId": "ReqFormComplete", "tabId": null, "zoneId": "null", "fieldDataType": 14, "dataEndPoint": null, "label": "Form Complete?", "tooltip": null, "description": null, "value": "False", "resolvedValue": "False", "defaultValue": null, "styles": null, "cssClass": null, "labelCssClass": null, "fieldCssClass": null, "attributes": null, "isExportable": false, "isReadOnly": false, "isRequired": false, "maxLength": 50, "pattern": null, "rangeMinimum": null, "rangeMaximum": null, "validationMessage": null, "placeholder": null, "image": null, "condition": null, "onChange": null, "onClick": null }
        //    , { "workFieldId": "ReqDuplicate", "tabId": null, "zoneId": "null", "fieldDataType": 14, "dataEndPoint": null, "label": "Duplicate RFQ check done", "tooltip": null, "description": null, "value": "False", "resolvedValue": "False", "defaultValue": null, "styles": null, "cssClass": null, "labelCssClass": null, "fieldCssClass": null, "attributes": null, "isExportable": false, "isReadOnly": false, "isRequired": false, "maxLength": 50, "pattern": null, "rangeMinimum": null, "rangeMaximum": null, "validationMessage": null, "placeholder": null, "image": null, "condition": null, "onChange": null, "onClick": null }
        //    , { "workFieldId": "Address2", "tabId": null, "zoneId": "null", "fieldDataType": 1, "dataEndPoint": null, "label": "Address", "tooltip": "66", "description": null, "value": "123", "resolvedValue": "123", "defaultValue": "123", "styles": "77", "cssClass": null, "labelCssClass": null, "fieldCssClass": "cssclass", "attributes": null, "isExportable": false, "isReadOnly": false, "isRequired": true, "maxLength": 55, "pattern": "^$|^[0-9]{1,5}$", "rangeMinimum": null, "rangeMaximum": null, "validationMessage": "Please enter a valid amount from 0 to 99999", "placeholder": "66", "image": null, "condition": null, "onChange": null, "onClick": null }, { "workFieldId": "RFQBroker", "tabId": null, "zoneId": "null", "fieldDataType": 8, "dataEndPoint": null, "label": "Broker", "tooltip": "Enter the Broker", "description": null, "value": "1", "resolvedValue": "1", "defaultValue": "", "styles": null, "cssClass": null, "labelCssClass": null, "fieldCssClass": null, "attributes": null, "isExportable": false, "isReadOnly": true, "isRequired": false, "maxLength": 50, "pattern": null, "rangeMinimum": null, "rangeMaximum": null, "validationMessage": null, "placeholder": "Enter the Broker", "image": null, "condition": null, "onChange": null, "onClick": null }, { "workFieldId": "e5_Lookup", "tabId": null, "zoneId": "null", "fieldDataType": 8, "dataEndPoint": null, "label": "e5 Lookup", "tooltip": null, "description": null, "value": "31b4b361-95b3-11e6-8112-00155d2a9f00", "resolvedValue": "3831", "defaultValue": "", "styles": null, "cssClass": null, "labelCssClass": null, "fieldCssClass": null, "attributes": null, "isExportable": false, "isReadOnly": false, "isRequired": false, "maxLength": 50, "pattern": null, "rangeMinimum": null, "rangeMaximum": null, "validationMessage": null, "placeholder": null, "image": null, "condition": null, "onChange": null, "onClick": null }, { "workFieldId": "MultiKeyLookup", "tabId": null, "zoneId": "null", "fieldDataType": 8, "dataEndPoint": null, "label": "MultiKey Lookup", "tooltip": null, "description": null, "value": null, "resolvedValue": "", "defaultValue": "", "styles": null, "cssClass": null, "labelCssClass": null, "fieldCssClass": null, "attributes": null, "isExportable": false, "isReadOnly": false, "isRequired": false, "maxLength": 50, "pattern": null, "rangeMinimum": null, "rangeMaximum": null, "validationMessage": null, "placeholder": null, "image": null, "condition": null, "onChange": null, "onClick": null }, { "workFieldId": "MultiKeyLOB1", "tabId": null, "zoneId": "null", "fieldDataType": 8, "dataEndPoint": null, "label": "MultiKey LOB1", "tooltip": null, "description": null, "value": "", "resolvedValue": "", "defaultValue": "", "styles": null, "cssClass": null, "labelCssClass": null, "fieldCssClass": null, "attributes": null, "isExportable": false, "isReadOnly": false, "isRequired": false, "maxLength": 50, "pattern": null, "rangeMinimum": null, "rangeMaximum": null, "validationMessage": null, "placeholder": null, "image": null, "condition": null, "onChange": null, "onClick": null }
        //    , { "workFieldId": "Date", "tabId": null, "zoneId": "null", "fieldDataType": 2, "dataEndPoint": null, "label": "Date", "tooltip": null, "description": null, "value": "13/12/2016", "resolvedValue": "13/12/2016", "defaultValue": null, "styles": null, "cssClass": null, "labelCssClass": null, "fieldCssClass": null, "attributes": null, "isExportable": false, "isReadOnly": false, "isRequired": false, "maxLength": null, "pattern": null, "rangeMinimum": null, "rangeMaximum": null, "validationMessage": null, "placeholder": null, "image": null, "condition": null, "onChange": null, "onClick": null }
        //    , { "workFieldId": "DateTime", "tabId": null, "zoneId": "null", "fieldDataType": 11, "dataEndPoint": null, "label": "DateTime", "tooltip": null, "description": null, "value": "13/12/2016 11:42 AM", "resolvedValue": "13/12/2016 11:42 AM", "defaultValue": null, "styles": null, "cssClass": null, "labelCssClass": null, "fieldCssClass": null, "attributes": null, "isExportable": false, "isReadOnly": false, "isRequired": false, "maxLength": null, "pattern": null, "rangeMinimum": null, "rangeMaximum": null, "validationMessage": null, "placeholder": null, "image": null, "condition": null, "onChange": null, "onClick": null }
        //    , { "workFieldId": "NewList", "tabId": null, "zoneId": "null", "fieldDataType": 7, "listId": 19, "lookupId": 0, "dataEndPoint": null, "label": "New List", "tooltip": null, "description": null, "value": "65", "resolvedValue": "Item1", "defaultValue": null, "styles": null, "cssClass": null, "labelCssClass": null, "fieldCssClass": null, "attributes": null, "isExportable": false, "isReadOnly": false, "isRequired": false, "maxLength": null, "pattern": null, "rangeMinimum": null, "rangeMaximum": null, "validationMessage": null, "placeholder": null, "image": null, "condition": null, "onChange": null, "onClick": null }];

        //Toggle debug info
        //$(document).ready(function () {
        //    $("body").dblclick(function () {
        //        if ($('#debuginfo').is(":visible"))
        //            $('#debuginfo').fadeOut();
        //        else
        //            $('#debuginfo').fadeIn();
        //    });
        //});


        // ReSharper disable once JsUnreachableCode
        /*eslint no-unreachable: "error"*/
        var spinCounter = 0;
        var myWorkId = "";
        var taskId = "";

        function activate() {
            if (typeof workitemdata.workId !== 'undefined' && workitemdata.workId !== "") {
                myWorkId = workitemdata.workId;
            }

            if (typeof $scope.taskIdIn !== 'undefined' && $scope.taskIdIn !== "") {
                taskId = $scope.taskIdIn;
            }

            spinCounter = 0;
            if (queryStringParam('GetNext') === '1' || workitemdata.isGetNext)
                $scope.isGetNext = true;
            else
                $scope.isGetNext = false;

            if (myWorkId === '' || $scope.isGetNext) {
                getNextWorkId();
            }
            else if (typeof $scope.taskIdIn === 'undefined') {
                //Get all task data from work item from WebApi, then load the due task's details
                getAllTasks();
            } else {
                //Get task and field data from the WebApi
                $scope.hidetaskpanel = true;
                getTaskAndFields();
            }
        }

        function saveTask() {

            if (!$scope.e5TaskForm.$valid) {
                return;
            }

            //Get just the changed values
            var changes = getKeyValueChanges();
            var data = JSON.stringify(changes);

            toggleSpinner(1);

            var workId = $scope.workIdIn || myWorkId;
            taskdata.save(workId, $scope.task.id, data).then(
                function (response) {
                    // success callback
                    $scope.e5TaskForm.$setPristine();
                    getAllTasks();
                },
                function (response) {
                    // failure callback
                    ngToast.danger({
                        content: $translate.instant('Failed to save field values')
                    });
                }
                ).finally(function () {
                    toggleSpinner(-1);
                });

        }


        function completeTask() {
            if (!$scope.e5TaskForm.$valid) {
                return;
            }

            var changes = getKeyValueChanges();
            var data = JSON.stringify(changes);

            toggleSpinner(1);

            var workId = $scope.workIdIn || myWorkId;
            taskdata.complete(workId, $scope.task.id, data)
           .then(
               function (response) {
                   // success callback
                   var closeWorkItem = response.data;
                   if (!closeWorkItem || !$scope.isGetNext) //Stay on this work item
                       getAllTasks();
                   else { //if GetNext and closeWorkItem = true then GetNext.

                       var previousWorkItemId = $scope.task.workId;

                       //Unlock previous work item
                       workItemUnlock();

                       getNextWorkId();

                       if (previousWorkItemId !== workitemdata.workId) {

                           //Refresh URL
                           if (typeof $attrs.getnextredirect !== 'undefined' && $attrs.getnextredirect === "true") {
                               var newUrl = setNewQueryStringParam(window.location.href, 'workId', workitemdata.workId);
                               newUrl = setNewQueryStringParam(newUrl, 'GetNext', '1');
                               window.location.replace(newUrl);
                           }
                       }

                       //refresh the tasks if same work item or Refresh URL hasn't fired.
                       getAllTasks();
                   }
               },
               function (response) {
                   // failure callback
                   ngToast.danger({
                       content: $translate.instant('Failed to complete task')
                   });
               }
            ).finally(function () {
                toggleSpinner(-1);
            });
        }


        function workItemUnlock(fireInOnUnload) {
            if (!fireInOnUnload) {
                workitemdata.unlock(myWorkId)
                    .then(
                        function (response) {
                            // success callback
                        },
                        function (response) {
                            // failure callback
                            ngToast.danger({
                                content: $translate.instant('Error while unlocking the work item')
                            });
                        }
                    );
            } else {

                //OnUnload: We have to use a synchronous call
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open("PUT", String.format(endpoints.workitemUnlockRoute, myWorkId), false); //the false is for making the call synchronous
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send('{}');
            }
        }


        function onPanelItemSelect(e) {
            taskId = $(e.item).children().children('.panelItemTaskLink').attr('task-id');
            if (typeof taskId === 'undefined')
                return;

            if ($scope.selectedTaskId === taskId)
                return;

            $scope.selectedTaskId = taskId;
            
            $scope.tasks.forEach(function (task) {
                if (task.id === taskId) {
                    $scope.task = task;
                    if ($scope.$parent) { $scope.$parent.task = $scope.task; }
                    $scope.taskDescription = $scope.task.description;
                    $scope.$apply();
                }
            });
            
        }

        function getNextWorkId() {

            toggleSpinner(1);

            // ES: Please Review
            workitemdata.getNext()
                .then(function (response) {
                    myWorkId = response.data;
                    workitemdata.workId = myWorkId;
                    getAllTasks();
                },
                function (response) {
                    // failure callback
                    ngToast.danger({
                        content: $translate.instant('Failed to get next work item')
                    });
                }).finally(function () {
                    toggleSpinner(-1);
                });
        }

        function getAllTasks() {
            $scope.hasDueTasks = false;
            $scope.taskDescription = "";

            toggleSpinner(1);

            taskdata.getTasks($scope.workIdIn || myWorkId, false /* nolock */) // workIdIn : binding orverrides 
                .then(function (response) {
                    //Tasks
                    $scope.tasks = response.data;

                    var firstDueTask = null;
                    $scope.dueTasks = [];
                    $scope.completeTasks = [];

                    $scope.tasks.forEach(function (task) {
                        if (task.completionDate === null) {
                            if (firstDueTask === null) {
                                firstDueTask = task.id;
                                $scope.task = task;
                                if ($scope.$parent) { $scope.$parent.task = $scope.task; }
                                $scope.taskDescription = task.description; $scope.taskDescription = task.description;
                            }

                            $scope.dueTasks.push({
                                "encoded": false,
                                "text": "<span class='panelItemTaskLink' task-id='" +
                                    task.id +
                                    "'>" +
                                    task.name +
                                    "</span>"
                            });
                        } else
                            $scope.completeTasks.push({
                                "encoded": false,
                                "text": "<span class='panelItemTaskLink' task-id='" +
                                    task.id +
                                    "'>" +
                                    task.name +
                                    "</span>"
                            });

                        taskId = task.id;
                    });

                    if (firstDueTask !== null) {
                        taskId = firstDueTask;
                        $scope.hasDueTasks = true;
                    } else {
                        $scope.hasDueTasks = false; //No due tasks - Don't allow save/complete
                        $scope.taskDescription = $translate.instant('Thank you. Your claim has been received and we will process it soon.');
                        $scope.task = null;
                        $scope.fields = null;
                    }


                    $("#taskPanelBar")
                        .kendoPanelBar({
                            //select: onPanelItemSelect, //Don't bind select here as it will fire for each panel item while loading.
                            dataSource: [
                                {
                                    text: $translate.instant('Complete'),
                                    expanded: !$scope.hasDueTasks, //Expand if no due tasks
                                    items: $scope.completeTasks
                                },
                                {
                                    text: $translate.instant('Due'),
                                    expanded: true,
                                    items: $scope.dueTasks
                                }
                            ]
                        });

                    if ($scope.task) {
                        $scope.classification = {
                            "category1Id": $scope.task.category1Id,
                            "category2Id": $scope.task.category2Id,
                            "category3Id": $scope.task.category3Id
                        };
                    } else
                        $scope.classification = { "category1Id": 0, "category2Id": 0, "category3Id": 0 };

                    $scope.classificationDataLoaded = true;
                }).finally(function () {
                    toggleSpinner(-1);

                    //After load, enable panelbar select	
                    var panelBar = $("#taskPanelBar").data("kendoPanelBar");
                    if (panelBar)
                        panelBar.bind("select", onPanelItemSelect);
                    
                    if (!$scope.hasDueTasks) {
                        workItemUnlock(); //unlock when done.

                        //TODO: Add work item status to task description detail if not active
                        //$scope.taskDescription
                    }
    
                });

        }

        function getTaskAndFields() {

            toggleSpinner(1);

            // PF: Extracted from old getTaskAndFieldData($scope.task.id)
            var $q = angular.injector(['ng']).get('$q');
            var workId = $scope.workIdIn || myWorkId ;
            if(!taskId) return;

            var requests = [
                taskdata.getTask(workId, taskId, true /* lock */)
            ] ;
            $q.all(requests)
                .then(function (responses) {
                    responses.forEach(function (response) {
                        if (response.config.url.indexOf('/Task') !== -1) {
                            //Tasks
                            $scope.tasks = response.data;
                        } 
                    });

                    $scope.task = $scope.tasks[0];
                    if ($scope.$parent) { $scope.$parent.task = $scope.task; }
                    $scope.taskDescription = $scope.task.description;

                    $scope.classification = {
                        "category1Id": $scope.task.category1Id,
                        "category2Id": $scope.task.category2Id,
                        "category3Id": $scope.task.category3Id
                    };

                    $scope.classificationDataLoaded = true;

                    //We have the fields, check if there are lists and populate their data
                    populateLists();
                }).finally(function () {
                    toggleSpinner(-1);
                });
        }
        

        function getKeyValueChanges() {

            var fieldData = {};

            angular.forEach($scope.e5TaskForm.$$controls, function (value, key) {
                if (typeof value === 'object' && value.$dirty) {
                    var fieldkey = value.$$element[0].id;
                    var fieldvalue = value.$viewValue;

                    fieldData[fieldkey] = fieldvalue;
                }
            });
            
            return fieldData;
        }

        //Show the spinner if the counter goes from 0 to 1
        //Hide the spinner if the counter goes from 1 to 0
        function toggleSpinner(counterIncrementDecrement) {
            if (typeof spinCounter === 'undefined')
                spinCounter = 0;

            spinCounter = spinCounter + counterIncrementDecrement;

            if (counterIncrementDecrement === 1 && spinCounter === 1) {
                if (!$("[ng-controller]")) return;
                kendo.ui.progress($("[ng-controller]"), true);
            }
            if (counterIncrementDecrement === -1 && spinCounter === 0) {
                if (!$("[ng-controller]")) return;
                kendo.ui.progress($("[ng-controller]"), false);
            }
        }

    }


})();
/*eslint eqeqeq: ["error", "ignore"]*/
(function () {

    var templateUrl = "";
    $('script').each(function () {
        if (this.src.length < 200 && this.src.indexOf('/dist/js/e5anywhere.angular.all.js') !== -1) { //dist
            templateUrl = this.src.replace('/js/e5anywhere.angular.all.js', '/templates/conversation.view.template.html');
            return false;
        }
        if (this.src.length < 200 && this.src.indexOf('/conversation/e5.conversation.view.component.js') !== -1) { //debug
            templateUrl = this.src.replace('e5.conversation.view.component.js', 'conversation.view.template.html');
            return false;
        }
    });

    if (templateUrl === "")
        templateUrl = "/Web/dist/templates/conversation.view.template.html";

    angular.module("e5Anywhere")
        .component("e5ConversationView", {
            bindings: { 
                workId: "=" // work-id
            },
            templateUrl: templateUrl,
            controller: e5ConversationViewController
        });


    e5ConversationViewController.$inject = ['$sce', '$scope', '$timeout', '$rootScope', '$http', 'e5Config', '$location', 'e5UtilsService', 'settingsdata', 'conversationdata', 'ngToast', '$translate', '$element', '$attrs', 'e5Endpoints', '$sessionStorage'];

    //function e5ConversationViewController($sce, $http) {
    function e5ConversationViewController($sce, $scope, $timeout, $rootScope, $http, e5Config, $location, e5UtilsService, settingsdata, conversationdata, ngToast, $translate, $element, $attrs, endpoints, $sessionStorage) {

        var model = this;
        var workId = "";
        var localStorageCurrentWork;
        model.conversations = null;

        model.newConversationOnClick = newConversation;
        model.newYammerPostOnClick = newYammerPostOnClick;
        model.refreshComponentClick = refreshComponent;
        model.replyEmailOnClick = replyEmail;
        model.trustHtml = trustHtml;
        model.AttachmentViewerUrl = AttachmentViewerUrl;

        model.$onInit = function () {

            // Watch for changes in the workId and reload accordingly
            $scope.$watch("$ctrl.workId",
                function(newId, oldId) {
                    if (newId && newId.length === 36 && newId !== oldId) {
                        workId = newId;
                        $scope.workId = newId; //set to scope so that child components will be updated
                        activate();
                    }
                });

            if (this.workId && this.workId.length === 36) {
                workId = this.workId;
            }
            
            $scope.hasYammerFeedSet = function (newVal) {
                $scope.hasYammerFeed = newVal;
            };

            settingsdata.getSiteSettings()
                .then(
                    function(response) {
                        if (typeof response.data !== 'undefined' &&
                            response.data !== null &&
                            response.data.length > 0 &&
                            typeof response.data[0].value !== 'undefined' &&
                            response.data[0].value !== null) {
                            var settings = angular.fromJson(response.data[0].value);
                            if (typeof settings.DefaultFromEmail !== 'undefined' &&
                                settings.DefaultFromEmail !== null)
                                $scope.from = settings.DefaultFromEmail;
                            if (typeof settings.DefaultEmailTemplate !== 'undefined' &&
                                settings.DefaultEmailTemplate !== null)
                                $scope.defaultTemplate = settings.DefaultEmailTemplate;
                            if (typeof settings.ShowYammerInConversationView !== 'undefined' &&
                                settings.ShowYammerInConversationView !== null)
                                $scope.ShowYammerInConversationView = settings.ShowYammerInConversationView;


                            //    var settings = angular.fromJson(response.data[0].value);
                            //    if (typeof settings.webApiBase !== 'undefined' && settings.webApiBase !== null)
                            //        e5Config.webApiBase = settings.webApiBase;
                            //    if (typeof settings.e5LegacyBase !== 'undefined' && settings.e5LegacyBase !== null)
                            //        e5Config.e5LegacyBase = settings.e5LegacyBase;

                        }
                    },
                    function(responses) {
                        //No action on error
                    })
                .finally(function() {
                    activate();
                });
        }

        function activate() {
            model.localSettings = {};
            model.localSettings.showNewConversation = false;
            model.localSettings.showNewYammerPost = false;
            
            //e5Email Defaults
            $scope.to = "";
            $scope.from = $scope.from || "esaunders@e5workflow.com";
            $scope.defaultTemplate = $scope.defaultTemplate || "default.xslt";
            if ($scope.defaultTemplateOriginal)
                $scope.defaultTemplate = $scope.defaultTemplateOriginal;

            $scope.cc = "";
            $scope.bcc = "";
            $scope.subject = "";
            $scope.threadId = "";
            $scope.showAttachments = true;
            $scope.showTemplates = true;

            $scope.onSentData = {};

            $scope.dateNow = new Date();

            $scope.onSent = function ($email) {
                localStorageCurrentWork.localSettings.showNewConversation = false;

                localStorageCurrentWork.localSettings.newTo = "";
                localStorageCurrentWork.localSettings.newSubject = "";
                localStorageCurrentWork.localSettings.newBody = "";

                localStorageCurrentWork.localSettings.originalBodyHtml = "";
                localStorageCurrentWork.localSettings.originalBodyHtmlMessageId = "";

                model.localSettings = localStorageCurrentWork.localSettings;

                ngToast.success({
                    content: $translate.instant('Email successfully sent')
                });
            };

            $scope.onReplySent = function (replyMessage) {
                replyMessage.replyBody = "";
                replyMessage.ShowReply = false;

                localStorageCurrentWork.localSettings.newTo = "";
                localStorageCurrentWork.localSettings.newSubject = "";
                localStorageCurrentWork.localSettings.newBody = "";

                localStorageCurrentWork.localSettings.originalBodyHtml = "";
                localStorageCurrentWork.localSettings.originalBodyHtmlMessageId = "";

                model.localSettings = localStorageCurrentWork.localSettings;

                ngToast.success({
                    content: $translate.instant('Email successfully sent')
                });
            };


            $scope.$storage = $sessionStorage;
            if (!workId) {
                workId = e5UtilsService.resolveWorkId();
                $scope.workId = workId;
            }

            if (typeof $scope.$storage.work === 'undefined' || $scope.$storage.work === null) {
                $scope.$storage.work = [{ 'workId': workId }];
            }

            localStorageCurrentWork = $.grep($scope.$storage.work, function (e) { return e.workId == workId; })[0]; //Should be ==, not ===
            if (typeof localStorageCurrentWork === 'undefined' || localStorageCurrentWork === null) {
                $scope.$storage.work.push({ 'workId': workId });
                localStorageCurrentWork = $.grep($scope.$storage.work, function (e) { return e.workId == workId; })[0]; //Should be ==, not ===
            }

            if (typeof localStorageCurrentWork.localSettings !== 'undefined' && localStorageCurrentWork.localSettings !== null) {
                model.localSettings = localStorageCurrentWork.localSettings;
                if (!$scope.defaultTemplateOriginal)
                    $scope.defaultTemplateOriginal = $scope.defaultTemplate; //Remember original default template for refresh

                $scope.defaultTemplate = "";
            }

            if (typeof localStorageCurrentWork.conversations !== 'undefined' && localStorageCurrentWork.conversations !== null) {
                model.conversations = localStorageCurrentWork.conversations;

                //check for changes in the message count
                conversationdata.getConversation(workId)
                .then(
                    function (response) {
                        var newData = response.data.conversations;
                        if (model.conversations || newData)
                            refreshComponent();
                        else if (model.conversations.length !== newData.length) {
                            refreshComponent();
                            ngToast.info({
                                content: $translate.instant('New message found - Refreshing conversation')
                            });
                        } else {
                            for (var k = 0; k < newData.length; k++) {
                                if (model.conversations[k].messages.length !== newData[k].messages.length) {
                                    refreshComponent();
                                    ngToast.info({
                                        content: $translate.instant('New message found - Refreshing conversation')
                                    });
                                }
                            }
                        }
                    },
                    function (response) {
                        //No action on error
                    })
                .finally(function () {
                });

            }
            else {

                conversationdata.getConversation(workId)
                    .then(
                        function (response) {
                            model.conversations = response.data.conversations;
                            localStorageCurrentWork.conversations = model.conversations;
                            //$scope.$apply();
                        },
                        function (response) {
                            // failure callback
                            ngToast.danger({
                                content: $translate.instant('Failed to get conversation data')
                            });
                        })
                    .finally(function () {
                        //toggleSpinner(-1);
                        //wait for settle time, then check images.
                        setTimeout(function () { insertInlineImages(); }, 500);
                    });
            }

        }

        function refreshComponent() {
            localStorageCurrentWork.conversations = null;
            localStorageCurrentWork.localSettings = null;
            activate();
        }

        function trustHtml(html) {
            return $sce.trustAsHtml(html);
        }
        


        function FixImageWidth(bodyhtml) {

            try {
                var $newBody = $(bodyhtml);
                $newBody.find('img')
                    .each(function (index) {

                        if (typeof $(this).attr("width") !== 'undefined' && $(this).attr("width") !== null) {
                            var originalWidth = $(this).attr("width");
                            if (originalWidth && originalWidth.indexOf("px") === -1)
                                originalWidth = originalWidth + "px";

                            $(this).removeAttr("width");
                            $(this).removeAttr("height");
                            $(this).css({ "height": "", "width": "100%", "max-width": originalWidth });
                        }
                    });

                return $newBody.wrapAll($('<div/>')).parent().html();
                //return $newBody.html();
            } catch (err) {
                return bodyhtml;
            }
        }

        function stripData(bodyhtml) {
            try {
                return bodyhtml.replace(/!important/gi, "");
            } catch (err) {
                return bodyhtml;
            }
        }

        function ExtractImageIdentifiers(bodyhtml) {
            var imgIndentifiers = [];

            $(bodyhtml).find('img').each(function (index) {
                if ($(this).attr("src") && $(this).attr("src").indexOf("cid:") !== -1)
                    imgIndentifiers.push($(this).attr("src"));
            });

            return imgIndentifiers;
        }

        function ReplaceBodyWithBase64Images(bodyHtml, bodyMhtml) {
            //image001.jpg@01D1EF03.91CC22F0    

            var cidImageData = getCidImageData(bodyHtml, bodyMhtml);

            for (var k = 0; k < cidImageData.length; k++) {
                if (cidImageData[k].data.length > 0) {
                    bodyHtml = bodyHtml.replace(new RegExp("src='" + cidImageData[k].cid, 'gi'), "originalCid='" + cidImageData[k].cid + "' src='data:image/" + cidImageData[k].ext + ";base64," + cidImageData[k].data);
                    bodyHtml = bodyHtml.replace(new RegExp("src=\"" + cidImageData[k].cid, 'gi'), "originalCid='" + cidImageData[k].cid + "' src=\"data:image/" + cidImageData[k].ext + ";base64," + cidImageData[k].data);
                    bodyHtml = bodyHtml.replace(new RegExp("src=" + cidImageData[k].cid, 'gi'), "originalCid='" + cidImageData[k].cid + "' src=data:image/" + cidImageData[k].ext + ";base64," + cidImageData[k].data);
                }
            }

            return bodyHtml;
        }

        function getCidImageData(bodyHtml, bodyMhtml) {
            var cidImageData = [];

            var lines = bodyMhtml.split("\n");

            //var regexPatternForImageIdentifier = "Content-ID: <"+ imageIdentifier + ">";
            var regexPatternForImageIdentifier = "Content-ID: <image001.jpg@01D1EF03.91CC22F0>";
            var regexPatternForContentTransferEncoding = "Content-Transfer-Encoding:";
            var regexPatternForEndOfEmage = "----_=_NextPart1";

            var imgIndentifiers = ExtractImageIdentifiers(bodyHtml);

            for (var k = 0; k < imgIndentifiers.length; k++) {

                var temp = imgIndentifiers[k].replace("cid:", "");
                regexPatternForImageIdentifier = "Content-ID: <" + temp + ">";

                var tmp1 = imgIndentifiers[k].split("@")[0];
                var tmp2 = tmp1.split(".");
                var imgExtension = tmp2[tmp2.length - 1];
                if (imgExtension.length > 4)
                    imgExtension = "png";

                var base64Image = [];
                var base64ImageString = "";
                var imageExtracted = false;
                var imageIdentifierFound = false;
                var contentTransferEncodingFound = false;
                var endOfImageFound = false;

                for (var i = 0; i < lines.length; i++) {
                    if (imageExtracted && !endOfImageFound && (lines[i].indexOf(regexPatternForEndOfEmage) > -1))
                        endOfImageFound = true;

                    if (endOfImageFound && imageExtracted) {
                        break;
                    }

                    if (imageIdentifierFound && contentTransferEncodingFound && lines[i].length > 0 && (lines[i].indexOf(regexPatternForContentTransferEncoding) === -1)) {
                        base64Image.push(lines[i]);
                        imageExtracted = true;
                    }

                    if (!imageIdentifierFound && (lines[i].indexOf(regexPatternForImageIdentifier) > -1))
                        imageIdentifierFound = true;
                    if (!contentTransferEncodingFound && (lines[i].indexOf(regexPatternForContentTransferEncoding) > -1))
                        contentTransferEncodingFound = true;

                }

                base64ImageString = base64Image.join('');

                cidImageData.push({ 'cid': imgIndentifiers[k], 'ext': imgExtension, 'data': base64ImageString });
            }
            return cidImageData;
        }

        function hasCidImages(str) {

            var html = /src=['""]cid:/g;

            return html.test(str);
        }


        function AttachmentViewerUrl(workId, source, attachmentString) {
            if (typeof queryStringParam('source') !== 'undefined' && queryStringParam('source') !== null && queryStringParam('source').length > 0)
                source = queryStringParam('source');

            return RetrieveAttachmentViewerUrl(workId, source, attachmentString, undefined, undefined, undefined, e5Config.e5LegacyBase);
        };

        $(document).on("hidden.bs.collapse", ".k-panel", function () {
            setTimeout(function () { saveCollapseState(); }, 200);
        });

        $(document).on("show.bs.collapse", ".k-panel", function () {
            //insertInlineImages($(this));

            //wait for settle time, then save state.
            setTimeout(function () { insertInlineImages(); saveCollapseState(); }, 200);
        });

        function insertInlineImages(sender) {
            var elements;
            if (typeof sender === 'undefined' || sender === null)
                elements = $(document).find(".messageBlock:visible");
            else
                elements = sender.find(".messageBlock");

            elements.each(function () {
                var workId = $(this).attr('workId');
                $scope.workId = workId;

                var conversationId = $(this).attr('conversationId');
                var messageId = $(this).attr('messageId');

                var conversation = model.conversations[conversationId];
                if (typeof conversation === 'undefined' || conversation === null)
                    return true;

                var message = $.grep(conversation.messages, function (e) { return e.id == messageId; })[0];  //Should be ==, not ===
                if (typeof message === 'undefined' || message === null)
                    return true;

                var html = message.bodyHtml;

                //Check if there are images to check in
                if (hasCidImages(html)) {
                    //TODO:Save ConversationMhtml in array and check if we already have this mhtml available - then reuse

                    //If not, do webapi call and replace
                    conversationdata.getUniqueEmailAsMhtml(workId, messageId)
                        .then(
                            function (response) {
                                message.bodyHtml = ReplaceBodyWithBase64Images(message.bodyHtml, response.data);
                                message.bodyHtml = FixImageWidth(message.bodyHtml);
                                message.bodyHtml = stripData(message.bodyHtml);
                                //$scope.$apply();
                            },
                            function (response) {
                                // failure callback
                            }
                        ).finally(function () {
                            //toggleSpinner(-1);
                        });
                }
            });

        }

        function saveCollapseState() {
            $(document).find(".conversationBlock:hidden").each(function () {
                var conversationId = $(this).attr('conversationId');

                var conversation = model.conversations[conversationId];
                if (typeof conversation !== 'undefined' && conversation !== null) {
                    model.conversations[conversationId].showConversation = false;
                } else {
                    return true;
                }
            });

            $(document).find(".conversationBlock:visible").each(function () {
                var conversationId = $(this).attr('conversationId');

                var conversation = model.conversations[conversationId];
                if (typeof conversation !== 'undefined' && conversation !== null) {
                    model.conversations[conversationId].showConversation = true;
                } else {
                    return true;
                }
            });

            $(document).find(".messageBlock:hidden").each(function () {
                var conversationId = $(this).attr('conversationId');
                var messageId = $(this).attr('messageId');

                var conversation = model.conversations[conversationId];
                if (typeof conversation === 'undefined' || conversation === null) {
                    return true;
                }

                var message = $.grep(conversation.messages, function (e) { return e.id == messageId; })[0];  //Should be ==, not ===
                if (typeof message !== 'undefined' && message !== null) {
                    message.showMessage = false;
                }
                else {
                    return true;
                }
            });

            $(document).find(".messageBlock:visible").each(function () {
                var conversationId = $(this).attr('conversationId');
                var messageId = $(this).attr('messageId');

                var conversation = model.conversations[conversationId];
                if (typeof conversation === 'undefined' || conversation === null) {
                    return true;
                }

                var message = $.grep(conversation.messages, function (e) { return e.id == messageId; })[0];  //Should be ==, not ===

                if (typeof message !== 'undefined' && message !== null) {
                    message.showMessage = true;
                }
                else {
                    return true;
                }
            });

            localStorageCurrentWork.conversations = model.conversations;
            $scope.$apply();
        }



        function newConversation() {
            model.localSettings.showNewConversation = !model.localSettings.showNewConversation;

            localStorageCurrentWork.localSettings = model.localSettings;
        }

        function newYammerPostOnClick() {
            model.localSettings.showNewYammerPost = !model.localSettings.showNewYammerPost;

            localStorageCurrentWork.localSettings = model.localSettings;
        }

        function showReply(message, mode) {
            if (message.HideReplyNoInit === false) {
                if ($scope.replyMode === mode) //clicked the same button => toggle show/hide
                    message.HideReplyNoInit = true;
                if (typeof $scope.replyMode === 'undefined' && message.ShowReply) {
                    message.HideReplyNoInit = true; //hide if no previous click is in scope
                }
            } else {
                //hide all other replies/fwds
                for (var k = 0; k < model.conversations.length; k++) {
                    for (var i = 0; i < model.conversations[k].messages.length; i++) {
                        model.conversations[k].messages[i].HideReplyNoInit = true;
                    }
                }

                //Show this reply/fwd for this message
                message.HideReplyNoInit = false;
            }

            //Always true for ng-if="ShowReply"
            message.ShowReply = true;
        }

        function replyEmail(conversation, message, mode) {

            if ($scope.defaultTemplateOriginal)
                $scope.defaultTemplate = $scope.defaultTemplateOriginal;

            if (!model.localSettings.originalBodyHtmlMessageId || model.localSettings.originalBodyHtmlMessageId !== message.id) {

                //Add a line to top of reply
                var newReplyBodyHtml = "<br/><br/><div class='replyEmailEnd' style='width:98%;padding:3pt 0 0 0;border-style:solid none none none;border-top-width:1pt;border-top-color:#B5C4DF;' >&nbsp;</div>" + message.replyBodyHtml;
                message.replyBodyHtml = "";

                //Insert images into message.replyBodyHtml
                //1st - try to get images from the DOM
                $('img[originalCid]').each(function () {
                    var cid = $(this).attr("originalCid");
                    var src = $(this).attr("src");

                    newReplyBodyHtml = newReplyBodyHtml.replace(new RegExp("src='" + cid, 'gi'), "originalCid='" + cid + "' src='" + src);
                    newReplyBodyHtml = newReplyBodyHtml.replace(new RegExp("src=\"" + cid, 'gi'), "originalCid='" + cid + "' src=\"" + src);
                    newReplyBodyHtml = newReplyBodyHtml.replace(new RegExp("src=" + cid, 'gi'), "originalCid='" + cid + "' src=" + src);
                });
                //2nd - if more images missing, step through the earlier messages and get the images from the mhtml
                if (hasCidImages(newReplyBodyHtml)) {
                    var promises = [];
                    for (var j = 0; j < conversation.messages.length; j++) {
                        var oMessage = conversation.messages[j];
                        if (oMessage.id <= message.id) {
                            promises.push(conversationdata.getUniqueEmailAsMhtml(workId, oMessage.id));
                        }
                    }

                    //Use promises because we have to get all back before activating the email component
                    var $q = angular.injector(['ng']).get('$q');
                    $q.all(promises)
                        .then(
                        function (responses) {
                            responses.forEach(function (response) {
                                //Only replace replyBodyHtml, not hidden bodyHtml
                                newReplyBodyHtml = ReplaceBodyWithBase64Images(newReplyBodyHtml, response.data);
                                newReplyBodyHtml = FixImageWidth(newReplyBodyHtml);
                                newReplyBodyHtml = stripData(newReplyBodyHtml);
                                //model.localSettings.originalBodyHtml = message.replyBodyHtml;
                            });
                        },
                        function (responses) {
                            // failure callback
                        })
                        .finally(function () {
                            model.localSettings.originalBodyHtml = newReplyBodyHtml;
                            showReply(message, mode);
                            $scope.$apply();
                        });
                } else //Don't need to populate images
                {
                    showReply(message, mode);
                }

                //TODO: not setting message.replyBodyHtml prevents the email changes going to sessionStorage
                model.localSettings.originalBodyHtml = newReplyBodyHtml;
                model.localSettings.originalBodyHtmlMessageId = message.id;

                localStorageCurrentWork.localSettings = model.localSettings;
            }
            else
                showReply(message, mode);


            message.replyTo = "";
            $scope.replyMode = mode;
            if (mode === "reply" || mode === "all") {
                message.messageType = "reply";
                message.replyTo = message.from;
                if (mode === "all") {
                    message.replyCc = message.cc.replace(/,/gi, ";");

                    var replyTo = (message.from + "," + message.to).split(',')
                        .filter(function (value, index, self) {
                            return self.indexOf(value) === index;
                        });

                    message.replyTo = replyTo.join(";");
                } else
                    message.replyCc = "";

                var re = $translate.instant('RE:');
                if (message.subject && message.subject.indexOf(re) === 0)
                    message.replySubject = message.subject;
                else
                    message.replySubject = re + " " + message.subject;

                message.replyAttachments = [];
            }
            else {
                message.messageType = "forward";

                var fw = $translate.instant('FWD:');
                if (message.subject && message.subject.indexOf(fw) === 0)
                    message.replySubject = message.subject;
                else
                    message.replySubject = fw + " " + message.subject;

                //forward the attachments that were attached to the source message
                message.replyAttachments = [];
                angular.forEach(message.attachments[0], function (value, key) {
                    if (key === 'id')
                        this.push(value);
                }, message.replyAttachments);
            }

            localStorageCurrentWork.conversations = model.conversations;
        }
    }


})();


(function () {
    angular.module("e5Anywhere")
        .component("e5YammerFeed", {
            bindings: {
                workId: "=",
                hasYammerFeed: "=" //Output to notify other components to hide "Create New Yammer Post" button
            },
            controllerAs: "vm",
            template: '<div class="panel-group" id="conversation_yammer" ng-if="vm.hasYammerFeed">'
                + '    <div class="panel panel-default">'
                + '        <div class="panel-heading">'
                + '            <a ng-click="toggleYammerFeedOnClick();">'
                + '                <div class="conversationHeaderYammer">'
                + '                    <img src="https://www.yammer.com/favicon.ico" /> Yammer Conversation'
                + '                </div>'
                + '            </a>'
                + '        </div>'
                + '        <div id="collapse_yammer" class="k-panel">'
                + '            <div class="panel-body conversationBlock" conversationId="yammerConversation" ng-hide="hideYammerFeed">'
                + '                <div id="embedded-feed" ng-hide="hideYammerFeed" style="height:500px;width:100%;"></div>'
                + '                <span ng-bind-html="yammerScript"></span>'
                + '            </div>'
                + '        </div>'
                + '    </div>'
                + '</div>',
                
            controller: 'e5YammerFeedController'
        })
        .controller('e5YammerFeedController', e5YammerFeedController);
    
    e5YammerFeedController.$inject = ['$sce', '$scope', 'propertydata'];

    //function e5YammerFeedController($sce, $http) {
    function e5YammerFeedController($sce, $scope, propertydata) {
        
        var vm = this;
        vm.yammerScriptFormat = '<script>' +
            '                    yam.connect.embedFeed({' +
            '                        "feedType": "topic",' +
            '                        "feedId": "{0}",' +
            '                        "config": {' +
            '                            "use_sso": false,' +
            '                            "header": false,' +
            '                            "footer": false,' +
            '                            "showOpenGraphPreview": false,' +
            '                            "defaultToCanonical": false,' +
            '                            "hideNetworkName": false' +
            '                        },' +
            '                        "container": "#embedded-feed"' +
            '                    });' +
            '                </script>';

        vm.$onInit = function () {
            vm.control = {
                activate: activate,
                toggleYammerFeed: toggleYammerFeed
            };
            
            $scope.toggleYammerFeedOnClick = toggleYammerFeed;

            $scope.$watch("vm.workId",
                function (newId, oldId) {
                    if (newId && newId.length === 36 && newId !== oldId) {
                        vm.workId = newId;
                        activate(newId);
                    }
                });

            $scope.$watch(angular.bind(propertydata, function () {
                    return this.yammerFeedId;
                }),
                function (newVal, oldVal) {
                    if (typeof newVal !== 'undefined' && newVal !== '' && newVal !== oldVal) {
                        $scope.yammerScript = $sce.trustAsHtml(String.format(vm.yammerScriptFormat, newVal));
                        vm.hasYammerFeed = true;
                        hasYammerFeedSet(true); //Set in $scope.$parent
                        $scope.hideYammerFeed = false;
                    }
                }, true);

            activate(vm.workId);
        }
        
        return vm;
        
        function activate(workId) {
            vm.hasYammerFeed = false;

            toggleSpinner(1);
            propertydata.get(workId, 'YammerFeedId', false)
                .then(
                    function (response) {
                        var yammerFeedId = response.data.value;
                        if (yammerFeedId) {
                            if (yammerFeedId.indexOf(",") !== -1) //yammerFeedId may have multiple topic id's
                                yammerFeedId = yammerFeedId.split(",")[0].trim();

                            $scope.yammerScript = $sce.trustAsHtml(String.format(vm.yammerScriptFormat, yammerFeedId));

                            vm.hasYammerFeed = true;
                            hasYammerFeedSet(true); //Set in $scope.$parent
                            $scope.hideYammerFeed = false;
                        }
                    },
                    function (response) {
                        //No action on error
                    })
                .finally(function () {
                    toggleSpinner(-1);
                });
        }
        
        function toggleYammerFeed() {
            if ($scope.hideYammerFeed)
                $scope.hideYammerFeed = false;
            else
                $scope.hideYammerFeed = true;
        }


        function hasYammerFeedSet(newVal) {
            if ($scope.hasYammerFeedSet)
                $scope.hasYammerFeedSet(newVal);
            if ($scope.$parent.hasYammerFeedSet)
                $scope.$parent.hasYammerFeedSet(newVal);
        }
        
        // ReSharper disable once JsUnreachableCode
        var spinCounter = 0;
        //Show the spinner if the counter goes from 0 to 1
        //Hide the spinner if the counter goes from 1 to 0
        function toggleSpinner(counterIncrementDecrement) {
            if (typeof spinCounter === 'undefined')
                spinCounter = 0;

            spinCounter = spinCounter + counterIncrementDecrement;

            if (counterIncrementDecrement === 1 && spinCounter === 1) {
                if (!$("[ng-controller]")) return;
                kendo.ui.progress($("[ng-controller]"), true);
            }
            if (counterIncrementDecrement === -1 && spinCounter === 0) {
                if (!$("[ng-controller]")) return;
                kendo.ui.progress($("[ng-controller]"), false);
            }
        }

    }


})();


(function () {
    angular.module("e5Anywhere")
        .component("e5YammerPost", {
            bindings: {
                workId: "=",
                newTopicId: "="
                //showTemplates: "=?",
                //defaultTemplate: "=?"
            },
            controllerAs: "vm",
            template: '<div class="panel-group" id="yammerpost" ng-hide="hideYammerPost">'
                + '    <div class="panel panel-default">'
                + '        <div class="panel-heading">'
                + '            <a>'
                + '                <div class="conversationHeaderYammerPost">'
                + '                    <img src="https://www.yammer.com/favicon.ico" /> New Yammer Post'
                + '                </div>'
                + '            </a>'
                + '        </div>'
                + '        <div id="collapse_yammerpost" class="k-panel">'
                + '            <div class="panel-body conversationBlock" conversationId="yammerConversationPost" >'
                + '                 <form id="e5YammerForm" class="e5YammerForm" name="e5YammerForm">'
                //+ '                     <div class="e5Heading">{{"Topics" | translate}}</div>'
                //+ '                     <input class="k-textbox" type="text" name="Topics" ng-model="vm.Topics"></input>'
                //+ '                     <div class="e5Heading">{{"Groups" | translate}}</div>'
                //+ '                     <input class="k-textbox" type="text" name="Groups" ng-model="vm.Groups"></input>'
                //+ '                     <div class="e5Templates">'
                //+ '                         <div class="e5Heading" >{{"Template" | translate}}</div>'
                //+ '                         <div class="k-block k-info-colored" ng-hide="vm.dsTemplates.length || vm.loading">{{"There are no templates available." | translate}}</div>'
                //+ '                         <div class="k-block k-info-colored" ng-show="vm.loading">{{"Loading..." | translate}}</div>'
                //+ '                         <div ng-show="vm.dsTemplates.length">'
                //+ '                             <select kendo-drop-down-list="vm.ddlTemplates" k-data-text-field="\'name\'" k-data-value-field="\'id\'" '
                //+ '                                   k-data-source="vm.dsTemplates" k-value-primitive="true" k-ng-model="vm.templateId" on-change="vm.onSelect(kendoEvent)"></select>'
                //+ '                         </div>'
                //+ '                     </div>'
                + '                     <div class="e5Heading">{{"Message" | translate}}</div>'
                + '                     <textarea class="k-textbox" type="textarea" name="Message" ng-model="vm.Message" required></textarea>'
                + '                     <div><button id="addYammerPost" class="k-button send k-primary" ng-click="addYammerPost()">{{"Post Message" | translate}}</button></div> '
                + '                 </form>'
                + '            </div>'
                + '        </div>'
                + '    </div>'
                + '</div>',

                
            controller: 'e5YammerPostController'
        })
        .controller('e5YammerPostController', e5YammerPostController);

    e5YammerPostController.$inject = ['$sce', '$scope', '$log', 'yammerdata', 'documentdata', 'workitemdata', 'propertydata', 'ngToast', '$translate'];

    //function e5YammerPostController($sce, $http) {
    function e5YammerPostController($sce, $scope, $log, yammerdata, documentdata, workitemdata, propertydata, ngToast, $translate) {
        
        var vm = this;
        vm.$onInit = function () {
            vm.control = {
                activate: activate,
                addYammerPost: addYammerPost
            };
            
            $scope.addYammerPost = addYammerPost;

            activate(vm.workId);
        }
        
        return vm;
        
        function activate(workId) {
            $scope.hideYammerPost = false;

            //vm.isDirty = false; // The forms details have been changed
            //vm.lastTemplateId = 0;

            ////load topics, template etc.

            //// setup handlers
            //vm.onSelect = function (e) {
            //    // var dropdownlist = $(vm.ddlTemplates).data("kendoDropDownList");
            //    if (vm.isDirty && !confirm($translate.instant("The email body or subject has been modified and switching templates will lose your changes."))) {
            //        //$scope.$apply(function () {
            //        vm.templateId = vm.lastTemplateId;
            //        //});
            //        e.preventDefault();
            //    } else {
            //        loadTemplate(vm.templateId);
            //    }
            //}
            //vm.onEditorChange = function () {
            //    vm.isDirty = true;
            //}

            //// Load template data
            //$log.debug("Loading template data");
            //vm.loading = true;
            //documentdata.getDocumentTemplates(workId, ".xslt")
            //    .then(function (response) {
            //        $log.debug(response);

            //        // Templates
            //        var td = response.data; // Id, Name
            //        vm.dsTemplates = (td && td.length > 0) ? td : []; // id, name

            //        // Load the default template if specified
            //        if (vm.defaultTemplate && (typeof (vm.defaultTemplate) === 'string') && vm.dsTemplates && (vm.dsTemplates.length > 0)) {
            //            for (var iTemplate in vm.dsTemplates) {
            //                var template = vm.dsTemplates[iTemplate];
            //                if (template.name && (template.name.toLowerCase().endsWith(vm.defaultTemplate.toLowerCase()))) {
            //                    $log.debug("Loading default template " + vm.defaultTemplate + "(" + template.id + ")");
            //                    vm.templateId = template.id; // select it in the list
            //                    loadTemplate(template.id);
            //                    break;
            //                }
            //            }
            //        } 
            //    }, function (response) {
            //        ngToast.danger({
            //            content: $translate.instant('Unable to load template data.')
            //        });

            //        $log.error('Unable to load template data : ' + JSON.stringify(response));
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
        }
        

        //function loadTemplate(templateId) {
        //    toggleSpinner(1);
        //    workitemdata.generateHtml(vm.workId, templateId).then(function (response) {
        //        $log.debug(response);
        //        vm.lastTemplateId = templateId;
        //        // Topics, Groups, bodyHtml
        //        var td = response.data;
        //        vm.Topics = vm.Topics || td.Topics; // Load the template value only if the field is current empty
        //        vm.Topics = vm.Groups || td.Groups; // Load the template value only if the field is current empty
        //        vm.isDirty = false;
        //        vm.Message = $(td.bodyHtml).text();

        //    }, function (response) {
        //        ngToast.danger({
        //            content: $translate.instant('Unable to load template Html.')
        //        });

        //        $log.error('Unable to load template Html : ' + JSON.stringify(response));

        //    }).finally(function () {
        //        toggleSpinner(-1);
        //    });
        //}

        function addYammerPost() {
            if (!$scope.e5YammerForm.$valid) {
                return;
            }

            toggleSpinner(1);
            yammerdata.addPost(vm.workId, vm.Message) //, vm.Groups, vm.Topics
                .then(
                    function(response) {
                        // success callback
                        //Get the topic id
                        if (response.data[0].references) {
                            response.data[0].references.forEach(function (reference) {
                                if (reference.type === "topic") {
                                    propertydata.yammerFeedId = reference.id;
                                }
                            });
                        }
                        $scope.hideYammerPost = true;

                    },
                    function(response) {
                        // failure callback
                        ngToast.danger({
                            content: $translate.instant('Failed to post yammer message.')
                        });
                    }
                ).finally(function() {
                    toggleSpinner(-1);
                });
        }

        // ReSharper disable once JsUnreachableCode
        var spinCounter = 0;
        //Show the spinner if the counter goes from 0 to 1
        //Hide the spinner if the counter goes from 1 to 0
        function toggleSpinner(counterIncrementDecrement) {
            if (typeof spinCounter === 'undefined')
                spinCounter = 0;

            spinCounter = spinCounter + counterIncrementDecrement;

            if (counterIncrementDecrement === 1 && spinCounter === 1) {
                if (!$("[ng-controller]")) return;
                kendo.ui.progress($("[ng-controller]"), true);
            }
            if (counterIncrementDecrement === -1 && spinCounter === 0) {
                if (!$("[ng-controller]")) return;
                kendo.ui.progress($("[ng-controller]"), false);
            }
        }
    }

})();

