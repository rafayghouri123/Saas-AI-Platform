"use client"
import { TooltipContent } from "@radix-ui/react-tooltip"
import { Tooltip, TooltipProvider ,TooltipTrigger } from "@workspace/ui/components/tooltip"

interface hintProp{
    children:React.ReactNode
    text:string
    side?:"top"|"right"|"bottom"|"left"
    align?:"start"|"center"|"end"
}

export const Hint=({children,text,side="top",align="center"}:hintProp)=>{

    return(
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent>
                    <p className="rounded-md bg-blue-600 px-2 py-1 text-sm text-white shadow-md">{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

}