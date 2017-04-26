
// functionality attached to valves

function valveControl(pumpData,Current_State){
   
    switch (Current_State){
        case "opened":
            console.log("Port " + pumpData.id + " selected");
            pumpData.Physical_State = 0;
            var valve_to_control = pumpData.id;
            var temp = pumpData;

            temp['Current_State'] = "closed";
            flipFlop_valveState(valve_to_control, temp);
            break;

        case "closed":
            console.log("Port " + pumpData.id + " clicked");
            valve_to_control = pumpData.id;
            pumpData.Physical_State = 1;
            // change recorded state in table
            var temp = pumpData;
            temp['Current_State'] = "opened";
            flipFlop_valveState(valve_to_control, temp);
            break;

        default:
           Current_State = "closed";
           break;
    }
   
}

function flipFlop_valveState(valve_to_control, pumpData) {
    var temp = pumpData;
    if (temp['Physical_State'] == 0) {
        temp['Physical_State'] = 1;
    }
    else {
        temp['Physical_State'] = 0;
    }
    sendCommand(temp);
    return false;
}


function valve_uL_to_PWM(uL_table,uL_precision,uL_goal) {
    for (var i=0; i <= uL_table.length; i=i+2) {
        if (uL_goal-uL_table[i] <= uL_precision/2) {
            return Math.round(uL_table[i+1]);
        }
    }
}

function wrap_data_for_Arduino(pumpData) {
    var valve_to_control = pumpData.id;
    var temp = pumpData;
    var deviceNum = temp['deviceIndex'];
    var open_state_parameter     = temp['Open_State'];
    var closed_state_parameter   = temp['Closed_State'];
    var physical_state_parameter = temp['Physical_State'];

    if (physical_state_parameter == 1)
    {
        var PWMval = open_state_parameter;
    }
    else
    {
        var PWMval = closed_state_parameter;
    }

    var initializeSetup_outputs = initializeSetup(180,460,0.69,3,0.88,0.25);
    var uL_table = initializeSetup_outputs.uL_table;
    var uL_precision = initializeSetup_outputs.uL_precision;
    PWMval = valve_uL_to_PWM(uL_table,uL_precision,PWMval);

    // FIRST, PAD THE VALVE_TO_CONTROL WITH 0's SUCH THAT THE VALUE IS 3 CHARACTERS LONG
    var valve_to_control_padded = zeroFill(deviceNum,4);
    // SECOND, PAD THE PWM VALUE WITH 0's SUCH THAT THE VALUE IS 4 CHARACTERS LONG
    var PWMval_padded = zeroFill(PWMval,4);
    // CONCAT THE VALVE NUMBER AND PWM VALUE
    var pre_command = valve_to_control_padded.concat(PWMval_padded);
    // ADD A START CODON TO SIGNIFY THE BEGINING OF SIGNAL
    var startStr = '';
    var pre_command_s = startStr.concat(pre_command);
    // ADD A STOP CODON TO SIGNIFY THE END OF SIGNAL
    var command = pre_command_s.concat('\n');
    // RETURN THE DATA
    return command;
}
function sendCommand(pumpData) {
    var command = wrap_data_for_Arduino(pumpData);
    var message = "Sending to Arduino: ";
    var command_info = message.concat(command);
    toastr.info(command_info);
  
}

