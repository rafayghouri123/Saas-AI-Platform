import { useEffect, useState } from "react"
import Vapi from "@vapi-ai/web"



interface TranscriptMessage{
    role:"user" | "assistance",
    text:string
}

export const useVapi = ()=>{
    const [vapi,setVapi]=useState<Vapi | null>(null)
    const [isConnected,setIsConnected] = useState(false)
    const [isConnecting,setIsConnecting] = useState(false)
    const [isSpeaking ,setIsSpeaking] = useState(false)
    const [transcript,setTranscript] = useState<TranscriptMessage[]>([])

    useEffect(()=>{
        const vapiInstance = new Vapi("ee5d70b9-38c1-4db3-8799-85e4d2807633")
        setVapi(vapiInstance)

        vapiInstance.on("call-start",()=>{
            setIsConnected(true)
            setIsConnecting(false)
           
            setTranscript([])
        })

        vapiInstance.on("call-end",()=>{
            setIsConnected(false)
            setIsConnecting(false)
            setIsSpeaking(false)
          
        })

        vapiInstance.on("speech-start",()=>{
            setIsSpeaking(true)
        })

        vapiInstance.on("speech-end",()=>{
            setIsSpeaking(false)
        })

        vapiInstance.on("error",(err)=>{
            console.log(err,"VAPI_ERROR")
            setIsConnected(false)
        })

        vapiInstance.on("message",(message)=>{
            if(message.type ==="transcript"  && message.transcriptType==="final"){
                setTranscript((prev)=>[...prev,{
                    role:message.role === "user" ? "user" :"assistance",
                    text:message.transcript

                }])
            }
        })

        return()=>{

            vapiInstance?.stop()
        } 

    },[])
    
    const startCall=()=>{
    setIsConnecting(true)

    if(vapi){
        vapi.start("e4ce20aa-4f26-459a-a0d6-460016b9cc58")
    }
    }

    const endCall=()=>{
        if(vapi){
            vapi.stop()
        }
    }
    return {
        isSpeaking,
        isConnected,
        isConnecting,
        transcript,
        startCall,
        endCall
    }
}
