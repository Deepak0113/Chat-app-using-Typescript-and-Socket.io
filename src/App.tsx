import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { io, Socket } from "socket.io-client";

const CONNECTION_PORT = "http://localhost:8080";
const socket = io(CONNECTION_PORT, { transports: ['websocket'] });
socket.emit("join-room", "chatarea")

interface Messages {
    roomid: string;
    userid: string;
    msg: string;
}

export const App = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Messages[]>([]);

    useEffect(() => {
        socket.on("recive-msg", (data) => {
            setMessages([...messages, data]);
        })
    }, [messages])

    const handleMessage = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const messageDetails = {
            roomid: "chatarea",
            userid: socket.id,
            msg: message
        }
        socket.emit("send-msg", messageDetails);
        setMessages([...messages, messageDetails]);
        setMessage("");
    }

    return (
        <div className="app">
            <div className="app-message">
                {
                    messages?.map((item, key) => (
                        item.userid === socket.id ?
                        <p key={key}>{item.msg}</p> :
                        <p key={key} className="reciver-msg">{item.msg}</p>
                    ))
                }
            </div>
            <form>
                <input type="text" placeholder="messages" value={message} onChange={handleMessage} />
                <input type="submit" value="Send" onClick={handleSubmit}/>
            </form>
        </div>
    )
}