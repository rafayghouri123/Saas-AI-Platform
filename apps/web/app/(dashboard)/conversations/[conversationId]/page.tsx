import { ConversationIdView } from '@/app/modules/dashboard/ui/views/conversation-id-view'
import { Id } from '@@workspace/backend/_generated/dataModel'
import React from 'react'

const page =async ({params}:{params:Promise<{
    conversationId:string
}>}) => {

    const {conversationId} = await params
  return (
    <>
        <ConversationIdView conversationId={conversationId as Id<"conversations">}/> 
    </>
  )
}

export default page