-- Seed 30 sample pesticide products with all details
DO $$
DECLARE
  cat_insecticides UUID := (SELECT id FROM public.categories WHERE slug = 'insecticides' LIMIT 1);
  cat_herbicides UUID := (SELECT id FROM public.categories WHERE slug = 'herbicides' LIMIT 1);
  cat_fungicides UUID := (SELECT id FROM public.categories WHERE slug = 'fungicides' LIMIT 1);
  cat_rodenticides UUID := (SELECT id FROM public.categories WHERE slug = 'rodenticides' LIMIT 1);
  cat_pgr UUID := (SELECT id FROM public.categories WHERE slug = 'plant-growth-regulators' LIMIT 1);
  cat_fumigants UUID := (SELECT id FROM public.categories WHERE slug = 'soil-fumigants' LIMIT 1);
  cat_bio UUID := (SELECT id FROM public.categories WHERE slug = 'biopesticides' LIMIT 1);
  cat_adj UUID := (SELECT id FROM public.categories WHERE slug = 'adjuvants' LIMIT 1);
  cat_seed UUID := (SELECT id FROM public.categories WHERE slug = 'seed-treatment' LIMIT 1);
  cat_nem UUID := (SELECT id FROM public.categories WHERE slug = 'nematicides' LIMIT 1);
