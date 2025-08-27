"use client"

import {glass} from "@dicebear/collection"
import { createAvatar } from "@dicebear/core"
import { AvatarImage } from "@radix-ui/react-avatar"
import {Avatar} from "@workspace/ui/components/avatar"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo } from "react"


interface DicebearAvatarProps{
    seed:string
    size?:number
    className?:string
    badgeClassName?:string
    imageUrl?:string
    badgeImageUrl?:string
}

export const DicebearAvatar = ({
    seed,
    size=32,
    className,
    badgeClassName,
    imageUrl,
    badgeImageUrl

}:DicebearAvatarProps)=>{
    const avatarSrc =useMemo(()=>{
        if(imageUrl){
            return imageUrl
        }
        const avatar = createAvatar(glass,{
            seed:seed.toLowerCase().trim(),
            size,

        })
        return avatar.toDataUri();
    },[seed,size])

    const badgeSize = Math.round(size*0.5)

    return(
        <>
            <div className="relative inline-block"
                style={{width:size, height:size}}>
                
                <Avatar className={cn("border",className)}
                        style={{width:size, height:size}}>
                    
                    <AvatarImage alt="Image" src={avatarSrc}/>
                  </Avatar>

                  {badgeImageUrl && (
                    <div className={cn("absolute right-0 bottom-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background",className)}
                         style={{width:badgeSize, height:badgeSize, transform:"translate(15%,15%)"}}>
                            
                        <img alt="Badge" src={badgeImageUrl} className="h-full w-full object-cover" height={badgeSize} width={badgeSize}/>
                    </div>
                 ) }

            </div>
        </>
    )
}