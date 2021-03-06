
// Controls initializing dispensers if they have not been already
// triggers commands to be sent for dispensing
// functionality for changing dispenser orientation

function sendDispense(dispenserData){
    // VALUES FROM THE FORM:
    var volume = dispenserData.volume; 
    var time   = dispenserData.endTime;
    var dispenserID = dispenserData.id;
    console.log(dispenserID);
    if(isNaN(volume)){
        toastr.error("Please enter a valid number for dispense volume.");
        return false;
    }
    else if (isNaN(time)){
        toastr.error("Please enter a valid number for dispense time.");
        return false;
    }
    else{
        
        var currentVolume = dispenserData.Current_State;
        // Hardware computations
        // Digital Servos 12cc
        var initializeSetup_outputs = initializeSetup(1000,2500,0.625,3,0,0.25);
        var PWM_table = initializeSetup_outputs.PWM_table;
        var PWM_dic = initializeSetup_outputs.PWM_dic;
        var uL_table = initializeSetup_outputs.uL_table;
        var uL_dic = initializeSetup_outputs.uL_dic;
        var uL_min = initializeSetup_outputs.uL_min;
        var uL_max = initializeSetup_outputs.uL_max;
        var uL_precision = initializeSetup_outputs.uL_precision;

        var temp = dispenserData;
        temp['Min']       = (uL_min).toString();
        temp['Max']       = (uL_max).toString();
        temp['Precision'] = (uL_precision).toString();

        temp['Min']       = (uL_min.toFixed(2)).toString();
        temp['Max']       = (uL_max.toFixed(2)).toString();
        temp['Precision'] = (uL_precision.toFixed(2)).toString(); 
       
       
        var dispOrientation = dispenserData.orientation;   // determine whether is pull/push dispenser
        var valueToDispense;

        // COMPUTE VALUE TO PASS INTO even_uL_steps()
        if(dispOrientation === "push"){
            valueToDispense = currentVolume - parseFloat(volume);
            if(valueToDispense < 0){
               toastr.error("Requested dispense volume exceedes remaining syringe volume");
            }
        }
        else {      // pull orientaion
            valueToDispense = currentVolume + parseFloat(volume);
            if(valueToDispense >= (parseFloat(temp['Max']) - parseFloat(temp['Current_State']))){
               toastr.error("Requested dispense volume exceedes remaining syringe volume");
            }
        }
        var even_uL_steps_output = even_uL_steps(uL_table, PWM_table, uL_precision, currentVolume, valueToDispense, time);   // [0] is seconds/step [1] is PWM value array to be sent
        // values needed for dispense rate
        var msecondsPerStep = even_uL_steps_output.seconds_per_step * 1000; // must be in milliseconds
        var stepsPerSecond = even_uL_steps_output.steps_per_second; // conversions only for commands being sent at the moment (this way its easier to update the current volume)
        var PWMvalueArray = even_uL_steps_output.PWM_values;

        // iterate over command array at appropriate time intervals
        for(i = 0; i < PWMvalueArray.length; i++)
        {
            (function () {
                // need to re-define some variables here due to scope
                var iPrime = i;
                var dispenser_to_control = dispenserID;
                setTimeout(function(){
                    if(PWMvalueArray[iPrime] != PWMvalueArray[iPrime - 1]) {
                        temp['Current_State'] = (PWM_dic[PWMvalueArray[iPrime]]).toString();
                        sendCommandDispense(PWMvalueArray[iPrime], dispenser_to_control, dispenserData);     // now send command
                    }

                }, i*msecondsPerStep);
            })();
        }
        return false;
    }
}

