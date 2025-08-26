"use client"

import { useAtomValue } from "jotai"
import { WidgetFooter } from "../components/widget-footer"
import { WidgetHeader } from "../components/widget-header"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"
import { screenAtom } from "../../atoms/widget-atoms"
import { error } from "console"
import { WidgetErrorScreen } from "../screens/widget-error-screen"
import { WidgetLoadingScreen } from "../screens/widget-loading-screen"

interface Props{
    organizationId:string|null
}

export const WidgetView =({organizationId}:Props)=>{
    const screen = useAtomValue(screenAtom)

    const screenComponents= {
        error:<WidgetErrorScreen/>,
        loading:<WidgetLoadingScreen organizationId={organizationId}/>,
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