type PrintableRoomProps = {
  room: {
    name: string;
    description: string;
    facilities: string[];
    imageUrl?: string;
  };
};

const PrintableRoom = ({ room }: PrintableRoomProps) => {
  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div
      id="pdf-printable"
      style={{
        width: "800px",
        margin: "0 auto",
        fontFamily: "'Merriweather', serif",
        fontSize: "14px",
        backgroundColor: "#fff",
        padding: "40px",
      }}
    >
      <div
        style={{
          backgroundColor: "#2d2d2d",
          padding: "20px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            color: "#2d2d2d",
            padding: "10px 20px",
            fontWeight: "bold",
            fontSize: "18px",
            marginRight: "20px",
          }}
        >
          H+
        </div>
        <div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>THE HUGO</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>CANTERBURY</div>
        </div>
      </div>

      <div style={{ padding: "30px 0" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>{room.name}</h2>
        <p>{room.description}</p>
      </div>

      {room.imageUrl && (
        <div>
          <img
            src={room.imageUrl}
            alt={room.name}
            style={{ width: "100%", borderRadius: "6px", marginBottom: "30px" }}
          />
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", marginBottom: "40px" }}>
        <ul style={{ flex: "1", listStyle: "disc", paddingLeft: "20px" }}>
          {room.facilities
            .slice(0, Math.ceil(room.facilities.length / 2))
            .map((facility, index) => (
              <li key={index}>{facility}</li>
            ))}
        </ul>
        <ul style={{ flex: "1", listStyle: "disc", paddingLeft: "20px" }}>
          {room.facilities.slice(Math.ceil(room.facilities.length / 2)).map((facility, index) => (
            <li key={index}>{facility}</li>
          ))}
        </ul>
      </div>

      <div
        style={{
          backgroundColor: "#e0dcd5",
          padding: "10px 20px",
          fontSize: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>© The Hugo {new Date().getFullYear()}</div>
        <div>{today}</div>
      </div>
    </div>
  );
};

export default PrintableRoom;
