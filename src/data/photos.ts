export type Species =
  | "birds"
  | "mammals"
  | "marine"
  | "reptiles";

export interface Photo {
  id: string;
  src: string;
  title: string;
  notes: string;
  location: string;
  species: Species;
  /** Bird species name derived from Instagram hashtags (birds only). */
  birdGroup?: string;
  instagramUrl?: string;
  featured?: boolean;
}

export const speciesLabels: Record<Species, { label: string; description: string }> = {
  birds: { label: "Birds", description: "Wings, song, and the quiet patience of the hunt." },
  mammals: { label: "Mammals", description: "Intelligence, instinct, and the wild at close range." },
  marine: { label: "Marine Life", description: "Beneath the surface — light, motion, and mystery." },
  reptiles: { label: "Reptiles & Amphibians", description: "Ancient forms, patient eyes, and perfect camouflage." },
};

/** Local fallback used when Instagram Graph API is not configured. */
export const fallbackPhotos: Photo[] = [
  {
    id: "01",
    src: "/images/0C7A3379-topaz-denoise-sharpen.jpg",
    title: "1 / 4 :  A short series of a fierce moment in the wild.",
    notes: "A tense moment in the wild. This mother Bald Eagle is perched over a stream, positioned between her nest and a Red-shouldered Hawk’s territory. You can see the agitation on her face as she intently scans the trees, waiting for the next attack. The hawk was not happy sharing the airspace.",
    location: "Pennsylvania",
    species: "birds",
    birdGroup: "Bald Eagle",
    instagramUrl: "https://www.instagram.com/p/DZEIq2dO7qM/",
    featured: true,
  },
  {
    id: "02",
    src: "/images/0C7A3412-topaz-denoise-sharpen.jpg",
    title: "2 / 4 - The harassment continues.",
    notes: "The Red-shouldered Hawk keeps making aggressive passes, flying back and forth, getting bolder with each dive. The Bald Eagle holds her ground but is clearly getting irritated by persistent attacks!",
    location: "Pennsylvania",
    species: "birds",
    birdGroup: "Bald Eagle",
    instagramUrl: "https://www.instagram.com/p/DZFbChMOHZs/",
    featured: true,
  },
  {
    id: "03",
    src: "/images/0C7A3451-topaz-denoise-sharpen.jpg",
    title: "3 / 4 - The conflict escalates.",
    notes: "Both birds are now vocalizing loudly — high-pitched squeaks and calls filling the air. The Red-shouldered Hawk relentlessly dives and attacks while the frustrated mother Bald Eagle tries to stand her ground. This battle went on for nearly 45 minutes.",
    location: "Pennsylvania",
    species: "birds",
    birdGroup: "Bald Eagle",
    instagramUrl: "https://www.instagram.com/p/DZIpedjO9zc/",
    featured: true,
  },
  {
    id: "04",
    src: "/images/0C7A3479-topaz-denoise-sharpen-2.jpg",
    title: "4 / 4: The dramatic climax.",
    notes: "The Bald Eagle and Red-shouldered Hawk finally go face-to-face, wings fully spread, beaks wide open, screaming at the top of their lungs. A raw display of power and defiance between two fierce raptors. Despite the massive size difference, the fearless hawk presses its assault, repeatedly diving and striking until the eagle is finally forced to loosen its grip and retreat farther down the branch. In a stunning display of courage over size, the smaller hawk claims victory in this intense aerial battle.",
    location: "Pennsylvania",
    species: "birds",
    birdGroup: "Bald Eagle",
    instagramUrl: "https://www.instagram.com/p/DZKlAVogpPm/",
    featured: true,
  },
  {
    id: "05",
    src: "/images/0C7A1796-topaz-denoise-sharpen.jpg",
    title: "4/7. The swallow(start):",
    notes: "Great Blue Heron moments after striking: beak clamped around a large fish, neck arched as it precisely aligns its catch head-first, ready to swallow the impressive prize in one smooth motion. A perfect display of patience, power, and skill.",
    location: "Pennsylvania",
    species: "birds",
    birdGroup: "Great Blue Heron",
    instagramUrl: "https://www.instagram.com/p/DYVuKdiuguv/",
  },
  {
    id: "06",
    src: "/images/0C7A1797-topaz-denoise-sharpen.jpg",
    title: "5/7. Final push:",
    notes: "In a dramatic final effort, the Great Blue Heron contorts its serpentine neck and triumphantly swallows the enormous fish.",
    location: "Pennsylvania",
    species: "birds",
    birdGroup: "Great Blue Heron",
    instagramUrl: "https://www.instagram.com/p/DYYGlpwOX3F/",
    featured: true,
  },
  {
    id: "07",
    src: "/images/0C7A1803-topaz-denoise-sharpen.jpg",
    title: "6/7: the innocent☺️:",
    notes: "A Great Blue Heron has completely swallowed a massive fish—one that looked way bigger than its head in the earlier photos! Its normally slender neck is now dramatically stretched and shaped like the outline of the fish inside. Now only a tiny sliver of the tail fins is still visible, while the heron stands there looking perfectly innocent, like it has no idea what you’re talking about. ☺️",
    location: "Pennsylvania",
    species: "birds",
    birdGroup: "Great Blue Heron",
    instagramUrl: "https://www.instagram.com/p/DYccGt6g6rq/",
  },
];
