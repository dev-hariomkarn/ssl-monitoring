"use client"
import { userLogout } from "@/app/(auth)/_redux/authApi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Settings, LogOut, User, CircleCheck, CircleAlert } from "lucide-react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"

export function DashboardHeader() {

  const userData = useSelector((state: any) => state.auth, shallowEqual)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    const res = await dispatch(userLogout())
  }
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
      </div>

      <div className="flex flex-1 items-center justify-between px-4">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-lg">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData?.profileImage} alt="Profile" />
                  <AvatarFallback>{userData?.name?.slice(0, 1)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userData.name}</p>
                  <div className="text-xs leading-none text-muted-foreground flex gap-1 align-middle">
                    <p> {userData?.email?.value}</p>
                    {
                      userData?.email?.isVerified ?
                        <span title="Verified">
                          <CircleCheck size={18} fill="green" color="white" />
                        </span> :
                        <span title="Email not verified"> <CircleAlert size={18} fill="red" color="white" /></span>
                    }
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <a href="/user-dashboard/account">
                  <span>Profile</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <a href="/user-dashboard/subscription">
                  <span>Settings</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
