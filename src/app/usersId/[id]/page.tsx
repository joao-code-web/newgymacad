"use client"
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
    _id: string;
    name: string;
    value: string;
    data: string;
}

export default function MonthId({ params }: { params: { id: string } }) {
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState({ name: "", value: "" });

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
        <div>
            <h1>Usuários do Mês {params.id}</h1>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        {user.name} - {user.value}
                        <button onClick={() => handleDelete(user._id)}>Deletar</button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Adicionar Usuário</button>
            </form>
        </div>
    );
}
