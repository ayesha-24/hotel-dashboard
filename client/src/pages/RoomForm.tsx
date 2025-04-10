import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DeleteModal from "../components/DeleteModal";
import PrintableRoom from "../components/PrintableRoom";

function RoomForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    facilities: [""],
    created: new Date().toISOString().split("T")[0],
    updated: "",
  });
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:8001/rooms/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name,
            description: data.description,
            facilities: data.facilities,
            created: data.created,
            updated: new Date().toISOString().split("T")[0],
          });
        })
        .catch((err) => console.error("Error loading room:", err));
    }
  }, [id, isEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFacilityChange = (index: number, value: string) => {
    const updated = [...formData.facilities];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, facilities: updated }));
  };

  const addFacility = () => {
    setFormData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, ""],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const url = isEdit ? `http://localhost:8001/rooms/${id}` : "http://localhost:8001/rooms";

    fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save room");
        return res.json();
      })
      .then(() => {
        alert(isEdit ? "Room updated!" : "Room created!");
        navigate("/rooms");
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = () => {
    fetch(`http://localhost:8001/rooms/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        return res.json();
      })
      .then(() => {
        alert("Room deleted");
        navigate("/rooms");
      })
      .catch((err) => console.error(err));
  };

  const handleExportPDF = () => {
    const printableElement = document.getElementById("pdf-printable");
    if (!printableElement) return;

    printableElement.style.visibility = "visible";
    printableElement.style.position = "absolute";
    printableElement.style.left = "-9999px";

    html2canvas(printableElement, { useCORS: true, logging: false, scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "px", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("room-details.pdf");

      printableElement.style.visibility = "hidden";
    });
  };

  return (
    <div style={{ display: "flex", gap: "3rem", padding: "2rem" }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Room details</h1>
        {isEdit && (
          <div style={{ textAlign: "right", marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              style={{
                border: "none",
                background: "none",
                color: "var(--red)",
                fontWeight: "bold",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              ❌ Delete Room
            </button>
            <DeleteModal
              isOpen={showDelete}
              onClose={() => setShowDelete(false)}
              onConfirm={handleDelete}
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            <strong className="karla">Title</strong>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Room title"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "var(--light-grey)",
                border: "none",
                borderRadius: "3px",
                marginBottom: "1rem",
              }}
            />
          </label>

          <label>
            <strong className="karla">Description</strong>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Room description..."
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "var(--light-grey)",
                border: "none",
                borderRadius: "3px",
                marginBottom: "1rem",
              }}
            />
          </label>

          <div>
            <strong className="karla">Image</strong>
            <br />
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "var(--red)",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
            >
              ➕ Add Image
            </button>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h2 className="karla" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              Facilities
            </h2>
            {formData.facilities.map((facility, index) => (
              <div key={index}>
                <input
                  value={facility}
                  onChange={(e) => handleFacilityChange(index, e.target.value)}
                  placeholder="Facility detail"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: "var(--light-grey)",
                    border: "none",
                    borderRadius: "3px",
                    marginBottom: "0.5rem",
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addFacility}
              style={{
                background: "none",
                border: "none",
                color: "var(--red)",
                fontWeight: "bold",
                cursor: "pointer",
                textTransform: "uppercase",
                marginBottom: "2rem",
              }}
            >
              ➕ Add Facility
            </button>
          </div>

          <button
            type="submit"
            className="confirm-button"
            style={{
              cursor: "pointer",
            }}
          >
            {isEdit ? "Save and Generate PDF" : "Create and Generate PDF"}
          </button>
        </form>
      </div>

      <div
        style={{
          width: "350px",
          backgroundColor: "var(--taupe)",
          padding: "1rem",
          borderRadius: "4px",
          color: "#333",
          fontSize: "0.875rem",
          alignSelf: "start",
        }}
      >
        <h2 className="karla" style={{ marginBottom: "1rem" }}>
          Dates
        </h2>
        <div style={{ display: "flex" }}>
          <p>
            <strong className="karla">Created</strong>
            <br />
            {formData.created}
          </p>
          <p style={{ paddingLeft: "100px" }}>
            <strong className="karla">Updated</strong>
            <br />
            {formData.updated || "-"}
          </p>
        </div>

        {isEdit && (
          <button
            type="button"
            onClick={handleExportPDF}
            style={{
              backgroundColor: "var(--red)",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "3px",
              marginTop: "1.5rem",
              width: "100%",
              cursor: "pointer",
            }}
          >
            ⬇️ Download PDF
          </button>
        )}
      </div>

      <div
        id="pdf-printable"
        style={{
          visibility: "hidden",
          position: "absolute",
          left: "-9999px",
          top: "0",
          width: "800px",
          zIndex: -1,
        }}
      >
        <PrintableRoom
          room={{
            name: formData.name,
            description: formData.description,
            facilities: formData.facilities,
          }}
        />
      </div>
    </div>
  );
}

export default RoomForm;
