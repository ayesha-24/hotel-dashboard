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
    imageUrl: "",
  });

  const [showDelete, setShowDelete] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
            imageUrl: data.imageUrl || "",
          });
          if (data.imageUrl) {
            const fullUrl = data.imageUrl.startsWith("http")
              ? data.imageUrl
              : `http://localhost:8001${data.imageUrl}`;
            setImageUrl(fullUrl);
          }
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let imageUrlToSave = formData.imageUrl;

    if (imageFile) {
      const imageForm = new FormData();
      imageForm.append("file", imageFile);

      try {
        const res = await fetch("http://localhost:8001/upload-image/", {
          method: "POST",
          body: imageForm,
        });
        const data = await res.json();
        imageUrlToSave = data.url;
        setImageUrl(`http://localhost:8001${data.url}`);
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    const url = isEdit ? `http://localhost:8001/rooms/${id}` : "http://localhost:8001/rooms";

    const roomToSave = {
      ...formData,
      imageUrl: imageUrlToSave,
    };

    fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomToSave),
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

  const handleExportPDF = async () => {
    const printableElement = document.getElementById("pdf-printable");
    if (!printableElement) return;

    const images = printableElement.querySelectorAll("img");
    const imageLoadPromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = () => resolve(null);
        img.onerror = () => resolve(null);
      });
    });

    await Promise.all(imageLoadPromises);

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
              className="room-button"
              onClick={() => setShowDelete(true)}
              style={{
                letterSpacing: "0.05em",
              }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  style={{
                    width: "1rem",
                    height: "1rem",
                    fill: "var(--red)",
                    paddingRight: "5px",
                    paddingTop: "5px",
                  }}
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm79 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
              </span>
              Delete Room
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
            <label
              className="room-button"
              htmlFor="file-upload"
              style={{
                marginBottom: "2rem",
              }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  style={{
                    width: "1rem",
                    height: "1rem",
                    fill: "var(--red)",
                    paddingRight: "5px",
                    paddingTop: "5px",
                  }}
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                </svg>
              </span>
              Add Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setImageFile(file);
                  setImageUrl(URL.createObjectURL(file));
                  setFormData((prev) => ({ ...prev, imageUrl: "" }));
                }
              }}
              style={{ display: "none" }}
            />

            {(imageUrl || formData.imageUrl) && (
              <div style={{ marginTop: "1rem" }}>
                <img
                  src={
                    imageUrl
                      ? imageUrl
                      : formData.imageUrl?.startsWith("http")
                      ? formData.imageUrl
                      : `http://localhost:8001${formData.imageUrl}`
                  }
                  alt="Room Preview"
                  style={{ maxWidth: "150px", borderRadius: "4px" }}
                />
              </div>
            )}
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
              className="room-button"
              style={{
                marginBottom: "2rem",
              }}
            >
              <span className="add-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  style={{
                    width: "1rem",
                    height: "1rem",
                    fill: "var(--red)",
                    paddingRight: "5px",
                    paddingTop: "5px",
                  }}
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                </svg>
              </span>
              Add Facility
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
            imageUrl: formData.imageUrl,
          }}
        />
      </div>
    </div>
  );
}

export default RoomForm;
