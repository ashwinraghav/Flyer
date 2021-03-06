var wsUri = "ws://128.143.137.142:8080"; 
var output;  
var message={};
var subscription_ids = {}
var message_identity;
var message_on_disconnect = "The web Socket Server is experiencing problems. We are unable to maintain consistent states across concurrent sessions on this document";
function init() { 
	testWebSocket();
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

function bootstrap(){
	$('[data-synchronize = "true"]').each(
		function(element){
			$(this)[0].value = "intial content";
		}
	);
}

function onOpen(evt) { 
	bootstrap();
	subscribe(); 
}  

function onClose(evt) { 
	alert(message_on_disconnect);
}  
function sent_by_me(a){
	return(a["message_identity"] == message_identity)
}
function onMessage(evt) {
	var a = eval('(' + evt.data + ')');
	if(a["subscription_message"]){
		subscription_ids = a["subscription_ids"];
	}else if(a["query"]){
		var str = "[data-sync-id = " + a["data-sync-id"] + "]";
		$(str).trigger("change");

	}else if (!sent_by_me(a)){
		var str = "[data-sync-id = " + a["data-sync-id"] + "]";
		$(str)[0].value = a["char"];
	}
}  

function onError(evt) {
	alert(evt.data); 
} 

function doSend(message) {
	message_identity = Math.floor(Math.random()*20000000);
	message["message_identity"] = message_identity;
	websocket.send(JSON.stringify(message)); 
} 

window.addEventListener("load", init, false);  

$('[data-synchronize="true"]').live('focus', function() {
		before = $(this).value;

		}).live('blur keyup paste', function() {
			if (before != $(this).html()) { $(this).trigger('change'); }
			});

$('[data-synchronize="true"]').live('change', function(e) {
		content = $(this)[0].value;
		message["char"]=content;
		message["data-sync-id"] = $(this).attr('data-sync-id');
		message["subscription_id"] = subscription_ids[$(this).attr('data-sync-id')];
		message["subscription_message"]=false;
		doSend(message);
});
