import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://p2p-chat-backend.onrender.com", {
  transports: ["websocket"],
});

function App() {
  const [myId, setMyId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      setMyId(socket.id);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [
        ...prev,
        `From ${data.from}: ${data.message}`,
      ]);
    });

    return () => {
      socket.off("connect");
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (!message || !targetId) return;

    socket.emit("send-message", {
      target: targetId,
      message: message,
    });

    setMessages((prev) => [...prev, `Me: ${message}`]);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>P2P Chat App</h2>

      <p>
        <strong>Your Socket ID:</strong> {myId || "Connecting..."}
      </p>

      <input
        placeholder="Enter target Socket ID"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <textarea
        rows="6"
        style={{ width: "100%" }}
        value={messages.join("\n")}
        readOnly
      />

      <input
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", marginTop: "10px" }}
      />

      <button onClick={sendMessage} style={{ marginTop: "10px" }}>
        Send Message
      </button>
    </div>
  );
}

export default App;
