"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    SidebarTrigger,
    Sidebar,
    SidebarHeader,
    useSidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenu,
    SidebarGroupLabel,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Calendar,
    CreditCard,
    Lightbulb,
    Plus,
    PlusCircleIcon,
    Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelType } from "@/types/channel.type";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { ChannelTypeEnum, getChannelIcon, getChannelUrl } from "@/constants/channels";
import ChannelAvatar from "@/components/channel-avatar";
import { UserButton } from "@clerk/nextjs";
import { toast } from "sonner";
// import CreatePostDialog from "@/components/schedule/create-post-dialog";



const mainNav = [
    { name: "Ideas", href: "/ideas", icon: Lightbulb },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
];

const subscribeToClientReady = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function getChannelProfileHref(channel: ChannelType) {
    if (channel.profile_url) return channel.profile_url;

    const baseUrl = getChannelUrl(channel.type);
    const handle = channel.handle?.replace(/^@/, "").trim();

    if (
        channel.type === ChannelTypeEnum.TWITTER &&
        handle &&
        !/\s/.test(handle)
    ) {
        return `${baseUrl}/${encodeURIComponent(handle)}`;
    }

    return baseUrl;
}

const AppSidebar = () => {
    const pathname = usePathname();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    const isMounted = useSyncExternalStore(
        subscribeToClientReady,
        getClientSnapshot,
        getServerSnapshot,
    );


    const connectMutation = useMutation({
        mutationFn: async (channelTypeId: string) => {
            const res = await fetch("/api/channel/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    channelTypeId,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to connect channel");
            }
            return data;
        },
        onSuccess: ({ url }) => {
            window.location.href = url;
        },
        onError: () => {
            toast.error("Failed to connect channel");
        },
    });


    const { data: channelsData, isPending } = useQuery({
        queryKey: ["channels"],
        queryFn: async () => {
            const res = await fetch("/api/channel");
            if (!res.ok) {
                throw new Error("Failed to fetch channels");
            }
            const data = await res.json();
            return data;
        },
    });

    const channels = (channelsData?.channels || []) as ChannelType[];
    const unconnectedChannels = channels.filter(
        (channel: ChannelType) => !channel.connected,
    );
    const connectedChannels = channels.filter(
        (channel: ChannelType) => channel.connected,
    );

    const connectedCount = channelsData?.connectedCount || 0;
    const totalChannels = channelsData?.totalChannels || 0;
    const limitedChannels = unconnectedChannels.slice(0, 4);

    
    const handleConnect = (channelTypeId: string) => {
        if (connectMutation.isPending) return;
        connectMutation.mutate(channelTypeId);
    };

    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarHeader className={cn(isCollapsed ? "p-2.5" : "p-4")}>
                    <div
                        className={cn(
                            "flex items-center w-full",
                            isCollapsed ? "justify-center" : "justify-between",
                        )}
                    >
                        {!isCollapsed && <Logo />}
                        <SidebarTrigger className="hidden md:flex ml-1" />
                    </div>
                    <Button
                        className={cn(
                            "mt-4",
                            isCollapsed
                                ? "mx-auto rounded-full h-8 w-8 p-0"
                                : "w-full",
                        )}
                        size={isCollapsed ? "icon" : "lg"}
                    >
                        <Plus className="size-4" />
                        {!isCollapsed && <span>New Post</span>}
                    </Button>
                </SidebarHeader>
                <SidebarContent className={cn(!isCollapsed && "px-2")}>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-1">
                                {mainNav.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === item.href}
                                            tooltip={item.name}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="size-6" />
                                                <span className="text-[14.5px] ">
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* {connected channels} */}
                    {connectedChannels.length > 0 && (
                        <SidebarGroup className={cn(isCollapsed && "px-1")}>
                            <SidebarGroupLabel className="text-sm">
                                Channels
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {isPending ? (
                                        <div className="flex flex-col gap-2">
                                            <Skeleton className="h-8 w-full bg-secondary" />
                                            <Skeleton className="h-8 w-full bg-secondary" />
                                            <Skeleton className="h-8 w-full bg-secondary" />
                                            <Skeleton className="h-8 w-full bg-secondary" />
                                        </div>
                                    ) : (
                                        connectedChannels?.map(
                                            (channel: ChannelType) => {
                                                const url =
                                                    getChannelProfileHref(channel);
                                                return (
                                                    <SidebarMenuItem
                                                        key={channel.id}
                                                    >
                                                        <SidebarMenuButton
                                                            asChild
                                                        >
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="w-full! relative block items-center gap-2"
                                                            >
                                                                <ChannelAvatar
                                                                    size="sm"
                                                                    className="w-full flex items-center gap-2"
                                                                    type={
                                                                        channel.type
                                                                    }
                                                                    color={
                                                                        channel.color
                                                                    }
                                                                    profileImage={
                                                                        channel.profile_image
                                                                    }
                                                                    name={
                                                                        !isCollapsed
                                                                            ? channel.handle ||
                                                                              channel.name
                                                                            : ""
                                                                    }
                                                                />
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                );
                                            },
                                        )
                                    )}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )}

                    {/* {Unconnected Channels} */}
                    <SidebarGroup className={cn(isCollapsed && "px-1")}>
                        <SidebarGroupLabel className="text-sm">
                            Connect Channels
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {isPending ? (
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-8 w-full bg-secondary" />
                                        <Skeleton className="h-8 w-full bg-secondary" />
                                        <Skeleton className="h-8 w-full bg-secondary" />
                                        <Skeleton className="h-8 w-full bg-secondary" />
                                    </div>
                                ) : (
                                    <>
                                        {limitedChannels.map(
                                            (channel: ChannelType) => {
                                                const icon = getChannelIcon(
                                                    channel.type,
                                                );
                                                return (
                                                    <SidebarMenuItem
                                                        key={channel.id}
                                                    >
                                                        <SidebarMenuButton
                                                            asChild
                                                            tooltip={`Connect ${channel.name}`}
                                                        >
                                                            <button
                                                                className="w-full flex items-center gap-2"
                                                                disabled={connectMutation.isPending}
                                                                onClick={() => handleConnect(channel.id)}
                                                            >
                                                                <span>
                                                                    <div className="relative">
                                                                        {icon ? (
                                                                            <HugeiconsIcon
                                                                                icon={
                                                                                    icon
                                                                                }
                                                                                color="currentColor"
                                                                                className=" text-white! size-6! p-1 rounded-sm"
                                                                                style={{
                                                                                    background:
                                                                                        channel.color,
                                                                                }}
                                                                            />
                                                                        ) : null}

                                                                        <div
                                                                            className={`absolute -right-1 bottom-0 p-0.5 bg-white dark:bg-background rounded-xs`}
                                                                        >
                                                                            <HugeiconsIcon
                                                                                icon={
                                                                                    PlusSignIcon
                                                                                }
                                                                                className="size-2!"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                                <span className="truncate">
                                                                    {
                                                                        channel.name
                                                                    }
                                                                </span>
                                                            </button>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                );
                                            },
                                        )}
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    className="w-full justify-start mt-1"
                                                >
                                                    <Link
                                                        href="/settings"
                                                        className="w-full flex items-center gap-2"
                                                    >
                                                        <PlusCircleIcon className="size-4" />
                                                        <span className="text-sm">
                                                            More channels
                                                        </span>
                                                    </Link>
                                                </Button>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <div className="mb-3 text-xs text-muted-foreground">
                        <span>
                            {connectedCount}/{totalChannels} channels connected
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isMounted ? (
                            <UserButton
                                showName={!isCollapsed}
                                appearance={{
                                    elements: {
                                        avatarBox: "h-8 w-8",
                                    },
                                }}
                            />
                        ) : (
                            <div
                                className="h-8 w-8 rounded-full bg-muted"
                                aria-hidden="true"
                            />
                        )}
                        {/* <span className="text-sm">
                            {user?.fullName ||
                                user?.primaryEmailAddress?.emailAddress}
                        </span> */}
                    </div>
                </SidebarFooter>
            </Sidebar>
        </>
    );
};

export default AppSidebar;
