function wrap_data_for_Arduino_Dispense(PWM, dispenser_to_control, dispenserData) {
    var temp = dispenserData;
    var deviceNum = temp['deviceIndex'];
    // FIRST, PAD VALUES WITH 0's SUCH THAT THE VALUE IS 3 CHARACTERS LONG
    var dispenser_to_control_padded = zeroFill(deviceNum, 4);
    var PWMval_padded = zeroFill(PWM, 4);
    // CONCAT THE VALVE NUMBER AND PWM VALUE
    var pre_command = dispenser_to_control_padded.concat(PWMval_padded);
    // ADD A START CODON TO SIGNIFY THE BEGINING OF SIGNAL
    var startStr = '';
    var pre_command_s = startStr.concat(pre_command);
    // ADD A STOP CODON TO SIGNIFY THE END OF SIGNAL
    var command = pre_command_s.concat('\n');

    return command;
}
function sendCommandDispense(PWM, dispenser_to_control, dispenserData) {
    var command = wrap_data_for_Arduino_Dispense(PWM, dispenser_to_control, dispenserData);
    var message = "Sending to Arduino: ";
    var command_info = message.concat(command);
    console.log(command_info);
    toastr.info(command_info);
   // var socket = io('http://localhost:3000');
    //socket.emit('ComName', 'command_info' );


}
// ./ END DISPENSER FUNCTIONS

// HELPER FUNCTIONS FOR SENDING COMMANDS FOR BOTH VALVES AND DISPENSERS
function zeroFill( number, width ) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}
function paddy(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}


