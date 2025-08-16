import { OrganizationList } from '@clerk/nextjs'
import React from 'react'

const OrgSelectView = () => {
  return (
   <OrganizationList 
   afterSelectOrganizationUrl='/'
   afterCreateOrganizationUrl='/'
   hidePersonal
   skipInvitationScreen>
    
   </OrganizationList>
  )
}

export default OrgSelectView