"use client"

import { useAtomValue } from "jotai"
import { WidgetFooter } from "../components/widget-footer"
import { WidgetHeader } from "../components/widget-header"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"
import { screenAtom } from "../../atoms/widget-atoms"
import { error } from "console"

interface Props{
    organizationId:string
}


export const WidgetView =({organizationId}:Props)=>{
    const screen = useAtomValue(screenAtom)

    const screenComponents= {
        error:<p>TODO:Error</p>,
        loading:<p>TODO:loading</p>,
        selection:<p>TODO:selection</p>,
        voice:<p>TODO:voice</p>,
        auth:<WidgetAuthScreen/>,
        inbox:<p>TODO:inbox</p>,
        chat:<p>TODO:chat</p>,
        contact:<p>TODO:contact</p>
 }
    return(
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
        {screenComponents[screen]}
    </main>
    )
}