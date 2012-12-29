// usual setup 
Server.default = Server.internal; 
s = Server.default; 
s.recSampleFormat = "int16"; 
s.recChannels = 2; 
s.recHeaderFormat = "AIFF"; 
s.options.sampleRate = 44100; 

// server can write user's scd to a file here. 
// found executeFile is more robust than interpreting scd text sent via osc with quotes etc 
// could validate the file for security, eg dont execute loading or writing a system file to hack the server 
~path = "/Projects-SuperCollider/Projects/2012-12-06/"; 

s.reboot; 

// define the listener that will record the scd to file 
OSCdef(\executeFile, { 
        |msg, time, addr, recvPort| 
        var filename, t, func, length; 

        filename = msg[1]; 
        length = msg[2]; 

        t  = Task.new ({ // used a task so i can specify wait / record length 

                ("reading sc file: " ++ filename).postln; 

                s.record(~path ++ filename ++ ".aiff"); // record to name.scd.aiff 

                func = this.executeFile(~path ++ filename); 

                ("func: " ++ func).postln; 

                (length).wait; 

                ("asString: " ++ func.asString).postln; 

                // since i didnt kickoff a process for ea. request, need to kill the code interpreted 
                // since any code could be executed, need to ensure no leaks 
                // may need a SC process per request to kill to ensure no memory/resource leaks 
                // tested running routine, tasks that have synthdef and synth.play. 
                // dont know how to control anonymous functions in the interpreted code 
                // without parsing/tokenizing to get a list of objects to free up later 
                if(func.asString.contains("Synth"), { 
                                "I'm a Synth".postln; 
                                func.free; // this was easy, but the sunny day case only 
                } ); 
                if(func.asString.contains("Task"), { 
                                "Rogue Task! Manage youreself!".postln; 
                                func.stop; // doesn't stop playing audio 
                } ); 
                if(func.asString.contains("Routine"), { 
                                "Rogue Routine! Manage youreself!".postln; 
                                func.stop; // doesnt stop playing audio 
                } ); 

                s.stopRecording; 

        }); 

        t.play; 

        }, '/executeFile', nil); 


// free 
OSCdef(\executeFile).free; 

// client, requests sclang to load an scd 

b = NetAddr.new("127.0.0.1", 57120); 
// tests using random SCtweets (not mine)
b.sendMsg("/executeFile", "_synth.scd", 10); 
b.sendMsg("/executeFile", "_task.scd", 10); 
b.sendMsg("/executeFile", "_routine.scd", 10);
