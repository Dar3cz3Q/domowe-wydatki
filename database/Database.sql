CREATE DATABASE domowe_wydatki;
USE domowe_wydatki;
--Tworzenie tabel
CREATE TABLE Osoby(
	OsobaID int PRIMARY KEY IDENTITY(1,1),
	Imie nvarchar(50) not null,
	Nazwisko nvarchar(50) not null
);

CREATE TABLE OsobySzczegoly(
	OsobaID int PRIMARY KEY IDENTITY(1,1) REFERENCES Osoby(OsobaID),
	NrDowoduOsobistego char(9) not null,
	Pesel char(11) not null,
	DataUrodzenia date not null
);

CREATE TABLE OszczednosciOsoby(
	OsobaID int PRIMARY KEY,
	NrOstatniejTransakcji int not null,
	OszczedzonaKwota money not null
);

CREATE TABLE HistoriaOszczedzania(
	OperacjaID int PRIMARY KEY IDENTITY(1,1),
	OsobaID int not null,
	TypTransakcji int not null,
	Kwota money not null
);

CREATE TABLE Pozyczki(
	PozyczkaID int PRIMARY KEY IDENTITY(1,1),
	PozyczkodawcaID int not null,
	PozyczkobiorcaID int not null,
	Kwota money not null,
	DataPozyczki datetime DEFAULT GETDATE() not null,
	TerminOddania datetime not null,
	CzyOddano bit
);

CREATE TABLE Obrot(
	OperacjaID int PRIMARY KEY IDENTITY(1,1),
	OsobaID int not null,
	TypTransakcji int not null,
	Kwota money not null,
	DataOperacji datetime DEFAULT GETDATE() not null
);

CREATE TABLE TypyTransakcji(
	TypID int PRIMARY KEY IDENTITY(1,1),
	Nazwa nvarchar(10) not null
);

CREATE TABLE Wydatki(
	WydatekID int PRIMARY KEY IDENTITY(1,1),
	KategoriaID int,
	OsobaID int not null,
	SklepID int not null,
	DataWydatku datetime DEFAULT GETDATE() not null,
	Kwota money not null,
	Opis nvarchar(100) not null,
	MetodaPlatnosciID int not null
);

CREATE TABLE MetodyPlatnosci(
	MetodaID int PRIMARY KEY IDENTITY(1,1),
	Nazwa nvarchar(50) not null
);

CREATE TABLE Sklepy(
	SklepID int PRIMARY KEY IDENTITY(1,1),
	Nazwa nvarchar(50) not null,
	Adres nvarchar(50),
	MiastoID int,
	Telefon varchar(18),
	NIP char(10)
);

CREATE TABLE Miasta(
	MiastoID int PRIMARY KEY IDENTITY(1,1),
	Nazwa nvarchar(50) not null,
	KodPocztowy char(6) not null
);

CREATE TABLE Kategorie(
	KategoriaID int PRIMARY KEY IDENTITY(1,1),
	Nazwa nvarchar(50) not null
);

CREATE TABLE Konta(
	IDKonta int PRIMARY KEY IDENTITY(1,1),
	Username nvarchar(50) UNIQUE NOT NULL,
	Email nvarchar(50) UNIQUE NOT NULL,
	Haslo char(60) NOT NULL,
	Data_utworzenia datetime DEFAULT GETDATE() not null
);

