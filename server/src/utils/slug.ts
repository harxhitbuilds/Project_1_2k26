import Idea from "../models/idea.model.js";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const generateUniqueSlug = async (title: string) => {
  const baseSlug = slugify(title);

  let slug = baseSlug;
  let count = 1;

  while (await Idea.exists({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};
