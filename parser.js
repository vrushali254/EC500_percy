var keywordAt     = /\bat/i;   // i: case insensitive and '\b' checks only for word at not 'thAT' etc.
var keywordOver   = /\bover/i; 
var keywordPush   = /\bpush/i;
var keywordPull   = /\bpull/i;
var keywordIn     = /\bIn/i; 
var keywordOut    = /\bOut/i;  
//ADDED keywords for valves and the action
var keywordVal    = /\bVal/i;
var keywordOpen   = /\bopen/i;
//Redundant keyword, eliminate later
var keywordSpace  = /\s/g; 

// at 0 over 2 push In1 2000;
// at 3 over 2 open Val1;

function main()
{
    scriptParser();
}

function scriptParser()
{
    var txtBox = document.getElementById("textbox");
    var lines  =  txtBox.value.split(";");  //Splits the lines in the textbox into individual array element.
    //Parsing one line at a time
    
    for(i = 0; i < lines.length - 1; i++)
    {
        var command = lines[i];
        //If the command typed in by the user is correct, then proceed.

        var syntaxCheck =  (keywordAt.test(command) && keywordOver.test(command) && (keywordPush.test(command) || keywordPull.test(command) || keywordOpen.test(command)));

        if(syntaxCheck)
        {
            var startTime = getStartTime(command); //To get the start time
            var endTime   = startTime + (getEndTime(command)); //Check the datatype returned and then separate the aciton & duration.
            var port      = getPort(command); //could be wither input or output
            var action    = getAction(command);
            if(keywordPush.test(command) || keywordPull.test(command))
            {
                var volume = getVolume(command);    
                     
            }
            // If the command is for controlling the valves, volume isn't needed but to conform to 
            // the uniformity of the 'info' object. 

            else if(keywordOpen.test(command))
            {
                var volume = 0;
            }
        } 
        //Please suggest what other information would be needed, 'action paamter will/can be added

        var info = {startTime: startTime, endTime: endTime, portNo: port, action: action, volume: volume};
    }
}
     
    
    
function getStartTime(command)
{
    /* while((arr = keywordAt.exec(command)) == !null)
    {
    var offset = keywordAt.lastIndex; //   accounting for the whitespace
    console.log(offset);
    console.log(keywordAt.lastIndex);
    }*/

    // var index1 = command.search(keywordAt); //getting the starting index of 'at'
    // var index2 = command.search(keywordOver);
    //console.log(index1); 
    var startIndex = (command.search(keywordAt)) + 3;
    var endIndex   = (command.search(keywordOver)) - 2;
    var power = 0;
    var startTime = 0;
    for (j = endIndex; j>= startIndex; j-- )
    {
        startTime += command[j] * Math.pow(10,power);
        power++;
        console.log(startTime);  
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
        //console.log(duration);  
    }
    return duration;
}

function getPort(command)
{
    var startIndex;
    var port = 0;
    //The below condition can be changed because if it is an input port, action will be keywordPush
    // as opposed to if it is an output port, action will be PULL.
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

   
// Using keywordSpace isn't working, therefore tried the below implementation. Works now.
function getPortNo(command, startIndex)
{
    var j = startIndex;
    var i = 0;
    var power = 0;
    var port = 0;
    var arr = [];
    while(command[j] != " " ) /*command.match(keywordSpace)*/
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
    while(command[j] != " ") /*command.match(keywordSpace)*/
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

