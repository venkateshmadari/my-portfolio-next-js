'use client'
import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { sora_font } from "../preloader/Preloader";

const Footer = () => {
  const [like, setLike] = useState(true);

  const handleLikeToggle = () => {
    setLike((prev) => !prev);
  };

  return (
    <div className="text-center mb-16 lg:mb-0">
      <h2 className={`${sora_font.className} text-center capitalize flex items-center justify-center pb-2 lg:text-sm text-xs`}>
        made with
        <span className="px-1 cursor-pointer" onClick={handleLikeToggle}>
          {like ? (
            <FaHeart className="text-shade" />
          ) : (
            <FaRegHeart className="text-shade" />
          )}
        </span>
        by venkatesh
      </h2>
    </div>
  );
};

export default Footer;
