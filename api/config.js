import { get } from "@vercel/edge-config";

export const config = { runtime: "edge" };

export default async function handler() {
  const focusAreas = (await get("focusAreas")) || "";
  const slangList = (await get("slangList")) || [];
  const teacherPhrases = (await get("teacherPhrases")) || "";
  return new Response(JSON.stringify({ focusAreas, slangList, teacherPhrases }), {
    status: 200,
  });
}
