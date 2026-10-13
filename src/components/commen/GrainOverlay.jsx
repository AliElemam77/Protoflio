// Fixed filmic grain — opacity driven live by the CMS fx store.
import { useProfileData } from "../../context/PortfolioContext";

const GrainOverlay = () => {
  const { fx } = useProfileData();
  const opacity = fx?.noiseOpacity ?? 0.05;
  const enabled = fx?.grainEnabled !== false;
  if (!enabled) return null;
  return <div className="grain" aria-hidden="true" style={{ opacity }} />;
};

export default GrainOverlay;
