import { mutation, query } from "./_generated/server"

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
    const newUser = await ctx.db.insert("users",{
      name:"Bilal"
    })
     return newUser
  },
 
}) 