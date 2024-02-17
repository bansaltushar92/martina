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
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { useParams, usePathname } from "next/navigation"

export function CreateNewCall() {

  const params = useParams()

  const campaignId = params.campaignId

  const [open, setOpen] = useState(false)

  function closeSheet() {
    setOpen(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Button size="sm" variant="default" className="">
            Start New Call
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
          <AddCampaignForm closeForm={closeSheet} campaignId={campaignId} />
        </SheetContent>
      </Sheet>
    </>
  )
}

const formSchema = z.object({
  context: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  contacts: z.array(
    z.number().min(2, {
      message: "Name must be at least 2 characters.",
    })
  ),
})

function AddCampaignForm({ closeForm, campaignId }: { closeForm: () => void, campaignId: string}) {
  const form = useForm({ defaultValues: { context: "", contacts: [] } })

  const { data, isLoading, isError } = trpc.getCustomers.useQuery()

  const mutation = trpc.insertCall.useMutation({
    onSuccess: () => {
      form.reset()
      toast.success("Call created")
      closeForm()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })


  if (!data) {
    return <div>Loading...</div>
  }

  const formOptions = data!.map((customer) => ({
    label: customer.name,
    value: customer.id,
  }))


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newArray = values.contacts.map((contact) => {
      return {
        customer_id: contact,
        call_context: values.context,
        campaign_id: parseInt(campaignId),
      }
    })
    mutation.mutate(newArray)
  }

  if (!data) {
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
              <FormLabel>
                Contacts to Call{" "}
                <span className="text-xs text-blue-400">
                  (connected to Salesforce)
                </span>
              </FormLabel>
              <MultiSelect
                selected={field.value}
                options={formOptions}
                {...field}
                className="sm:w-[510px]"
              />
              <FormMessage />
              <FormDescription className="font-bold text-black">
                Ensure you have gotten permission to contact these individuals
                prior to submitting.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          Submit
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="m-4">Add Contact</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new contact </DialogTitle>
              <DialogDescription>
                Create a new contact in Salesforce.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="" placeholder="Enter their name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Number
                </Label>
                <Input id="number"  placeholder="+1555555555" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}
