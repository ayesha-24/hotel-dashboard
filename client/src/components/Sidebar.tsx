import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const isActive = location.pathname.startsWith("/rooms");

  return (
    <aside
      style={{
        width: "200px",
        height: "100vh",
        backgroundColor: "var(--black)",
        color: "#fff",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div
          style={{
            backgroundColor: "#fff",
            color: "#2d2d2d",
            fontWeight: "bold",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            fontSize: "1.25rem",
            marginBottom: "0.5rem",
          }}
        >
          H+
        </div>
        <div style={{ fontSize: "0.9rem" }}>The Hugo</div>
        <div style={{ fontSize: "0.9rem" }}>Canterbury</div>
      </div>

      <Link
        to="/rooms"
        style={{
          color: isActive ? "var(--red)" : "#fff",
          textDecoration: "none",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span>🏠</span> Room list
      </Link>
    </aside>
  );
}

export default Sidebar;
