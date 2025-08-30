"use client"

import { api } from "@@workspace/backend/_generated/api"
import { Id } from "@@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { useAction, useMutation, useQuery } from "convex/react"
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react"
import { AIConversation, AIConversationContent, AIConversationScrollButton } from "@workspace/ui/components/ai/conversations"
import {AIMessage, AIMessageContent} from "@workspace/ui/components/ai/message"
import { AIResponse } from "@workspace/ui/components/ai/response"
import { AIInput, AIInputButton, AIInputSubmit, AIInputTextarea, AIInputToolbar, AIInputTools } from "@workspace/ui/components/ai/input"
import{ Form,FormField} from "@workspace/ui/components/form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {toUIMessages,useThreadMessages} from "@convex-dev/agent/react"
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar"
import { ConversationStatusButton } from "../components/conversation-status-button"
import { useState } from "react"
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger"
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinetScroll"
import { cn } from "@workspace/ui/lib/utils"
import { Skeleton } from "@workspace/ui/components/skeleton"

export const ConversationIdView=({conversationId}:{conversationId :Id<"conversations">})=>{

    const [isUpdatingStatus,setIsUpdatingStatus] =useState(false)

        const formSchema = z.object({
            message:z.string().min(1,"Message is required")
        })

        const conversation = useQuery(api.private.conversations.getOne,{
            conversationId
        })

        const messages = useThreadMessages(api.private.message.getMany,
            conversation?.threadId ? {threadId:conversation.threadId}:"skip",
            {initialNumItems:10}
        )

        const {canLoadMore,handleLoadmore,isLoadingMore,topElementRef} = useInfiniteScroll({
            status:messages.status,
            loadMore:messages.loadMore,
            loadSize:10
        })
        
        const [isEnhancing,setIsEnhancing]=useState(false)
        const enhanceResponse = useAction(api.private.message.enhanceResponse)

        const handleEnchanceResponse=async()=>{
            setIsEnhancing(true)
            const currentValue = form.getValues("message")
        
            try {
                const response = await enhanceResponse({prompt:currentValue})
                   form.setValue("message",response)
            } catch (error) {
                console.log(error)
            }finally{
                setIsEnhancing(false)
            }
        }

        const form = useForm<z.infer<typeof formSchema>>({
            resolver:zodResolver(formSchema),
            defaultValues:{
                message:""
            }
        })

        const createMessage = useMutation(api.private.message.create)

        const updateConversationStatus = useMutation(api.private.conversations.updateStatus)

        const handleToggleStatus = async ()=>{
            if(!conversation){
                return
            }
            setIsUpdatingStatus(true)
            let newStatus:"unresolved"|"resolved"|"escalated";
            if(conversation.status==="unresolved"){
                    newStatus="escalated"
            }else if(conversation.status==="escalated"){
                newStatus = "resolved"
            }else{
                newStatus="unresolved"
            }

            try {
                await updateConversationStatus({
                    conversationId,
                    status:newStatus
                })
            } catch (error) {
                console.log(error)
            }finally{
                setIsUpdatingStatus(false)
            }
        }

        const onSubmit=(values:z.infer<typeof formSchema>)=>{
                try {
                    createMessage({
                        conversationId,
                        prompt:values.message
                    })
                    form.reset()
                } catch (error) {
                    console.error(error)
                }
        }

        if(conversation===undefined||messages.status==="LoadingFirstPage"){
            return(
                <ConversationIdViewLoading/>
            )
        }
    return(
        <div className="flex h-full flex-col bg-muted">
            <header className="flex items-center justify-between border-b bg-background p-2.5">
                <Button
                    size="sm"
                    variant="ghost">
                    <MoreHorizontalIcon/>
                </Button>
                {!!conversation&&(
                    <ConversationStatusButton
                        onClick={handleToggleStatus}
                        status={conversation.status}
                        disabled={isUpdatingStatus }
                        />
                )}
            </header>
            <AIConversation className="max-h-[calc(100vh-180px)]">
                <AIConversationContent>
                    <InfiniteScrollTrigger
                        canLoadMore={canLoadMore}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={handleLoadmore}
                        ref={topElementRef}/>
                    {toUIMessages(messages.results??[])?.map((message)=>(
                        <AIMessage
                            from={message.role==="user"?"assistant":"user"}
                            key={message.id}>
                            <AIMessageContent>
                                <AIResponse>
                                    {message.content}
                                </AIResponse>
                            </AIMessageContent>
                            {message.role==="user" && (
                                <DicebearAvatar
                                    seed={conversation?.contactSessionId ??"user"}
                                    size={32}/>
                            )}
                        </AIMessage>
                    ))}
                </AIConversationContent>
                <AIConversationScrollButton/>
            </AIConversation>

            <div className="p-2">
                <Form {...form}>
                    <AIInput onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            disabled={conversation?.status==="resolved"}
                            name="message"
                            render={({field})=>(
                                <AIInputTextarea
                                    disabled={conversation?.status==="resolved"||form.formState.isSubmitting}
                                      onChange={field.onChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault()
                                            form.handleSubmit(onSubmit)()
                                        }
                                    }} placeholder={conversation?.status === "resolved" ? "The conversation has been resolved" : "Type your message..."}
                                        value={field.value}/>
                            )}/>
                        <AIInputToolbar>
                            <AIInputTools>
                                <AIInputButton
                                    onClick={handleEnchanceResponse}
                                    disabled={conversation?.status==="resolved"|| isEnhancing||!form.formState.isValid}>
                                    <Wand2Icon/>
                                    {isEnhancing?"Enhancing...":"Enhance"}
                                </AIInputButton>
                            </AIInputTools>
                            <AIInputSubmit
                                disabled={conversation?.status === "resolved"||!form.formState.isValid||form.formState.isSubmitting||isEnhancing}
                                status="ready"
                                type="submit"/>
                        </AIInputToolbar>
                    </AIInput>
                </Form>
            </div>
        </div>
    )
}



export const ConversationIdViewLoading = () => {
  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </header>

      <AIConversation>
        <AIConversationContent>
          {Array.from({ length: 8 }, (_, index) => {
            const isUser = index % 2 === 0
            const widths = ["w-48", "w-60", "w-72"]
            const width = widths[index % widths.length]

            return (
              <div
                key={index}
                className={cn(
                  "group flex w-full items-center justify-end gap-2 py-2 [&>div]max-w-[80%]",
                  isUser ? "is-user" : "is-assistant flex-row-reverse"
                )}
              >
                {/* Darker skeleton bubbles */}
                <Skeleton className={`h-9 ${width} rounded-lg bg-neutral-300`} />
                <Skeleton className="size-8 rounded-full bg-neutral-300" />
              </div>
            )
          })}
        </AIConversationContent>
      </AIConversation>

      <div className="p-2">
        <AIInput>
          <AIInputTextarea
            disabled
            placeholder="Type your response as an operator..."
          />
          <AIInputToolbar>
            <AIInputTools>
              <AIInputSubmit disabled status="ready" />
            </AIInputTools>
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  )
}
 