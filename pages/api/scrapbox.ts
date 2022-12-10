import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

type Data = {
  title: string;
  contents: string;
};

const schema = z.object({
  projectName: z.string(),
  pageTitle: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { projectName, pageTitle } = schema.parse(req.query);
    const response = await fetch(
      `https://scrapbox.io/api/pages/${projectName}/${pageTitle}/text`
    );
    const text = await response.text();
    const [title, ...contents] = text.split("\n");
    res.status(200).json({ title, contents: contents.join("\n") });
  } catch (error) {
    res.status(404);
  }
}
