import Layout from "@/components/Layout";
import { EditIcon,DeleteIcon } from "@/utils/Icons";
import axios from "axios";
import Link from "next/link";
import { useEffect,useState } from "react";

export default function Products () {
    const [products, setProducts] = useState([])
    useEffect (()=> {
        axios.get ('/api/products').then(response =>
        setProducts(response.data)
        )
    },[])
    return (
        <Layout>
            <h1> Products </h1>
            <Link href={"/products/new"} className="btn-primary">
                Add new product    
            </Link>
            <table className="basic mt-2">
                <thead>
                    <tr>
                        <td>Product name</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {products.map (product => (
                        <tr key={product._id}>
                            <td>{product.title}</td>
                            <td>
                                <Link className="btn-default" href={'/products/edit/'+product._id}> 
                                    <EditIcon/>Edit 
                                </Link>
                                <Link className="btn-red" href={'/products/delete/'+product._id}> 
                                    <DeleteIcon/>Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}