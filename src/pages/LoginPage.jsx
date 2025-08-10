// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    middle_name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Foydalanuvchini yaratishda xatolik.");
      }

      const user = await response.json();

      // localStorage ga saqlash
      localStorage.setItem("user", JSON.stringify({
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        middle_name: user.middle_name,
        phone: user.phone
      }));

 
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("Error Registering The Student");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div style={styles.container} >
      <h2 style={styles.title}>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="last_name"
          placeholder="Last Name "
          value={form.last_name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="middle_name"
          placeholder="Middle Name"
          value={form.middle_name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="phone"
          placeholder="Telefon raqam"
          value={form.phone}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Yuklanmoqda..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    
    maxWidth: "400px",
    margin: "100px auto",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    backgroundColor: "#ecfdf5", // light green background
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    border: "1px solid #d1fae5",
  },
  title: {
    color: "#065f46", // dark green text
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #a7f3d0",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    backgroundColor: "#10b981", // green button
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  },
};
