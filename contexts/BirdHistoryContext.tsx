import {
  fetchBirdWikipediaInfo,
  searchBirdWikipedia,
} from "@/lib/wikipediaService";
import { BirdHistoryContextType, BirdIdentification } from "@/types/bird";
import { createContext, ReactNode, useContext, useState } from "react";

const BirdHistoryContext = createContext<BirdHistoryContextType | undefined>(
  undefined
);

export const useBirdHistory = () => {
  const context = useContext(BirdHistoryContext);
  if (!context) {
    throw new Error("useBirdHistory must be used within a BirdHistoryProvider");
  }
  return context;
};

interface BirdHistoryProviderProps {
  children: ReactNode;
}

export const BirdHistoryProvider = ({ children }: BirdHistoryProviderProps) => {
  const [history, setHistory] = useState<BirdIdentification[]>([]);
  const [isHistoryVisible, setHistoryVisible] = useState(false);
  const addBirdToHistory = async (
    bird: Omit<BirdIdentification, "id" | "timestamp">
  ) => {
    const newBird: BirdIdentification = {
      ...bird,
      id: `bird_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }; // Add bird to history immediately
    setHistory((prevHistory) => [newBird, ...prevHistory]);

    // Try to fetch Wikipedia image in the background and update
    try {
      let wikiResult = await fetchBirdWikipediaInfo(bird.species);

      // If that fails and we have a scientific name, try with that
      if (wikiResult.error && bird.scientificName) {
        wikiResult = await searchBirdWikipedia(bird.scientificName);
      }

      // If still no luck, try with "bird" appended
      if (wikiResult.error) {
        wikiResult = await searchBirdWikipedia(bird.species);
      } // If we got a Wikipedia image, update the bird in history
      if (!wikiResult.error && wikiResult.thumbnailUrl) {
        setHistory((prevHistory) =>
          prevHistory.map((historyBird) =>
            historyBird.id === newBird.id
              ? { ...historyBird, wikipediaImageUrl: wikiResult.thumbnailUrl }
              : historyBird
          )
        );
      }
    } catch {
      // Continue without Wikipedia image - this is not critical
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <BirdHistoryContext.Provider
      value={{
        history,
        addBirdToHistory,
        clearHistory,
        isHistoryVisible,
        setHistoryVisible,
      }}
    >
      {children}
    </BirdHistoryContext.Provider>
  );
};
