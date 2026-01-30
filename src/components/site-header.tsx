import { Separator } from "@/ui/separator"
import { SidebarTrigger } from "@/ui/sidebar"
import { ModeToggle } from "../ui/mode-toggler"
import { useSelector } from "react-redux"
import { StoreRootState } from "@/reduxstore/redux-store"

export function SiteHeader() {
  const wallet = useSelector(
    (state: StoreRootState) => state?.data?.userdata?.user?.wallet,
  )
  const role = useSelector(
    (state: StoreRootState) => state?.data?.userdata?.user?.role,
  )
  const roleValue = typeof role === "string" ? role : role?.value

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Admin</h1>
        <div className="ml-auto flex items-center gap-2">
          {roleValue === "retailer" ? (
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              Wallet: {wallet ?? 0}
            </span>
          ) : null}
          <ModeToggle/>
   
        </div>
      </div>
    </header>
  )
}
