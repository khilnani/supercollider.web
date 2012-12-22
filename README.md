sc_tweeter
=========

Node.js based web application to create audio files for SuperCollider tweets. Includes SoundCloud integration. May include Twitter integration.


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

Installation
---------
- Ensure /tmp/ is aviable as Read/Write
- Update <code>src.express/config.js</code>
- Once the code has been pulled,ange dir to src.express and run: <code>USAGE node index.js [CONFIG FILE] [PORT]</code>
	- Example <code>node index.js config 8080</code>
- If you want to run the process in the background, you can 
  - Install the forever module - <code>npm install forever</code>
  - Run <code>forever start index.js [CONFIG FILE] [PORT]</code>. 
  	- Example <code>forever start index.js config 8080</code>

Features
=========

> **NOTE - The code is very early in development and is not safe to run on any public web server as it could expose your server to security/hacks.**

Current Development State
---------

- Web based entry of SuperCollider code
- Generation of Audio based on command line execution of 'sclang'
- Streaming of generated audio to the browser
- State saving in the Browser using LocalStorage
- SCCode.org Docs integration

Planned Features
---------

- SoundCloud integration to upload/store resulting audio.
- Twitter integration to post resulting tweet.



Screenshots
=========

<img src="https://raw.github.com/dysf/sc_tweeter/master/docs/image_0.png" width="50%" />
<img src="https://raw.github.com/dysf/sc_tweeter/master/docs/image_1.png" width="50%" />
<img src="https://raw.github.com/dysf/sc_tweeter/master/docs/image_2.png" width="50%" />
<img src="https://raw.github.com/dysf/sc_tweeter/master/docs/image_3.png" width="50%" />
<img src="https://raw.github.com/dysf/sc_tweeter/master/docs/image_4.png" width="50%" />
<img src="https://raw.github.com/dysf/sc_tweeter/master/docs/image_5.png" width="50%" />
<img src="https://raw.github.com/dysf/sc_tweeter/master/docs/image_6.png" width="50%" />


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

- sample_output: Sample SuperCollider code that is created, along with the resulting audio.
- test: Reference SuperCollider code that is used for standalone testing of SC integration. 
- leftovers: Experiments, abandoned ideas etc. that may be of interest.


