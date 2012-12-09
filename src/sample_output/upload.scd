Server.default = Server.internal;
s = Server.default;
s.recSampleFormat = "int16";
s.recChannels = 2;
s.recHeaderFormat = "AIFF";
s.options.sampleRate = 44100;

~path = "/tmp/audio.aiff";
~length = 10;

s.waitForBoot({


Task.new ({
	
		s.sync;

		s.record(~path);

		//---- START - inserted by server ----


play{a=SinOsc;b=49*(1,1.33..10.64);Splay.ar(a.ar({|i|b@i*a.ar(b@(7-i))*LFNoise1.kr(0.5.rand).exprange(1,9)}!8)).tanh/4};
		
        //---- END - inserted by server ----

		(~length).wait;

		s.stopRecording;
        
		2.wait;
        
		0.exit;


}).play;

});



