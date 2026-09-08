import { createContext, useContext } from "react";

/**
 * Shared state for the whole section-based experience: which section is on
 * screen, whether the circular menu is open, and whether the loader is done.
 */
export const ExperienceContext = createContext(null);

export const useExperience = () => {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error("useExperience must be used inside <ExperienceProvider>");
  }
  return ctx;
};
