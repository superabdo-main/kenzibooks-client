import React from 'react'
import { SidebarTrigger } from './shadcn-ui/sidebar'

const AppHeader = () => {
  return (

    <header className="flex sticky top-0 lg:rounded-tl-3xl z-50 w-full lg:h-16 h-10 bg-background shrink-0 items-center gap-2">
    <div className="flex items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
    </div>
  </header>
  )
}

export default AppHeader