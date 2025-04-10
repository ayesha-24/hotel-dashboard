import { Routes, Route } from "react-router-dom";
import RoomForm from "./pages/RoomForm";
import RoomList from "./pages/RoomList";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem" }}>
        <Routes>
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/rooms/create" element={<RoomForm />} />
          <Route path="/rooms/:id/edit" element={<RoomForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
