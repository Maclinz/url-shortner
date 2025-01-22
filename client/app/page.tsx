"use client";
import {
  atIcon,
  copy,
  electricityIcon,
  linkIcon,
  mouseIcon,
} from "@/util/Icons";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("testmail@gmail.com");
  const [fullShortUrl, setFullShortUrl] = useState("");
  const [fullUrl, setFullUrl] = useState("");
  const [allLinks, setAllLinks] = useState({
    totalLinks: 0,
    totalClicks: 0,
  });

  const generateShortLink = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/v1/shorten", {
        url,
        email,
      });

      toast.success("Short URL generated successfully");

      // generate short url
      setFullShortUrl(res.data.fullShortUrl);

      // Set the full URL
      setFullUrl(process.env.NEXT_PUBLIC_CLIENT_URL + "/" + res.data.shortUrl);
    } catch (error: any) {
      console.log("Error creating short url: ", error);
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    const getAllLinks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/all");
        console.log("All links: ", res.data);
        setAllLinks(res.data);
      } catch (error) {
        console.log("Error fetching all links: ", error);
      }
    };

    getAllLinks();
  }, [fullUrl]);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-[url('/bg--glass.png')] bg-cover bg-center text-black">
      <div className="w-[70%] h-[80%] flex rounded-xl border border-white/90 shadow-[0_0_10px_0_rgba(0,0,0,0.05)]">
        <div className="p-8 basis-[30%] flex flex-col gap-4 justify-center bg-white/50 border-r border-white/90 rounded-tl-xl rounded-bl-xl">
          <div className="bg-white/60 border border-white rounded-xl p-4 shadow-sm">
            <h3 className="text-center">Total Links Generated</h3>

            <p className="mt-2 flex items-center justify-center gap-2 text-[#8347CF]">
              <span className="text-2xl">{electricityIcon}</span>
              <span className="font-bold text-4xl">{allLinks?.totalLinks}</span>
            </p>
          </div>
          <div className="bg-white/60 border border-white rounded-xl p-4 shadow-sm">
            <h3 className="text-center">Total Clicks</h3>

            <p className="mt-2 flex items-center justify-center gap-2 text-[#8347CF]">
              <span className="text-2xl">{mouseIcon}</span>
              <span className="font-bold text-4xl">
                {allLinks?.totalClicks}
              </span>
            </p>
          </div>
        </div>
        <div className="p-8 flex-1 flex flex-col gap-8 items-center justify-center bg-white/70 rounded-tr-xl rounded-br-xl">
          <div className="flex flex-col items-center gap-8">
            <Image
              src="/logo--link.svg"
              width={150}
              height={150}
              className="shadow-md rounded-full"
              alt="Link Shortener Logo"
            />
            <h1 className="font-bold text-5xl text-[#8347CF] drop-shadow-sm">
              Link Shortener
            </h1>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="w-full grid grid-cols-[46px_1fr] items-center gap-4">
              <label
                htmlFor="email"
                className="py-2 px-3 text-lg text-[#8347CF] bg-white rounded-md cursor-pointer shadow-sm"
              >
                {atIcon}
              </label>
              <div className="flex-1 flex items-center gap-4">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white py-2 px-3 text- rounded-md shadow-sm"
                  placeholder="Paste your link here"
                />
                <button
                  type="button"
                  className="bg-[#8347CF] text-white py-2 px-8 rounded-md shadow-md hover:bg-[#8347CF]/90 transition-colors"
                >
                  Validate Email
                </button>
              </div>
            </div>
            <div className="w-full grid grid-cols-[46px_1fr] items-center gap-4">
              <label
                htmlFor="link"
                className="py-2 px-3 text-lg text-[#8347CF] bg-white rounded-md cursor-pointer shadow-sm"
              >
                {linkIcon}
              </label>
              <input
                type="text"
                id="link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-white py-2 px-3 text- rounded-md shadow-sm"
                placeholder="Paste your link here"
              />
            </div>
          </div>

          {fullShortUrl && (
            <div className="w-full flex flex-col items-center gap-4">
              <h2 className="text-[#8347CF] text-lg">Shortened Link</h2>
              <div className="w-full flex items-center justify-center gap-4 bg-white/90 p-4 border border-white rounded-xl shadow-sm">
                <Link
                  href={fullUrl}
                  target="_blank"
                  className="text-[#8347CF] underline"
                >
                  {fullShortUrl}
                </Link>

                <button
                  type="button"
                  className="bg-[#8347CF] text-white py-2 px-3 rounded-md shadow-md hover:bg-[#8347CF]/90 transition-colors"
                  onClick={() => {
                    toast.success("Link copied to clipboard");
                    navigator.clipboard.writeText(fullShortUrl);
                  }}
                >
                  {copy}
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={!url || !email}
            className="flex items-center gap-2 bg-[#8347CF] text-white py-2 px-8 rounded-md shadow-md hover:bg-[#8347CF]/90 transition-colors"
            onClick={generateShortLink}
          >
            {linkIcon}
            Shorten Link
          </button>
        </div>
      </div>
    </div>
  );
}
