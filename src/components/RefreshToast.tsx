import { useEffect, useState } from "react";

export function RefreshToast({ visible }: { visible: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 z-[60] bg-dash-purple text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-fade-in-up">
      Refreshing...
    </div>
  );
}
