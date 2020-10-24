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
        node ${scriptFile} "<Input-Device-Name>" "<Output-Device-Name> (optional)"

 */

// when device argument is missing it will use the first midi device that has been found
const autoUseFirstDeviceFound = false

const easymidi = require('easymidi')

const outputDeviceNameDefault = 'Virtual MIDI output device - Auto NOTE OFF'
/**
 * 
 * @param {*} inputDeviceName The name of the MIDI input device. Must not be `null`.
 * @param {*} outputDeviceName The name of the output MIDI device. If `null` or empty then a virtual device will be created.
 * @param {*} verbose Set to `true` to log all received and sent MIDI messages to console
 */
const startAutoNoteOff = (inputDeviceName, outputDeviceName, verbose) => {
    const inputDevice = new easymidi.Input(inputDeviceName, false)
    const outputVirtual = new easymidi.Output(outputDeviceName || outputDeviceNameDefault, (outputDeviceName ? false : true))

    /** auto send note-off on note-on - begin */
    const deviceSource = inputDevice
    const deviceTarget = outputVirtual
    if (verbose) {
        console.log('DEBUG: listen on device', deviceSource.name)
    }
    if (verbose) {
        console.log('DEBUG: destination device', deviceTarget.name)
    }
    deviceSource.on('noteon', function (msg) {
        if (verbose) {
            console.log('DEBUG: received msg "noteon"', msg)
        }
        deviceTarget.send('noteon', msg)
        if (verbose) {
            console.log('DEBUG: sent msg "noteon"', msg)
        }
        const noteOffMsg = Object.assign(msg)
        noteOffMsg.velocity = 0
        deviceTarget.send('noteoff', noteOffMsg)
        if (verbose) {
            console.log('DEBUG: sent msg "noteoff"', noteOffMsg)
        }
    })
    /** auto send note-off on note-on - end */
}

/** main */
const path = require('path')
const scriptFile = path.parse(path.basename(process.argv[1])).name
// when started from a npm link script then no file extension is present ;-)
const startProgrammName = process.argv[1].endsWith('.js') ? 'node ' : ''

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
        ${startProgrammName}${scriptFile} "<Input-Device-Name>" "<Output-Device-Name> (optional)"

.   .   .   .   .   .   .   .   .   .   .   .  . 

Below is a list of recognized devices:
  Input devices (Target)
\t${easymidi.getInputs().length ? easymidi.getInputs().join('\n\t') : '<no device connected>'}

  Output devices
\t${easymidi.getOutputs().length ? easymidi.getOutputs().join('\n\t') : '<no device connected>'}

Example : 
       ${startProgrammName}${scriptFile} "${easymidi.getInputs()[0] || 'TDX-15 MIDI'}"
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
        if (!options.inputDeviceName) {
            options.inputDeviceName = item
        } else {
            options.outputDeviceName = item
        }
    }
})

if (options.help) {
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
if (autoUseFirstDeviceFound && !options.inputDeviceName && easymidi.getInputs().length === 1) {
    options.inputDeviceName = easymidi.getInputs()[0]
}


const main = async () => {
    // can create virtual device?
    const canCreateVirtualDevice = () => {
        let testVirtualDevice
        try {
            testVirtualDevice = new easymidi.Output('Test virtual device', true)
        } catch (e) {
            console.error(e)
            testVirtualDevice = null
        }
        const retVal = testVirtualDevice ? true : false
        if (testVirtualDevice) {
            try { testVirtualDevice.close() } catch (e) { console.error(e) }
        }
        return retVal
    }

    // promt for device selection
    const askForDevice = async (title, devices) => {
        const devList = []
        devices.filter((item, index, all) => {
            devList.push(`${index + 1}) ${item}`)
        })

        const rlp = require('readline')
        const rl = rlp.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        const prom = new Promise((resolve, reject) => {
            devList.push('')
            devList.push('Type key \'Enter\' to exit')
            rl.question(
                (title) + '\n' +
                ('\t' + devList.join('\n\t')) +
                ('\n') +
                'Enter number: ',
                (input) => {
                    rl.close()
                    resolve(input)
                }
            )
        })
        let selectedIndex = -2
        try {
            selectedIndex = await prom
            if (selectedIndex === '' || selectedIndex === '0' || selectedIndex === 'Enter') {
                // provoke exit
                selectedIndex = -2
            }
        } catch (e) {
            // nothing selected
        }
        if (!selectedIndex) {
            selectedIndex = 1
        }
        return devices[Number.parseInt(selectedIndex) - 1]
    }

    if (!options.inputDeviceName) {
        // ask for device from list
        const deviceName = await askForDevice('Select the input MIDI device', easymidi.getInputs())
        if (deviceName)
            options.inputDeviceName = deviceName
    }

    if (!options.inputDeviceName) {
        printUsage()
        console.log()
        console.log(' ⚠ ⚠ ⚠ ! Input MIDI device required ! ⚠ ⚠ ⚠')
        console.log()
        process.exit(1)
    }

    const requireOutputDevice = !canCreateVirtualDevice()
    if (!options.outputDeviceName && requireOutputDevice) {
        // ask for device from list
        const deviceName = await askForDevice('Select the output MIDI device', easymidi.getOutputs())
        if (deviceName)
            options.outputDeviceName = deviceName

        if (!options.outputDeviceName) {
            // printUsage()
            console.log()
            console.log(' ⚠ ⚠ ⚠ ! Output MIDI device required ! ⚠ ⚠ ⚠')
            console.log()
            console.log('This operating system is not able to create virtual MIDI devices.')
            console.log('You must select an existing MIDI device or')
            console.log('create a virtual device with 3rd-party software like')
            console.log('LoopMIDI from http://www.tobias-erichsen.de/software/loopmidi.html')
            console.log()
            process.exit(1)
        }
    }

    const testDeviceName = (deviceName, devices, errorMsg) => {
        const deviceFoundByName = devices.filter(item => item === deviceName)[0]
        if (!deviceFoundByName) {
            console.log()
            // console.log('⚠ 🎹 ! No MIDI INPUT DEVICE FOUND with name: "' + deviceName + '" !  🎹 ⚠')
            console.log(errorMsg)
            console.log('Run the following command to show a list of devices:')
            console.log(`\tnode ${scriptFile}`)
            console.log()
            process.exit(1)
        }
        return deviceFoundByName
    }

    const inputDevice = testDeviceName(options.inputDeviceName, easymidi.getInputs(), '⚠ 🎹 ! No MIDI INPUT DEVICE FOUND with name: "' + options.inputDeviceName + '" !  🎹 ⚠')
    const outputDevice = requireOutputDevice ? testDeviceName(options.outputDeviceName, easymidi.getOutputs(), '⚠ 🎹 ! No MIDI OUTPUT DEVICE FOUND with name: "' + options.outputDeviceName + '" !  🎹 ⚠') : null


    console.log(`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        ⭑ ⭑ ⭑ Auto MIDI NOTE OFF started ⭑ ⭑ ⭑ 

Listening on device:
    "${inputDevice}"

Setup your DAW to use the MIDI output device:
    "${requireOutputDevice ? outputDevice : outputDeviceNameDefault}"

                    🥁 🥁 🥁
`)


    startAutoNoteOff(inputDevice, outputDevice, options.verbose)
}

main()