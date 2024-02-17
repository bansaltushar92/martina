
import {

  HomeIcon,

} from '@heroicons/react/24/outline'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'
import { AudioLinesIcon, BarChart2Icon, NewspaperIcon } from 'lucide-react'
import { CampaignList } from './SidebarClientComponents'
import { supabase } from './db'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'Interviews', href: '#', icon: AudioLinesIcon, current: false },
  { name: 'Analytics', href: '#', icon: BarChart2Icon, current: false },
  { name: 'Feature Requests', href: '#', icon: NewspaperIcon, current: false },
]

const teams = [
  { id: 1, name: 'LinkedIn Job Search', href: '#', initial: 'LP', current: true },
]



export default async function Sidebar() {   
  
  
const { data: campaigns, error } = await supabase
.from('campaigns')
.select('id,name,initials')

console.log(campaigns)
        


  return (
    <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col bg-black">
    {/* Sidebar component, swap this element with another sidebar if you like */}
    <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 ring-1 ring-white/5">
      <div className="flex flex-col h-16 shrink-0 py-4">
        <h1 className='font-bold text-xl text-white'>Martina</h1>
        <h2 className='text-white italic text-xs'>User Feedback Simplified</h2>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={cn(
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <CampaignList teams={campaigns}/>
          <li className="-mx-6 mt-auto">
            <a
              href="#"
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
            >
              <img
                className="h-8 w-8 rounded-full bg-gray-800"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  )
}

