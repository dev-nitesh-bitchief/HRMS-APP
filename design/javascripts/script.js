//Show toast....

    function displayMessage(message, duration='3000') {
     Toastify({
         text: message,
         duration: duration,
         newWindow: true,
         close: true,
         gravity: "top",
         position: "center",
         stopOnFocus: true,
         style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
         callback: function(){
             localStorage.removeItem('message');
           } // Callback after click
       }).showToast();
 }

