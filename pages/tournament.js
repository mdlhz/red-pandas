import { Inter } from 'next/font/google'
import { useState } from "react";
import { CldImage } from 'next-cloudinary';
import {Avatar, Button, Dialog, Heading, Text} from "evergreen-ui";

const inter = Inter({ subsets: ['latin'] })

export default function Home({ resources, count, cursor }) {
  const [images, setImages] = useState(resources);
  const [total, setTotal] = useState([]);
  const [nextCursor, setNextCursor] = useState(cursor);
  const [isShown, setIsShown] = useState(false);
  const [activeFolder, setActiveFolder] = useState('');
  const [dialogImageUrl, setDialogImageUrl] = useState('');
  const [dialogImageWidth, setDialogImageWidth] = useState(500);
  const [dialogImageHeight, setDialogImageHeight] = useState(500);

  async function handleButtonClick(event) {
    event.preventDefault();
    const path = 'tournament'
    const results = await fetch('/api/cloudinary/', {
      method: 'POST',
      body: JSON.stringify({
        expression: `folder=${path}`
      })
    }).then(r => r.json());

    setImages(results.resources);
    setTotal(results.total_count);
    setNextCursor(results.next_cursor);
    setActiveFolder(path);
  }

  async function handleLoadMore(e) {
    e.preventDefault();
    const dataCursor = e.target.getAttribute('data-cursor');
    const dataFolder = 'Karate/tournament';
    const results = await fetch('/api/cloudinary', {
      method: 'POST',
      body: JSON.stringify({
        expression: `folder=""${dataFolder}`,
        nextCursor: dataCursor
      })
    }).then(r => r.json());

    const { resources, next_cursor } = results;

    setImages(images => images.concat(resources));
    setNextCursor(next_cursor)
  }
  function handleImageClick(e) {
    e.preventDefault();
    const imgUrl = e.target.getAttribute('data-url');
    const imgWidth = e.target.getAttribute('data-width');
    const imgHeight = e.target.getAttribute('data-height');
    console.log(imgUrl);
    setDialogImageUrl(imgUrl);
    setDialogImageHeight(imgHeight);
    setDialogImageWidth(imgWidth);
    setIsShown(true);
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-5xl justify-between font-mono text-sm lg:flex">
        <Avatar
          src="red-panda-logo.png"
          name="Red Panda"
          size={40}
        />
        <Heading is="h1" size={900} color="muted">Red Pandas Tournament</Heading>
      </div>
      <div>
        {
          images.length > 0 && <Text size={400}>Images Karate/tournament showing {resources.length} images of 1200</Text>
        }
      </div>
      <div>
        <Dialog
          isShown={isShown}
          title="Right click to download high resolution image"
          onCloseComplete={() => setIsShown(false)}
          confirmLabel="Download"
          width={dialogImageWidth}
          topOffset='100'
          hasFooter={false}
        >
          <img src={dialogImageUrl} width={dialogImageWidth} height={dialogImageHeight} alt={activeFolder}/>S
        </Dialog>
        <ul className="flex flex-wrap">
          {images.map(image => {
            return (
              <>
                <li onClick={handleImageClick} key={image.asset_id}>
                  <CldImage
                    data-url={image.secure_url}
                    data-width={image.width}
                    data-height={image.height}
                    width="400"
                    height="400"
                    crop="thumb"
                    gravity="faces"
                    src={image.public_id}
                    alt={image.folder} />
                </li>
              </>
            )
          })}
        </ul>
      </div>
      <div>
        <Button data-cursor={nextCursor} data-folder="Karate/tournament" marginRight={16} appearance="primary" onClick={handleLoadMore}>
          Load More
        </Button>
      </div>
    </main>
  )
}

export async function getStaticProps(context) {

  const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/search`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.API_KEY + ":" + process.env.API_SECRET).toString('base64')}`
    },
    body: JSON.stringify({
      'expression': 'folder=tournament',
    })
  });
  const images = await res.json()
  console.log(images.total_count);
  // console.log(images.resources);
  return ({
    props: {
      resources: images.resources,
      count: images.total_count,
      cursor: images.next_cursor
    },
  });
}
