Server.default = Server.internal;
s = Server.default;
s.recSampleFormat = "int24";
s.recChannels = 2;
s.recHeaderFormat = "AIFF";
s.options.sampleRate = 48000;

~path = "/tmp/audio2.aiff";
~length = 10;

s.waitForBoot({



Task.new ({
	
		s.sync; 
        
		s.record(~path);

		//---- START - inserted by server ----

//		play{a=SinOsc;b=49*(1,1.33..10.64);Splay.ar(a.ar({|i|b@i*a.ar(b@(7-i))*LFNoise1.kr(0.5.rand).exprange(1,9)}!8)).tanh/4};
		
		play{a=SinOsc;Splay.ar({|i|j=i/700;a.ar(j,a.ar(j*2,a.ar(j*3,a.ar(j*4,a.ar(j*5,InFeedback.ar/99,2pi ),2pi),2pi),2pi))}!15)/2};
		
        //---- END - inserted by server ----

		(~length).wait;

		s.stopRecording;
        
		2.wait;
		
		s.quit;
        
		0.exit;


}).play;

});



