import { useState, useEffect } from "react";
import axios from "axios"
import { useRouter } from "next/router";
import  Spinner  from "./Spinner";
import {ReactSortable} from "react-sortablejs"

export default function ProductForm ({
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    _id,
    images:existingImages,
    category: assignedCategory,
    properties: assignedProperties
    }) {
    
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [category, setCategory] = useState(assignedCategory || '')
    const [productProperties, setProductProperties] = useState(assignedProperties || {})
    const [price, setPrice] = useState(existingPrice || '')
    const [images, setImages] = useState(existingImages || [])
    const [categories, setCategories] = useState([])
    const [goToProducts, setGoToProducts] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()
    
    useEffect(() => {
        axios.get ('/api/categories').then (result => {setCategories(result.data)})
    }, [])
    
    async function saveProduct (event) {
        event.preventDefault()
        const data = {title,description,price,images,category, properties: productProperties}
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

    async function uploadImages(event){
        const files = event.target?.files
        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData()
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
            setIsUploading(false)
        }
    }

    function updateImagesOrder(images) {
        setImages(images)
    }

    function setProductProp (propName, value) {
        setProductProperties(prev => {
            const newProductProps = {...prev}
            newProductProps[propName] = value
            return newProductProps
        })
    }

    const propertiestoFill = []
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category)
        propertiestoFill.push(...catInfo.properties)
        while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id)
            propertiestoFill.push(...parentCat.properties)
            catInfo= parent
        }
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
                <label>Category</label>
                <select 
                    value={category}
                    onChange={ev => setCategory(ev.target.value)}
                >
                    <option value=''>Uncategorized</option>
                    {categories?.length > 0 && categories.map (cat => (
                        <option value={cat._id}>{cat.name}</option>
                    ))} 
                </select>
                {propertiestoFill.length > 0 && propertiestoFill.map( p =>
                    <div className="flex gap-1">
                        <div>{p.name}</div>
                        <select
                            value={productProperties[p.name]}
                            onChange={ev => setProductProp(p.name,ev.target.value) }
                        >
                            {p.values.map(v => (
                                <option value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                )
                }
                <label>Photo</label>
                <div className="mb-2 flex flex-wrap gap-1">
                    <ReactSortable 
                        list={images} 
                        setList={updateImagesOrder}
                        className="flex flex-wrap gap-1"
                    >
                        {!!images?.length && images.map (link => (
                            <div key={link} className="h-24 ">
                                <img src={link} alt="" className="rounded-lg" />
                            </div>
                        ))}
                    </ReactSortable>
                    {isUploading && ( 
                    <div className="h-24 p-2 flex items-center">
                        <Spinner/>
                    </div>
                    )}
                    <label className="w-24 h-24 flex text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 items-center justify-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <div>Upload</div>
                        <input type='file' className="hidden" onChange={uploadImages}/>
                    </label>
                    {!images?.length && (
                        <div>No photos</div>
                    )}
                </div>
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