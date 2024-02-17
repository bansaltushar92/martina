"use client"

import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form"
import {Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { createCampaign, revalidateRoot } from "./serverActions"
import { useFormState } from "react-dom"
import { trpc } from "./utils/trpc"

import { HomeIcon } from "@heroicons/react/24/outline"
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { AudioLinesIcon, BarChart2Icon, NewspaperIcon } from "lucide-react"
import { supabase } from "./db"
import { usePathname } from "next/navigation"
import Link from "next/link"
import path from "path"
import { revalidatePath } from "next/cache"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"



interface Campaign {
  id: number
  name: string
  initials: string
}

export function CampaignList({teams, limitReached}: {teams:Campaign[], limitReached: boolean}) {
  const [open, setOpen] = useState(false)

  function closeSheet() {
    setOpen(false)
  }

  const isCurrentCampaign = (path: string) => {
    return path.toLowerCase().includes("campaigns")
  }

  return <li>
    <div className="flex flex-row justify-between items-center">
    <div className="text-xs font-semibold leading-6 text-gray-400">Your campaigns</div>
    <Sheet open={open} onOpenChange={setOpen}>
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
    <AddCampaignForm closeForm={closeSheet}/>
  </SheetContent>
</Sheet>
    </div>


    <ul role="list" className="-mx-2 mt-2 space-y-1">
      {teams.map((team) => (
        <li key={team.id}>
          <a
            href={`/campaigns/${team.id}/home`}
            className={cn(
              team.current
                ? 'text-white bg-gray-800'
                : 'text-gray-400 ',
              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
              {team.initials}
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
  description: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})


function AddCampaignForm({closeForm}: {closeForm: () => void}){
  const form = useForm()

  const mutation = trpc.getCampaigns.useMutation({
    onSuccess: () => {
      form.reset()
      toast.success("Campaign created")
      revalidateRoot()
      closeForm()
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Details</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter any details that might help explain what type of feedback you're trying to get" {...field} />
              </FormControl>
              <FormDescription>
              Enter any details that might help explain what type of feedback you are trying to get.
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

const navigation = [
  { name: "Home", href: "/home", icon: HomeIcon, current: true },
  {
    name: "Interviews",
    href: "/interviews",
    icon: AudioLinesIcon,
    current: false,
  },
  { name: "Analytics", href: "/analytics", icon: BarChart2Icon, current: false },
  { name: "Feature Requests", href: "/feature-ideas", icon: NewspaperIcon, current: false },
]




export function MainPages() {

  const pathName = usePathname()
  const isCurrentPath = (path: string) => pathName.toLowerCase().includes(path.toLowerCase())

  

  const newPath = pathName.split("/interviews")[0]
  .split("/analytics")[0]
  .split("/feature-ideas")[0]
  .split("/home")[0];

  console.log(newPath)

  const currentNavigation = navigation.map((item) => {
    return {
      ...item,
      current: isCurrentPath(item.href) && pathName.endsWith(item.href),
    }
  }
  )

  return (
  <li>
  <ul role="list" className="-mx-2 space-y-1">
    {currentNavigation.map((item) => (
      <li key={item.name}>
        <Link
          href={item.current ? pathName : newPath + item.href}
          className={cn(
            item.current
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800',
            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
          )}
        >
          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</li>
  )
}