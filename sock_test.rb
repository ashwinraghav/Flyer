require 'eventmachine'
require 'em-websocket'
require 'json'
EventMachine.run {
        @channels = {}

        EventMachine::WebSocket.start(:host => "128.143.137.142", :port => 8080) do |ws|
                ws.onopen {
                        puts "WebSocket connection open"
        
                        #sid = @channel.subscribe { |msg| ws.send msg }           
                        ws.onclose {
                                puts "Connection closed"
                                #@channel.unsubscribe(sid)
                                #need a fix to unsubscribe from channels
                        }
                
                        ws.onmessage { |msg|
                                received_message = JSON.parse(msg)
                                puts "Recieved message: #{msg}"
                                p msg
				if(!received_message["subscription_message"])
                                        channel = @channels[received_message["data-sync_id"]]
                                        channel.push "#{received_message.to_json}"
                                else
                                        channel = @channels[received_message["data-sync-id"]]
                                        if channel.nil?
                                                channel = EM::Channel.new
                                                @channels[received_message["data-sync-id"]] = channel
                                        end
                                        return_ids = {}
                                        received_message["subscriptions"].each do |subscription|
                                                return_ids[subscription.to_s] = channel.subscribe{|msg| ws.send msg}
                                        end
                                        ws.send({:subscription_message => true, :subscription_ids => return_ids}.to_json)
                        	end
			}
                }
        
        end
}

