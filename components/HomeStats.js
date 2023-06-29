import axios from "axios"
import { subDays, subHours } from "date-fns"
import { useState, useEffect } from "react"
import { SpinnerCenter } from "./Spinner"

export default function HomeStats() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/orders').then(res =>{
            setOrders(res.data)
            setIsLoading(false)
        })
    }, [])

    function ordersTotal (orders) {
        let sum = 0
        orders.forEach(order => {
            const {line_items} = order
            line_items.forEach(li => {
                const lineSum = li.quantity * li.price_data.unit_amount
                sum += lineSum
            })
        })
        return new Intl.NumberFormat('ar-ES').format(sum)
    }

    if (isLoading) {
        return (
            <SpinnerCenter/>
        )
    }

    const dailyOrders = orders.filter(o => {
        return o.createdAt && new Date(o.createdAt) > subHours(new Date, 24)}
    )
    const weeklyOrders = orders.filter(o => {
        return o.createdAt && new Date(o.createdAt) > subDays(new Date, 7)}
    )
    const monthlyOrders = orders.filter(o => {
        return o.createdAt && new Date(o.createdAt) > subDays(new Date, 30)}
    )


    return (
        <div className="">
            <h2>Orders</h2>
            <div className="stats-grid">
                <div className="stats-box">
                    <h3>Today</h3>
                    <div>{dailyOrders.length}</div>
                    <h4>{dailyOrders.length} order/s today</h4>
                </div>
                <div className="stats-box">
                    <h3>This Week</h3>
                    <div>{weeklyOrders.length}</div>
                    <h4>{weeklyOrders.length} order/s this week</h4>
                </div>
                <div className="stats-box">
                    <h3>This Month</h3>
                    <div>{monthlyOrders.length}</div>
                    <h4>{monthlyOrders.length} order/s this month</h4>
                </div>
            </div>
            <h2>Revenue</h2>
            <div className="stats-grid">
                <div className="stats-box">
                    <h3>Today</h3>
                    <div>${ordersTotal(dailyOrders)}</div>
                    <h4>{dailyOrders.length} order/s today</h4>
                </div>
                <div className="stats-box">
                    <h3>This Week</h3>
                    <div>${ordersTotal(weeklyOrders)}</div>
                    <h4>{weeklyOrders.length} order/s this week</h4>
                </div>
                <div className="stats-box">
                    <h3>This Month</h3>
                    <div>${ordersTotal(monthlyOrders)}</div>
                    <h4>{monthlyOrders.length} order/s this month</h4>
                </div>
            </div>
        </div>
    )
}