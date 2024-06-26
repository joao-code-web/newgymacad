"use client"
import { useEffect, useState } from "react";
import axios from "axios";

import "./page.css";

interface User {
    _id: string;
    name: string;
    value: string;
    data: string;
}

export default function MonthId({ params }: { params: { id: string } }) {
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState({ name: "", value: "" });
    const [monthName, setMonthName] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get<User[]>(`/api/users/?monthId=${params.id}`);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();

        const fetchMonthName = async () => {
            try {
                const monthResponse = await axios.get(`/api/months/${params.id}`);
                setMonthName(monthResponse.data.name);
            } catch (error) {
                console.error("Error fetching month:", error);
            }
        };

        fetchMonthName();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;

        try {
            await axios.post(`/api/users/?monthId=${params.id}`, { ...formData, data: formattedDate });
            const response = await axios.get<User[]>(`/api/users/?monthId=${params.id}`);
            setUsers(response.data);
            setFormData({ name: "", value: "" });
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            await axios.delete(`/api/users/?monthId=${params.id}&userId=${userId}`);
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
            <h1>Usuários do Mês {monthName}</h1>

            <form className="user-form dark-theme" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nome do usuário"
                />
                <input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="Valor"
                />
                <button className="add-button" type="submit">Adicionar Usuário</button>
            </form>

            <table className="user-table dark-theme">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.value}</td>
                            <td>{user.data}</td>
                            <td>
                                <button className="delete-button" onClick={() => handleDelete(user._id)}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
