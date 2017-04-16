function main()
{
    parser();
}

function parser()
{
    var txtBox = document.getElementById("textbox");
    var lines  =  txtBox.value.split("\n");
    document.getElementById("demo").innerHTML = lines;
}
// print out last line to page


