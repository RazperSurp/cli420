<?php 

error_reporting(E_ALL); // Report all errors
ini_set('display_errors', '1'); // Display errors on screen
ini_set('display_startup_errors', '1'); // Display startup errors
ini_set('log_errors', '1'); // Log errors (optional, but good practice)

?>

<head>
    <title> tictactoe </title>
    <script src="./assets/ws.js"> </script>
    <link rel="stylesheet" href="./assets/main.css">
</head>
<body>
    <main> 
        <ul style="border-bottom: 1px solid black">
            <li> socket status: <span id="socket-status"><u> offline </u></span> </li>
            <li> socketclient id: <span id="client-id"> -1 </span>
        </ul>
        <form id="send">
            <select name="to" hidden>
                <option value="all" selected> - </option>
            </select>
            <input name="text" type="text">
            <button type="submit"> send </button>
        </form>
        <div id="history"> </div>
    </main>

</body>