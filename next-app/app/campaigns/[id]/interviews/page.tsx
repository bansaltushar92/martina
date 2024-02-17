

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

export default async function Page() {

  return (
    <div className="grid w-full grid-cols-2 bg-[#fff]">
    <table className="mt-6 w-full whitespace-nowrap text-left">
      <colgroup>
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
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
        </tr>
      </thead>

      <tbody className="divide-y divide-black/5">
        {dataItems.map((item) => (
          <tr key={item.contact} className="h-12">
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                <div className="truncate text-sm font-medium leading-6 text-black">
                  {item.contact}
                </div>
              </div>
            </td>
            <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
              <div className="flex gap-x-3">
                <div className="font-mono text-sm leading-6 text-black">
                  {item.date}
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
              {item.sentimentDescription}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="bg-red-300 w-full"></div>
    </div>
  )
}
