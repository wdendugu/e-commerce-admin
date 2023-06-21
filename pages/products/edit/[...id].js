import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import { SpinnerCenter } from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage () {
    const [productInfo, setProductInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const {id} = router.query

    useEffect(() => {
        if (!id) {
            return
        }
        setIsLoading(true)
        axios.get('/api/products?id='+id).then(response => setProductInfo(response.data),setIsLoading(false))
    }, [id])

    return (
        <Layout>
            <h1 >Edit Product</h1>
            {isLoading && <SpinnerCenter/>}
            {productInfo && (<ProductForm {...productInfo}/>)}
        </Layout>
    )
}