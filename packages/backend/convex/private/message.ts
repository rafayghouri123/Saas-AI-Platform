import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "../_generated/server";
import { components, internal } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { saveMessage } from "@convex-dev/agent";
import { threadId } from "worker_threads";



export const create = mutation({
    args:{
        prompt:v.string(),
        conversationId:v.id("conversations")
    },
    handler:async(ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity()

        if(identity === null){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Identity not found"
            })
        }

        const orgId = identity.orgId as string

        if(orgId === null){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Organization not found"
            })
        }
        const conversations= await ctx.db.get(args.conversationId)
        if(!conversations){
             throw new ConvexError({
                code:"NOT FOUND",
                message:"Conversation not found"
            })
        }
         if(conversations.organizationId!==orgId){
             throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Invalid Organization"
            })
        }

        if(conversations.status === "resolved"){
             throw new ConvexError({
                code:"BAD REQUEST",
                message:"Coversation resolved"
            })
        }

        await saveMessage(ctx,components.agent,{
            threadId:conversations.threadId,
            agentName:identity.familyName,
            message:{
                role:"assistant",
                content:args.prompt
            }
        })
        
       
    }
})

export const getMany = query({
    args:{
        threadId:v.string(),
        paginationOpts:paginationOptsValidator,
        
    },
    handler:async(ctx,args)=>{
         const identity = await ctx.auth.getUserIdentity()

        if(identity === null){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Identity not found"
            })
        }

        const orgId = identity.orgId as string

        if(orgId === null){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Organization not found"
            })
        }

        const conversations= await ctx.db.query("conversations").withIndex("by_thread_id",(q)=>q.eq("threadId",args.threadId)).unique()

        if(!conversations){
             throw new ConvexError({
                code:"Not found",
                message:"Conversation not found"
            })
        }

        

         if(conversations.organizationId!==orgId){
             throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Invalid Organization"
            })
        }

        const paginated = await supportAgent.listMessages(ctx,{
            threadId:args.threadId,
            paginationOpts:args.paginationOpts
        })
        return paginated
    }
})