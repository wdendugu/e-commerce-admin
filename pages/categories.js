import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


export default function Categories () {
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState ([])
    const [properties, setProperties] = useState([])

    const MySwal = withReactContent(Swal)


    function getCategories () {
        axios.get('/api/categories').then (result => {
            setCategories(result.data)
        })
    }
    
    useEffect(() => {
        getCategories()
    }, [])

    function editCategory(category) {
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
        setProperties(
            category.properties.map(({name,values}) => ({
                name,
                values:values.join(',')
        })))
    }
    
    async function saveCategory (ev) {
        ev.preventDefault()
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name:p.name,
                values:p.values.split(',')
            }))
        }
        if(editedCategory) {
            await axios.put('/api/categories', {...data, _id:editedCategory._id})
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data)
        }
        setName('')
        getCategories()
        setProperties([])
        setCategories('')
    }

    async function deleteCategory (category) {
        Swal.fire({
          title: `Are you sure you want to delete category "${category.name}?"`,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Yes, DELETE!',
          showDenyButton: false,
          confirmButtonColor:'#d55',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const {_id} = category
            await axios.delete('api/categories?_id='+_id)
            getCategories()
        }})
    }

    function addProperty () {
        setProperties(prev => {
            return [...prev, {name:'',values:''}]
        })
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].name = newName
            return properties
        })
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].values = newValues
            return properties
        })
    }

    function removeProperty (indextoRemove) {
        setProperties(prev => {
            return[...prev].filter((p, pIndex) => {
                return pIndex !== indextoRemove
            })
        })
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory ?
                    `Edit category ${editedCategory?.name}` :
                    'Create new category'
                }</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input 
                        type='text'
                        placeholder="Category Name" 
                        value={name}
                        onChange= {ev => setName(ev.target.value)}
                       >
                    </input>
                    <select 
                        value={parentCategory} 
                        onChange={ev => setParentCategory(ev.target.value)
                    }>
                        <option value=''>No parent category</option>
                        {categories?.length > 0 && categories.map (category => (
                            <option value={category._id}>{category.name}</option>
                        ))} 
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button 
                        type="button" 
                        className="btn-default text-sm mb-2"
                        onClick={addProperty}
                    >
                        Add new property
                    </button>
                    {properties.length > 0 && properties.map((property,index) => 
                        <div className="flex gap-1 mb-2">
                            <input
                                className="mb-0"
                                type='text'
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                value={property.name}
                                placeholder='property name(example: color)' 
                            />
                            <input
                                className="mb-0"
                                type='text'
                                onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                                value={property.values} 
                                placeholder='values, comma separated' 
                            />
                        <button 
                            type="button"
                            className="btn-red"
                            onClick={() => removeProperty(index)}
                            >
                            Remove
                        </button>
                        </div> 
                    )}
                </div>
                <div className="flex gap-1">
                {editedCategory && (
                    <button
                        type="button"
                        className="btn-default"
                        onClick={() => {
                            setEditedCategory(null)
                            setName('')
                            setParentCategory('')
                            setProperties([])
                        }}
                    > 
                        Cancel
                    </button>
                )}
                <button 
                    type='submit' 
                    className="btn-primary"
                >
                    Save
                </button>
                </div>

            </form>
            {!editedCategory && (
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories?.length > 0 && categories.map (category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button 
                                    onClick={() => editCategory(category)}
                                    className="btn-default mr-1"
                                >
                                    Edit 
                                </button>
                                <button className="btn-red" onClick={() => deleteCategory(category)} > 
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))} 
                </tbody>
            </table>
            )}
        </Layout>
    )
}