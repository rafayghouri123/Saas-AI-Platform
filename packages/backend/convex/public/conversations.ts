import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { threadId } from "worker_threads";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";

 
export const getOne = query({
    args:{
        conversationId:v.id("conversations"),
        contactSessionId:v.id("contactSessions")
    },
    handler:async(ctx,args)=>{
        const session = await ctx.db.get(args.contactSessionId)

        if(!session||session.expiresAt<Date.now()){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Invalid Session"
            })
        }
        const conversation = await ctx.db.get(args.conversationId)

        if(!conversation){
             throw new ConvexError({
                code:"NOT_FOUND",
                message:"Conversation not found"
            })
        }
        if(conversation.contactSessionId!==session._id){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Incorrect Session"
            })
        }
        return{
            _id:conversation._id,
            status:conversation.status,
            threadId:conversation.threadId
        }
    }
})

export const create = mutation({
    args:{
        organizationId:v.string(),
        contactSessionId:v.id("contactSessions")
    },
    handler:async(ctx,args)=>{
        const session = await ctx.db.get(args.contactSessionId)

        if(!session||session.expiresAt<Date.now()){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Invalid Session"
            })
        }
        const {threadId} = await supportAgent.createThread(ctx,{
            userId:args.organizationId
        })
        await saveMessage(ctx,components.agent,{
            threadId,
            message:{
                role:"assistant",
                //TODO: later modify to widget settings
                content:"Hello, how can i help you"
            }
            
        })
        const conversationId  = await ctx.db.insert("conversations",{
            contactSessionId:session._id,
            organizationId:args.organizationId,
            status:"unresolved",
            threadId

        })
        return conversationId
    }
})