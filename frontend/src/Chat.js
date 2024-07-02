import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage(""); // Reset currentMessage state to clear the input
    }
  };

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Live-Chat Box</h3>
      </div>
      <div className="chat-body">
    <ScrollToBottom className="message-container">  
        {messageList.map((messageContent) => {
          return (
            <div
              className="message"
              id={username == messageContent.author ? "you" : "other"}
                key={messageContent.time} // Adding a unique key for each message
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                    <p>
                      {messageContent.author} {messageContent.time}
                    </p>
                </div>
              </div>
            </div>
          );
        })}
         </ScrollToBottom>
      </div>
     
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Message"
          value={currentMessage} // Controlled input value
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
