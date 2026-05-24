"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarTrigger, Sidebar, SidebarHeader, useSidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuButton, SidebarMenuItem, SidebarMenu } from '@/components/ui/sidebar'
import { Calendar, CreditCard, Lightbulb, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';

const mainNav = [
    { name: "Ideas", href: "/ideas", icon: Lightbulb },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
];

const AppSidebar = () => {
    const pathname = usePathname();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader
                className={cn(isCollapsed ? "p-2.5" : "p-4")}
            >
                <div
                    className={cn(
                        "flex items-center w-full",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}
                >
                    {!isCollapsed && <Logo />}
                    <SidebarTrigger className="hidden md:flex ml-1" />
                </div>
                <Button className={cn('mt-4', isCollapsed ? 'mx-auto rounded-full h-8 w-8 p-0' : 'w-full')} size={isCollapsed ? "icon" : "lg"} >
                    <Plus className='size-4' />
                    {!isCollapsed && <span>New Post</span>}
                </Button>
            </SidebarHeader>
            <SidebarContent className={cn(!isCollapsed && "px-2")}>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-[4px]">
                            {mainNav.map((item) => (
                                <SidebarMenuItem key={item.name} >
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        tooltip={item.name}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className='size-6' />
                                            <span className='text-[14.5px] '>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar