// ქართული. საიტზე სიტყვის შესაცვლელად იპოვეთ ის ამ ფაილებიდან ერთ-ერთში. src/content/en/-ს იგივე ფაილები აქვს ინგლისურად.
import { site as facts } from "@/data/site";
import { composeContent } from "../compose.js";
import * as about from "./about.js";
import * as contact from "./contact.js";
import * as estimator from "./estimator.js";
import * as faqs from "./faqs.js";
import * as included from "./included.js";
import * as legal from "./legal.js";
import * as navigation from "./navigation.js";
import * as pages from "./pages.js";
import * as pricing from "./pricing.js";
import * as process from "./process.js";
import * as projects from "./projects.js";
import * as sections from "./sections.js";
import * as services from "./services.js";
import * as site from "./site.js";
import * as stats from "./stats.js";
import * as ui from "./ui.js";
import * as values from "./values.js";

export default composeContent(
  "ka",
  { about, contact, estimator, faqs, included, legal, navigation, pages, pricing, process, projects, sections, services, site, stats, ui, values },
  facts,
);
