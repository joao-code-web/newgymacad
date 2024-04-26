"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Month {
  _id: string;
  name: string;
}


const AllMonths = () => {
  const [months, setMonths] = useState<Month[]>([]);
  const [newMonthName, setNewMonthName] = useState("");
  const [addedMonth, setAddedMonth] = useState(null);

  const handleDeleteMonth = async (monthId: string) => {
    try {
      await axios.delete(`/api/months/?monthId=${monthId}`);
      setMonths(months.filter(month => month._id !== monthId));
    } catch (error) {
      console.error("Error deleting month:", error);
    }
  };


  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const response = await axios.get("/api/months");
        setMonths(response.data);
      } catch (error) {
        console.error("Error fetching months:", error);
      }
    };

    fetchMonths();
  }, []);

  const handleAddMonth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/months", { name: newMonthName });
      setMonths([...months, response.data]);
      setAddedMonth(response.data);
      setNewMonthName("");
    } catch (error) {
      console.error("Error adding month:", error);
    }
  };

  return (
    <div>
      <h2>Adicionar Novo Mês</h2>
      <form onSubmit={handleAddMonth}>
        <input
          type="text"
          placeholder="Nome do Mês"
          value={newMonthName}
          onChange={(e) => setNewMonthName(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      <hr />

      <h2>Todos os Meses</h2>
      <ul>
        {months.map((month) => (
          <div key={month._id}>
            <li>{month.name}</li>
            <Link href={`usersId/${month._id}`}>osjasj</Link>
            <button onClick={() => handleDeleteMonth(month._id)}>Deletar</button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default AllMonths;
