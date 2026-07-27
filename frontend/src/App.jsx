import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");

  // メッセージ取得
  async function getMessages() {
    const response = await fetch("/api/messages");
    const data = await response.json();
    setMessages(data);
  }

  // メッセージ送信
  async function sendMessage(e) {
    e.preventDefault();

    await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        text,
      }),
    });

    setUsername("");
    setText("");
    getMessages();
  }

  useEffect(() => {
    getMessages();

    const timer = setInterval(getMessages, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container">
      <h1>チャット</h1>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="名前"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="メッセージ"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <button type="submit">送信</button>
      </form>

      <ul id="messages">
        {messages.map((msg) => (
          <li key={msg.id}>
            {msg.username}: {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;