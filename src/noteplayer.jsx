import { range_onChange  } from "./sound"
import { useState } from "react";

export default function NotePlayer() {
  const [muted, setMuted] = useState(false);

  const handleMuteUnmute = () => {
    setMuted(!muted);
    range_onChange(muted); // Pass the muted state to the range_onChange function
  };

  return (
    <div>
      <button onClick={handleMuteUnmute}>
        {muted ? "🔇":"🔊" }
      </button>
    </div>
  );
}
