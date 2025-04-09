import { Link } from "react-router";
import { Button, Form, Input, Modal, Select } from "antd";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router";


const SAVE_INTERVAL_MS = 2000;

export default function CollabContent() {
    //value is the code data
    const [value, setValue] = useState('')
    const [socket, setSocket] = useState<Socket | null>(null)
    //const {id:collabId} = useParams();
    //this suppose to be the session id
    const collabId = "123";
    const [isTyping, setIsTyping] = useState(false); //track user input
    const [status, setStatus] = useState(false);

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

    useEffect(()=> {
        if(!socket) return;

        const interval = setInterval(() => {
            socket.emit('save-data', value);
        }, SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval);
        }

    }, [socket, value])
    

    useEffect(()=>{
        if(!socket) return;
        socket.once("load-collab", (collabValue) => {
            setValue(collabValue);
        });
        socket.emit("get-collab", collabId);

        
    }, [socket, collabId])

    useEffect(()=>{
        if(!socket) return;
        socket.on("receive-end-session", (data) => {
            alert(`User ${data} have decided to leave the session`);
        })
    }, [socket])

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

     useEffect(() => {
        if(!socket) return;

        if(status == true){
            socket.emit("send-status", collabId);
        }
     }, [socket, status])
    
     const endSession = () => {
        if(!socket) return;
        socket.emit("send-end-session", socket.id);
    }
    
  return (
    <div className='App'>
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
        <Button onClick= {endSession}>End Session</Button>
    </div>
    
  )
}
