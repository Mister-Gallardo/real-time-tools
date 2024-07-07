import axios from "axios";
import React, { useEffect, useState } from "react";

const LongPulling = () => {
  const [messages, setMessages] = useState<any>([]);
  const [value, setValue] = useState<string>();

    useEffect(() => {
        subscribe();
    }, [])

    const subscribe = async () => {
        try {
            const {data} = await axios.get('http://localhost:5000/get-messages');
            setMessages((prev: any) => [data, ...prev]);
            await subscribe();
        } catch (e) {
            setTimeout(subscribe, 500);
        }
    }

  const sendMessages = async () => {
    await axios.post("http://localhost:5000/new-messages", {
      message: value,
      id: Date.now(),
    });
  };

  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          ></input>
          <button onClick={sendMessages}>Отправить</button>
        </div>
        <div className="messages">
          {messages.map((mess: { message: string; id: number }) => (
            <div className="message" key={mess.id}>
              {mess.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LongPulling;
