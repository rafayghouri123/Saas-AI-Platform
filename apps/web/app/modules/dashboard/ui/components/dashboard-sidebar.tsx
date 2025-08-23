"use client"

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@workspace/ui/components/sidebar"
import { Tooltip } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { CreditCardIcon, InboxIcon, LayoutDashboardIcon, Library, LibraryBigIcon, Mic, PaletteIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"





export const DashboardSidebar = () => {
    const customerSupportItems = [
        {
            title: "Coversations",
            url: "/conversations",
            icon: InboxIcon
        },

        {
            title: "Knowledge Base",
            url: "/files",
            icon: LibraryBigIcon
        },
    ]

    const ConfigurationItems = [
        {
            title: "Integrations",
            url: "/integrations",
            icon: LayoutDashboardIcon
        },

        {
            title: "Widget Customizations",
            url: "/customizations",
            icon: PaletteIcon
        },
        {
            title: "Voice Assistance",
            url: "/plugins/vapi",
            icon: Mic
        },
    ]

    const AccountItems = [
        {
            title: "Plans & Billings",
            url: "/billings",
            icon: CreditCardIcon
        },
    ]



    const path = usePathname()

    const isActive = (url: string) => {
        if (url === "/") {
            return path === "/"
        }
        return path.startsWith(url)
    }

    return (
        <Sidebar className="group" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg">
                            <OrganizationSwitcher hidePersonal
                                skipInvitationScreen
                                appearance={{
                                    elements: {
                                        rootBox: "w-full! h-8!",
                                        avatarBox: "size-4! rounded-sm!",
                                        organizationSwitcherTrigger: "w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                                        organizationPreview: "group-data-[collapsible=icon]:justify-center! gap-2!",
                                        organizationPreviewTextContainer: "group-data-[collapsible=icon]:hidden! text-xs font-medium! text-sidebar-foreground!",
                                        organizationSwitcherTriggerIcon: "group-data-[collapsible=icon]:hidden! ml-auto!  text-sidebar-foreground!"
                                    }
                                }} />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/*Customer support*/}
                <SidebarGroup>
                    <SidebarGroupLabel>Customers support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {customerSupportItems.map((items) => (
                                <SidebarMenuItem key={items.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(items.url)}
                                        className={cn(isActive(items.url)&&"bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90! ")}
                                        tooltip={items.title}>
                                        <Link href={items.url}>
                                            <items.icon className="size-4"></items.icon>
                                            <span>{items.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {/*Configurations*/}
                <SidebarGroup>
                    <SidebarGroupLabel>Configurations</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {ConfigurationItems.map((items) => (
                                <SidebarMenuItem key={items.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(items.url)}
                                         className={cn(isActive(items.url)&&"bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90! ")}
                                        tooltip={items.title}>
                                        <Link href={items.url}>
                                            <items.icon className="size-4"></items.icon>
                                            <span>{items.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {/*Billings*/}
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {AccountItems.map((items) => (
                                <SidebarMenuItem key={items.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(items.url)}
                                         className={cn(isActive(items.url)&&"bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90! ")}
                                        tooltip={items.title}>
                                        <Link href={items.url}>
                                            <items.icon className="size-4"></items.icon>
                                            <span>{items.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <UserButton
                            showName
                            appearance={{
                                elements: {
                                    rootBox: "w-full! h-8!",
                                    userButtonTrigger: "w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                                    userButtonBox: "w-full! flex-row-reverse! justify-end! group-data-[collapsible=icon]:justify-center! gap-2! text-sidebar-accent-foreground!",
                                    userButtonOuterIdentifier: "pl-0! group-data-[collapsible=icon]:hidden!",
                                    avatarBox: "size-4!"
                                }
                            }} />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}