


export default async function Page() {

  return (
    <div className="xl:pl-72 ">
      <main>
        <header>

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
      </main>
    </div>
  )
}
