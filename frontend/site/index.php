<?php require_once('./backend/script/autoload.php'); ?>

<head></head>
    <title> tictactoe </title>
    <script src="./assets/main.js"> </script>
    <script src="./assets/ws.js"> </script>
    <link rel="stylesheet" href="./assets/main.css">
</head>
<body>
    <main> 
        <div id="debug-info">
            <div> status: <span id="socket-status"> offline </span> </div>
            <div> id: <span id="client-id"> -1 </span> </div>
        </div>
        <div id="screen">
            <form id="send">
                <select name="to" hidden>
                    <option value="all" selected> - </option>
                </select>
                <div id="cli-input">
                    <div> 
                        <span id="name">anonymous</span><span>@</span><span id="channel">all</span><span>></span>
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