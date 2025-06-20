export interface BirdIdentification {
  id: string;
  species: string;
  scientificName?: string;
  confidence: number;
  timestamp: Date;
  audioUri?: string;
  wikipediaImageUrl?: string; // Wikipedia thumbnail image
}

export interface BirdHistoryContextType {
  history: BirdIdentification[];
  addBirdToHistory: (
    bird: Omit<BirdIdentification, "id" | "timestamp">
  ) => Promise<void>;
  clearHistory: () => void;
  isHistoryVisible: boolean;
  setHistoryVisible: (visible: boolean) => void;
}
