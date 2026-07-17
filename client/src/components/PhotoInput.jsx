import { useRef } from "react";

export default function PhotoInput({ onSelect, disabled }) {
  const cameraInputRef = useRef(null);
  const libraryInputRef = useRef(null);

  function handleChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      onSelect(file);
    }
  }

  return (
    <div className="photo-input">
      <div className="photo-input__buttons">
        <button
          type="button"
          className="btn btn-primary"
          disabled={disabled}
          onClick={() => cameraInputRef.current?.click()}
        >
          📷 Take Photo
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={disabled}
          onClick={() => libraryInputRef.current?.click()}
        >
          🖼️ Choose from Library
        </button>
      </div>

      {/* Same upload code path as the library input — capture="environment" just
          hints the OS to open the camera when a device supports it. */}
      <input
        ref={cameraInputRef}
        className="visually-hidden-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />
      <input
        ref={libraryInputRef}
        className="visually-hidden-input"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </div>
  );
}
