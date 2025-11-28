export type Genre =
  | 'RPG'
  | 'Puzzle'
  | 'Roguelike'
  | 'Platformer'
  | 'Co-op'
  | 'Horror'
  | 'Narrative'
  | 'Other';

export type Tone =
  | 'Cozy'
  | 'Dark'
  | 'Surreal'
  | 'Comedic'
  | 'Epic'
  | 'Other';

export type DesignerResponse = {
  title: string;
  coreFantasy: string;
  coreLoop: string;
  mechanics: string[];
};

export type EngineerResponse = {
  summary: string;
  systems: string[];
  challenges: string;
};

export type ArtistResponse = {
  summary: string;
  imagery: string;
  references: string[];
  palette: string;
};

export type IdeaResult = {
  prompt: string;
  genre: Genre | '';
  tone: Tone | '';
  designer: DesignerResponse;
  engineer: EngineerResponse;
  artist: ArtistResponse;
  createdAt: string; // ISO
};

export type SavedIdea = IdeaResult & {
  id: string;
};
