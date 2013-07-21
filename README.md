- [Instructions](#instructions)
	- [Requirements](#requirements)
	- [Installation](#installation)
- [Features](#features)
	- [Current Development State](#current-development-state)
	- [Planned Features](#planned-features)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Technical Notes](#technical-notes)
	- [Overview](#overview)
	- [Codebase](#codebase)


supercollider.web [![Build Status](https://travis-ci.org/khilnani/supercollider.web.png)](https://travis-ci.org/khilnani/supercollider.web)
=========

Node.js based web application to create audio files for SuperCollider. Includes SoundCloud integration. May include Twitter integration.


Thanks to the following people for feedback, suggestions, technical insight and sanity checks. In alphabetical order -

- Batuhan Bozkurt - http://www.earslap.com
- Charlie Roberts - http://www.charlie-roberts.com
- crucialfelix - https://github.com/crucialfelix, https://soundcloud.com/crucialfelix
- Metin Yerlikaya
- Nicholas Starke - http://www.nickstarke.com, https://soundcloud.com/nicholas-starke
- Schemawound - http://schemawound.com/, https://soundcloud.com/schemawound


Instructions
=========
 
Requirements 
---------
- Node.js
- SuperCollider
- Node.js Modules
	- dysf.utils
	- soundclouder.js
	- express 
		- If you see errors after installing express globally, use `export NODE_PATH=/usr/local/lib/node_modules`
	- forever


Installation
---------
- Ensure /tmp/ is available as Read/Write
- Update <code>src/config.js</code>
- Once the code has been pulled, change your working directory to 'src'
- run: `USAGE node supercollider.js [CONFIG FILE] [PORT]`
	- Example `node supercollider.js config.js 8080`
- If you want to run the process in the background, you can 
  - Install the forever module - `npm install forever`
  - Run `forever start supercollider.js [CONFIG FILE] [PORT]`. 
  	- Example `forever start supercollider.js config.js 8080`

Features
=========

> **NOTE - The code is very early in development and is not safe to run on any public web server as it could expose your server to security/hacks.**

Current Development State
---------

- Web based entry, validation and execution of SuperCollider code
- Streaming of generated audio
- Generation of Audio based on command line execution of 'sclang'
- Supports Basic Auth security
- State saving in the Browser using LocalStorage
- SCCode.org Docs integration

Planned Features
---------

- SoundCloud integration to upload/store resulting audio.
- Twitter integration to post resulting audio.
- Realtime interaction with the SuperCollider application via web sockets to facilitate live coding.

Usage
=========

- The application wraps SuperCollider code submitted into a Task. 
- If the SuperCollider code uses Tasks or Routines, it would need to compatible with being run within a Task.
- Else, you will get an error message that is not very informative, specifically <code>ERROR: syntax error, unexpected '(', expecting '}'</code>
- Examples
	- The following code will give an error:


	```
	(
		{
			SynthDef(\test, {
				var st = SinOsc.ar();
				Out.ar(0,st!2);
			}).add;
			s.sync;
			Synth(\test);
		}.fork
	)
	```

	- The code below *will* work. *Note, only the encapsulating `'({'`  and `'}.fork)'` were removed.*

	```
	SynthDef(\test, {
		var st = SinOsc.ar();
		Out.ar(0,st!2);
	}).add;
	s.sync;
	Synth(\test);
	```	

- As a reference, the resulting code the application sends to SCLang (SuperCollider) is more or less

```
s.waitForBoot({
	Task.new ({

		s.sync; 
		s.record(~path);

		//---- START - inserted by server ----

		SynthDef(\test, {
			var st = SinOsc.ar();
			Out.ar(0,st!2);
		}).add;
		s.sync;
		Synth(\test);

		//---- END - inserted by server ----

		(~length).wait;
		s.stopRecording;
		2.wait;
		s.quit;
		0.exit;

	}).play;
});
```

Screenshots
=========

<img src="https://raw.github.com/dysf/supercollider.web/master/docs/image_0.png" width="40%" />
<img src="https://raw.github.com/dysf/supercollider.web/master/docs/image_1.png" width="40%" />
<img src="https://raw.github.com/dysf/supercollider.web/master/docs/image_2.png" width="40%" />
<img src="https://raw.github.com/dysf/supercollider.web/master/docs/image_3.png" width="40%" />
<img src="https://raw.github.com/dysf/supercollider.web/master/docs/image_4.png" width="40%" />
<img src="https://raw.github.com/dysf/supercollider.web/master/docs/image_5.png" width="40%" />
<img src="https://raw.github.com/dysf/supercollider.web/master/docs/image_6.png" width="40%" />


Technical Notes
=========

Overview
---------

- The application allows a user to submit SuperCollider code via a form. 
- The submitted code is then inserted into a template that facilitates command line execution of SuperCollider (sclang) to generate audio.
- Audio is generated in 16bit 44.1kHz AIFF format.
- Via a post-redirect-get pattern, audio is streamed to the browser.

Codebase
---------

- src
	- supercollider.web.js: The main js file of the application
	- config
		- config.js: Template config file that should contain SoundCloud client keys, Log levels etc.
		- config.illegals.js: Illegal keywords
	- html: Publish html/js/css files accessible at http://server:port/
	- modules: Custom modules for the application that handle request routing, utils, SoundCloud API etc.
	- templates: Template SCD files used to generate SuperCollider code send to sclang
- tests: Vow and PhantomJS tests
- docs: misc stuff
	- examples: Sample SuperCollider code that is created, along with the resulting audio.
	- leftovers: Experiments, abandoned ideas etc. that may be of interest.
	- misc: Reference SuperCollider code that is used for standalone testing of SC integration. 


