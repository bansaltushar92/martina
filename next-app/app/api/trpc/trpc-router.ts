import { supabase } from "@/app/db";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  getCampaigns: t.procedure
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .mutation(async ({input, ctx}) => {

    function getInitials(name: string): string {
      const words = name.split(" ");
      let initials = "";
  
      for (let i = 0; i < words.length && initials.length < 2; i++) {
        const word = words[i];
        if (word.length > 0) {
          initials += word[0].toUpperCase();
        }
      }
  
      return initials;
    }

    const initials = getInitials(input.name);

    const { data, error } = await supabase
    .from('campaigns')
    .insert([
      { name: input.name, initials: initials },
    ])
    .select()
            
            
    return data;
  }),
});



export type AppRouter = typeof appRouter;

// The code below is kept here to keep things simple

interface User {
  id: string;
  name: string;
  email: string;
}

const userList: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe@gmail.com",
  },
  {
    id: "2",
    name: "Abraham Smith",
    email: "abrahamsmith@gmail.com",
  },
  {
    id: "3",
    name: "Barbie Tracy",
    email: "barbietracy@gmail.com",
  },
  {
    id: "4",
    name: "John Payday",
    email: "johnpayday@gmail.com",
  },
  {
    id: "5",
    name: "Remember My Name",
    email: "remembermyname@gmail.com",
  },
  {
    id: "6",
    name: "Go to School",
    email: "gotoschool@gmail.com",
  },
  {
    id: "7",
    name: "Fish Fruit",
    email: "fishfruit@gmail.com",
  },
  {
    id: "8",
    name: "Don't try",
    email: "donttry@gmail.com",
  },
  {
    id: "9",
    name: "Producer Feed",
    email: "producerfeed@gmail.com",
  },
  {
    id: "10",
    name: "Panic So",
    email: "panicso@gmail.com",
  },
];