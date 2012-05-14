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
                return_ids = {}
                ws.onopen {
                        puts "WebSocket connection open"
        
                        #sid = @channel.subscribe { |msg| ws.send msg }           
                        ws.onclose {
                                puts "Connection closed"
                                return_ids.keys.each do |key|
                                        puts "removing from channel #{return_ids}"
                                        @channels[key].unsubscribe(return_ids[key]);
                                        if(@channels[key].subs.empty?)
                                                @channels.delete(key)
                                        end
                                end
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
                                        puts "subscribing"
                                        leaders =[];
                                        received_message["subscriptions"].each do |subscription|
                                                if @channels[subscription].nil?
                                                        @channels[subscription] = EM::Channel.new
                                                else
                                                        leaders << [@channels[subscription].subs.values.last, subscription]
                                                end
                                        end

                                        received_message["subscriptions"].each do |subscription|
                                                return_ids[subscription.to_s] = @channels[subscription].subscribe{|msg| ws.send msg}
                                        end

                                        ws.send({:subscription_message => true, :subscription_ids => return_ids}.to_json)
                                        puts "the leaders are #{leaders}"
                                        leaders.each { |l, sub| l.call({"query" => true, "data-sync-id" => sub }.to_json) }
                        	end
			}
                }
        
        end
}

