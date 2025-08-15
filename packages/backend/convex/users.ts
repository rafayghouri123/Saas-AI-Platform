import { mutation, query } from "./_generated/server.js"

export const getMany = query({
  args:{},
  handler:async(ctx)=>{
    const users = await ctx.db.query("users").collect()

    return users
  }
})

export const addUser = mutation({

  args:{},
  handler:async(ctx)=>{
    const identity = await ctx.auth.getUserIdentity()

    if(identity===null){
      throw new Error("Not Authenticated")
    }
    const newUser = await ctx.db.insert("users",{
      name:"Bilal"
    })
     return newUser
  },
 
}) 