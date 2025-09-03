import { createTool } from "@convex-dev/agent";
import z from "zod";
import { query } from "../../../_generated/server";
import { internal } from "../../../_generated/api";
import rag from "../rag";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { supportAgent } from "../agents/supportAgent";
import { SEARCH_INTERPRETER_PROMPT } from "../constant";



export const search  =createTool({
    description:"Search the knowledge base for relevant information to help answer user questions",
    args:z.object({
        query:z.string().describe("The query to find relevant information")
    }),

    handler:async(ctx,args)=>{
        if(!ctx.threadId){
            return "Missing thread ID"
        } 

        const conversation = await  ctx.runQuery(
            internal.system.conversations.getByThreadId,
            {threadId:ctx.threadId}
        )

        if(!conversation){
            return "Conversaation not found"
        }

        const orgId = conversation.organizationId

        const searchResult = await rag.search(ctx,{
            namespace:orgId,
            query:args.query,
            limit:5
        })

        const contextText = `Found results in ${searchResult.entries.map((e)=>(e.title||null))
                                                                    .filter((t)=>t!==null)
                                                                    .join(", ")}. Here is the context:\n\n${searchResult.text}`


        const response = await generateText({
            messages:[
                {
                    role:"system",
                    content:SEARCH_INTERPRETER_PROMPT
                },
                {
                    role:"user",
                    content:`User asked: "${args.query}"\n\nSearch results:${contextText}` 
                }
            ],
            model:google.chat("gemini-2.0-flash-lite")
        })

        await supportAgent.saveMessage(ctx,{
            threadId:ctx.threadId,
            message:{
                role:"assistant",
                content:response.text
            }
        })

        return response.text
    }

})