-- Seed data: real coffee varieties from major producing regions.
-- Passwords for seed users are set via the init-db script (hashed with bcrypt).
-- Never put plaintext passwords here.

INSERT INTO coffees (name, origin, region, variety, process, altitude_m, tasting_notes, description, created_by) VALUES
('Yirgacheffe', 'Ethiopia', 'Sidamo', 'Arabica', 'Washed', 2000, 'Floral, jasmine, lemon, black tea', 'Considered one of the finest coffees in the world, Ethiopian Yirgacheffe is grown at high altitude. Its highly floral and acidic profile makes it a benchmark for specialty coffees.', 1),
('Geisha', 'Panama', 'Boquete', 'Arabica', 'Washed', 1700, 'Bergamot, orange blossom, honey', 'A very rare variety originally from Ethiopia, planted in Panama in the 1960s. Its unique profile and rarity make it the most expensive coffee in the world at auction.', 1),
('Bourbon Pointu', 'France', 'Reunion Island', 'Arabica', 'Washed', 800, 'Mandarin, vanilla, low bitterness', 'Historic variety grown only on Reunion Island. Naturally low caffeine content. Very limited production.', 1),
('Kerala Robusta', 'India', 'Wayanad', 'Robusta', 'Natural', 800, 'Dark chocolate, earthy, full body', 'Indian robusta grown at altitude, more aromatic than classic robustas. Widely used in Italian blends for crema.', 1),
('Sidamo', 'Ethiopia', 'Sidamo', 'Arabica', 'Natural', 1900, 'Red fruits, wine, chocolate', 'Ethiopian natural coffee dried on the whole cherry. Very fruity profile typical of Sidamo coffees.', 1),
('Antigua', 'Guatemala', 'Antigua', 'Arabica', 'Washed', 1600, 'Cocoa, hazelnut, sweet spices', 'Grows on rich volcanic soils around Antigua. Classic balance between acidity, body and sweetness.', 1),
('Tarrazu', 'Costa Rica', 'Tarrazu', 'Arabica', 'Honey', 1700, 'Caramel, citrus, malty notes', 'Honey process where pulp is partially left on the bean during drying. Increased sweetness.', 1),
('Sumatra Mandheling', 'Indonesia', 'Sumatra', 'Arabica', 'Natural', 1200, 'Earthy, cedar, herbs, low acidity', 'Giling basah process specific to Sumatra. Heavy body and rustic profile, very recognisable.', 1),
('Kona', 'United States', 'Hawaii', 'Arabica', 'Washed', 600, 'Buttery, nutty, sweet', 'Grown on the volcanic slopes of Hawaii Island. Very limited production volume. Often counterfeited.', 1),
('Malaysian Liberica', 'Malaysia', 'Johor', 'Liberica', 'Natural', 200, 'Wood, smoke, exotic fruits', 'Rare species making up less than 2% of world production. Beans larger than Arabica. Atypical profile.', 1);