CREATE TABLE Profile_konta(
	IDProfilu int REFERENCES Osoby(OsobaID),
	IDKonta int REFERENCES Konta(IDKonta),
	PRIMARY KEY(IDProfilu, IDKonta)
);
--Konfigurowanie tabel
ALTER TABLE OszczednosciOsoby ADD FOREIGN KEY (NrOstatniejTransakcji) REFERENCES HistoriaOszczedzania(OperacjaID);
ALTER TABLE HistoriaOszczedzania ADD FOREIGN KEY (OsobaID) REFERENCES Osoby(OsobaID);
ALTER TABLE HistoriaOszczedzania ADD FOREIGN KEY (TypTransakcji) REFERENCES TypyTransakcji(TypID);
ALTER TABLE Pozyczki ADD FOREIGN KEY (PozyczkodawcaID) REFERENCES Osoby(OsobaID);
ALTER TABLE Pozyczki ADD FOREIGN KEY (PozyczkobiorcaID) REFERENCES Osoby(OsobaID);
ALTER TABLE Obrot ADD FOREIGN KEY (OsobaID) REFERENCES Osoby(OsobaID);
ALTER TABLE Obrot ADD FOREIGN KEY (TypTransakcji) REFERENCES TypyTransakcji(TypID);
ALTER TABLE Wydatki ADD FOREIGN KEY (KategoriaID) REFERENCES Kategorie(KategoriaID);
ALTER TABLE Wydatki ADD FOREIGN KEY (OsobaID) REFERENCES Osoby(OsobaID);
ALTER TABLE Wydatki ADD FOREIGN KEY (SklepID) REFERENCES Sklepy(SklepID);
ALTER TABLE Wydatki ADD FOREIGN KEY (MetodaPlatnosciID) REFERENCES MetodyPlatnosci(MetodaID);
ALTER TABLE Sklepy ADD FOREIGN KEY (MiastoID) REFERENCES Miasta(MiastoID);
--Tworzenie constraintow
ALTER TABLE OsobySzczegoly ADD CONSTRAINT dowodOsobisty_format CHECK(
	NrDowoduOsobistego LIKE '[A-Z][A-Z][A-Z][0-9][0-9][0-9][0-9][0-9][0-9]'
)
--Tworzenie procedur
CREATE PROCEDURE dbo.Create_person
	@imie varchar(50),
	@nazwisko varchar(50),
	@nrDowoduOsobistego char(9),
	@pesel char(11),
	@dataUrodzenia date,
	@accountID int
AS 
BEGIN
	DECLARE @profileID int
	INSERT INTO Osoby (Imie, Nazwisko) VALUES(@imie, @nazwisko)
	INSERT INTO OsobySzczegoly (NrDowoduOsobistego, Pesel, DataUrodzenia) VALUES(@nrDowoduOsobistego, @pesel, @dataUrodzenia)
	SET @profileID = SCOPE_IDENTITY()
	INSERT INTO Profile_konta VALUES(@profileID, @accountID)
END

CREATE PROCEDURE dbo.Update_person
	@id int,
	@imie varchar(50),
	@nazwisko varchar(50),
	@nrDowoduOsobistego char(9),
	@pesel char(11),
	@dataUrodzenia date
AS 
BEGIN
	UPDATE Osoby SET Imie = @imie, Nazwisko = @nazwisko WHERE OsobaID = @id
	UPDATE OsobySzczegoly SET NrDowoduOsobistego = @nrDowoduOsobistego, Pesel = @pesel, DataUrodzenia = @dataUrodzenia WHERE OsobaID = @id
END

CREATE PROCEDURE dbo.Remove_person
	@id int
AS 
BEGIN
	DELETE FROM Osoby WHERE OsobaID = @id
	DELETE FROM OsobySzczegoly WHERE OsobaID = @id
END

--Tworzenie funkcji
CREATE FUNCTION dbo.CountSavings(@id int)
	RETURNS int
AS
BEGIN
	DECLARE @in int;
	DECLARE @out int;
	SET @in = (SELECT SUM(Kwota) FROM HistoriaOszczedzania WHERE OsobaID = @id AND TypTransakcji = 1);
	SET @out = (SELECT SUM(Kwota) FROM HistoriaOszczedzania WHERE OsobaID = @id AND TypTransakcji = 2);
	RETURN ISNULL(@in, 0) - ISNULL(@out, 0)
END

--Tworzenie triggerów
CREATE TRIGGER Osoby_usuwanie ON Osoby
	FOR DELETE AS 
		BEGIN
			DECLARE @id int;
			DECLARE @imie varchar(50);
			DECLARE @nazwisko varchar(50);
			SELECT @id = OsobaID,  @imie = Imie, @nazwisko = Nazwisko FROM DELETED;
			INSERT INTO Osoby_usuniete VALUES (@id, @imie, @nazwisko)
		END

CREATE TRIGGER OsobySzczegoly_usuwanie ON OsobySzczegoly
	FOR DELETE AS 
		BEGIN
			DECLARE @id int;
			DECLARE @dowod char(9);
			DECLARE @pesel char(11);
			DECLARE @data date
			SELECT @id = OsobaID, @dowod = NrDowoduOsobistego, @pesel = Pesel, @data = DataUrodzenia FROM DELETED;
			INSERT INTO OsobySzczegoly_usuniete VALUES (@id, @dowod, @pesel, @data)
		END