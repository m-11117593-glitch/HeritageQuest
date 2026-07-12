## Imaging Icon Skill

Purpose: Replace emoji-based achievement and badge icons with SVG asset rendering in the HeritageQuest app.

Instructions for a future AI model:

1. Identify where achievement and badge icons are sourced.
   - Search for `icon` fields in `src/routes/_authenticated/achievements.tsx` and `src/routes/_authenticated/profile.tsx`.
   - Verify whether the app is reading from the database via Supabase or from local static data.

2. Add a utility resolver for icon sources.
   - Create or update a helper like `resolveAchievementIcon(icon, id?)` in `src/lib/utils.ts`.
   - If the icon string is already a path/URL (`/...`, `http...`, or ends in `.svg/.png/.jpg`), return it.
   - If the icon string looks like a filename, return `/achievements/{filename}`.
   - If the icon string is missing or is emoji, fall back to a path based on `id` and/or a legacy mapping from achievement IDs to SVG filenames.

3. Normalize public asset filenames.
   - Ensure the SVG files exist under `public/achievements/` with consistent names.
   - Convert any filenames with spaces into hyphenated/normative names that match data references.

4. Update route components to use resolved image URLs.
   - In `src/routes/_authenticated/achievements.tsx`, replace hard-coded paths like `/achievements/${a.id}.svg` with `resolveAchievementIcon(a.icon, a.id)`.
   - In `src/routes/_authenticated/profile.tsx`, replace hard-coded paths like `/achievements/${b.id}.svg` and `/achievements/${a.id}.svg` with the same resolver.
   - Pass `fallbackIcon` only when the resolved icon is an actual image source and the fallback is a valid emoji or alternate image source.

5. Confirm `BadgeMedallion` supports image rendering.
   - Use a component such as `BadgeMedallion` that detects whether `icon` is an image and renders `<img>` when appropriate.
   - Keep emoji fallback displayed when the icon is not a path or if the image fails to load.

6. Handle legacy DB emoji values.
   - If the database rows still contain emoji values, add a mapping from legacy achievement IDs to the new SVG filenames.
   - Optionally update the database seed or migration to store `/achievements/{filename}` paths instead of emojis.

7. Verify behavior.
   - Run the dev server and load `/achievements` and `/profile` after login.
   - Confirm earned items and available items render the correct SVG assets, not fallback emojis.
   - If needed, inspect network requests to verify the SVG path served from `/achievements/...`.

Use this skill to ensure future AI edits maintain clear separation between icon data, asset resolution, and UI rendering.