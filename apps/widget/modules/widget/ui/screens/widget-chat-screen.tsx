"use client"

import { ArrowLeftIcon, MenuIcon } from "lucide-react"

import { WidgetHeader } from "../components/widget-header"
import { AIConversation, AIConversationContent } from "@workspace/ui/components/ai/conversations"
import { AIMessage, AIMessageContent } from "@workspace/ui/components/ai/message"
import { AIInput, AIInputSubmit, AIInputTextarea, AIInputToolbar, AIInputTools } from "@workspace/ui/components/ai/input"
import { AIResponse } from "@workspace/ui/components/ai/response"
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinetScroll"
import {InfiniteScrollTrigger} from "@workspace/ui/components/infinite-scroll-trigger"
import { useAtomValue, useSetAtom } from "jotai"
import { Button } from "@workspace/ui/components/button"
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar"
import { contactSessionIdAtomFamily, conversationIdAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms"
import { useAction, useQuery } from "convex/react"
import { api } from "@workspace/backend/convex/_generated/api"
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField } from "@workspace/ui/components/form"
import { Island_Moments } from "next/font/google"

export const WidgetChatScreen = () => {
    const setScreen = useSetAtom(screenAtom)
    const setConversationId = useSetAtom(conversationIdAtom)

    const conversationId = useAtomValue(conversationIdAtom)
    const organizationId = useAtomValue(organizationIdAtom)
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))

    const converation = useQuery(api.public.conversations.getOne,
        conversationId && contactSessionId ? { conversationId, contactSessionId } : "skip")

    const messages = useThreadMessages(api.public.message.getMany,
        converation?.threadId && contactSessionId ? {
            threadId: converation.threadId,
            contactSessionId

        } : "skip",
        { initialNumItems: 10 }
    )
   
    const {topElementRef,handleLoadmore,canLoadMore,isLoadingMore}=useInfiniteScroll({
        status:messages.status,
        loadMore:messages.loadMore,
        loadSize:10
    })

    const formSchema = z.object({
        message: z.string().min(1, "Message is requried")
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: ""
        }
    })

    const createMessage = useAction(api.public.message.create)

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!converation || !contactSessionId) {
            return
        }
        form.reset();
        await createMessage({
            threadId: converation.threadId,
            prompt: values.message,
            contactSessionId: contactSessionId
        })
    }

    const onBack = () => {
        setConversationId(null)
        setScreen("selection")
    }

    return (
        <>
            <WidgetHeader className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Button size="icon"
                        variant="transparent"
                        onClick={onBack}
                    >

                        <ArrowLeftIcon />
                        <p>Chat</p>
                    </Button>
                </div>
                <Button size="icon"
                    variant="transparent"
                >
                    <MenuIcon />
                </Button>
            </WidgetHeader>
            <AIConversation>
                <AIConversationContent>
                    <InfiniteScrollTrigger
                        canLoadMore={canLoadMore}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={handleLoadmore}
                        ref={topElementRef}/>
                    {toUIMessages(messages.results ?? [])?.map((message) => {
                        return (
                            <AIMessage from={message.role === "user" ? "user" : "assistant"} key={message.id}>
                                <AIMessageContent>
                                    <AIResponse>
                                        {message.content}
                                    </AIResponse>
                                </AIMessageContent>
                                {message.role==="assistant" &&(
                                    <DicebearAvatar 
                                        imageUrl="/logo.svg"
                                        seed="assistance"
                                        size={32}/>
                                )}
                            </AIMessage>
                        )
                    })}
                </AIConversationContent>
            </AIConversation>
            <Form {...form}>
                <AIInput className="rounded-none border-x-0 border-b-0"
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} disabled={converation?.status === "resolved"}
                        name="message" render={({ field }) => {
                            return (
                                <AIInputTextarea disabled={converation?.status === "resolved"}
                                    onChange={field.onChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault()
                                            form.handleSubmit(onSubmit)()
                                        }
                                    }} placeholder={converation?.status === "resolved" ? "The conversation has been resolved" : "Type your message..."}
                                        value={field.value}/>
                            )
                        }} />
                        <AIInputToolbar>
                            <AIInputTools/>
                           <AIInputSubmit disabled={converation?.status==="resolved" || !form.formState.isValid} type="submit"/>
                        </AIInputToolbar>
                </AIInput>
            </Form>
        </>
    )
}