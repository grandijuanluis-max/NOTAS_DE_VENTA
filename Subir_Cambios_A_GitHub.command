#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=========================================================="
echo "    SUBIENDO MEJORAS A GITHUB (NOTAS_DE_VENTA)           "
echo "=========================================================="
echo ""

git branch -M main 2>/dev/null
git add .
git commit -m "Actualizacion: Comprobante fiel a NV.pdf y limpieza Presea ERP"
git push -u origin main

echo ""
echo "=========================================================="
echo ">> ¡Listo! Tus cambios ya estan en GitHub y en tu link web"
echo "=========================================================="
read -p "Presiona ENTER para salir..."
