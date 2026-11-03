import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ImageViewer = ({ image, title }: { image: string; title: string }) => {
  return (
    <div className="border-t border-white/10 p-4 sm:p-6">
      <Link
        href={image}
        target="_blank"
        rel="noreferrer"
        className="group block min-w-0 rounded-md border border-white/10 bg-white/[.02] p-3"
      >
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-neutral-900">
          <Image
            src={image}
            alt="Image"
            fill
            sizes="(min-width: 720px) 640px, 100vw"
            priority
            className="object-contain"
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3  text-xs  font-medium group-hover:text-primary">
          <span>{title}</span>
          <span className="flex shrink-0 items-center gap-1">
            Open full size <ArrowUpRight size={10} />
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ImageViewer;
