#!/bin/bash
echo "Importing jspratiche" && \
sudo -u postgres psql --set ON_ERROR_STOP=on dbnir < dbscripts/1.create_pg.psql && \
echo "Importing DBNIR" && \
sudo -u postgres psql --set ON_ERROR_STOP=on dbnir < dbscripts/2.create_dbnir.psql && \
printf "\n\nOK!\n"