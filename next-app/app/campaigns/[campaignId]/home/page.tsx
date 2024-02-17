import { supabase } from "@/app/db"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CreateNewCall } from "../CreateCall"
import { InterviewTable } from "../interviews/page"



export default async function Page({ params }: { params: { campaignId: string } }) {

  const campaignId = params.campaignId
  const {data:campaigns, error} = await supabase.from('campaigns').select('id, name, initials, description').filter('id', 'eq', campaignId)

  const campaign = campaigns![0]


  return (
    <div className="">
      <main className="w-full bg-[#fff] p-12">
        <InterviewTable heading="Recent Interviews (last 5)" limit={5} campaignId={campaignId}/>
    </main>
    </div>
  )
}


