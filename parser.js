function main()
{
    parser();
}

function parser()
{
    var txtBox = document.getElementById("textbox");
   // console.log("hi"+ " "+ txtBox );
    var lines  =  txtBox.value.split(";");
    //var arr = lines[0][0];
    //console.log("hi"+arr);
    document.getElementById("demo").innerHTML = lines;
    ///\b($word)\b/i
	
	var pat = /^at/i;   //Starting '^' has to be 'a' so it'll filter out words like cat, bat.
	var pat1 = /over/i; //No idea why
	var pat2 = /push/i;
	var pat3 = /pull/i;
	var pat4 = /open/i;
	var pat5 = /close/i; // for if we go with open and close
	
	//moved the above out of the loop so we don't need to initialize every iteration
	
    for(i = 0; i < lines.length - 1; i++)
    {
        var lineOne = lines[i];
        console.log(lineOne); 

        //Not ignoring spaces. Ergo, weird offsets.
        if(pat.test(lineOne) && pat1.test(lineOne))
        {
           var index1 = lineOne.search(pat); //getting the starting index of 'at'
           var index2 = lineOne.search(pat1);
            //console.log(index1); 
           var startIndex = index1 + 3;
           var endIndex = index2 - 2;
           var power = 0;
           var number = 0;
           for (j = endIndex; j>= startIndex; j-- )
            {
              number += lineOne[j] * Math.pow(10,power);
              power++;
              console.log(number);  
            }
            var startTime = number;
            if(pat2.test(lineOne))
            {
                var index3 = lineOne.search(pat2);
                startIndex = index2 + 5;
                endIndex = index3 - 2;
                power = 0;
                number = 0;
                for (k = endIndex; k>= startIndex; k-- )
                  {
                    number += lineOne[k] * Math.pow(10,power);
                    power++;
                    console.log(number);  
                }
                var duration = number;
                var endTime = duration - startTime;
            }
            if(pat3.test(lineOne))
            {
                var index3 = lineOne.search(pat3);
                startIndex = index2 + 5;
                endIndex = index3 - 2;
                power = 0;
                number = 0;
                for (k = endIndex; k>= startIndex; k-- )
                  {
                    number += lineOne[k] * Math.pow(10,power);
                    power++;
                    console.log(number);  
                }
                var duration = number;
                var endTime = duration - startTime;
            }
            if(pat4.test(lineOne))
            {
                var index3 = lineOne.search(pat4);
                startIndex = index2 + 5;
                endIndex = index3 - 2;
                power = 0;
                number = 0;
                for (k = endIndex; k>= startIndex; k-- )
                  {
                    number += lineOne[k] * Math.pow(10,power);
                    power++;
                    console.log(number);  
                }
                var duration = number;
                var endTime = duration - startTime;
            }
        }
        var object1 = {startTime: startTime, endTime: endTime};
        console.log(object1);

    }



}
// print out last line to page

// at 0 over 2 push In1 2000;