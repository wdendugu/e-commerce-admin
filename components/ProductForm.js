import { useState, useEffect } from "react";
import axios from "axios"
import { useRouter } from "next/router";

export default function ProductForm ({title:existingTitle, description:existingDescription, price:existingPrice, _id}) {
    

    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [price, setPrice] = useState(existingPrice || '')
    const [goToProducts, setGoToProducts] = useState(false)
    const router = useRouter()
    

    async function saveProduct (event) {
        event.preventDefault()
        const data = {title, description, price}
        if (_id) {
            await axios.put('/api/products', {...data, _id})
        } else {
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)
    }
    if (goToProducts) {
        router.push ('/products')
    }
    return (
            <form onSubmit={saveProduct}>
                <label>Product Name</label>
                <input 
                    type="text" 
                    placeholder="product name" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea 
                    placeholder="description" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <label>Price</label>
                <input 
                    type="number" 
                    placeholder="price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                <button 
                    className="btn-primary"
                    type="submit"
                >
                    Save
                </button>
            </form>
    )
}