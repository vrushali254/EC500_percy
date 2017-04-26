var keywordAt     = /\bat/i;   // i: case insensitive and '\b' checks only for word at not 'thAT' etc.
var keywordOver   = /\bover/i;
var keywordPush   = /\bpush/i;
var keywordPull   = /\bpull/i;
var keywordIn     = /\bIn/i;
var keywordOut    = /\bOut/i;
var keywordVal    = /\bVal/i;
var keywordOpen   = /\bopen/i;
var commands = [];
var startTime = 0;
var endTime = 0;
var volume = 0;
var port = 0;
var orientation = "pull";
var HW_shield = 1;
var HW_pin = 0;
var deviceIndex = 0;
var Min = 0;
var Max = 0;

function main()
{
    scriptParser();
}

function scriptParser()
{
    var txtBox = document.getElementById("textbox");
     lines  = txtBox.value.split(";");  //Splits the lines in the textbox into individual array element.
      
    for(i = 0; i < lines.length - 1; i++)
    {
        var command = lines[i];
        //If the command typed in by the user is correct, then proceed.
        var syntaxCheck =  (keywordAt.test(command) && keywordOver.test(command) && (keywordPush.test(command) || keywordPull.test(command) || keywordOpen.test(command)));

        if(syntaxCheck)
        {
            var startTime = getStartTime(command) * 1000; //To get the start time in milliseconds
            var endTime   = getEndTime(command); 
            var port      = getPort(command); 
            var action    = getAction(command);
            if(keywordPush.test(command) || keywordPull.test(command))
            {
                var volume = getVolume(command);  

                //getDispenserData(startTime,endTime, port, action, volume);
                var dispenserData = {
                                        startTime      : startTime,
                                        endTime        : endTime,
                                        id             : port,
                                        orientation    : action,
                                        volume         : volume,
                                        HW_shield      : 1,
                                        HW_pin         : port, 
                                        deviceIndex    : port,
                                        Current_State  : 0,
                                        Min            : 0,
                                        Max            : 0,
                                        Precision      : 0,
                                    };  
                getDispenserData(dispenserData, i);    
            }
            else if(keywordOpen.test(command))
            {
                getPumpData(startTime,endTime, port, action)
            }
        } 
        else
        {
            alert("Check syntax!");
        }

    }
}
     
    
//function getDispenserData(startTime,endTime, port, action, volume)
function getDispenserData(dispenserData, i)
{
    
    commands[i] = dispenserData;
    console.log('Object' + commands[i]);
    if( i == (lines.length-2))
    {
        actutate(commands);
    }


    //setTimeout( function() {sendDispense(dispenserData)}, commands.startTime);
} 

function actutate(commands)
{   
    var k = 0;
    var j = 0;
    for(k = 0; k <= commands.length - 1; k++)
    {
        //var temp = commands[i];
        for(j = k + 1; j <= commands.length - 1; j++)
        {
            if (commands[k]["id"] == commands[j]["id"])
            {
                if(commands[k].orientation == "pull")
                {
                    commands[j]["Current_State"] = commands[k]["Current_State"] + commands[k]["volume"]; 
                    break;
                }
                else if(commands[k].orientation == "push")
                {
                    commands[j]["Current_State"] = commands[k]["Current_State"] - commands[k]["volume"]; 
                    break;
                } 
            }
        }

    }

    for(var h = 0; h <= commands.length -1; h++)
    {
        var dispenserData = commands[h];
        setTimeout( function() {sendDispense(dispenserData)}, dispenserData.startTime);
    } 

}

function getPumpData(startTime,endTime, port, action)
{
    var pumpData = {};
    pumpData["id"] = port;
    pumpData["HW_shield"]      = 1;
    pumpData["HW_pin"]         = port;
    pumpData["deviceIndex"]    = port;
    pumpData["Open_State"]     = 0;
    pumpData["Closed_State"]   = 100;
    pumpData["Current_State"]  = "closed";
    pumpData["Physical_State"] = 0;
    setTimeout( function() {valveControl(pumpData, "closed")}, startTime);
    setTimeout( function() {valveControl(pumpData, "opened")}, startTime + (endTime * 1000));
}

function getStartTime(command)
{
    var startIndex = (command.search(keywordAt)) + 3;
    var endIndex   = (command.search(keywordOver)) - 2;
    var power = 0;
    var startTime = 0;
    for (j = endIndex; j>= startIndex; j-- )
    {
        startTime += command[j] * Math.pow(10,power);
        power++;
    }
    return startTime;
}

function getEndTime(command)
{
    var startIndex = (command.search(keywordOver)) + 5;
    var endIndex;
    var power = 0;
    var duration = 0;
    if(keywordPush.test(command))
    {
            endIndex = (command.search(keywordPush)) - 2;
    }
    else if(keywordPull.test(command))
    {
            endIndex = (command.search(keywordPull)) - 2;
    }   
    else if(keywordOpen.test(command))
    {
        endIndex = (command.search(keywordOpen)) - 2;
    }         
    for (j = endIndex; j>= startIndex; j-- )
    {
        duration += command[j] * Math.pow(10,power);
        power++;
    }
    return duration;
}

function getPort(command)
{
    var startIndex;
    var port = 0;
    if(keywordIn.test(command))
    {
        startIndex = (command.search(keywordIn)) + 2;
        port = getPortNo(command, startIndex);

    }
    else if(keywordOut.test(command))
    {
        startIndex = (command.search(keywordOut)) + 3;
        port = getPortNo(command, startIndex);
    }
    else if(keywordOpen.test(command))
    {
        startIndex = (command.search(keywordVal)) + 3;
        port = getValveNo(command, startIndex);
    }
    return port;
}

function getPortNo(command, startIndex)
{
    var j = startIndex;
    var i = 0;
    var power = 0;
    var port = 0;
    var arr = [];
    while(command[j] != " " ) 
    {   
        arr[i] = command[j];
        i++;
        j++;
    }
    for (j = (arr.length - 1); j>= 0; j-- )
    {
        port += arr[j] * Math.pow(10,power);
        power++;
    }
return port;
}

function getValveNo(command, startIndex)
{
    var arr = [];
    var port = 0;
    var power = 0;
    var j = startIndex;
    var endIndex = command.length - 1;
    var j = endIndex;
    for (j = startIndex; j <= endIndex; j++ )
    {
        port += command[j] * Math.pow(10,power);
        
        power++;
    }
    return port;
}

function getAction(command)
{
    var action;
    if(keywordPush.test(command))
    {
            action = "push";
    }
    else if(keywordPull.test(command))
    {
            action = "pull";
    }   
    else if(keywordOpen.test(command))
    {
        action = "open";
    }    
    return action;
}

function getVolume(command)
{   
    var arr = [];
    var i = 0;
    var volume = 0;
    var power = 0;
    var endIndex = command.length - 1;
    var j = endIndex;
    while(command[j] != " ")
    {   
        arr[i] = command[j];
        i++;
        j--;
    }

    for (j = 0; j <= (arr.length - 1); j++ )
    {
        volume += arr[j] * Math.pow(10,power);
        power++;
    }
    return volume;
}

