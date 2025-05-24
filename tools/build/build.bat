@echo off
"%~dp0\..\bootstrap\node.bat" --experimental-transform-types "%~dp0\build.ts" %*
