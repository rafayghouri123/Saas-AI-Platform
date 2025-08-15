"use client"
import { Button } from "@workspace/ui/components/button"
import { add } from "../../../packages/math/src/add"
import { useMutation, useQueries, useQuery } from "convex/react"
import { api } from "../../../packages/backend/convex/_generated/api"
export default function Page() {
  const users = useQuery(api.users.getMany)

  const addusers = useMutation(api.users.addUser)
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World/ Widget</h1>
        <h1>{add(2,4)}</h1>
        <Button size="sm">Button</Button>
        <Button onClick={()=>{addusers()}} >Add User</Button>
        <div>{JSON.stringify(users)}</div>
      </div>
    </div>
  )
}
