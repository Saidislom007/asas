// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";

export default function Dashboard() {
  const sections = [
    { name: "Reading", path: "/reading", icon: "/images/reading.png" },
    { name: "Writing", path: "/writing", icon: "/images/writing.png" },
    { name: "Speaking", path: "/speaking", icon: "/images/speaking.png" },
    { name: "Listening", path: "/listening", icon: "/images/listening.png" },
  ];

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      <div style={styles.grid}>
        {sections.map((section) => (
          <Link key={section.name} to={section.path} style={styles.card}>
            <img src={section.icon} alt={section.name} style={styles.icon} />
            <div>{section.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "20px",
    marginTop: "30px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  card: {
    display:"flex",
    flexDirection:"column",
    justifyItems:"center",
    alignItems:"center",
    backgroundColor: "#f0f0f0",
    borderRadius: "12px",
    padding: "30px 20px",
    textDecoration: "none",
    color: "#333",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
    fontSize: "18px",
  },
  icon: {
    width: "40px",
    height: "40px",
    marginBottom: "10px",
    
  },
};
