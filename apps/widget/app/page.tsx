"use client"
import { Button } from "@workspace/ui/components/button"
import { useVapi } from "@/modules/widget/hooks/use-vapi"

export default function Page() {

   const {
        isSpeaking,
        isConnected,
        isConnecting,
        transcript,
        startCall,
        endCall}= useVapi()
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World/ Widget</h1>
      
        <Button size="sm" onClick={()=>{startCall()}} >Start call</Button>
         <Button size="sm" onClick={()=>{endCall()}} variant="destructive" >End call</Button>
     
      </div>
      <p>isConnected:{`${isConnected}`}</p>
      <p>isConnecting:{`${isConnecting}`}</p>
      <p>isSpeaking:`${isSpeaking}`</p>
      <p>{JSON.stringify(transcript,null,2)}</p>
    </div>
  )
}
