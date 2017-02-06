
CREATE DATABASE jsPratiche;
USE jsPratiche;

CREATE TABLE Province (
  id varchar(2),
  name varchar(50),

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE Gestori (
  id int(11) NOT NULL AUTO_INCREMENT,

  name varchar(50),
  pec varchar(50),

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE AAS (
  id int(11) NOT NULL AUTO_INCREMENT,

  name varchar(50),
  pec varchar(50),

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE Comuni (
  id int(11) NOT NULL AUTO_INCREMENT,

  name varchar(50),
  pec varchar(50),
  idaas int(11),
  province varchar(2),

  PRIMARY KEY (id),
  FOREIGN KEY (idaas) REFERENCES AAS(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (province) REFERENCES Province(id) ON DELETE NO ACTION ON UPDATE CASCADE
) DEFAULT CHARSET=utf8;

CREATE TABLE Utenti (
  id int(11) NOT NULL AUTO_INCREMENT,

  username varchar(50),
  hash varchar(256),
  name varchar(50),
  surname varchar(50),
  email varchar(50),
  phone varchar(50),
/*  firstlogin datetime TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, */
  lastlogin TIMESTAMP,
  userlevel int(11),
  pareri boolean,
  correzioni boolean,

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE ConstTipoPratiche (
  id int(11) NOT NULL AUTO_INCREMENT,

  descrizione varchar(50),

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE ConstStatoPratiche (
  id int(11) NOT NULL AUTO_INCREMENT,

  descrizione varchar(50),
  final BOOLEAN,

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE Pratiche (
  id int(11) NOT NULL AUTO_INCREMENT,

  idGestore int(11),
  idComune int(11),
  address varchar(50),
  sitecode varchar(50),
  tipopratica int(11),
  protoIN varchar(50),
  dateIN date,
  protoOUT varchar(50),
  dateOUT date,
  note varchar(256),

  PRIMARY KEY (id),
  FOREIGN KEY (tipopratica) REFERENCES ConstTipoPratiche(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (idGestore) REFERENCES Gestori(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (idComune) REFERENCES Comuni(id) ON DELETE NO ACTION ON UPDATE CASCADE
) DEFAULT CHARSET=utf8;

CREATE TABLE Integrazioni (
  id int(11) NOT NULL AUTO_INCREMENT,

  dateOUT date NOT NULL,
  dateIN date,
  protoOUT varchar(50),
  protoIN varchar(50),
  note varchar(256),

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE StatoPratiche (
  id int(11) NOT NULL AUTO_INCREMENT,

  idPratica int(11),
  idStato int(11),
  idUtenteModifica int(11),
  timePoint TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (idPratica) REFERENCES Pratiche(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (idStato) REFERENCES ConstStatoPratiche(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (idUtenteModifica) REFERENCES Utenti(id) ON DELETE NO ACTION ON UPDATE CASCADE
) DEFAULT CHARSET=utf8;

CREATE TABLE AssStatoPraticheUtenti (
  idStato int(11) NOT NULL,

  idUtente int(11),

  PRIMARY KEY (idStato),
  FOREIGN KEY (idStato) REFERENCES StatoPratiche(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (idUtente) REFERENCES Utenti(id) ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE AssStatoPraticheIntegrazioni (
  idStato int(11) NOT NULL,

  idInteg int(11),

  PRIMARY KEY (idStato),
  FOREIGN KEY (idStato) REFERENCES StatoPratiche(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (idInteg) REFERENCES Integrazioni(id) ON DELETE CASCADE ON UPDATE CASCADE
);

/* Registro Strumenti */
CREATE TABLE Strumenti (
  id int(11) NOT NULL AUTO_INCREMENT,

  name varchar(256),
  marca varchar(50),
  modello varchar(50),
  serial varchar(50),
  inventario varchar(50),
  tipo varchar(50),
  taratura varchar(256),
  note varchar(256),

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE Catene (
  id int(11) NOT NULL AUTO_INCREMENT,

  name varchar(50),
  note varchar(256),

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE StrumentiDelleCatene (
  idCatena int(11) NOT NULL,
  idStrumento int(11) NOT NULL,

  PRIMARY KEY (idCatena, idStrumento),
  FOREIGN KEY (idCatena) REFERENCES Catene(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (idStrumento) REFERENCES Strumenti(id) ON UPDATE CASCADE ON DELETE CASCADE
) DEFAULT CHARSET=utf8;

CREATE TABLE Sedi (
  id int(11) NOT NULL AUTO_INCREMENT,

  nome varchar(50),
  telefono varchar(50),
  note varchar(256),

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE Calibrazioni (
  id int(11) NOT NULL AUTO_INCREMENT,

  idCatena int(11) NOT NULL,
  lab varchar(256),
  certn varchar(256),
  dateCal date NOT NULL,
  note varchar(256),
  scadenza date NOT NULL,

  PRIMARY KEY (id),
  FOREIGN KEY (idCatena) REFERENCES Catene(id) ON UPDATE CASCADE ON DELETE CASCADE
) DEFAULT CHARSET=utf8;

CREATE TABLE RegistroStrumenti (
  id int(11) NOT NULL AUTO_INCREMENT,

  idCatena int(11) NOT NULL,
  idUtente int(11),
  timePointFrom TIMESTAMP NOT NULL,
  timePointTo TIMESTAMP,
  idSedeTo int(11),

  PRIMARY KEY (id),
  FOREIGN KEY (idCatena) REFERENCES Catene(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (idUtente) REFERENCES Utenti(id) ON UPDATE CASCADE ON DELETE NO ACTION,
  FOREIGN KEY (idSedeTo) REFERENCES Sedi(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;


/* Chat */
CREATE TABLE Messages (
  id int(11) NOT NULL AUTO_INCREMENT,

  userfrom int(11),
  msg TEXT,
  timePoint TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (userfrom) REFERENCES Utenti(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;

CREATE TABLE PrivateMessages (
  id int(11) NOT NULL AUTO_INCREMENT,

  userfrom int(11),
  userto int(11),
  msg TEXT,
  readen boolean,
  timePoint TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (userfrom) REFERENCES Utenti(id) ON UPDATE CASCADE ON DELETE NO ACTION,
  FOREIGN KEY (userto) REFERENCES Utenti(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;

CREATE TABLE SharedNotes(
  id int(11) NOT NULL AUTO_INCREMENT,

  text TEXT,
  create_user int(11),
  create_timePoint TIMESTAMP DEFAULT 0,
  mod_user int(11),
  mod_timePoint TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (create_user) REFERENCES Utenti(id) ON UPDATE CASCADE ON DELETE NO ACTION,
  FOREIGN KEY (mod_user) REFERENCES Utenti(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;

/* Bookmarks */
CREATE TABLE Links(
  id int(11) NOT NULL AUTO_INCREMENT,
  url varchar(256),
  name varchar(256),

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE Bookmarks(
  iduser int(11),
  idurl int(11),

  PRIMARY KEY (iduser, idurl),
  FOREIGN KEY (iduser) REFERENCES Utenti(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (idurl) REFERENCES Links(id) ON UPDATE CASCADE ON DELETE CASCADE
) DEFAULT CHARSET=utf8;



/* SRB */
CREATE TABLE SRBSiti(
  id int(11),
  code varchar(256),
  idcomune int(11),
  address varchar(256),

  height Decimal(10,2),
  utmx Decimal(10,2),
  utmy Decimal(10,2),

  activationDate date,
  resignationDate date,
  active boolean,

  PRIMARY KEY (id),
  FOREIGN KEY (idcomune) REFERENCES Comuni(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;

CREATE TABLE SRBSitiNote(
  id int(11),
  idsite int(11),

  note TEXT,

  iduser int(11),
  timePoint TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (idsite) REFERENCES SRBSiti(id) ON UPDATE CASCADE ON DELETE NO ACTION,
  FOREIGN KEY (iduser) REFERENCES Utenti(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;

CREATE TABLE SRBAntenne(
  id int(11),
  brand varchar(256),
  model varchar(256),
  version varchar(256),

  frequency Decimal(6,1),
  gain Decimal(6,3),
  tilte Decimal(4,1),

  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE SRBAntennaData(
  id int(11),
  idantenna int(11),

  pathmsi varchar(256),
  rawdata TEXT,

  PRIMARY KEY (id),
  FOREIGN KEY (idantenna) REFERENCES SRBAntenne(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;

CREATE TABLE SRBCelle(
  id int(11),
  idsite int(11),

  frequency Decimal(6,1),
  gain Decimal(6,3),
  direction Decimal(4,1),
  tiltm Decimal(4,1),
  tilte Decimal(4,1),

  idantenna int(11),

  power Decimal(6,2),
  alpha24 Decimal(4,3),

  height Decimal(10,2),
  utmx Decimal(10,2),
  utmy Decimal(10,2),

  PRIMARY KEY (id),
  FOREIGN KEY (idantenna) REFERENCES SRBAntenne(id) ON UPDATE CASCADE ON DELETE NO ACTION,
  FOREIGN KEY (idsite) REFERENCES SRBSiti(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;

CREATE TABLE SRBRiconfig(
  id int(11),
  idnew int(11),
  idold int(11),

  PRIMARY KEY (id),
  FOREIGN KEY (idnew) REFERENCES SRBSiti(id) ON UPDATE CASCADE ON DELETE NO ACTION,
  FOREIGN KEY (idold) REFERENCES SRBSiti(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;

CREATE TABLE SRBRPraticheSiti(
  idsite int(11),
  idpratica int(11),

  PRIMARY KEY (idsite,idpratica),
  FOREIGN KEY (idsite) REFERENCES SRBSiti(id) ON UPDATE CASCADE ON DELETE NO ACTION,
  FOREIGN KEY (idpratica) REFERENCES Pratiche(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;


/* Link tables */
CREATE TABLE LinkUtenti(
  id int(11),			/* id on jsPratiche */
  idlink int(11),		/* id on db_emittenti */

  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES Utenti(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;

CREATE TABLE LinkSitiPratiche(
  idsite int(11),		/* Siti(id) on db_emittenti */
  idpratica int(11),	/* id on jsPratiche */

  flag87bis boolean,
  flagSupTerra boolean,
  flagA24 boolean,

  idriconf int(11),		/* Siti(id) on db_emittenti */
  
  PRIMARY KEY (idsite),
  FOREIGN KEY (idPratica) REFERENCES Pratiche(id) ON DELETE CASCADE ON UPDATE CASCADE

) DEFAULT CHARSET=utf8;

CREATE TABLE LinkMisure(
  idpratica int(11),	/* id on jsPratiche */
  idMisura int(11),		/* Interventi(id) on db_emittenti */
  
  PRIMARY KEY (idMisura),
  FOREIGN KEY (idPratica) REFERENCES Pratiche(id) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8;


