import { MetadataRoute } from "next";

import { USER_INFORMATIONS } from "@/constants/data";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${USER_INFORMATIONS.domain}/sitemap.xml`,
  };
};

export default robots;
