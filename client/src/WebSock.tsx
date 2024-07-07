import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const WebSock = () => {
  const [messages, setMessages] = useState<any>([]);
  const [value, setValue] = useState<string>("");
  const socket = useRef<any>();
  const [connected, setConnected] = useState(false);
  const [userName, setUserName] = useState("");

  const sendMessage = async () => {
    const message = {
      userName,
      id: Date.now(),
      message: value,
      event: 'message'
    }
    socket.current.send(JSON.stringify(message));
    setValue('');
  };

  function Connect() {
    socket.current = new WebSocket("ws://localhost:5000");

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        userName,
        id: Date.now()
      }
      socket.current.send(JSON.stringify(message))
    };

    socket.current.onmessage = (event: { data: string; }) => {
      const message = JSON.parse(event.data);
      setMessages((prev: any) => [message, ...prev])
    };

    socket.current.onclose = () => {
      alert("Socket closed");
      setConnected(false);
    };

    socket.current.onerror = () => {
      alert("Socket error");
    };
  }

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            type="text"
          />
          <button onClick={Connect}>Войти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          />
          <button onClick={sendMessage}>Отправить</button>
        </div>
        <div className="messages">
          {messages.map((mess: { id: number; message: string, event: string, userName: string }) => (
            <div key={mess.id}>
              {mess.event === 'connection' 
              ? <div className="connection_message">Пользователь {mess.userName} подключился</div>
              : <div className="message">{mess.userName}: {mess.message}</div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSock;
