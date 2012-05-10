require 'eventmachine'
require 'em-websocket'
require 'json'
EventMachine.run {
         @channel = EM::Channel.new

        EventMachine::WebSocket.start(:host => "128.143.137.142", :port => 8080) do |ws|
                ws.onopen {
                        puts "WebSocket connection open"
        
                        sid = @channel.subscribe { |msg| ws.send msg }           
                        # publish message to the client
                        #ws.send "Hello Client"
                        ws.onclose {
                                puts "Connection closed"
                                @channel.unsubscribe(sid)
                        }
                
                        ws.onmessage { |msg|
                                puts "Recieved message: #{msg}"
                                changes = eval(msg);
                                p changes
                                @channel.unsubscribe(sid)
                                @channel.push "#{changes.to_json}"
                                sid = @channel.subscribe { |msg| ws.send msg }           
                        }
                }
        
        end
}

