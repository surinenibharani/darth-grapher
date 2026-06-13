/** Maps Instagram hashtags to display names for bird collections. */
const HASHTAG_GROUPS: Record<string, string> = {
  baldeagle: "Bald Eagle",
  baldeagles: "Bald Eagle",
  baldeaglenest: "Bald Eagle",
  baldeagleinnest: "Bald Eagle",
  baldeagleeaglets: "Bald Eagle",
  baldeaglesofinstagram: "Bald Eagle",
  baldeaglesofconowingo: "Bald Eagle",
  baldeaglephotography: "Bald Eagle",
  juvenilebaldeagle: "Bald Eagle",
  eaglet: "Bald Eagle",
  conowingoeagles: "Bald Eagle",
  greatblueheron: "Great Blue Heron",
  greatblueheronsofinstagram: "Great Blue Heron",
  greatblueheronwithfish: "Great Blue Heron",
  greatblueheronportrait: "Great Blue Heron",
  greenheron: "Green Heron",
  greenheronwithfish: "Green Heron",
  redshoulderedhawk: "Red-shouldered Hawk",
  songsparrow: "Song Sparrow",
  treeswallow: "Tree Swallow",
  treeswallows: "Tree Swallow",
  treeswallowsofinstagram: "Tree Swallow",
  northernmockingbird: "Northern Mockingbird",
  mockingbird: "Northern Mockingbird",
  mockingbirds: "Northern Mockingbird",
  beltedkingfisher: "Belted Kingfisher",
  femalebeltedkingfisher: "Belted Kingfisher",
  osprey: "Osprey",
  greathornedowl: "Great Horned Owl",
  screechowl: "Eastern Screech Owl",
  owl: "Owl",
  americanrobin: "American Robin",
  robin: "American Robin",
  snowgoose: "Snow Goose",
  tundraswans: "Tundra Swan",
  swan: "Tundra Swan",
};

const GENERIC_TAGS = new Set([
  "birdsofprey",
  "birdsofpennsylvania",
  "pennsylvaniabirds",
  "pennsylvaniaowls",
  "heron",
  "eagle",
  "hawk",
  "swallow",
  "swallows",
  "kingfisher",
  "kingfishers",
  "sparrow",
  "at",
  "canonr5",
  "conowingodam",
  "middlecreek",
  "middlecreekwildlifemanagementarea",
]);

export function extractHashtags(caption: string): string[] {
  return (caption.match(/#[\w]+/g) ?? []).map((tag) =>
    tag.slice(1).toLowerCase()
  );
}

export function birdGroupFromCaption(caption: string): string | null {
  const tags = extractHashtags(caption);

  for (const tag of tags) {
    if (GENERIC_TAGS.has(tag)) continue;
    const group = HASHTAG_GROUPS[tag];
    if (group) return group;
  }

  return null;
}

export function groupBirdPhotos<T extends { birdGroup?: string | null }>(
  photos: T[]
): { group: string; photos: T[] }[] {
  const grouped = new Map<string, T[]>();

  for (const photo of photos) {
    const group = photo.birdGroup ?? "Other Birds";
    const list = grouped.get(group) ?? [];
    list.push(photo);
    grouped.set(group, list);
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => {
      if (a === "Other Birds") return 1;
      if (b === "Other Birds") return -1;
      return a.localeCompare(b);
    })
    .map(([group, items]) => ({ group, photos: items }));
}
