import { ActionButton, Stack, Surface, Text, WaypointDraftPattern } from "@dndimension/ui";

import styles from "./UiLab.module.css";

const palette = [
  ["Canvas", "canvas"],
  ["Workspace", "workspace"],
  ["Reading", "reading"],
  ["Action", "action"],
  ["Structure", "structure"],
] as const;

const ThemePreview = ({ name, label }: { name: "night-chart" | "vellum-study"; label: string }) => (
  <section aria-label={label} className={styles.themePreview} data-theme={name}>
    <Surface variant="canvas" className={styles.previewCanvas}>
      <Stack gap="sm">
        <Text as="h3" variant="title">
          Primitives preview
        </Text>
        <Surface variant="workspace" className={styles.previewWorkspace}>
          <Stack gap="xs">
            <Text variant="label">Workspace surface</Text>
            <Text>Shared semantic primitives retain their markup across themes.</Text>
          </Stack>
        </Surface>
        <Surface variant="reading" className={styles.previewReading}>
          <Text tone="on-reading">Reading surfaces prioritize long-form map notes.</Text>
        </Surface>
      </Stack>
    </Surface>
  </section>
);

export const UiLab = () => (
  <Surface as="main" className={styles.lab} variant="canvas">
    <Stack gap="lg">
      <header className={styles.header}>
        <Text as="h1" variant="display">
          DnDimension UI Lab
        </Text>
        <Text role="status" variant="label">
          Development only
        </Text>
      </header>

      <section aria-labelledby="palette-title">
        <Stack gap="sm">
          <Text as="h2" id="palette-title" variant="title">
            Semantic palette
          </Text>
          <div className={styles.palette}>
            {palette.map(([label, token]) => (
              <div className={styles.swatch} key={token}>
                <span aria-hidden="true" className={styles[`swatch${token}`]} />
                <Text variant="label">{label}</Text>
              </div>
            ))}
          </div>
        </Stack>
      </section>

      <section aria-labelledby="type-title">
        <Stack gap="sm">
          <Text as="h2" id="type-title" variant="title">
            Type and spacing
          </Text>
          <Text variant="display">Cartographer display</Text>
          <Text variant="label">Ledger label</Text>
          <Text>Body text is shaped for comfortable reading alongside map work.</Text>
          <div aria-label="Spacing scale" className={styles.spacing}>
            <span className={styles.space1}>1</span>
            <span className={styles.space2}>2</span>
            <span className={styles.space3}>3</span>
            <span className={styles.space4}>4</span>
          </div>
        </Stack>
      </section>

      <section aria-labelledby="surface-title">
        <Stack gap="sm">
          <Text as="h2" id="surface-title" variant="title">
            Surface samples
          </Text>
          <div className={styles.surfaces}>
            <Surface className={styles.sample} variant="canvas">
              <Text>Canvas</Text>
            </Surface>
            <Surface className={styles.sample} variant="workspace">
              <Text>Workspace</Text>
            </Surface>
            <Surface className={styles.sample} variant="reading">
              <Text tone="on-reading">Reading</Text>
            </Surface>
          </div>
        </Stack>
      </section>

      <section aria-labelledby="actions-title">
        <Stack gap="sm">
          <Text as="h2" id="actions-title" variant="title">
            Action buttons
          </Text>
          <div className={styles.actions}>
            <ActionButton>Primary</ActionButton>
            <ActionButton variant="secondary">Secondary</ActionButton>
            <ActionButton variant="quiet">Quiet</ActionButton>
            <ActionButton variant="danger">Danger</ActionButton>
            <ActionButton isDisabled>Disabled</ActionButton>
          </div>
        </Stack>
      </section>

      <section aria-labelledby="themes-title">
        <Stack gap="sm">
          <Text as="h2" id="themes-title" variant="title">
            Theme previews
          </Text>
          <div className={styles.themes}>
            <ThemePreview label="Night chart preview" name="night-chart" />
            <ThemePreview label="Vellum study preview" name="vellum-study" />
          </div>
        </Stack>
      </section>

      <WaypointDraftPattern />

      <aside aria-label="UI lab guidance">
        <Stack gap="xs">
          <Text variant="label">Quality notes</Text>
          <Text>
            Reduced motion replaces non-essential movement with an immediate state change.
          </Text>
          <Text>Keyboard focus remains visible and action targets retain a 44-pixel minimum.</Text>
          <Text>Ornaments stay sparse so hierarchy and reading surfaces remain clear.</Text>
        </Stack>
      </aside>
    </Stack>
  </Surface>
);
