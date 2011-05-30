 function displayGreeting () {
   alert("sss")
document.getElementById('content_div').innerHTML="BLUE3";
   }
   // Pass the userprefs for this module instance to the function
   // (allows users to include multiple module instances on their page)
   gadgets.util.registerOnLoadHandler(displayGreeting); 