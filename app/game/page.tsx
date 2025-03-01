"use client";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./game"), {
  ssr: false,
});

function Home() {
  return <DynamicComponentWithNoSSR />;
}

export default Home;
