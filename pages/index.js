import Image from 'next/image'
import { Inter } from 'next/font/google'
import { fetch } from "next/dist/compiled/@edge-runtime/primitives/fetch";

const inter = Inter({ subsets: ['latin'] })

export default function Home({ folders }) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-5xl justify-between font-mono text-sm lg:flex">Red Pandas Practice</div>
      <div className="z-10 w-full max-w-5xl justify-between font-mono text-sm lg:flex">
        <ul className="flex space-x-8">
          {folders.map((folder) => (
            <li key={folder.name} >
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {folder.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
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
    }, // will be passed to the page component as props
  });
}
