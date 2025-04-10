type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "8px",
          width: "500px",
          textAlign: "left",
        }}
      >
        <h1>Are you sure?</h1>
        <p>You are deleting a room...</p>
        <button className="confirm-button" onClick={onConfirm}>
          YES DELETE
        </button>
        <button className="decline-button" onClick={onClose} style={{ marginLeft: "0.5rem" }}>
          NO TAKE ME BACK
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
