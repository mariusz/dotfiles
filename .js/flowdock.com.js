(function(){var a=0,b=Function.prototype.call.bind(Array.prototype.slice),c={applyUserImages:function(){var a="#flowdock-chat .chat_line .chat_line_content { padding-left: 70px; } #flowdock-chat .chat_line .nick { left: 70px; text-align: left; color: #A8A8A8; } #flowdock-chat .chat_line .chat_line_header { padding: 10px 0 20px 0; } #flowdock-chat .chat_line.hide_header .chat_line_header { padding-bottom: 0; } #flowdock-chat #chat_app_lines .chat_line { padding-bottom: 5px; }";this.createStylesheet(a),b(document.querySelectorAll("#userlist_button div")).forEach(function(b){var c=b.id.split("_").pop(),d=b&&b.style.backgroundImage||"";a=".chat_line_header .nick.user_"+c+':after { content: ""; background: '+d+" no-repeat center; width: 30px; height: 30px; display: inline-block; position: absolute; left: -50px; padding: 1px; border: solid 1px #BFBFBF; }",this.createStylesheet(a)},this)},makeTimestampVisible:function(){var a="#flowdock-chat .chat_line .timestamp span.time { display: block !important; }";this.createStylesheet(a)},createStylesheet:function(b){var c=document.getElementsByTagName("head")[0],d=document.createElement("style"),e=document.createTextNode(b);d.type="text/css",d.id="flowdockEnhancements_"+a++,d.styleSheet?d.styleSheet.cssText=e.nodeValue:d.appendChild(e),c.appendChild(d)},runAll:function(){this.makeTimestampVisible(),this.applyUserImages()}};c.runAll()})()