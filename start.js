#!/usr/bin/env node
/** 
 @author Superfusion Mobile - superfusion.mobile@googlemail.com

 - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    ⭑ ⭑ ⭑ 🥁  Auto MIDI NOTE OFF  🥁 ⭑ ⭑ ⭑ 

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

              🥁 🥁 🥁   

- - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Usage : 
        node ${scriptFile} "<Target-Device-Name>"

 */
const easymidi = require('easymidi')

const outputDeviceNameDefault = 'Virtual MIDI output device - Auto NOTE OFF'

const startAutoNoteOff = (inputDeviceName, outputDeviceName, verbose) => {
    const inputDevice = new easymidi.Input(inputDeviceName, false)
    const outputVirtual = new easymidi.Output(outputDeviceName || outputDeviceNameDefault, true)

    /** auto send note-off on note-on - begin */
    const deviceSource = inputDevice
    const deviceTarget = outputVirtual
    if (verbose) {
        console.log('listen on device', deviceSource.name)
    }
    if (verbose) {
        console.log('destination device', deviceTarget.name)
    }
    deviceSource.on('noteon', function (msg) {
        if (verbose) {
            console.log('received msg "noteon"', msg)
        }
        deviceTarget.send('noteon', msg)
        if (verbose) {
            console.log('sent msg "noteon"', msg)
        }
        const noteOffMsg = Object.assign(msg)
        noteOffMsg.velocity = 0
        deviceTarget.send('noteoff', noteOffMsg)
        if (verbose) {
            console.log('sent msg "noteoff"', noteOffMsg)
        }
    })
    /** auto send note-off on note-on - end */
}


/** main */
const scriptFile = require('path').basename(process.argv[1])

const printUsage = () => {
    const usage = `
- - - - - - - - - - - - - - - - - - - - - - - - - - - - 
      ⭑ ⭑ ⭑ 🥁  Auto MIDI NOTE OFF  🥁 ⭑ ⭑ ⭑ 

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

                   🥁 🥁 🥁   

- - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Usage : 
        node ${scriptFile} "<Target-Device-Name>"

.   .   .   .   .   .   .   .   .   .   .   .  . 

Below is a list of recognized devices:
  Input devices (Target)
\t${easymidi.getInputs().length ? easymidi.getInputs().join('\n\t') : '<no device connected>'}

  Output devices
\t${easymidi.getOutputs().length ? easymidi.getOutputs().join('\n\t') : '<no device connected>'}

Example : 
       node ${scriptFile} "${easymidi.getInputs()[0] || 'TDX-15 MIDI'}"
- - - - - - - - - - - - - - - - - - - - - - - - - - - - 
`
    console.log(usage)
}

const options = {}
process.argv.slice(2).filter(item => {
    if (item === '-h' || item === '--help' || -1 != item.indexOf('help')) {
        options.help = true
    } else if (item === '-v' || item === '--verbose') {
        options.verbose = true
    } else {
        options.deviceName = item
    }
})

if (options.help || !options.deviceName) {
    printUsage()
    process.exit(1)
}

if (!easymidi.getInputs().length) {
    printUsage()
    console.log('⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ')
    console.log('⚠ 🎹 ! NO MIDI INPUT DEVICE FOUND !  🎹 ⚠')
    console.log('⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ')
    process.exit(1)
}


const argDeviceSelected = options.deviceName
const deviceFoundByArg = easymidi.getInputs().filter(item => item === argDeviceSelected)[0]
if (!deviceFoundByArg) {
    console.log()
    console.log('⚠ 🎹 ! No MIDI INPUT DEVICE FOUND with name: "' + argDeviceSelected + '" !  🎹 ⚠')
    console.log('Run the following command to show a list of devices:')
    console.log(`\tnode ${scriptFile}`)
    console.log()
    process.exit(1)
}

console.log(`    ⭑ ⭑ ⭑ Auto MIDI NOTE OFF started ⭑ ⭑ ⭑ 

Listening on device:
    "${argDeviceSelected}"

Setup your DAW to use the MIDI output device:
    "${outputDeviceNameDefault}"

                    🥁 🥁 🥁
`)


startAutoNoteOff(deviceFoundByArg, null, options.verbose)