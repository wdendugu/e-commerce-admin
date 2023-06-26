import Layout from "@/components/Layout";
import { SpinnerCenter } from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SettingsPage () {
    const [products,setProducts] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const [featuredProductId, setFeaturedProductId]= useState(null)

    useEffect (()=>{
        setIsLoading(true)
        axios.get('/api/products').then (res => {
            setProducts(res.data)
            setIsLoading(false)
        })
        axios.get ('api/settings?name=featuredProductId').then (res =>{
            setFeaturedProductId(res.data.value)
        })
    },[])

    async function saveSetting() {
        await axios.put ('/api/settings', {
            name: 'featuredProductId',
            value: featuredProductId
        }).then (() => { Swal.fire({
            title: `Featured product changed!`,
            icon:'success'
            })})
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