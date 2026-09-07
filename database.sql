    -- 1. Database voorbereiden
    USE boeren;
    SET FOREIGN_KEY_CHECKS = 0;

    -- 2. Tabellen opschonen 
    TRUNCATE TABLE `trip`;
    TRUNCATE TABLE `location`;
    TRUNCATE TABLE `users`;
    TRUNCATE TABLE `faq`;
    TRUNCATE TABLE `faq_categories`;
    TRUNCATE TABLE `contact`;
    TRUNCATE TABLE `department`;
    TRUNCATE TABLE `role`;
    TRUNCATE TABLE `fueltype`;
    TRUNCATE TABLE `transportvehicle`;
    TRUNCATE TABLE `triptype`;
    TRUNCATE TABLE `vehicles`;


    -- 3. Stamgegevens
    -- Role table now includes descriptions for permissions
    INSERT INTO `role` (`name`, `description`) VALUES 
    ('Admin', 'Volledige toegang tot het beheerpaneel, voertuigbeheer en alle rapportages.'),
    ('Afdelingleider', 'Kan alle data van een afdeling zien!'),
    ('Management', 'Kan rapporten van een vestiging zien!'),
    ('Medewerker', 'Toegang tot het registreren van eigen ritten en het bekijken van persoonlijke statistieken.');
    
    INSERT INTO `location` (`address`, `name`, `city`) VALUES 
    ('Dorpsstraat 1', 'Woning Jan Boer', 'Utrecht'),
    ('Stationsplein 5', 'Kantoor Utrecht', 'Utrecht'),
    ('Damrak 1', 'Hoofdkantoor', 'Amsterdam'),
    ('Coolsingel 1', 'Kantoor Rotterdam', 'Rotterdam'),
    ('Vrijthof 1', 'Vestiging Maastricht', 'Maastricht'),
    ('Lange Poten 10', 'Kantoor Den Haag', 'Den Haag');

    INSERT INTO `department` (`name`, `location_address`, `location_city`) VALUES 
    ('IT', 'Damrak 1', 'Amsterdam'),
    ('HR', 'Stationsplein 5', 'Utrecht'),
    ('Logistiek', 'Coolsingel 1', 'Rotterdam'),
    ('Office', 'Lange Poten 10', 'Den Haag');

    INSERT INTO `fueltype` (`name`, `emission_factor_kg_per_km`) VALUES 
    ('benzine', 0.149),
    ('diesel', 0.136),
    ('elektrisch', 0.0000),
    ('hybride', 0.138),
    ('geen', 0.0000);

    INSERT INTO `transportvehicle` (`name`, `is_motorized`) VALUES 
    ('auto', 1), ('fiets', 0), ('trein', 1), ('bus', 1), ('motor', 1),
    ('tram', 1), ('scooter', 1), ('wandelen', 0);

    INSERT INTO `triptype` (`name`) VALUES 
    ('woon-werk'), ('zakelijk'), ('prive');

    INSERT INTO `faq_categories` (`name`) VALUES 
    ('Algemeen'), ('Account'), ('Duurzaamheid'), ('Rapportage');


    INSERT INTO `users` 
    (`email`, `name`, `password`, `department_name`, `role_name`, `location_address`, `location_city`) 
    VALUES

    ('jan.boer@example.com', 'Jan Boer', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Y5g.TKq3plh3Ymnv6JDcJ/J1lGR3e', 'IT', 'Admin', 'Dorpsstraat 1', 'Utrecht'),

    -- Test Admin | wachtwoord: Test1234!
    ('test.admin@boeren.nl', 'Test Admin', '$2b$10$SJwrS4MZE8vTtFWxBYHoLuudBSU/djmkUkTx/clel8mGzsCFXINnm', 'IT', 'Admin', 'Damrak 1', 'Amsterdam'),

    -- Test Medewerker | wachtwoord: Test1234!
    ('test.medewerker@boeren.nl', 'Test Medewerker', '$2b$10$SJwrS4MZE8vTtFWxBYHoLuudBSU/djmkUkTx/clel8mGzsCFXINnm', 'HR', 'Medewerker', 'Stationsplein 5', 'Utrecht'),

    ('anita.groen@example.com', 'Anita Groen', '$2a$10$7Q0m6I2R.P1/0K7F.8lE0eHq5XaFz/otxNzIvjYxTXrJn0uV6VpeG', 'Office', 'Medewerker', 'Stationsplein 5', 'Utrecht'),

    ('bo.hoobroeckx@gmail.com', 'Bo Hoobroeckx', '$2a$10$4rU6F.s8DQ1z6Nhsxj9o9u1g0x2kbj7Kj0Z4W9qR0pAB7J0aQpzSy', 'Logistiek', 'Medewerker', 'Dorpsstraat 1', 'Utrecht'),

    ('mark.de.vries@example.com', 'Mark de Vries', 'password123', 'IT', 'Medewerker', 'Damrak 1', 'Amsterdam'),

    ('lisa.bakker@provider.nl', 'Lisa Bakker', 'password123', 'HR', 'Medewerker', 'Coolsingel 1', 'Rotterdam'),

    ('pieter.post@hulp.nl', 'Pieter Post', 'password123', 'Logistiek', 'Medewerker', 'Lange Poten 10', 'Den Haag');

    -- 8. Trips
    INSERT INTO `trip` (`user_email`, `trip_datetime`, `start_location`, `end_location`, `distance_km`, `vehicle_name`, `fuel_name`, `trip_type_name`) VALUES 
    ('jan.boer@example.com', '2026-03-12 08:30:00', 'Dorpsstraat 1', 'Stationsplein 5', 15.50, 'auto', 'benzine', 'woon-werk'),
    ('mark.de.vries@example.com', '2026-04-01 08:15:00', 'Utrecht', 'Amsterdam', 45.20, 'auto', 'benzine', 'woon-werk'),
    ('bo.hoobroeckx@gmail.com', '2026-03-26 11:12:10', 'Utrecht', 'Amsterdam', 12.00, 'auto', 'diesel', 'prive'),
    ('anita.groen@example.com', '2026-03-12 09:00:00', 'Stationsplein 5', 'Dorpsstraat 1', 5.20, 'fiets', 'geen', 'zakelijk'),
    ('lisa.bakker@provider.nl', '2026-04-02 09:30:00', 'Rotterdam', 'Delft', 6.50, 'fiets', 'geen', 'zakelijk'),
    ('lisa.bakker@provider.nl', '2026-04-02 15:45:00', 'Rotterdam', 'Assen', 32.00, 'motor', 'benzine', 'prive'),
    ('bo.hoobroeckx@gmail.com', '2026-03-27 08:27:04', 'Amsterdam', 'Eindhoven', 40.00, 'motor', 'hybride', 'zakelijk'),
    ('bo.hoobroeckx@gmail.com', '2026-03-26 15:29:18', 'Amsterdam', 'Utrecht', 25.00, 'trein', 'elektrisch', 'zakelijk'),
    ('jan.boer@example.com', '2026-03-28 10:00:00', 'Utrecht', 'Maastricht', 180.00, 'trein', 'elektrisch', 'prive'),
    ('pieter.post@hulp.nl', '2026-04-03 08:00:00', 'Den Haag', 'Scheveningen', 7.50, 'tram', 'elektrisch', 'woon-werk'),
    ('pieter.post@hulp.nl', '2026-04-03 12:00:00', 'Scheveningen', 'Den Haag', 7.50, 'tram', 'elektrisch', 'woon-werk'),
    ('anita.groen@example.com', '2026-04-04 10:00:00', 'Utrecht', 'Zeist', 12.30, 'scooter', 'benzine', 'prive'),
    ('mark.de.vries@example.com', '2026-04-04 11:30:00', 'Amsterdam', 'Amstelveen', 8.00, 'scooter', 'elektrisch', 'zakelijk'),
    ('lisa.bakker@provider.nl', '2026-04-05 09:00:00', 'Rotterdam', 'Kantoor', 1.50, 'wandelen', 'geen', 'woon-werk'),
    ('jan.boer@example.com', '2026-04-05 14:00:00', 'Utrecht', 'Supermarkt', 0.80, 'wandelen', 'geen', 'prive'),
    ('pieter.post@hulp.nl', '2026-04-06 07:30:00', 'Den Haag', 'Rotterdam', 22.00, 'bus', 'diesel', 'zakelijk');

    -- Test data for favoritetrip
    INSERT INTO `favoritetrip` (`user_email`, `start_location`, `end_location`, `distance_km`, `vehicle_name`, `fuel_name`, `trip_type_name`) VALUES

    -- test.admin@boeren.nl
    ('test.admin@boeren.nl', 'Damrak 1', 'Stationsplein 5', 45.20, 'auto', 'elektrisch', 'zakelijk'),
    ('test.admin@boeren.nl', 'Amsterdam', 'Rotterdam', 75.50, 'trein', 'elektrisch', 'zakelijk'),
    ('test.admin@boeren.nl', 'Damrak 1', 'Lange Poten 10', 60.00, 'auto', 'hybride', 'zakelijk'),

    -- test.medewerker@boeren.nl
    ('test.medewerker@boeren.nl', 'Stationsplein 5', 'Damrak 1', 45.20, 'trein', 'elektrisch', 'woon-werk'),
    ('test.medewerker@boeren.nl', 'Utrecht', 'Amsterdam', 45.20, 'auto', 'benzine', 'woon-werk'),
    ('test.medewerker@boeren.nl', 'Stationsplein 5', 'Coolsingel 1', 60.00, 'auto', 'hybride', 'zakelijk');
    
    -- 9. FAQ Vragen
    INSERT INTO `faq` (`question`, `description`, `FAQ_categories_name`) VALUES 
    ('Hoe wijzig ik mijn wachtwoord?', 'Ga naar instellingen in je profiel om je wachtwoord veilig aan te passen.', 'Account'),
    ('Wat is de emissiefactor?', 'De emissiefactor geeft aan hoeveel CO2 er wordt uitgestoten per gereden kilometer per brandstoftype.', 'Duurzaamheid'),
    ('Waarom zie ik mijn rit niet in de grafiek?', 'Ritten worden pas getoond nadat ze volledig zijn geregistreerd en opgeslagen in het systeem.', 'Rapportage'),
    ('Welke vervoersmiddelen kan ik kiezen?', 'Je kunt kiezen uit auto, fiets, trein, bus, motor, tram, scooter en wandelen.', 'Algemeen'),
    ('Hoe worden de kilometers berekend?', 'De afstand wordt berekend op basis van de start- en eindlocatie die je invoert.', 'Algemeen');

    INSERT INTO vehicles 
    (number_plate, brand, model, model_year, status, fueltype_name, location_address, location_city) 
    VALUES

    -- ELEKTRISCH
    ('EL-001-A', 'Tesla', 'Model 3', 2023, 'beschikbaar', 'elektrisch', 'Damrak 1', 'Amsterdam'),
    ('EL-002-B', 'Tesla', 'Model Y', 2022, 'in gebruik', 'elektrisch', 'Stationsplein 5', 'Utrecht'),
    ('EL-003-C', 'Hyundai', 'Kona Electric', 2021, 'beschikbaar', 'elektrisch', 'Coolsingel 1', 'Rotterdam'),
    ('EL-004-D', 'Kia', 'EV6', 2023, 'onderhoud', 'elektrisch', 'Damrak 1', 'Amsterdam'),
    ('EL-005-E', 'Volkswagen', 'ID.3', 2022, 'beschikbaar', 'elektrisch', 'Lange Poten 10', 'Den Haag'),
    ('EL-006-F', 'Volkswagen', 'ID.4', 2023, 'in gebruik', 'elektrisch', 'Coolsingel 1', 'Rotterdam'),
    ('EL-007-G', 'BMW', 'i4', 2022, 'beschikbaar', 'elektrisch', 'Stationsplein 5', 'Utrecht'),
    ('EL-008-H', 'Mercedes-Benz', 'EQB', 2023, 'beschikbaar', 'elektrisch', 'Damrak 1', 'Amsterdam'),
    ('EL-009-J', 'Nissan', 'Leaf', 2020, 'in gebruik', 'elektrisch', 'Lange Poten 10', 'Den Haag'),
    ('EL-010-K', 'Peugeot', 'e-208', 2021, 'beschikbaar', 'elektrisch', 'Coolsingel 1', 'Rotterdam'),

    -- HYBRIDE
    ('HY-101-A', 'Toyota', 'Corolla Hybrid', 2021, 'beschikbaar', 'hybride', 'Damrak 1', 'Amsterdam'),
    ('HY-102-B', 'Toyota', 'Prius', 2020, 'in gebruik', 'hybride', 'Stationsplein 5', 'Utrecht'),
    ('HY-103-C', 'Hyundai', 'Ioniq Hybrid', 2021, 'beschikbaar', 'hybride', 'Lange Poten 10', 'Den Haag'),
    ('HY-104-D', 'Kia', 'Niro Hybrid', 2022, 'onderhoud', 'hybride', 'Coolsingel 1', 'Rotterdam'),
    ('HY-105-E', 'Ford', 'Kuga Hybrid', 2023, 'beschikbaar', 'hybride', 'Damrak 1', 'Amsterdam'),
    ('HY-106-F', 'Volvo', 'XC40 Hybrid', 2022, 'in gebruik', 'hybride', 'Stationsplein 5', 'Utrecht'),

    -- BENZINE (weinig)
    ('BZ-201-A', 'Volkswagen', 'Golf', 2019, 'beschikbaar', 'benzine', 'Lange Poten 10', 'Den Haag'),
    ('BZ-202-B', 'Ford', 'Focus', 2018, 'in gebruik', 'benzine', 'Coolsingel 1', 'Rotterdam'),

    -- DIESEL (weinig)
    ('DS-301-A', 'Audi', 'A4', 2020, 'beschikbaar', 'diesel', 'Damrak 1', 'Amsterdam'),
    ('DS-302-B', 'BMW', '3 Series', 2019, 'in gebruik', 'diesel', 'Stationsplein 5', 'Utrecht');

    -- 11. Contact
    INSERT INTO `contact` (`email`, `created_at`, `description`, `name`) VALUES 
    ('support@boeren.nl', '2026-03-12 10:00:00', 'Vraag over de dashboard statistieken.', 'Pieter Post');

    -- 11. Afronden
    SET FOREIGN_KEY_CHECKS = 1;
