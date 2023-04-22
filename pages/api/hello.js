// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import {fetch} from "next/dist/compiled/@edge-runtime/primitives/fetch";

export default async function handler(req, res) {
  const path = JSON.parse(req.body);
  const images = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/search?folder=${path.expression}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.API_KEY + ":" + process.env.API_SECRET).toString('base64')}`
    }
  }).then(r =>r.json());
  console.log(images);
  // res.status(200).json({ name: 'John Doe' })
}
