import { useEffect, useState } from "react";

type UseCalculateTableHeightReturn = {
  height: number;
  width: number
};

export default function useCalculateTableHeight(): UseCalculateTableHeightReturn {
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  //calculate table height based on screen size
  const calculateTableHeight = () => {
    const { width, height } = screenDimensions;
    return width > 1535
      ? height - 200
      : width > 1024
      ? height - 250
      : height - 350;
  };
  useEffect(()=>{
    const handleResize=()=>{
        setScreenDimensions({
            width:window.innerWidth,
            height:window.innerHeight
        })
    }
    window.addEventListener("resize",handleResize);
    return ()=>window.removeEventListener("resize",handleResize);
  },[])
  return {
    height: calculateTableHeight(),
    width:screenDimensions.width
  };
}
