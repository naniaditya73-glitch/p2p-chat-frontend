import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://p2p-chat-backend.onrender.com");

function App() {
  const [socketId, setSocketId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("chat-message", (data) => {
      setMessages((prev) => [
        ...prev,
        `From ${data.from}: ${data.message}`,
      ]);
    });

    return () => {
      socket.off("connect");
      socket.off("chat-message");
    };
  }, []);

  const sendMessage = () => {
    if (!targetId || !message) return;

    socket.emit("chat-message", {
      target: targetId,
      message: message,
    });

    setMessages((prev) => [...prev, `Me: ${message}`]);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>P2P Chat App</h2>

      <p><b>Your Socket ID:</b></p>
      <p>{socketId}</p>

      <hr />

      <input
        type="text"
        placeholder="Enter target Socket ID"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <div
        style={{
          border: "1px solid #ccc",
          height: "200px",
          padding: "10px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={sendMessage} style={{ width: "100%" }}>
        Send Message
      </button>
    </div>
  );
}

export default App;
