<script language="javascript" type="text/javascript"> 
	   var wsUri = "ws://128.143.137.142:8080"; 
	   var output;  
	   var message;
	   var expired = false;
	   function init() { 
	   		output = document.getElementById("output");
	   		testWebSocket(); 
	   }  
	   function testWebSocket() { 
		   websocket = new WebSocket(wsUri); 
		   websocket.onopen = function(evt) { onOpen(evt) }; 
		   websocket.onclose = function(evt) { onClose(evt) };
		   websocket.onmessage = function(evt) { onMessage(evt) }; 
		   websocket.onerror = function(evt) { onError(evt) }; 
	   }  
	
	  function onOpen(evt) { 
	  	writeToScreen("initial content"); 
	  }  
	  function onClose(evt) { alert("DISCONNECTED"); }  
	  
	  function onMessage(evt) {
	   var a = eval('(' + evt.data + ')');
	   document.getElementById('output').innerHTML = a["char"];
	   
	  }  
	  
	  function onError(evt) { alert(evt.data); } 
	  
	  function doSend(message) {websocket.send(message); } 
	  
	  function writeToScreen(message) { 
	  	var content = document.getElementById('output').innerHTML;
		
	  	document.getElementById('output').innerHTML= message;
	  } 
	  
	  window.addEventListener("load", init, false);  
	  
	  $('#output').live('focus', function() {
	  	before = $(this).html();
	  	
	  }).live('blur keyup paste', function() {
	  	if (before != $(this).html()) { $(this).trigger('change'); }
	  });

	  $('#output').live('change', function(e) {
	  	//doSend(document.getElementById('output').innerHTML);
	  	if(!expired){
	  		//expired = true;
	  		doSend(message);
	  	}
	  });
	  
	  function getCursorPos() {
		var cursorPos;
		if (window.getSelection) {
			var selObj = window.getSelection();
			var selRange = selObj.getRangeAt(0);
			cursorPos =  findNode(selObj.anchorNode.parentNode.childNodes, selObj.anchorNode) + selObj.anchorOffset;
			/* FIXME the following works wrong in Opera when the document is longer than 32767 chars */
		}
		else if (document.selection) {
			var range = document.selection.createRange();
			var bookmark = range.getBookmark();
			/* FIXME the following works wrong when the document is longer than 65535 chars */
			cursorPos = bookmark.charCodeAt(2) - 11; /* Undocumented function [3] */	
		}
		return cursorPos;
	}

	function findNode(list, node) {
		for (var i = 0; i < list.length; i++) {
			if (list[i] == node) {
				return i;
			}
		}
		return -1;
	}
	
	function find_chars_pressed(e){
		content = document.getElementById('output').innerHTML;
		message = "{:cursor_pos => 1" + ",:char =>'"+ content + "'}";
		//expired = false;
	}