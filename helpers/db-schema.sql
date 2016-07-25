/*
Gestore(id, name, pec)
Comune(id, name, pec)
Utenti(id, username, hash, name, surname, email, phone, lastlogin, userlevel)
Pratiche(id, idGestore, idComune, address, sitecode, tipopratica, protoIN, dataIN, protoOUT, dataOUT, note)
ConstStatoPratiche(id, descrizione)
ConstTipoPratiche(id, descrizione)
StatoPratiche(idPratica, idUtente, idStato, idUtenteModifica, timePoint)
StoricoStatoPratiche(id, idPratica, idUtente, idStato, idUtenteModifica, timePoint)
Integrazioni(idPratica, dateOUT, dateIN, protoOUT, protoIN, note)
*/

CREATE DATABASE jsPratiche;
USE jsPratiche;

CREATE TABLE Comuni (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  pec varchar(50),
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE Gestori (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  pec varchar(50),
  PRIMARY KEY (id)
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
  dataIN date,

  protoOUT varchar(50),
  dataOUT date,
  
  note varchar(256),
  
  PRIMARY KEY (id),
  FOREIGN KEY (tipopratica) REFERENCES ConstTipoPratiche(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (idGestore) REFERENCES Gestori(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (idComune) REFERENCES Comuni(id) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARSET=utf8;


CREATE TABLE StatoPratiche (
  idPratica int(11),
  idUtente int(11),
  idStato int(11),
  
  idUtenteModifica int(11),
  timePoint TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (idPratica),
  FOREIGN KEY (idPratica) REFERENCES Pratiche(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (idUtente) REFERENCES Utenti(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (idUtenteModifica) REFERENCES Utenti(id) ON DELETE NO ACTION ON UPDATE CASCADE,  
  FOREIGN KEY (idStato) REFERENCES ConstStatoPratiche(id) ON DELETE NO ACTION ON UPDATE CASCADE
) DEFAULT CHARSET=utf8;

CREATE TABLE StoricoStatoPratiche (
  id int(11) NOT NULL AUTO_INCREMENT,
    
  idPratica int(11),
  idUtente int(11),
  idStato int(11),
  
  idUtenteModifica int(11),
  timePoint TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  FOREIGN KEY (idPratica) REFERENCES Pratiche(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (idUtente) REFERENCES Utenti(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (idUtenteModifica) REFERENCES Utenti(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (idStato) REFERENCES ConstStatoPratiche(id) ON DELETE NO ACTION ON UPDATE CASCADE
) DEFAULT CHARSET=utf8;


CREATE TABLE Integrazioni (
  idPratica int(11) NOT NULL AUTO_INCREMENT,

  dateOUT date NOT NULL,
  dateIN date,
  
  protoOUT varchar(50),
  protoIN varchar(50),
  
  note varchar(256),

  PRIMARY KEY (idPratica, dateOUT),
  FOREIGN KEY (idPratica) REFERENCES Pratiche(id) ON UPDATE CASCADE ON DELETE NO ACTION
) DEFAULT CHARSET=utf8;
