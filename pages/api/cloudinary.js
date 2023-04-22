
export default async function getImages(req, res) {
  const path = JSON.parse(req.body);
  const images = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(process.env.API_KEY + ":" + process.env.API_SECRET).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'expression': path.expression
    })
  }).then(r => r.json());
  res.status(200).json({ ...images });
}