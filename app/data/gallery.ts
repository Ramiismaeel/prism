export const galleryCategories = ["nature", "city", "people", "abstract"] as const;
export type GalleryCategory = (typeof galleryCategories)[number];

/** Tile height in the masonry grid; also sets the image's aspect ratio. */
export type GalleryShape = "tall" | "portrait" | "square" | "landscape";

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  shape: GalleryShape;
}

/** Natural size (px) of each shape, used for picsum URLs and width/height attributes. */
export const SHAPE_SIZE: Record<GalleryShape, { width: number; height: number }> = {
  tall: { width: 800, height: 1200 },
  portrait: { width: 800, height: 1000 },
  square: { width: 800, height: 800 },
  landscape: { width: 1200, height: 800 },
};

const titles: Record<GalleryCategory, string[]> = {
  nature: ["Morning refraction", "Fern spectrum", "Glacier glow", "Wild prism", "Golden hour"],
  city: ["Neon crossing", "Glass towers", "Night signals", "Rooftop light"],
  people: ["Studio portrait", "Color workshop", "Sketch session", "Team huddle", "Gallery opening"],
  abstract: ["Liquid rainbow", "Soft geometry", "Chromatic noise", "Paper light"],
};

const shapes: GalleryShape[] = ["portrait", "landscape", "tall", "square", "landscape", "portrait"];

// 18 items with stable seeds ("gallery-nature-1"…), interleaved so every filter mixes shapes.
export const galleryItems: GalleryItem[] = (() => {
  const items: GalleryItem[] = [];
  const counters: Record<GalleryCategory, number> = { nature: 0, city: 0, people: 0, abstract: 0 };
  for (let i = 0; items.length < 18; i++) {
    const category = galleryCategories[i % galleryCategories.length]!;
    const n = counters[category]++;
    const title = titles[category][n];
    if (!title) continue;
    items.push({ id: `gallery-${category}-${n + 1}`, title, category, shape: shapes[items.length % shapes.length]! });
  }
  return items;
})();
