import { parseBuildInfo } from "@dndimension/core";
import { Route, Routes } from "react-router";

const buildInfo = parseBuildInfo({ version: "0.1.0", commit: "local" });

const Home = () => (
  <main>
    <p className="eyebrow">Project Foundation</p>
    <h1>DnDimension</h1>
    <p>Die technische Basis ist bereit. Produktfunktionen folgen als geprüfte Release-Slices.</p>
  </main>
);

const Health = () =>
  buildInfo.ok ? (
    <main>
      <h1>Build Health</h1>
      <p role="status">
        Version {buildInfo.value.version}, Commit {buildInfo.value.commit}
      </p>
    </main>
  ) : (
    <main>
      <h1>Build Health</h1>
      <p role="alert">Build-Metadaten sind ungültig.</p>
    </main>
  );

export const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/health" element={<Health />} />
  </Routes>
);
