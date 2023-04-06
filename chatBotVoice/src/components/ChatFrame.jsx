import Messages from "./Messages";
import { useRef } from "react";
import Recorder from "voice-recorder-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useVoice } from "../Context";
import { useState, useEffect } from "react";

import RecorderUI from "./RecordUi";
import Sidebar from "./sidebar";

export default function ChatFrame (){
    const [userChat, setUserChat] = useState("");
    let mesgRef = useRef(null);
    const {addChat, convo, setConvo, play, setIsChatLoading, setIsChatOnGoing, isChatOnGoing, apiKey} = useVoice();
    const onSend = (ev) => {
        ev.preventDefault();
        if(mesgRef.current.value.length > 0){
            let mesg = mesgRef.current.value;
            mesgRef.current.value = "";
                addChat({
                    body: mesg,
                    ownedByCurrentUser: false,
                    is_voice: false,
                    voice: false
                })
                setUserChat(mesg);
                setIsChatOnGoing(true);
        }
    }

  useEffect(() => {
    if (userChat.length > 0) {
        setIsChatLoading(true)
        fetch("http://localhost:8000/get_result", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: userChat,
                    conversation: convo,
                    key: apiKey
                })
            }).then(res => res.json()).then(data => {
                setIsChatLoading(false);
                addChat({
                    body: data.message,
                    ownedByCurrentUser: true,
                    isVoice: data.error ? false : true,
                    voice: data.voice,
                })
                if(!data.error){
                    play(data.voice);
                    setConvo(data.conversation);
                }
                else {
                    setIsChatOnGoing(false);
                }
            })
        }
    }, [userChat]);
    
    return(
        <div id="frame">
            <div className="content">
                <div className="contact-profile">
                    <img src="/src/images/cybrosys.png" alt="" />
                    <p>ChatBot</p>
                    <Sidebar/>
                </div>
                <Messages/>
                <div className="message-input">
                    <div className="wrap">
                        <input type="text" placeholder="Write your message..." ref={mesgRef} onKeyDown={
                            (ev) => {
                                if(ev.key === "Enter" && !isChatOnGoing && apiKey){
                                    onSend(ev);
                                }
                            }
                        }/>
                        <Recorder Render={RecorderUI}/>
                        <button className="submit" onClick={onSend} disabled={isChatOnGoing || !apiKey}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
