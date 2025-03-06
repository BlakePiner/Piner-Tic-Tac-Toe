document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.connection === "undefined") {
        window.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7213/gameHub") // Ensure correct backend URL
            .configureLogging(signalR.LogLevel.Information)
            .build();

        window.connection.start()
            .then(() => console.log("✅ SignalR Connected!"))
            .catch(err => console.error("❌ SignalR Connection Error: ", err));
    }

    // Handle player moves
    document.querySelectorAll(".cell").forEach((cell, index) => {
        cell.addEventListener("click", function () {
            if (!cell.innerText.trim()) {
                let player = "X"; // Change this dynamically for turns
                cell.innerText = player;
                window.connection.invoke("SendMove", index, player)
                    .catch(err => console.error("Error sending move:", err));
            }
        });
    });

    // Receive moves from opponent
    window.connection.on("ReceiveMove", (cellIndex, player) => {
        document.querySelectorAll(".cell")[cellIndex].innerText = player;
    });

    // Ensure reset button exists before adding event listener
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            window.connection.invoke("ResetGame")
                .catch(err => console.error("Error resetting game:", err));
        });
    } else {
        console.warn("⚠️ resetBtn not found in DOM.");
    }

    // Reset game when event is received
    window.connection.on("GameReset", () => {
        document.querySelectorAll(".cell").forEach(cell => (cell.innerText = ""));
    });
});
