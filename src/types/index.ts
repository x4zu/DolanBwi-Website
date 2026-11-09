export interface HighlightCard {
  title: string;
  description: string;
  image: string;
}

export interface ExploreFact {
  label: string;
  value: string;
}

export interface ExploreChapter {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  facts: ExploreFact[];
  activities: string[];
  image: string;
  gallery: string[];
  /** Short "did you know" note shown on the chapter. */
  trivia: string;
}

export interface PhotoCredit {
  title: string;
  author: string;
  license: string;
  source: string;
}

export interface JourneyStop {
  time: string;
  place: string;
  title: string;
  text: string;
  image: string;
}

export interface Landscape {
  name: string;
  subtitle: string;
  image: string;
  text: string;
  spots: string[];
}

export interface Principle {
  title: string;
  text: string;
}
