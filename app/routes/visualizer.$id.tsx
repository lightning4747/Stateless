import { useLocation } from "react-router";
import { useState, useEffect } from "react";

const VisualizerPage = () => {
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { initialImage, name } = location.state || {};

  const displayName = isMounted ? (name || 'Untitled Project') : 'Untitled Project';

  return (
    <section>
      <h1>{displayName}</h1>

      <div className="visualizer">
        {initialImage && (
          <div className="image-container">
            <h2>Source Image</h2>
            <img src={initialImage} alt="source" />
          </div>
        )}
      </div>
    </section>
  );
};

export default VisualizerPage;