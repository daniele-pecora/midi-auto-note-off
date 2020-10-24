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



Install 

1) **Requirements**  
Make sure you have Node.js installed.  
Otherwise dowload and install Node.js from here  
https://nodejs.org/en/download/

2) **Install**    
    Install programm from a terminal, *Powershell* oder *Command Prompt*   
    ```bash
    npm install -g midi-auto-note-off
    ```

3) **Run programm**    
To run this programm you must know the e-drum set MIDI device name.  
Here is how you can find it out.
    - **Find device name**  
        Find out the MIDI device name by running the programm without any arguments  

        Type in your terminal, *Powershell* oder *Command Prompt*
        ```bash
        midi-auto-note-off
        ```
        This will output something like 
        ```bash
        Below is a list of recognized devices:
            Input devices (Target)
                VMPK Output
                "TDX-15 MIDI"
        ```
        In this example there are the 2 devices *VMPK Output* (a virtual piano keyboard) *TDX-15 MIDI* (my e-drum set).  
        _(the quotes are actually not part of the name)_

    - **Run**   
        Now grab the name of the e-drum set device and set it as argument after programm command:
        ```bash
        midi-auto-note-off "TDX-15 MIDI"
        ```
