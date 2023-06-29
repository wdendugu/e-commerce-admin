import Layout from "@/components/Layout";
import { SpinnerCenter } from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SettingsPage () {
    const [products,setProducts] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const [featuredProductId, setFeaturedProductId]= useState(null)
    const [shippingFee, setShippingFee] = useState(null)

    useEffect (()=>{
        setIsLoading(true)
        fetchAll().then (() => {
            setIsLoading(false)
        })
    },[])

    async function fetchAll () {
        await axios.get('/api/products').then (res => {
            setProducts(res.data)
        })
        await axios.get ('api/settings?name=featuredProductId').then (res =>{
            setFeaturedProductId(res.data.value)
        })
        await axios.get ('api/settings?name=shippingFee').then (res =>{
            setShippingFee(res.data.value)
        })
    }

    async function saveSetting() {
        setIsLoading(true)
        await axios.put ('/api/settings', {
            name: 'shippingFee',
            value: shippingFee
        });
        await axios.put ('/api/settings', {
            name: 'featuredProductId',
            value: featuredProductId
        });
        setIsLoading(false)
        await Swal.fire({
            title: `Settings saved!`,
            icon:'success'
        })
    }
    

    return (
        <Layout>
            <h1>Settings</h1>
            <label>Featured product</label>
            {isLoading && (<SpinnerCenter />)}
            {!isLoading && (
                <>
                    <select 
                        onChange={ev => setFeaturedProductId(ev.target.value)} 
                        value={featuredProductId}
                    >
                        {products.length > 0 && products.map(product => (
                            <option value={product._id} key={product._id}>{product.title}</option>
                        ))}
                    </select>
                    <label>Shipping Fee</label>
                    <input 
                        type='number'
                        value={shippingFee}
                        onChange={ev => setShippingFee(ev.target.value)}
                    ></input>
                    <div>
                        <button 
                            className="btn-primary"
                            onClick={saveSetting}
                        >
                            Save
                        </button>
                    </div>
                </>
            )}
        </Layout>
    )
}