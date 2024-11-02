import Link from "next/link";
import Image from "next/image";
import star from "@/public/star.svg";
import bluestar from "@/public/bluestar.svg";
import { sora_font } from "../preloader/Preloader";

interface socialMediatypes {
    id: number;
    icon: any;
    url: string;
    name: string;
  }
  const socialMedia: socialMediatypes[] = [
    {
      id: 1,
      icon: star,
      url: "https://github.com/venkateshmadari",
      name: "github",
    },
    {
      id: 2,
      icon: bluestar,
      url: "https://www.linkedin.com/in/venkateshmadari",
      name: "linkedin",
    },
    {
      id: 3,
      icon: star,
      url: "https://x.com/MadariVenk4216",
      name: "twitter",
    },
  ];
const SocialLinks = () => {
  return (
    <div>
         <div className="flex gap-5 pt-14 items-center justify-center">
        {socialMedia.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className="flex items-center gap-2 text-lg cursor-pointer"
          >
            <Image
              src={link.icon}
              height={20}
              width={20}
              alt="star"
              className="object-contain"
            />
            <span className={`${sora_font.className} capitalize`}>{link.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SocialLinks