export interface BirdIdentification {
  id: string;
  species: string;
  scientificName?: string;
  confidence: number;
  timestamp: Date;
  audioUri?: string;
  // Additional properties that can be expanded later
  imageUrl?: string;
  wikipediaImageUrl?: string; // Wikipedia thumbnail image
  habitat?: string;
  diet?: string;
  size?: string;
  wingspan?: string;
  description?: string;
  conservationStatus?: string;
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
