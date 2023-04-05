import { useVoice } from "../Context"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPlay, faStop} from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"

export default function Message({message}) {
    const {play, isPlaying, setIsChatOnGoing, pause} = useVoice()
    const [playc, setPlayc] = useState(false)
    return(
        <li className={message.ownedByCurrentUser ? 'sent' : 'replies'}>
            {message.ownedByCurrentUser ? <img src="/src/images/cybrosys.png" alt="" /> : <img src="/src/images/icon.png" alt="" />}
            <p style={message.ownedByCurrentUser ? { position: "relative"} : { position: "relative", paddingLeft: "30px"}}>{message.body}
            {message.isVoice && (
                <FontAwesomeIcon icon={playc ? faStop : faPlay} onClick={() => {
                    if(!isPlaying){
                        setIsChatOnGoing(true);
                        play(message.voice);
                        setPlayc(true)
                    } else {
                        pause();
                        setPlayc(false)
                    }
                }} style={message.ownedByCurrentUser ? {bottom: "5px", right: "10px", position: "absolute"} : {bottom: "5px", left: "10px", position: "absolute"}} />
                
            )}</p>
        </li>
    )
}