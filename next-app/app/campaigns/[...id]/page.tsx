import { supabase } from "@/app/db"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

export default async function Page({ params }: { params: { id: string } }) {

  const {data, error} = await supabase.from('campaigns').select('id, name, initials, description').filter('id', 'eq', params.id)
  // console.log("campaignID", params.id)

  const campaign = data![0]








  return (
    <div className="xl:pl-72 ">
      <main>
        <header>
          <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-indigo-600 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <div className="flex items-center gap-x-3">
                <h1 className="flex gap-x-3 text-base leading-7">
                  <span className="font-semibold text-white">{campaign.name}</span>
                  {/* <span className="text-gray-600">/</span> */}
                  {/* <span className="font-semibold text-white">{campaign.description}</span> */}
                </h1>
              </div>
              <p className="mt-2 text-xs leading-6 text-white">
                {campaign.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-1 bg-[#F9F9F9]  sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, statIdx) => (
              <div
                key={stat.name}
                className={cn(
                  statIdx % 2 === 1
                    ? "sm:border-l"
                    : statIdx === 2
                    ? "lg:border-l"
                    : "",
                  "border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8"
                )}
              >
                <p className="text-sm font-medium leading-6 text-gray-500">
                  {stat.name}
                </p>
                <p className="mt-2 flex items-baseline gap-x-2">
                  <span className="text-4xl font-semibold tracking-tight text-black">
                    {stat.value}
                  </span>
                  {stat.unit ? (
                    <span className="text-sm text-black">{stat.unit}</span>
                  ) : null}
                </p>
              </div>
            ))}
          </div> */}
        </header>
        {/* Activity list */}
        <CustomerInterviewList id={campaign.id} />
      </main>
    </div>
  )
}

async function CustomerInterviewList({id}: {id: string}) {



  return <div className=" pt-11 px-8 w-full">
    <div className="flex w-full justify-between">
      <h2 className="text-2xl font-semibold leading-7 text-black">
        Customer Interviews
      </h2>
      <Button size="sm" variant="default" className="">New +</Button>
    </div>
    <table className="mt-6 w-full whitespace-nowrap text-left">
      <colgroup>
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-4/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
      </colgroup>
      <thead className="border-b border-black text-sm leading-6 text-black">
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
            className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
          >
            Duration
          </th>
          <th
            scope="col"
            className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
          >
            Sentiment Description
          </th>
          <th
            scope="col"
            className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
          >
            Transcript Link
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-black/5">
        {dataItems.map((item) => (
          <tr key={item.contact}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                <div className="truncate text-sm font-medium leading-6 text-black">
                  {item.contact}
                </div>
              </div>
            </td>
            <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div className="flex gap-x-3">
                <div className="font-mono text-sm leading-6 text-gray-400">
                  {item.date}
                </div>
              </div>
            </td>
            <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div className="flex gap-x-3">
                <div className="font-mono text-sm leading-6 text-gray-400">
                  {item.duration}
                </div>
              </div>
            </td>

            <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
              {item.sentimentDescription}
            </td>
            <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
              <Button size="sm"> View </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}

