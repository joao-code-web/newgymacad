"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

import "../app/page.css"

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
    <div className="container">
      <div className="section">
        <h2>Adicionar Novo Mês</h2>
        <form className="form" onSubmit={handleAddMonth}>
          <input
            className="input"
            type="text"
            placeholder="Nome do Mês"
            value={newMonthName}
            onChange={(e) => setNewMonthName(e.target.value)}
          />
          <button className="button" type="submit">Adicionar</button>
        </form>
      </div>

      <hr className="divider" />

      <div className="section">
        <h2>Todos os Meses</h2>
        <div className="months-container">
          {months.map((month) => (
            <div className="month-item" key={month._id}>
              <div className="month-box">
                <div className="month-name">{month.name}</div>
                <div className="links">
                  <Link href={`usersId/${month._id}`}>Ver Usuários</Link>
                  <button className="delete-button" onClick={() => handleDeleteMonth(month._id)}>Deletar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default AllMonths;
