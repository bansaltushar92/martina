"use client"

import { Button } from "@/components/ui/button"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { trpc } from "@/app/utils/trpc"
import { MultiSelect } from "@/components/ui/mulit-select"
import { Textarea } from "@/components/ui/textarea"

interface Campaign {
  name: string
  href: string
  initial: string
  current: boolean
}

export function CreateNewCall() {
  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Button size="sm" variant="default" className="">
            New +
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Customer Call</SheetTitle>
            <SheetDescription>
              Enter details to initiate a new customer call from our AI
              assistant.
            </SheetDescription>
          </SheetHeader>
          <AddCampaignForm />
        </SheetContent>
      </Sheet>
    </>
  )
}

const formSchema = z.object({
  context: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  contacts: z.array(z.number().min(2, {
    message: "Name must be at least 2 characters.",
  }))
})

function AddCampaignForm() {
  const form = useForm({defaultValues: {context:"",contacts: []}})

  const {data,isLoading,isError} = trpc.getCustomers.useQuery()
  console.log(data)

  const formOptions = data!.map((customer) => ({
    label: customer.name,
    value: customer.id,
  }))
  
  console.log("formOptions",formOptions)

  const mutation = trpc.insertCall.useMutation({
    onSuccess: () => {
      form.reset()
      toast.success("Call created")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values",values)
    const newArray = values.contacts.map((contact) => {
      return {customer_id: contact, call_context: values.context, campaign_id: 1}
    })
    mutation.mutate(newArray)
  }

  if(!data){
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form className="space-y-8 pt-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relevant Context</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any relevant context or focus for the call that you may want to prioritize."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contacts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contacts to Call</FormLabel>
              <MultiSelect
                selected={field.value}
                options={formOptions}
                {...field}
                className="sm:w-[510px]"
              />
              <FormMessage />
              <FormDescription className="font-bold text-black">
                Ensure you have gotten permission to contact these individuals prior to submitting.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
