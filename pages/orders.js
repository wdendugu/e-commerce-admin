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

    function formatDate (date) {
        return new Date(date).toLocaleDateString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })
    }
     /* FALTA IMPLEMENTAR LOGICA SI ESTA PAGO O NO */
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
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{order.name}<br/>
                            {order.streetAdress}, {order.city}<br/>
                            CP:{order.postalCode}<br/>
                            {order.country}
                        </td>
                        <td>
                            {order.line_items.map(l => 
                                <>
                                {l.quantity} x {l.product_data.name} = ${l.price_data.unit_amount}<br/>

                                </>
                            )}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </Layout>
    )
}