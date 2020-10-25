# midi-auto-note-off

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⭑ ⭑ ⭑ 🥁  Auto MIDI NOTE OFF  🥁 ⭑ ⭑ ⭑ 

This programm solves a common problem with certain e-drum sets
which do not send any MIDI *NOTE OFF* command what 
make a note last for ever.
Every note that is played will consume the total available polyphony and 
the DAW will not play any note from there on.

I have been confronted with this issue in Logic Pro X 
with the e-drum set Millenium HD-120

This programm adds to every MIDI *NOTE ON* command 
received from the target input device
an additional MIDI *NOTE OFF* command

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🥁 🥁 🥁   



## Download programm
Simply download any of this executables and start it with a double click
- [MAC OS Download](https://github.com/daniele-pecora/midi-auto-note-off/releases/download/1.0.1/midi-auto-note-off-macos.zip)
- [Linux Download](https://github.com/daniele-pecora/midi-auto-note-off/releases/download/1.0.1/midi-auto-note-off-linux.zip)
- [Windows Download](https://github.com/daniele-pecora/midi-auto-note-off/releases/download/1.0.1/midi-auto-note-off-win.zip)


### Running on windows

On Windows OS no virtual MIDI device can be created.  
This may be done via 3rd-party software like  
[LoopMIDI](http://www.tobias-erichsen.de/software/loopmidi.html) from http://www.tobias-erichsen.de/software/loopmidi.html



---

## Install via npm (alternative)

1) **Requirements**  
Make sure you have Node.js installed.  
Otherwise download and install Node.js from here  
https://nodejs.org/en/download/

2) **Install**    
    Install programm from a terminal, *Powershell* oder *Command Prompt*   
    ```bash
    npm install -g midi-auto-note-off
    ```

3) **Run programm**    
    Type in your terminal, *Powershell* oder *Command Prompt*
    ```bash
    midi-auto-note-off
    ```

    You will be asked to select a MIDI input device.
    If your OS doesn't support creating virtual output devices
    then you will also be asked to select a MIDI output device.

_Keep in mind: Windows OS will require existing MIDI output devices. See note 'Running on windows' on top of page._  




---

## Build (from source)

Checkout the source and run
```bash
$ npm install
$ npm run executable
```
This will create the excutable file for the specific os in directory `dist`.  
Every os specific executable must be built on the specific os.  
So the executables provided with the links above are built by the specific operating systems:   
- MAC OS Catalina 
- Ubuntu 20.04
- Windows 10

_Keep in mind: Windows OS will require existing MIDI output devices. See note 'Running on windows' on top of page._  
