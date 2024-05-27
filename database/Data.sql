INSERT INTO Kategorie(Nazwa) VALUES
('Elektronika'),
('Utrzymanie czystości'),
('Kosmetyki'),
('Spożywcze'),
('Ubrania'),
('Mieszkanie'),
('Działka'),
('Relaks'),
('Prezenty'),
('Samochód'),
('Alkohol'),
('Rachunki'),
('Transport'),
('Podatki'),
('Urlop'),
('Zdrowie'),
('Praca'),
('Inne');

INSERT INTO MetodyPlatnosci(Nazwa) VALUES
('Gotówka'),
('BLIK'),
('Karta debetowa'),
('Karta kredytowa'),
('Czek'),
('Szybki przelew'),
('Przelew'),
('Za pobraniem'),
('Raty'),
('PayPal'),
('GooglePay'),
('ApplePay'),
('PayU'),
('Blue Media'),
('SMS');

INSERT INTO Sklepy(Nazwa, Adres, MiastoID, Telefon, NIP) VALUES
('Biedronka', 'Zakopiańska 22a', 1, '800080010', '9081681663'),
('Lewiatan', 'Podhalańska 2b', 1, '515781645', '4922255779'),
('Media Expert', 'Zakopiańska 6c', 1, '578194253', '2430392096'),
('Steskal', 'Chopina 16', 1, '182676326', '4453138416'),
('MediaMarkt', 'Al. Pokoju 67', 2, '799353535', '3298004555'),
('Decathlon', 'Szaflarska 164', 3, '185345600', '3574691962'),
('IKEA', 'Josepha Conrada 66', 4, '222750000', '1657442321');

INSERT INTO Miasta(Nazwa, KodPocztowy) VALUES
('Rabka-Zdrój', '34-700'),
('Kraków', '31-580'),
('Nowy Targ', '34-400'),
('Kraków', '31-357');

INSERT INTO TypyTransakcji(Nazwa) VALUES
('Wpłata'),
('Wypłata');