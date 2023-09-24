@echo off
SET "PATH=%PATH%;%SystemRoot%\System32\WindowsPowerShell\v1.0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

choco install nodejs

npm install -g yarn

yarn install

echo Установка завершена.
