-- Refresh achievements & badges to match the new JPEG icon files.
-- Deletes old achievements that are no longer relevant (scan-3, scan-6, level-3)
-- and inserts/updates all remaining ones with correct icons and requirement values.

-- 1) Remove old user achievements referencing obsolete IDs
DELETE FROM public.user_achievements
WHERE achievement_id IN ('ach-scan-3', 'ach-scan-6', 'ach-level-3');

-- 2) Delete obsolete achievements
DELETE FROM public.achievements
WHERE id IN ('ach-scan-3', 'ach-scan-6', 'ach-level-3');

-- 3) Upsert all achievements with correct icons and requirements
INSERT INTO public.achievements (id, name_bm, name_en, description_bm, description_en, icon, rarity, requirement_key, requirement_value, sort_order) VALUES
('ach-first-scan', 'Langkah Pertama', 'First Steps',
 'Imbas artifak pertama anda.', 'Scan your first artifact.',
 'first-scan.jpg', 'common', 'scans', 1, 1),
('ach-scan-5', 'Pengembara Muda', 'Young Explorer',
 'Imbas 5 artifak.', 'Scan 5 artifacts.',
 '5-scaned.jpg', 'common', 'scans', 5, 2),
('ach-scan-10', 'Penjelajah Berpengalaman', 'Seasoned Explorer',
 'Imbas 10 artifak.', 'Scan 10 artifacts.',
 '10-scaned.jpg', 'rare', 'scans', 10, 3),
('ach-scan-all', 'Kolektor Warisan', 'Heritage Collector',
 'Imbas kesemua 15 artifak.', 'Scan all 15 artifacts.',
 'all-scaned.jpg', 'legendary', 'scans', 15, 4),
('ach-level-5', 'Naik Tahap 5', 'Reach Level 5',
 'Capai tahap 5.', 'Reach level 5.',
 'level-up-5.jpg', 'epic', 'level', 5, 5),
('ach-level-10', 'Naik Tahap 10', 'Reach Level 10',
 'Capai tahap 10.', 'Reach level 10.',
 'level-up-10.jpg', 'legendary', 'level', 10, 6),
('ach-uq-1', 'Pemburu Rahsia', 'Secret Hunter',
 'Selesaikan satu Kuest Unik.', 'Complete one Unique Quest.',
 'first-quest.jpg', 'rare', 'unique_quests', 1, 7),
('ach-uq-all', 'Legenda Unik', 'Unique Legend',
 'Selesaikan semua Kuest Unik.', 'Complete all Unique Quests.',
 'quest-master.jpg', 'legendary', 'unique_quests', 5, 8),
('ach-perfect-quiz', 'Juara Kuiz', 'Quiz Champion',
 'Dapatkan skor sempurna dalam 3 kuiz.', 'Get a perfect score on 3 quizzes.',
 'perfect-quiz-3.jpg', 'rare', 'perfect_quizzes', 3, 9),
('ach-teka-sahih', 'Teka Sahih!', 'Correct Answers',
 'Kumpul 30 jawapan betul dalam kuiz.', 'Accumulate 30 correct quiz answers.',
 'teka-sahih.jpg', 'epic', 'total_correct', 30, 10),
('ach-social-top', 'Pengembara Teratas', 'Top Explorer',
 'Menjadi juara mingguan papan pemimpin.', 'Become the weekly leaderboard champion.',
 'social-top.jpg', 'legendary', 'leaderboard_rank', 1, 11)
ON CONFLICT (id) DO UPDATE SET
  name_bm = EXCLUDED.name_bm,
  name_en = EXCLUDED.name_en,
  description_bm = EXCLUDED.description_bm,
  description_en = EXCLUDED.description_en,
  icon = EXCLUDED.icon,
  rarity = EXCLUDED.rarity,
  requirement_key = EXCLUDED.requirement_key,
  requirement_value = EXCLUDED.requirement_value,
  sort_order = EXCLUDED.sort_order;

-- 4) Upsert all badges with correct icons
INSERT INTO public.badges (id, name_bm, name_en, description_bm, description_en, icon, sort_order, rarity) VALUES
('penemu-pertama', 'Penemu Pertama', 'First Discovery',
 'Imbas artifak pertama anda.', 'Scan your first artifact.',
 'penemu-pertama.jpg', 1, 'common'),
('ahli-kuest', 'Ahli Kuest', 'Quest Adept',
 'Selesaikan satu kuest kategori.', 'Complete one category quest.',
 'ahli-kuest.jpg', 2, 'common'),
('separuh-jalan', 'Separuh Jalan', 'Halfway There',
 'Imbas 8 daripada 15 artifak.', 'Scan 8 of 15 artifacts.',
 'separuh-jalan.jpg', 3, 'epic'),
('peneroka-muzium', 'Peneroka Muzium', 'Museum Explorer',
 'Imbas kesemua 15 artifak.', 'Scan all 15 artifacts.',
 'peneroka-muzium.jpg', 4, 'legendary'),
('unique-explorer-weapons', 'Peneroka Unik: Senjata', 'Unique Explorer: Weapons',
 'Menamatkan Jejak Pahlawan.', 'Completed the Warrior''s Trail.',
 'unique-explorer-weapons.jpg', 100, 'rare'),
('unique-explorer-regalia', 'Peneroka Unik: Diraja', 'Unique Explorer: Regalia',
 'Menamatkan Jejak Istana.', 'Completed the Royal Path.',
 'unique-explorer-regalia.jpg', 101, 'rare'),
('unique-explorer-music', 'Peneroka Unik: Muzik', 'Unique Explorer: Music',
 'Menamatkan Irama Warisan.', 'Completed the Rhythm of Heritage.',
 'unique-explorer-music.jpg', 102, 'rare'),
('unique-explorer-crafts', 'Peneroka Unik: Kraf', 'Unique Explorer: Crafts',
 'Menamatkan Tangan Seni.', 'Completed the Artisan''s Hand.',
 'unique-explorer-crafts.jpg', 103, 'rare'),
('unique-explorer-toys', 'Peneroka Unik: Mainan', 'Unique Explorer: Toys',
 'Menamatkan Semangat Bermain.', 'Completed the Spirit of Play.',
 'unique-explorer-toys.jpg', 104, 'rare'),
('detik-sejarah', 'Detik Sejarah', 'Historic Moment',
 'Mencapai pencapaian istimewa dalam perjalanan anda.', 'Reach a special milestone in your journey.',
 'detik-sejarah.jpg', 200, 'epic'),
('jamuan-budaya', 'Jamuan Budaya', 'Cultural Feast',
 'Terokai kepelbagaian warisan budaya Malaysia.', 'Explore the diversity of Malaysian cultural heritage.',
 'jamuan-budaya.jpg', 201, 'rare'),
('jantung-warisan', 'Jantung Warisan', 'Heart of Heritage',
 'Menjadi pelindung setia warisan negara.', 'Become a devoted guardian of national heritage.',
 'jantung-warisan.jpg', 202, 'legendary')
ON CONFLICT (id) DO UPDATE SET
  name_bm = EXCLUDED.name_bm,
  name_en = EXCLUDED.name_en,
  description_bm = EXCLUDED.description_bm,
  description_en = EXCLUDED.description_en,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  rarity = EXCLUDED.rarity;
