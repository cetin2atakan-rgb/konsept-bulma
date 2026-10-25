@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 -X utf8 app\server.py
) else (
  python -X utf8 app\server.py
)
if errorlevel 1 (
  echo.
  echo Python bulunamadi ya da uygulama hata verdi. https://www.python.org/downloads/ adresinden Python 3.10+ kur.
  echo Kurarken "Add python.exe to PATH" kutusunu isaretle.
  pause
)
