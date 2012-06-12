// ==UserScript==
// @name        Flowdock Enhancements
// @namespace   http://fluidapp.com
// @description Some Enhancements for Flowdock
// @include     *
// @author      Jens Arps http://jensarps.de
// ==/UserScript==

(function () {

	var styleSheetId = 0;

	var slice = Function.prototype.call.bind(Array.prototype.slice);

	var enhancements = {

		applyUserImages: function(){
			// generic styles:
			var cssString = '#flowdock-chat .chat_line .chat_line_content { padding-left: 70px; } \
							 #flowdock-chat .chat_line .nick { left: 70px; text-align: left; color: #A8A8A8; } \
							 #flowdock-chat .chat_line .chat_line_header { padding: 10px 0 20px 0; } \
							 #flowdock-chat .chat_line.hide_header .chat_line_header { padding-bottom: 0; } \
							 #flowdock-chat #chat_app_lines .chat_line { padding-bottom: 5px; }';
			this.createStylesheet(cssString);

			// add images:
			slice(document.querySelectorAll('#userlist_button div')).forEach(function(node){
				var id = node.id.split('_').pop();
				var img = (node && node.style.backgroundImage) || '';

				cssString = '.chat_line_header .nick.user_' + id + ':after { \
					content: ""; \
					background: ' + img + ' no-repeat center; \
					width: 30px; \
					height: 30px; \
					display: inline-block; \
					position: absolute; \
					left: -50px; \
					padding: 1px; \
					border: solid 1px #BFBFBF; \
				 }';
				this.createStylesheet(cssString);
			}, this);
		},

		makeTimestampVisible: function(){
	        var cssString = '#flowdock-chat .chat_line .timestamp span.time { display: block !important; }';
	        this.createStylesheet(cssString);
		},
		
		createStylesheet: function(cssText){
			var head = document.getElementsByTagName('head')[0],
			    style = document.createElement('style'),
			    rules = document.createTextNode(cssText);

			style.type = 'text/css';
			style.id="flowdockEnhancements_" + styleSheetId++;
			if(style.styleSheet){
			    style.styleSheet.cssText = rules.nodeValue;
			}else{
				style.appendChild(rules);
			}
			head.appendChild(style);
		},

		runAll: function(){
			this.makeTimestampVisible();
			this.applyUserImages();
		}
	};

    if (window.fluid) {
    	enhancements.runAll();
    }
})();

