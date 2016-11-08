echo "=============================="
echo "Compiling frontend using grunt"
setlocal
cd /d %~dp0
mklink /J node_modules "c:\Development\Jenkins\grunt_libs\node_modules"
grunt release
rmdir node_modules
cd ..
ren Frontend Frontend_old
move /y Frontend_old\dist\Frontend .\
move /y Frontend_old\dist\* .\
rmdir Frontend_old /s /q

echo "================================"
echo "Completed grunt job and replacing files in Frontend"