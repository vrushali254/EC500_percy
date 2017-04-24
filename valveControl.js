
// functionality attached to valves


function valveControl(pumpData,Current_State){
    //var location = getLocation(this.src);

    switch (Current_State){
        case "opened":
          //  $(this).attr("src", "../images/fluigi/valveMarkerClosed.svg");
            console.log("Port " + pumpData.id + " clicked");
            //Var declaration is weird.
            pumpData.Physical_State = 0;
            var valve_to_control = pumpData.id;

            // change recorded state in table
            var temp = pumpData;

            temp['Current_State'] = "closed";
            //localStorage.pumpData = JSON.stringify(temp);
            flipFlop_valveState(valve_to_control, temp);
            break;

        case "closed":
           // $(this).attr("src", "../images/fluigi/valveMarkerOpen.svg");
            console.log("Port " + pumpData.id + " clicked");
            valve_to_control = pumpData.id;
            pumpData.Physical_State = 1;
            // change recorded state in table
            var temp = pumpData;
            temp['Current_State'] = "opened";
            //localStorage.pumpData = JSON.stringify(temp);
            flipFlop_valveState(valve_to_control, temp);
            break;

        default:
           Current_State = "closed";
           break;
    }
   
}

/*
var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

function onclickanchortagDispense(){
    dispenser_to_control =pumpData.id;
    incrementDispenserPosition(dispenser_to_control);
    return false;
}

function activateDispenser(dispenserIDNum) {
    localStorage.activeDispenser = dispenserIDNum;
    localStorage.dispenserToControl = dispenserIDNum;
    updateDispenseProgressBar(dispenserIDNum);
}

function deactivateDispenser() {
    localStorage.activeDispenser = "none";
}

*/

function flipFlop_valveState(valve_to_control, pumpData) {
   // localStorage.portToControl = valve_to_control;
    var temp = pumpData;
    if (temp['Physical_State'] == 0) {
        //var temp = JSON.parse(localStorage.pumpData);//[valve_to_control]['Physical_State'] = 1;
        temp['Physical_State'] = 1;
        //localStorage.pumpData = JSON.stringify(temp);
    }
    else {
       // var temp = JSON.parse(localStorage.pumpData);//[valve_to_control]['Physical_State'] = 1;
        temp['Physical_State'] = 0;
       // localStorage.pumpData = JSON.stringify(temp);
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
    // var valve_to_control = (document.getElementById("ValveNumberSelector").value);
    var valve_to_control = pumpData.id;
    var temp = pumpData;
    var deviceNum = temp['deviceIndex'];

    //localStorage.MasterData = combine_pumpData_valveData();

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
    // --- Include code to serial.write() the command to the Arduino here --- //
    toastr.info(command_info);
    // console.log(command);
    //localStorage.setItem('myCommand', command);
  
}

