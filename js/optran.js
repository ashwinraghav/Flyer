var wsUri = "ws://128.143.137.142:8080"; 
var output;  
var message={};
var message_on_disconnect = "The web Socket Server is experiencing problems. We are unable to maintain consistent states across concurrent sessions on this document";
function init() { 
	output = document.getElementById("output");
	testWebSocket();
	subscribe(); 
}  
function testWebSocket() { 
	websocket = new WebSocket(wsUri); 
	websocket.onopen = function(evt) { onOpen(evt) }; 
	websocket.onclose = function(evt) { onClose(evt) };
	websocket.onmessage = function(evt) { onMessage(evt) }; 
	websocket.onerror = function(evt) { onError(evt) }; 
}
 
function subscribe(){
	var subscribe_message = {};
	subscribe_message["subscription_message"]=true;
	var subscriptions = [];
	$('[data-synchronize="true"]').each(
		function(elt){
				subscriptions.push($(this).attr('data-sync-id'));
			}
	);
	subscribe_message["subscriptions"] = subscriptions;
	websocket.send(JSON.stringify(subscribe_message));
}

function onOpen(evt) { 
	writeToScreen("initial content"); 
}  
function onClose(evt) { alert(message_on_disconnect);}  

function onMessage(evt) {
	var a = eval('(' + evt.data + ')');
	document.getElementById('output').innerHTML = a["char"];
}  

function onError(evt) { alert(evt.data); } 

function doSend(message) {websocket.send(JSON.stringify(message)); } 

function writeToScreen(message) { 
	var content = document.getElementById('output').innerHTML;

	document.getElementById('output').innerHTML= message;
} 

window.addEventListener("load", init, false);  

$('[data-synchronize="true"]').live('focus', function() {
		before = $(this).html();

		}).live('blur keyup paste', function() {
			if (before != $(this).html()) { $(this).trigger('change'); }
			});

$('[data-synchronize="true"]').live('change', function(e) {
		message["data-sync-id"]=$(this).attr('data-sync-id');
		message["subscription_message"]=false;
		doSend(message);
});

function find_chars_pressed(e){
	content = document.getElementById('output').innerHTML;
	message["char"]=content;
}

function findNode(list, node) {
	for (var i = 0; i < list.length; i++) {
		if (list[i] == node) {
			return i;
		}
	}
	return -1;
}
