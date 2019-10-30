

(function () {

    function loadScript(href) {
        return new Promise((resolve, reject) => {
            var script = document.createElement('script');
            script.setAttribute('src', href);
            script.setAttribute('type', 'text/javascript');
            document.getElementsByTagName('head')[0].appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
        });
    }

    function loadDependencies(dependencies) {
        return new Promise((resolve, reject) => {
            Promise.all(dependencies.map(loadScript))
                .then(resolve, reject);
        });
    }

    loadDependencies([
            "https://code.jquery.com/jquery-3.4.1.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"
        ])
        .then(() => {
            console.log("Ready...");
            var socket = io("http://localhost:5555");
            socket.on("scrape-command", (command) => {
                console.log("recieved ",command);
                let response = "<p style=\"color:red\"> An Error Occured:</p>";
                try{
                    eval(command).then(res=>{   
                        socket.emit("scrape-response", res);
                    });
                }catch(e){
                    try{
                        response += `<br><p>${e.message}</p>`
                    }catch(e){
                        console.log(e);
            
                    }
                    socket.emit("scrape-response", response);

                }
            });
        }, console.error);




})()