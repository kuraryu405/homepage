import React from 'react';

export default function Card({content}: {content: React.ReactNode}) {

    return (
        <div className="hover-3d w-full">
        {/* content */}
        <figure className="w-full rounded-2xl">
          {content}
        </figure>
        {/* 8 empty divs needed for the 3D effect */}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
}







