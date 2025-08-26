"use client"

import { AlertTriangleIcon } from "lucide-react"
import { errorMessageAtom } from "../../atoms/widget-atoms"
import { WidgetHeader } from "../components/widget-header"
import { useAtomValue } from "jotai"

export const WidgetErrorScreen = ()=>{
    const errorMessagge = useAtomValue(errorMessageAtom)

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
                <AlertTriangleIcon/>
                <p className="text-sm">
                    {errorMessagge|| "Invalid Connfiguration"}
                </p>
            </div>
        </>
    )
}