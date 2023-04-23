import { Inter } from 'next/font/google'
import { useState } from "react";
import { CldImage } from 'next-cloudinary';
import {Avatar, Button, Heading, Text} from "evergreen-ui";

const inter = Inter({ subsets: ['latin'] })

export default function Home({ folders }) {
  const [images, setImages] = useState([]);
  const [total, setTotal] = useState([]);
  const [cursor, setNextCursor] = useState('');
  const [activeFolder, setActiveFolder] = useState('');

  async function handleButtonClick(event) {
    event.preventDefault();
    const path = event.target.getAttribute('data-path');
    const results = await fetch('/api/cloudinary/', {
      method: 'POST',
      body: JSON.stringify({
        expression: `folder=${path}`
      })
    }).then(r => r.json());
    console.log(results);
    setImages(results.resources);
    setTotal(results.total_count);
    setNextCursor(results.next_cursor);
    setActiveFolder(path);
  }

  // async function handleLoadMore(e) {
  //   e.preventDefault();
  //   const dataCursor = e.target.getAttribute('data-cursor');
  //   const dataFolder = e.target.getAttribute('data-folder');
  //   const results = await fetch('/api/load', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       expression: `folder=""${dataFolder}`,
  //       nextCursor: dataCursor
  //     })
  //   }).then(r => r.json());
  //
  //   const { resources } = results;
  //
  //   // const images = mapImageResources(resources);
  //
  //   console.log('images', 'resources');
  //   console.log('images', resources);
  // }

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
        <Heading is="h1" size={900} color="muted">Red Pandas Practice</Heading>
      </div>
      <div className="z-10 w-full max-w-5xl justify-between font-mono text-sm lg:flex">
        <ul className="flex space-x-8">
          {folders.map((folder) => (
            <li key={folder.path} >
              <button data-path={folder.path} onClick={handleButtonClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {folder.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {
          images.length > 0 && <Text size={400}>Images {activeFolder} showing {images.length} images of {total}</Text>
        }
      </div>
      <div>
        <ul className="flex flex-wrap">
          {images.map(image => {
            return (
              <li key={image.asset_id}>
                <CldImage width="400" height="400" crop="thumb"
                          gravity="faces" src={image.public_id} alt={image.folder} />
              </li>
            )
          })}
        </ul>
      </div>
      {/*<div>*/}
      {/*  <Button data-cursor={cursor} data-folder={activeFolder} marginRight={16} appearance="primary" onClick={handleLoadMore}>*/}
      {/*    Load More*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </main>
  )
}

export async function getStaticProps(context) {
  const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/folders/Karate/Practice`, {
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.API_KEY + ":" + process.env.API_SECRET).toString('base64')}`
    }
  });
  const folders = await res.json()

  return ({
    props: {
      folders: folders.folders
    },
  });
}
