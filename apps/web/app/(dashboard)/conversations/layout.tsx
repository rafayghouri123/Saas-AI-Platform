import { ConversationsLayout } from '@/app/modules/dashboard/ui/layout/conversations-layout'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <ConversationsLayout>
        {children}
    </ConversationsLayout>
  )
}

export default layout