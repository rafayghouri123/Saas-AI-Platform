"use client"

import { WidgetFooter } from "../components/widget-footer"
import { WidgetHeader } from "../components/widget-header"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"

interface Props{
    organizationId:string
}


export const WidgetView =({organizationId}:Props)=>{
    return(
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
        {/* <WidgetHeader>
            <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                <p className="font-semibold text-3xl">
                    Hi There! 🖐️
                </p>
                <p className="font-semibold text-lg">
                    How can we help you today?
                </p>
            </div>
        </WidgetHeader> */}
            <WidgetAuthScreen/>
           <div className="flex flex-1"> Widget View {organizationId}</div>
        {/* <WidgetFooter></WidgetFooter> */}
    </main>
    )
}