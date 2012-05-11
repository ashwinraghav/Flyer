require 'eventmachine'
require 'em-websocket'
require 'json'
module EventMachine
        class Channel
               def subs
                        return @subs
               end
        end
end

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
                                        channel = @channels[received_message["data-sync-id"]]
                                        p channel.subs
                                        channel.push "#{received_message.to_json}"
                                else
                                        leaders =[];
                                        received_message["subscriptions"].each do |subscription|
                                                if @channels[subscription].nil?
                                                        @channels[subscription] = EM::Channel.new
                                                else
                                                        leaders << @channels[subscription].subs.values.first
                                                end
                                        end

                                        return_ids = {}
                                        received_message["subscriptions"].each do |subscription|
                                                return_ids[subscription.to_s] = @channels[subscription].subscribe{|msg| ws.send msg}
                                        end

                                        ws.send({:subscription_message => true, :subscription_ids => return_ids}.to_json)
                                        leaders.each { |l| l.call({"query" => true}.to_json) }
                        	end
			}
                }
        
        end
}

