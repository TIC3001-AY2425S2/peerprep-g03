import { Link } from "react-router";
import { Button, Form, Input, Modal, Select } from "antd";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router";


export default function CollabContent() {
    const [value, setValue] = useState('')
    const [socket, setSocket] = useState<Socket | null>(null)
    const {id:collabId} = useParams();
    const [isTyping, setIsTyping] = useState(false); //track user input

    console.log(collabId);

    useEffect(() => {
        const s = io("http://localhost:4002")
        setSocket(s);
        return () => {
            s.disconnect();
        }
    }, [])

    useEffect(() => {
       if(!socket || !isTyping) return;
       socket.emit("send-changes", value);
    }, [value])

    useEffect(()=>{
        if(!socket) return;
        socket.once("load-collab", (collabValue) => {
            setValue(collabValue);
        });
        socket.emit("get-collab", collabId);
    }, [socket, collabId])

    useEffect(() => {
        if(!socket) return;

        const handler = (newValue: string) => {
            if (!isTyping) {
                setValue(newValue);
            }
        };

        socket.on("receive-changes", handler)

        return () => {
            socket.off("receive-changes", handler)
        }

     }, [socket, isTyping])
    
    
  return (
    <Input.TextArea
        placeholder="Enter your code here"
        rows={23}
        onChange={(e) => {
            setIsTyping(true)
            setValue(e.target.value)
            setTimeout(() => setIsTyping(false), 500)
        }}
        value={value}
    />
  )
}
