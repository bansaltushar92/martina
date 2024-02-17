"use server"

import { revalidatePath } from "next/cache";
// import { Form } from "react-hook-form"
import { supabase } from "./db"

export async function createCampaign(values: { name: string }) {


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

  const initials = getInitials(values.name)

  const rawFormData = {
    name: name,
    initials: initials,
  }


  const { data, error } = await supabase
    .from("campaigns")
    .insert([rawFormData])
    .select()


  if (error) {
    throw error
  }

  return data
}


export async function revalidateRoot() {
  "use server"

  revalidatePath("/", "layout")
}