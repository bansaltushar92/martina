"use client"

import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form"
import {Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { createCampaign } from "./serverActions"
import { useFormState } from "react-dom"
import { trpc } from "./utils/trpc"


interface Campaign {
  name: string
  href: string
  initial: string
  current: boolean

}

export function CampaignList({teams}: {teams:Campaign[]}) {

 

  return <li>
    <div className="flex flex-row justify-between items-center">
    <div className="text-xs font-semibold leading-6 text-gray-400">Your campaigns</div>
    <Sheet>
    <SheetTrigger>
    <Button size={"sm"} variant="outline" className="text-black text-xs">New +</Button>
    </SheetTrigger>
    <SheetContent>
    <SheetHeader>
      <SheetTitle>Create new campaign</SheetTitle>
      <SheetDescription>
        Create a new campaign to start collecting feedback on how your users feel about your product.
      </SheetDescription>
    </SheetHeader>
    <AddCampaignForm/>
  </SheetContent>
</Sheet>
    </div>


    <ul role="list" className="-mx-2 mt-2 space-y-1">
      {teams.map((team) => (
        <li key={team.name}>
          <a
            href={team.href}
            className={cn(
              team.current
                ? 'text-white bg-gray-800'
                : 'text-gray-400 ',
              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
              {team.initial}
            </span>
            <span className="truncate">{team.name}</span>
          </a>
        </li>
      ))}
    </ul>
  </li>
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})


function AddCampaignForm() {
  const form = useForm()

  const mutation = trpc.getCampaigns.useMutation({
    onSuccess: () => {
      form.reset()
      toast.success("Campaign created")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }

   return (
    <Form {...form}>
      <form className="space-y-8 pt-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Campaign Name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>Submit</Button>
      </form>
    </Form>
  )
}