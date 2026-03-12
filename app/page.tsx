import { Analytics } from "@vercel/analytics/react";
import Home from "./components/home";  // ← 正确方式，默认导入
import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

export default async function App() {
  return (
    <>
      <Home />
      {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )}
    </>
  );
}
