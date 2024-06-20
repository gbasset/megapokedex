import React, { useCallback, useEffect, useState } from "react";
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderImg?: string;
  errorImg?: string;
  className? : any;
  onClick? : any;
}
export default function ImageCpc({ src, placeholderImg, errorImg, className ,onClick}: ImageProps) {

  const [imgSrc, setSrc] = useState(placeholderImg || src);

  const onLoad = useCallback(() => {
    setSrc(src);
  }, [src]);

  const onError = useCallback(() => {
    setSrc(errorImg || placeholderImg);
  }, [errorImg, placeholderImg]);

  useEffect(() => {
    if(src){
        const img = new Image();
        
        img.src =  src as string;
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onError);
        return () => {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
        };

    }
  }, [src, onLoad, onError]);

  return  <img 
             style={onClick ? {cursor: 'pointer'}  : {}}
              onClick={onClick ? onClick : null}
              className={className}  
              alt={imgSrc} 
              src={imgSrc} />;
}
