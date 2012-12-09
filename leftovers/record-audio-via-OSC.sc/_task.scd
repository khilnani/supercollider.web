
(

   		SynthDef(\snare909,{
			|out = 0, pan = 0, amp = 1, mul = 1, velocity = 1, noise = 0.3|
			var excitation, membrane;
			excitation = LPF.ar(WhiteNoise.ar(1), 7040, 1) * (0.1 + velocity);
			membrane = (
						/* Two simple enveloped oscillators represent the loudest resonances of the drum membranes */
						(LFTri.ar(330,0,1) * EnvGen.ar(Env.perc(0.0005,0.055),doneAction:0) * 0.25)
						+(LFTri.ar(185,0,1) * EnvGen.ar(Env.perc(0.0005,0.075),doneAction:0) * 0.25)
						/* Filtered white noise represents the snare */
						+(excitation * EnvGen.ar(Env.perc(0.0005, noise),doneAction:2) * 0.2)
						+(HPF.ar(excitation, 120, 1) * EnvGen.ar(Env.perc(0.0005,0.183),doneAction:0) * 0.2)
					) * mul;
			Out.ar(out, Pan2.ar(membrane, pan, amp));
		}).add;

   		SynthDef(\tri,{
 			|out=0|
			var snd;
			snd = Saw.ar(300,128,128);
			Out.ar(out, Pan2.ar(snd, 0, 1));
		}).add;


	t = Task.new({


	a = Synth(\snare909,[\out,0, \mul,0.5,\velocity, rrand(0.5, 1.0)]);
	b = Synth(\tri,[\out,0]);

	6.wait;

	b.free;

	});


	t.start;


)