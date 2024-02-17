import { supabase } from "@/app/db"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CreateNewCall } from "../CreateCall"
import { InterviewTable } from "../interviews/page"

const stats = [
  { name: 'Number of deploys', value: '405' },
  { name: 'Average deploy time', value: '3.65', unit: 'mins' },
  { name: 'Number of servers', value: '3' },
  { name: 'Success rate', value: '98.5%' },
]
const statuses = { Completed: 'text-green-400 bg-green-400/10', Error: 'text-rose-400 bg-rose-400/10' }
const activityItems = [
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    commit: '2d89f0c8',
    branch: 'main',
    status: 'Completed',
    duration: '25s',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    commit: '2d89f0c8',
    branch: 'main',
    status: 'Completed',
    duration: '25s',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    commit: '2d89f0c8',
    branch: 'main',
    status: 'Completed',
    duration: '25s',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    commit: '2d89f0c8',
    branch: 'main',
    status: 'Completed',
    duration: '25s',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
]

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
];

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


