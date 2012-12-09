sctweeter
=========

Node.js based web application to create audio files for SuperCollider tweets. Potentially may include SoundCloud &amp; Twitter integration.

Requirements
=========
- Node.js
- SuperCollider

Instructions
=========
- Ensure /tmp/ is aviable as Read/Write
- Once the code has been pulled, run: <code>node index.js</code>
- Via a web browser, navigate to http://localhost:4040/

Features
=========

> **NOTE - The code is very early in development and is not safe to run on any public web server as it could expose your server to security/hacks.**

Current Features
---------

- Web based entry of SuperCollider code
- Generation of Audio based on command line execution of 'sclang'
- Streaming of generated audio to the browser

Planned Features
---------

- SoundCloud integration to upload/store resulting audio.
- Twitter integration to post resulting tweet.


Development Status
=========

- The application is in a proof of concept stage. The code does not account for multi-user support or security validation.

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

- Sample SuperCollider code that is created along with the resulting audio file is located in: sample_output
- Reference SuperCollider code that is used for standalone testing of SC integration is located in: test