BEGIN
  -- Insert products
  INSERT INTO public.products (name, sku, category, category_id, description, ingredients, application_info, safety_info, price, stock, safety_level, is_organic)
  VALUES
    ('Malathion 50% EC', 'INS-MAL-50-001', 'insecticides', cat_insecticides, 'Broad-spectrum organophosphate insecticide effective against aphids, mites, and other pests', 'Malathion 50% w/w, Emulsifiers and solvents', 'Dilute 2ml per liter of water. Apply as foliar spray during early morning or evening', 'Wear protective gloves and mask during application. Keep away from water bodies', 2499, 150, 'medium', false),
    ('Glyphosate 41% SL', 'HRB-GLY-41-002', 'herbicides', cat_herbicides, 'Non-selective systemic herbicide for control of annual and perennial weeds', 'Glyphosate 41% w/v', 'Mix 30ml per liter of water. Spray directly on weed foliage', 'Avoid drift to crops. Do not apply before rain. Use protective equipment', 1899, 200, 'medium', false),
    ('Mancozeb 75% WP', 'FUN-MAN-75-003', 'fungicides', cat_fungicides, 'Broad-spectrum protective fungicide for disease control in vegetables and fruits', 'Mancozeb 75% w/w', 'Mix 2-2.5g per liter of water. Apply at 7-10 day intervals', 'Wear mask and gloves. Store in cool, dry place away from food items', 899, 300, 'low', false),
    ('Cypermethrin 10% EC', 'INS-CYP-10-004', 'insecticides', cat_insecticides, 'Synthetic pyrethroid for control of lepidopteran pests', 'Cypermethrin 10% w/w', 'Dilute 1ml per liter. Spray on affected plants', 'Use protective gear. Toxic to fish', 1599, 180, 'medium', false),
    ('Imidacloprid 17.8% SL', 'INS-IMI-17-005', 'insecticides', cat_insecticides, 'Systemic insecticide for sucking pests', 'Imidacloprid 17.8% w/v', 'Soil drench or foliar spray. 0.5ml per liter', 'Keep away from bees. Toxic to aquatic life', 2199, 120, 'high', false),
    ('2,4-D Amine Salt 58% SL', 'HRB-24D-58-006', 'herbicides', cat_herbicides, 'Selective herbicide for broadleaf weeds', '2,4-D 58% w/v', 'Mix 2ml per liter. Apply to young weeds', 'Drift sensitive. Avoid crop contact', 1299, 250, 'medium', false),
    ('Paraquat Dichloride 24% SL', 'HRB-PAR-24-007', 'herbicides', cat_herbicides, 'Fast-acting contact herbicide', 'Paraquat 24% w/v', 'Use 2ml per liter. Apply to green weeds', 'HIGHLY TOXIC. Restricted use. Wear full protection', 3499, 50, 'high', false),
    ('Copper Oxychloride 50% WP', 'FUN-COP-50-008', 'fungicides', cat_fungicides, 'Contact fungicide and bactericide', 'Copper Oxychloride 50% w/w', 'Mix 3g per liter. Apply at disease onset', 'Avoid mixing with alkaline substances', 799, 350, 'low', false),
    ('Carbendazim 50% WP', 'FUN-CAR-50-009', 'fungicides', cat_fungicides, 'Systemic fungicide for seed and foliar treatment', 'Carbendazim 50% w/w', 'Seed: 2g/kg. Foliar: 1g per liter', 'Avoid inhalation. Suspected carcinogen', 1099, 200, 'medium', false),
    ('Zinc Phosphide 80% WP', 'ROD-ZIN-80-010', 'rodenticides', cat_rodenticides, 'Acute rodenticide for rat and mice control', 'Zinc Phosphide 80% w/w', 'Mix with bait material. Place in burrows', 'HIGHLY TOXIC. Keep away from children and pets', 2899, 80, 'high', false),
    ('Brodifacoum 0.005% RB', 'ROD-BRO-05-011', 'rodenticides', cat_rodenticides, 'Anticoagulant rodenticide bait blocks', 'Brodifacoum 0.005% w/w', 'Place bait stations in rodent pathways', 'Secondary poisoning risk. Use with caution', 1799, 100, 'high', false),
    ('Gibberellic Acid 0.001% L', 'PGR-GIB-01-012', 'plant-growth-regulators', cat_pgr, 'Plant growth promoter for fruit and vegetable crops', 'GA3 0.001% w/v', 'Foliar spray 1ml per liter at flowering', 'Generally safe. Follow label instructions', 999, 150, 'low', true),
    ('Paclobutrazol 23% SC', 'PGR-PAC-23-013', 'plant-growth-regulators', cat_pgr, 'Growth retardant for ornamentals and fruit trees', 'Paclobutrazol 23% w/v', 'Soil drench 2ml per plant based on size', 'Avoid excess use. May affect plant height', 2299, 90, 'medium', false),
    ('Metam Sodium 42% SL', 'FUM-MET-42-014', 'soil-fumigants', cat_fumigants, 'Broad-spectrum soil fumigant', 'Metam Sodium 42% w/v', 'Apply to soil before planting. Requires incorporation', 'RESTRICTED USE. Requires applicator license', 4999, 30, 'high', false),
    ('Dazomet 98% GR', 'FUM-DAZ-98-015', 'soil-fumigants', cat_fumigants, 'Granular soil fumigant for nematodes and pathogens', 'Dazomet 98% w/w', 'Broadcast and incorporate into soil', 'Irritant to eyes and skin. Use PPE', 3799, 40, 'high', false),
    ('Bacillus thuringiensis var. kurstaki', 'BIO-BTK-16-016', 'biopesticides', cat_bio, 'Biological insecticide for caterpillar control', 'BT kurstaki 3.2% w/w', 'Mix 1g per liter. Apply to young larvae', 'Safe for humans and beneficial insects', 1499, 200, 'low', true),
    ('Trichoderma viride 1% WP', 'BIO-TRI-01-017', 'biopesticides', cat_bio, 'Biological fungicide for soil-borne diseases', 'Trichoderma viride spores', 'Soil application or seed treatment. 5g per kg', 'Eco-friendly. Safe for organic farming', 899, 300, 'low', true),
    ('Neem Oil 1500 PPM', 'BIO-NEE-15-018', 'biopesticides', cat_bio, 'Organic insecticide and fungicide', 'Azadirachtin 1500 ppm', 'Mix 5ml per liter. Apply as foliar spray', 'OMRI listed. Safe for organic use', 1299, 250, 'low', true),
    ('Spreader Sticker Non-Ionic', 'ADJ-SPR-80-019', 'adjuvants', cat_adj, 'Surfactant to improve pesticide coverage', 'Alkyl phenol ethoxylate 80%', 'Add 0.5-1ml per liter of spray solution', 'Enhances pesticide efficacy. Follow label', 599, 400, 'low', false),
    ('Wetting Agent Silicone-Based', 'ADJ-WET-10-020', 'adjuvants', cat_adj, 'Super-spreader for difficult-to-wet surfaces', 'Modified silicone 10% w/v', 'Use 0.1-0.2ml per liter with pesticides', 'Increases spray coverage significantly', 1499, 150, 'low', false),
    ('Thiram 75% WS', 'SDT-THI-75-021', 'seed-treatment', cat_seed, 'Seed protectant fungicide', 'Thiram 75% w/w', 'Apply as seed dressing. 2-3g per kg seed', 'May cause skin irritation. Use gloves', 899, 200, 'medium', false),
    ('Carboxin 37.5% + Thiram 37.5% WS', 'SDT-CAR-75-022', 'seed-treatment', cat_seed, 'Combination seed treatment fungicide', 'Carboxin 37.5% + Thiram 37.5%', 'Seed dressing. 2g per kg seed', 'Handle with care. Avoid dust inhalation', 1599, 180, 'medium', false),
    ('Imidacloprid 48% FS', 'SDT-IMI-48-023', 'seed-treatment', cat_seed, 'Systemic insecticide seed treatment', 'Imidacloprid 48% w/v', 'Coat seeds. 5-10ml per kg seed', 'Toxic to bees. Follow stewardship guidelines', 2799, 100, 'high', false),
    ('Carbosulfan 25% EC', 'NEM-CAR-25-024', 'nematicides', cat_nem, 'Contact and systemic nematicide', 'Carbosulfan 25% w/w', 'Soil application. 2-3 liters per hectare', 'Highly toxic. Restricted use pesticide', 3299, 60, 'high', false),
    ('Phorate 10% CG', 'NEM-PHO-10-025', 'nematicides', cat_nem, 'Granular systemic nematicide and insecticide', 'Phorate 10% w/w', 'Apply in furrow at planting. 10kg per hectare', 'EXTREMELY TOXIC. Requires permit', 4599, 40, 'high', false),
    ('Paecilomyces lilacinus 1% WP', 'NEM-PAE-01-026', 'nematicides', cat_nem, 'Biological nematicide', 'P. lilacinus spores 1x10^6 CFU/g', 'Soil incorporation. 5kg per hectare', 'Organic. Safe for environment', 1999, 120, 'low', true),
    ('Abamectin 1.8% EC', 'INS-ABA-18-027', 'insecticides', cat_insecticides, 'Miticide and insecticide', 'Abamectin 1.8% w/v', 'Foliar spray. 0.5ml per liter', 'Toxic to fish. Avoid water contamination', 2899, 110, 'high', false),
    ('Emamectin Benzoate 5% SG', 'INS-EMA-05-028', 'insecticides', cat_insecticides, 'Selective insecticide for lepidopteran pests', 'Emamectin benzoate 5% w/w', 'Mix 0.5g per liter. Apply to young larvae', 'Very effective. Follow PHI guidelines', 3199, 95, 'medium', false),
    ('Tebuconazole 25.9% EC', 'FUN-TEB-25-029', 'fungicides', cat_fungicides, 'Systemic triazole fungicide', 'Tebuconazole 25.9% w/v', 'Foliar spray. 1ml per liter water', 'Toxic to aquatic organisms', 1899, 160, 'medium', false),
    ('Azoxystrobin 23% SC', 'FUN-AZO-23-030', 'fungicides', cat_fungicides, 'Broad-spectrum strobilurin fungicide', 'Azoxystrobin 23% w/w', 'Apply 1ml per liter. Preventive spray', 'Do not apply more than twice per season', 3599, 75, 'medium', false)
  ON CONFLICT (sku) DO NOTHING;
END $$;

-- Update admin role for existing admin@gmail.com if exists
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@gmail.com' LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    UPDATE public.profiles SET role = 'admin'::user_role WHERE id = admin_user_id;
    INSERT INTO public.user_roles (user_id, role) VALUES (admin_user_id, 'admin'::user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;