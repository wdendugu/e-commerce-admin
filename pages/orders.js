import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage () {
    const [orders, setOrders] = useState([])

    useEffect(()=>{
        axios.get('/api/orders').then(response => {
            setOrders(response.data)
        })
    },[])
    console.log(orders)

    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length && orders.map( order => 
                    <tr>
                        <td>{order.createdAt}</td>
                        <td>{order.name}</td>
                        <td>{order.line_items.map(item => item.product_data)}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </Layout>
    )
}