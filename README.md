# 🚀 CRM Multi-Empresa • Gestión de Notas de Venta (PRESEA ERP)

Sistema web ágil, moderno y adaptable para el **Ingreso de Notas de Venta** de acuerdo al circuito oficial de **PRESEA ERP** para:
- 🏢 **PASINA MARCELO ALEJANDRO**
- 🏢 **PALAVERSICH Y CIA. S.A.C.**
- 🏢 **PETROBONO S.A.**

---

## 🌟 Características y Particularidades por Empresa

### 1. PASINA MARCELO ALEJANDRO
- **Numeración oficial:** `100127312` (talonario 1001 + correlativo).
- **Listas de Precios:** Selección dinámica de listas (`LISTA_UNIC`, `LISTA_MAY`, `LISTA_DIST`, `LISTA_ESP`).
- **Precios de Lista:** Visualización con **4 decimales**.
- **Depósito:** Sugerencia default `1 - PASINA` (editable y completable por el usuario).
- **Transporte:** 1 transporte principal (`2 - Retira Cobro Vendedor`, etc.).
- **Vendedor:** Asignación automática por cliente (`Carolina Mediavilla`).

### 2. PALAVERSICH Y CIA. S.A.C.
- **Numeración oficial:** `700004829` (talonario 7000 + correlativo).
- **Listas de Precios:** `LISTA_01`, `LISTA_AGRO`, `DISTRIBUIDOR`, `LISTA_EXPORT`.
- **Depósito:** Sugerencia default `50 - PREPARADO` (editable y completable).
- **Modal Exclusivo "📋 Datos adicionales":**
  - Checkbox: `¿Es NV Comisionista?`
  - Tipo de NV: `Consignacion`, `Anticipada`, `Otras Condi.`, `Pases`, `Liq. Prod.`
  - Forma de Entrega: `Retira Cliente`, `Entrega Vendedor`, `Envio por Transpor`
  - Medio de Pago: `Pago Cheque`, `Pago Transferencia`, `Pago Tarjeta`
- **Moneda USD:** Dólares Estadounidenses con cotización oficial del día editable.

### 3. PETROBONO S.A.
- **Numeración oficial:** `153189` (correlativo 6 dígitos).
- **Listas de Precios:** `R0` (Tarifa Agro), `R1` (Estaciones Blancas), `R2` (Mayorista Transporte), `MAYORISTA_AGRO`.
- **Múltiples Transportes:** **3 Transportes en simultáneo** (`TRANSP. 1`, `TRANSP. 2` Chofer/Acoplado, `TRANSP. 3` Cisterna).
- **Depósito:** `1 - PLANTA SAN LORENZO`, `2 - BASE DOCK SUD`, `3 - PLANTA CÓRDOBA` (editable).
- **Control Crediticio:** Límite de Crédito destacado (`$19.301.263,00`) y control de saldos en tiempo real.

---

## ⚡ Regla Universal de Moneda
En cualquiera de las 3 empresas, si se selecciona **Moneda: 2 - Dólares Estadoun. (USD)**:
1. Se despliega automáticamente el casillero **Cotización del Día ($ / USD)** (ej: `1.450,00`).
2. Los artículos calculan sus totales en USD y muestran la equivalencia en Pesos.
3. El comprobante impreso oficial estampa la cotización del día aplicada.

---

## 🚀 Cómo Iniciar la Aplicación en tu Mac

1. Haz doble clic en el archivo:
   👉 **`Iniciar_Servidor.command`**
2. Se abrirá automáticamente tu navegador en:
   👉 **`http://localhost:8080`**
3. En la esquina superior derecha puedes alternar con un solo clic entre **Pasina**, **Palavecich** y **Petrobono** para hacer la demostración en vivo a los tres.
