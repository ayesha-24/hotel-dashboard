import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Room = {
  id: number;
  name: string;
  description: string;
  facilities: string[];
  created: string;
  updated?: string;
};

function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>All rooms</h1>
        <button
          onClick={() => navigate("/rooms/create")}
          className="confirm-button"
          style={{
            cursor: "pointer",
          }}
        >
          CREATE A ROOM
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
        <thead>
          <tr
            className="karla"
            style={{
              textAlign: "left",
              color: "#444",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              borderBottom: "1px solid #ccc",
            }}
          >
            <th>Room</th>
            <th>Description</th>
            <th>Facilities</th>
            <th>Created</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr
              key={room.id}
              onClick={() => navigate(`/rooms/${room.id}/edit`)}
              style={{
                borderBottom: "1px solid #eee",
                verticalAlign: "top",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <td>{room.name}</td>
              <td>{room.description}</td>
              <td>{room.facilities.length}</td>
              <td>{room.created}</td>
              <td>{room.updated || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoomList;
