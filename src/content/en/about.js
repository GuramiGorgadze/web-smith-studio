import { siteText } from "./site.js";

// Copy for the About page. This is the honest story of a brand-new studio: edit it as the studio grows.
// In `aboutFacts`, {founded} is filled in from src/data/site.js.

export const aboutStory = {
  eyebrow: "our story",
  title: "Started in 2026, with one simple belief.",
  paragraphs: [
    "Too many business websites are slow, generic or impossible to update, and too many studios keep the price a secret until the invoice arrives. We started Web Smith Studio to do the opposite.",
    "We are a new studio, and we would rather say so than invent a long client list. What we do bring is a modern toolkit, a careful process and a promise to be straight with you, from the first call to long after launch.",
    "We work remotely with businesses of every size, from a neighborhood shop to an international brand, and we shape our process around yours instead of the other way around.",
  ],
};

export const aboutFacts = [
  { label: "Founded", value: "{founded}" },
  { label: "How we work", value: siteText.workingModel },
  { label: "Who we build for", value: "Local businesses, organizations and growing brands, at home and abroad" },
  { label: "Right now", value: siteText.availability },
];
