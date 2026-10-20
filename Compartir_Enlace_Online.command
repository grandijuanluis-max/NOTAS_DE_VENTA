#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=========================================================="
echo "    PALAVERSICH S.A. — COMPARTIR NOTA DE VENTA ONLINE     "
echo "=========================================================="
echo ""
echo "1. Iniciando servidor local en puerto 8080..."

# Iniciar servidor local si no está corriendo
if ! lsof -i :8080 > /dev/null 2>&1; then
    python3 server.py &
    SERVER_PID=$!
    echo ">> Servidor local iniciado (PID: $SERVER_PID)"
    sleep 1
else
    echo ">> Servidor local ya estaba activo en puerto 8080"
fi

echo ""
echo "2. Generando enlace público HTTPS temporal..."
echo "----------------------------------------------------------"
echo ">> Conectando con túnel seguro..."
echo ">> Copia el enlace HTTPS que aparecerá a continuación y"
echo "   compártelo por WhatsApp o correo."
echo ">> (Mantén esta ventana abierta mientras quieras compartir el link)"
echo "----------------------------------------------------------"
echo ""

# Intentar túnel seguro mediante pinggy (sin instalación requerida)
ssh -p 443 -o StrictHostKeyChecking=no -R0:localhost:8080 a.pinggy.io
