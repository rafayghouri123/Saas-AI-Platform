import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { resolveObjectURL } from "buffer";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";


const SESSION_DURATION_MS=26*60*60*1000
   
export const create = mutation({
    
    args:{
        name:v.string(),
        email:v.string(),
        organizationId:v.string(),
        metadata:v.optional(
            v.object({
            userAgent:v.optional(v.string()),
            language:v.optional(v.string()),
            platform:v.optional(v.string()),
            timezone:v.optional(v.string()),
            timezoneOffset:v.optional(v.number()),
            cookieEnabled:v.optional(v.boolean()),
            currentUrl:v.optional(v.string())})
        ),
    },
    handler:async(ctx,args)=>{
        const now = Date.now()
        const expiresAt = now +SESSION_DURATION_MS
        const sessionContactId = await ctx.db.insert("contactSessions",{
            name:args.name,
            email:args.email,
            organizationId:args.organizationId,
            expiresAt,
            metadata:args.metadata,

        })
        return sessionContactId
    }
})