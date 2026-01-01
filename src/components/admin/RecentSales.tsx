interface RecentSalesProps {
  data: Array<{
    reservation_id: number
    user_name: string
    user_email: string
    total_amount: number
  }>
}

export function RecentSales({ data }: RecentSalesProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No recent sales available
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {data.map((sale) => (
        <div key={sale.reservation_id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.user_name}</p>
            <p className="text-sm text-muted-foreground">{sale.user_email}</p>
          </div>
          <div className="ml-auto font-medium">+${sale.total_amount}</div>
        </div>
      ))}
    </div>
  )
}
