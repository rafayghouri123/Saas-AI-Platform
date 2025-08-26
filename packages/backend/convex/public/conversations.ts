import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { threadId } from "worker_threads";

 
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
            return null
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
         const  threadId="12ddsa3"
        const conversationId  = await ctx.db.insert("conversations",{
            contactSessionId:session._id,
            organizationId:args.organizationId,
            status:"unresolved",
            threadId

        })
        return conversationId
    }
})