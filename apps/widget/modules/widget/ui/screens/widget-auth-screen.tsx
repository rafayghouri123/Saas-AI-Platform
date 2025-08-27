import { WidgetHeader } from "../components/widget-header"
import {z} from "zod"
import { useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import{Form,FormControl, FormField, FormItem,FormMessage} from "@workspace/ui/components/form"
import {Input} from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { useMutation } from "convex/react"
import {api} from "@workspace/backend/convex/_generated/api"
import { Doc } from "/Users/Hamza/Saas-Ai-Platform/packages/backend/convex/_generated/dataModel"
import { useAtomValue, useSetAtom } from "jotai"
import { contactSessionIdAtomFamily, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms"



const formSchema = z.object({
    name:z.string().min(1,"Name is requried"),
    email:z.string().email("Invalid email address")
})

export const WidgetAuthScreen = ()=>{


    const organizationId = useAtomValue(organizationIdAtom)
    const setScreen = useSetAtom(screenAtom)
    const setContactSessionId = useSetAtom(contactSessionIdAtomFamily(organizationId||""))


    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name:"",
            email:""
        }
    })

    const createContactSession = useMutation(api.public.contactSessions.create)

    const onSubmit = async(values:z.infer<typeof formSchema>)=>{
        if(!organizationId){
            return
        }
        const metadata: Doc<"contactSessions">["metadata"]={
            userAgent:navigator.userAgent,
            language:navigator.language,
            timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset:new Date().getTimezoneOffset(),
            cookieEnabled:navigator.cookieEnabled,
            currentUrl:window.location.href,
            platform:navigator.platform
        }
       const contactSessionId= await createContactSession({
        ...values,
        organizationId,
        metadata    
        })

        setContactSessionId(contactSessionId)
        setScreen("selection")
    }

    return(
        <>
        <WidgetHeader>
             <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                <p className="font-semibold text-3xl">
                    Hi There! 🖐️
                </p>
                <p className="font-semibold text-lg">
                    Let's get you started
                </p>
            </div>
        </WidgetHeader>
        <Form {...form}>
            <form className="flex flex-1 flex-col gap-y-4 p-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control ={form.control} name="name" render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <Input className="h-10 bg-background"
                                    placeholder="e.g John Doe"
                                    type="text"
                                    {...field}></Input>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
    )}>

                </FormField>
                <FormField control ={form.control} name="email" render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <Input className="h-10 bg-background"
                                    placeholder="e.g JohnDoe@gmail.com"
                                    type="email"
                                    {...field}></Input>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
    )}>

                </FormField>
                <Button disabled={form.formState.isSubmitting}
                        size="lg"
                        type="submit"
                >
                    Continue</Button>

            </form>
        </Form>
        </>
    )
}