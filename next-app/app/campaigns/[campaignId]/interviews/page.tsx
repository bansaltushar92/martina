import { supabase } from "@/app/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CreateNewCall } from "../CreateCall"

const dataItems = [
  {
    contact: "John Doe",
    date: "2022-10-15",
    duration: "00:30:00",
    sentimentDescription: "Positive",
    transcriptLink: "https://example.com/transcript1",
  },
  {
    contact: "Jane Smith",
    date: "2022-10-16",
    duration: "00:45:00",
    sentimentDescription: "Neutral",
    transcriptLink: "https://example.com/transcript2",
  },
  {
    contact: "Alice Johnson",
    date: "2022-10-17",
    duration: "01:15:00",
    sentimentDescription: "Negative",
    transcriptLink: "https://example.com/transcript3",
  },
]

export default async function Page({ params }: { params: { campaignId: string } }) {
  return <div className="w-full bg-[#fff] p-12">
    <InterviewTable heading="All Interviews" campaignId={params.campaignId}/>
  </div>
}

export async function InterviewTable({heading, limit, campaignId}: {heading:string, limit?: number, campaignId: string}) {
  const { data, error } = await supabase
    .from("calls")
    .select(`id, created_at, sentiment, duration, customer("name")`)
    .filter("campaign_id", "eq", campaignId)
    .limit(limit ?? 25)


  return (
    <div className="">
    <div className="flex w-full justify-between py-4">
      <h1 className="text-base font-base">{heading}</h1>
      <CreateNewCall />
      </div>
      <table className=" w-full whitespace-nowrap text-left bg-white rounded-md shadow-lg ">
        <colgroup>
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b border-black text-sm leading-6 text-black py-4">
          <tr>
            <th
              scope="col"
              className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              Contact
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
            >
              Date
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left "
            >
              Duration
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell"
            >
              Sentiment Description
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell"
            >
              Transcript
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-black/5">
          {data.map((item) => (
            <tr key={item.customer.name} className="h-12">
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="truncate text-sm font-medium leading-6 text-black">
                    {item.customer.name}
                  </div>
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                <div className="flex gap-x-3">
                  <div className="font-mono text-sm leading-6 text-black">
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                <div className="flex gap-x-3">
                  <div className="font-mono text-sm leading-6 text-black">
                    {item.duration}
                  </div>
                </div>
              </td>

              <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-black md:table-cell lg:pr-20">
                {item.sentiment ?? "Neutral"}
              </td>
              <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-black md:table-cell lg:pr-20">
                <Link href={`/campaigns/1/interviews/${item.id}`}>
                  <Button variant={"link"}>View Transcript</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
