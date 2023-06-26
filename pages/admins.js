import Layout from "@/components/Layout";
import { Spinner } from "@/components/Spinner";
import axios from "axios";
import { useState,useEffect } from "react";
import Swal from "sweetalert2";

export default function AdminsPage () {
    const [email,setEmail] = useState("")
    const [adminEmails, setAdminEmails] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    function loadAdmins() {
        setIsLoading(true)
        axios.get ('api/admins').then(res => {
            setAdminEmails(res.data)
            setIsLoading(false)
        })
    }

    function addAdmin(ev) {
        ev.preventDefault()
        axios.post('/api/admins', {email}).then(res => {
            console.log(res.data)
            Swal.fire({
            title: `Admin created!`,
            icon:'success'
            })
        setEmail('')
        loadAdmins()
        }).catch (err => {
            Swal.fire({
                title: `Error!`,
                text: err.response.data.message,
                icon:'error'
                })
        })
    }

    function deleteAdmin (_id, email) {
        Swal.fire({
            title: `Do you want to delete admin "${email}"`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes, DELETE!',
            showDenyButton: false,
            confirmButtonColor:'#d55',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('api/admins?_id='+_id)
                loadAdmins()
            }})
        }
    
    useEffect(() => {
        loadAdmins()
    }, [])
    

    return (
        <Layout>
            <h1>Admins</h1>
            <h2>Add new Admin</h2>
            <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                    <input 
                        type="text"
                        placeholder="google email" 
                        className="mb-0"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                    >
                    </input>
                    <button 
                        type="submit"
                        className="btn-primary py-1 whitespace-nowrap"
                    >
                        Add Admin
                    </button>
                </div>
            </form>
            <h2>Existing admins</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th className="text-left">Admin email</th>
                        <th className="text-left">Created</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2}>
                                <div className="py-4">
                                    <Spinner />
                                </div>
                            </td>
                        </tr>
                    )}
                    {adminEmails.length > 0 && adminEmails.map(adminEmail => (
                        <tr key={adminEmail._id}>
                            <td>{adminEmail.email}</td>
                            <td>{new Date(adminEmail.createdAt).toLocaleDateString("es-AR")}</td>
                            <td>
                                <button className="btn-red" onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}