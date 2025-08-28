"use client"

import { AlertTriangleIcon, ChevronRight, ChevronRightIcon, LoaderIcon, MessageSquareIcon, MessageSquareTextIcon } from "lucide-react"
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms"
import { WidgetHeader } from "../components/widget-header"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { useAction, useMutation } from "convex/react"
import { api } from "@workspace/backend/convex/_generated/api"
import { Id } from "@workspace/backend/convex/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { WidgetFooter } from "../components/widget-footer"

type initStep = "storage"|"org"|"session"|"settings"|"vapi"|"done"

export const WidgetSelectionScreen = ()=>{
    const [isPending,setIsPending] = useState(false)

    const setScreen = useSetAtom(screenAtom)
    const setConversationId = useSetAtom(conversationIdAtom)
    const organizationId = useAtomValue(organizationIdAtom)
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId||""))
    const setErrorMessage = useSetAtom(errorMessageAtom)

    const createConversation = useMutation(api.public.conversations.create)

    const handleNewConversation = async()=>{
        if(!organizationId){
            setScreen("error")
            setErrorMessage("Missing Organization ID")
            return
        }
        
        if(!contactSessionId){
            setScreen("auth")
            return
        }
        setIsPending(true)
        try {
            const conversationId = await createConversation({
                contactSessionId,
                organizationId

            })
            setConversationId(conversationId)
            setScreen("chat")
        } catch {
            setScreen("auth")
        }finally{
            setIsPending(false)
        }
    }

    return(
        <>
            <WidgetHeader>
                 <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                <p className="font-semibold text-3xl">
                    Hi There! 🖐️
                </p>
                <p className="font-semibold text-lg">
                    Let's get you started
                </p>
            </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col items-center  gap-y-4 p-4 overflow-y-auto">
                <Button className="h-14 w-full justify-between"
                        variant="outline"
                        onClick={handleNewConversation}
                        disabled={isPending}>
                    <div className="flex items-center gap-x-2">
                        <MessageSquareTextIcon className="size-4"/>
                        <span>Start chat</span>
                    </div>
                    <ChevronRightIcon/>
                </Button>
                
            </div>
            <WidgetFooter/>
        </>
    )
}