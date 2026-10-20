#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
echo "===================================================================="
echo "  🚀 INICIANDO CRM MULTI-EMPRESA PRESEA ERP (NOTAS DE VENTA)"
echo "  🏢 Empresas: PASINA S.A. • PALAVERSICH S.A. • PETROBONO S.A."
echo "===================================================================="
open "http://localhost:8080"
python3 server.py
