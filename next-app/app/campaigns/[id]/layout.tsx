import { supabase } from "@/app/db";

export default async function Layout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {

  const campaignId = params.id

  const {data, error} = await supabase.from('campaigns').select('id, name, initials, description').filter('id', 'eq', params.id)


  const campaign = data[0]


  return (
    <header className="xl:pl-72">
          <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-indigo-600 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <div className="flex items-center gap-x-3">
                <h1 className="flex gap-x-3 text-base leading-7 w-full justify-between">
                  <span className="font-semibold text-white text-2xl">{campaign.name}</span>
                  {/* <span className="text-gray-600">/</span> */}
                   {/* <span className="font-semibold text-white">{campaign.description}</span> */}
                </h1>
              </div>
              <p className="mt-2 text-sm leading-6 text-white">
                {campaign.description}
              </p>
            </div>
          </div>
      {children}
    </header>
  );
}