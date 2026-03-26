<?php 

error_reporting(E_ALL); // Report all errors
ini_set('display_errors', '1'); // Display errors on screen
ini_set('display_startup_errors', '1'); // Display startup errors
ini_set('log_errors', '1'); // Log errors (optional, but good practice)

?>

<head>
    <title> tictactoe </title>
    <script src="./assets/main.js"> </script>
    <script src="./assets/ws.js"> </script>
    <link rel="stylesheet" href="./assets/main.css">
</head>
<body>
    <main> 
        <div id="debug-info">
            <div> status: <span id="status"> offline </span> </div>
            <div> id: <span id="id"> n/a </span> </div>
            <div> token: <span id="token"> n/a </span> </div>
            <div> color: <span id="color"> n/a </span> </div>
        </div>
        <div id="screen">
            <form id="send">
                <select name="to" hidden>
                    <option value="all" selected> - </option>
                </select>
                <div id="cli-input">
                    <div> 
                        <span id="name">anonymous</span><span>@</span><span id="path">all</span><span>></span>
                    </div>
                    <input name="text" type="text">
                </div>
                <button type="submit"> send </button>
            </form>
            <div id="history--wrapper">
                <div id="history"> </div>
            </div>
        </div>
    </main>

</body>