"use client"

import { AlertTriangleIcon, LoaderIcon } from "lucide-react"
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms"
import { WidgetHeader } from "../components/widget-header"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { useAction, useMutation } from "convex/react"
import { api } from "@workspace/backend/convex/_generated/api"
import { Id } from "@workspace/backend/convex/_generated/dataModel"

type initStep = "storage"|"org"|"session"|"settings"|"vapi"|"done"

export const WidgetLoadingScreen = ({organizationId}:{organizationId:string|null})=>{
    const [step,setStep] = useState<initStep>("org")
    const [sessionValid,setSessionValid] = useState(false)

    const loadingMessage = useAtomValue(loadingMessageAtom)
    const setErrorMessagge = useSetAtom(errorMessageAtom)
    const setScreen = useSetAtom(screenAtom)
    const setLoadingMessage = useSetAtom(loadingMessageAtom)
    const setOrganizationId = useSetAtom(organizationIdAtom)
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))

    const validateOrg = useAction(api.public.organizations.validate)

    useEffect(()=>{
        if(step!== "org"){
            return 
        }
        setLoadingMessage("Finding organization ID...")
        if(!organizationId){
            setErrorMessagge("Organization ID requried")
            setScreen("error")
            return
        }
        setLoadingMessage("verifying organization...")

        validateOrg({organizationId}).then((result)=>{
            if(result.valid){
                setOrganizationId(organizationId)
                setStep("session")
            }else{
                setErrorMessagge(result.reason||"Invalid Configuration")
                setScreen("error")
            }
        }).catch(()=>{
            setErrorMessagge("Unable to verfiy")
            setScreen("error")
        })
    },[step,organizationId,setErrorMessagge,setScreen,setStep])

    const validateContactSession = useMutation(api.public.contactSessions.validate)
    useEffect(() => {
    if(step!=="session"){
        return
    } 
    setLoadingMessage("Finding contact session ID...")
    if(!contactSessionId){
        setSessionValid(false)
        setStep("done")
        return
    } 
    setLoadingMessage("Validating session...")

    validateContactSession({
        contactSesssionId:contactSessionId as Id<"contactSessions">
    }).then((result)=>{
        setSessionValid(result.valid)
        setStep("done")
    }).catch(()=>{
        setSessionValid(false)
        setStep("done")
    })

 
    }, [step,contactSessionId,validateContactSession,setLoadingMessage])

    useEffect(()=>{
        if(step!=="done"){
            return
        }

        const hasValidSession  = contactSessionId && sessionValid
        console.log(screenAtom)

        setScreen(hasValidSession?"selection":"auth")

    },[step,contactSessionId,sessionValid,setScreen])
    

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
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
                <LoaderIcon className="animate-spin"/>
                <p className="text-sm">
                    {loadingMessage|| "Loading...."}
                </p>
            </div>
        </>
    )
}