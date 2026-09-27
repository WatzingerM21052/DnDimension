import { parseBuildInfo } from "@dndimension/core";
import { Stack, Surface, Text } from "@dndimension/ui";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

const StorageLab = import.meta.env.DEV ? lazy(() => import("./StorageLab")) : null;

const buildInfo = parseBuildInfo(__DNDIMENSION_BUILD__);
const DevelopmentUiLab = import.meta.env.DEV
  ? lazy(() => import("../dev/ui-lab/UiLab").then(({ UiLab }) => ({ default: UiLab })))
  : null;

const Home = () => (
  <Surface as="main" variant="canvas">
    <Stack gap="md">
      <Text variant="label">Project Foundation</Text>
      <Text as="h1" variant="display">
        DnDimension
      </Text>
      <Text>
        Die technische Basis ist bereit. Produktfunktionen folgen als geprüfte Release-Slices.
      </Text>
    </Stack>
  </Surface>
);

const Health = () =>
  buildInfo.ok ? (
    <Surface as="main" variant="canvas">
      <Stack gap="md">
        <Text as="h1" variant="display">
          Build Health
        </Text>
        <Text role="status">
          Version {buildInfo.value.version}, Commit {buildInfo.value.commit}
        </Text>
      </Stack>
    </Surface>
  ) : (
    <Surface as="main" variant="canvas">
      <Stack gap="md">
        <Text as="h1" variant="display">
          Build Health
        </Text>
        <Text role="alert">Build-Metadaten sind ungültig.</Text>
      </Stack>
    </Surface>
  );

export const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/health" element={<Health />} />
    {DevelopmentUiLab === null ? null : (
      <Route
        path="/dev/ui"
        element={
          <Suspense fallback={null}>
            <DevelopmentUiLab />
          </Suspense>
        }
      />
    )}
    {StorageLab && (
      <Route
        path="/dev/storage"
        element={
          <Suspense fallback={<p>Lädt …</p>}>
            <StorageLab />
          </Suspense>
        }
      />
    )}
  </Routes>
);
