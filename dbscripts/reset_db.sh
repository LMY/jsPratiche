#!/bin/bash
echo "Importing jspratiche" && \
sudo -u postgres psql --set ON_ERROR_STOP=on dbnir < dbscripts/1.create_pg.psql && \
echo "Importing DBNIR" && \
sudo -u postgres psql --set ON_ERROR_STOP=on dbnir < dbscripts/2.create_dbnir.psql && \
printf "\n\nPopulating db...\n" && \
sudo -u postgres psql --set ON_ERROR_STOP=on dbnir < dbscripts/4.fixture.psql && \
printf "\n\nOK!\n"


# sudo -u postgres psql dbnir    # -c 
# UPDATE jspratiche."Utenti" SET hash='' WHERE username='y';

