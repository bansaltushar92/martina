import { WebSocketDemo } from "./WebSocketStream";

export default async function Page({
  params,
}: {
  params: { campaignId: string; interviewId: string }
}) {
  return (
    <div className="w-full bg-[#f9f9f9] p-4 min-h-screen">
        {/* <div className="flex flex-col">
          <CallDetails interviewId={""} />
        </div> */}
          <WebSocketDemo/>
    </div>
  )
}

const data = {
  created_at: "2022-01-01",
  campaign_id: 1,
  api_transcript: "Sample API Transcript",
  transcript_readable: "Sample Readable Transcript",
  sentiment_score: 0.8,
  sentiment: "Positive",
  concerns: {},
  ideas: {},
  call_context: "Sample Call Context",
  customer_id: 123,
  embeddings: "Sample Embeddings",
}

function CallDetails({ interviewId }: { interviewId: string }) {
  return (
    <div className="w-full bg-[#f9f9f9] p-12">
      <div className="grid grid-cols-2 w-full gap-4">
        <div className="grid gap-2 grid-cols-2">
          <h1 className="font-bold text-base">Created At: </h1>
          <h2 className="pl-4 text-gray-800">{data?.created_at}</h2>
          <h1 className="font-bold text-base">Campaign ID: </h1>
          <h2 className="pl-4 text-gray-800">{data?.campaign_id}</h2>
          <h1 className="font-bold text-base">API Transcript: </h1>
          <h2 className="pl-4 text-gray-800">{data?.api_transcript}</h2>
          <h1 className="font-bold text-base">Transcript Readable: </h1>
          <h2 className="pl-4 text-gray-800">{data?.transcript_readable}</h2>
          <h1 className="font-bold text-base">Sentiment Score: </h1>
          <h2 className="pl-4 text-gray-800">{data?.sentiment_score}</h2>
          <h1 className="font-bold text-base">Sentiment: </h1>
          <h2 className="pl-4 text-gray-800">{data?.sentiment}</h2>
          <h1 className="font-bold text-base">Concerns: </h1>
          <h2 className="pl-4 text-gray-800">
            {JSON.stringify(data?.concerns)}
          </h2>
          <h1 className="font-bold text-base">Ideas: </h1>
          <h2 className="pl-4 text-gray-800">{JSON.stringify(data?.ideas)}</h2>
          <h1 className="font-bold text-base">Call Context: </h1>
          <h2 className="pl-4 text-gray-800">{data?.call_context}</h2>
          <h1 className="font-bold text-base">Customer ID: </h1>
          <h2 className="pl-4 text-gray-800">{data?.customer_id}</h2>
          <h1 className="font-bold text-base">Embeddings: </h1>
          <h2 className="pl-4 text-gray-800">{data?.embeddings}</h2>
        </div>
      </div>
    </div>
  )
}

