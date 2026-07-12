-- Fix unique-explorer badges: revert to emoji icons since JPG files don't exist
UPDATE public.badges
SET icon = CASE id
  WHEN 'unique-explorer-weapons' THEN '⚔️'
  WHEN 'unique-explorer-regalia' THEN '👑'
  WHEN 'unique-explorer-music'   THEN '🎵'
  WHEN 'unique-explorer-crafts'  THEN '🧵'
  WHEN 'unique-explorer-toys'    THEN '🪀'
END
WHERE id IN ('unique-explorer-weapons','unique-explorer-regalia','unique-explorer-music','unique-explorer-crafts','unique-explorer-toys');
