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
    }
    
    async function saveCategory (ev) {
        ev.preventDefault()
        const data = {name, parentCategory}
        if(editedCategory) {
            await axios.put('/api/categories', {...data, _id:editedCategory._id})
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data)
        }
        setName('')
        getCategories()
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

    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory ?
                    `Edit category ${editedCategory?.name}` :
                    'Create new category'
                }</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                    type='text'
                    placeholder="Category Name" 
                    value={name}
                    onChange= {ev => setName(ev.target.value)}
                    className="mb-0">
                </input>
                <select 
                    className="mb-0" 
                    value={parentCategory} 
                    onChange={ev => setParentCategory(ev.target.value)
                }>
                    <option>No parent category</option>
                    {categories?.length > 0 && categories.map (category => (
                        <option value={category._id}>{category.name}</option>
                    ))} 
                </select>
                <button type='submit' className="btn-primary">Save</button>
            </form>
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
                                    className="btn-primary mr-1"
                                >
                                    Edit 
                                </button>
                                <button className="btn-primary" onClick={() => deleteCategory(category)} > 
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))} 
                </tbody>
            </table>
        </Layout>
    )
}