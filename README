Optran is a lightweigt ruby asynchronous server and client component that can help you build operational transformation into your web application.

What is Operational Transformation?
The internet is CRUD. In an incredible surprise move, consider 2 users editing the profile of the same employee record. There are 2 parts to the user experience that are not deterministic:
        1) The last person to click the save button wins the battle overwriting everything that the other users has written.
        2) The users are not aware that there is a simultaneous edit happening and their work could potentially be overwritten.

A complete solution to this would be to have a "Google docs" like document editing feature built all over your application that would support elegant concurrent editing. If you are looking for a full-fledged, editor like interface, https://github.com/pita/etherpad-lite is a good choice.

On the other hand, a simplistic solution like, getting changes from users to be concurrently visible on all other clients that are simultaneously editing the document can be effective too. This is what OpTran does.
A convenient part of Optran is that it can be plugged relatively easily into existing web applications. Also, keeping states consistent between clients is the responsibility of a separate server component. Hence, your scaling schemes should remain unaffected. 

Steps to incorporate Optran(I will gemify this soon):
        1) clone this git repo
        2) gem install em-websocket
        3) 'ruby sock_server.rb' should start the web-socket server on port 8080 of your machine
        4) The javascript file in js/optran.js contains a statement var wsUri = "ws://localhost:8080". Change this to the IP address of the machine where step-2 was carried out.
        5) Copy this javascript file into the public folder of your web application

Thats is you are ready to go. Take a look at the examples in the examples folder to see how to get started.
