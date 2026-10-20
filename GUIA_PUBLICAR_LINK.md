# Cómo Publicar y Compartir la Nota de Venta Online — PALAVERSICH S.A.

Tienes 3 alternativas según lo que necesites:

---

## ⚡ Opción 1: Enlace Inmediato Temporal (Para compartir YA MISMO)

Si necesitas pasarle el link ahora mismo a un compañero, vendedor o cliente por WhatsApp:

1. Ve a la carpeta `CRM_NOTA_DE_VENTA`.
2. Haz doble clic en el archivo **`Compartir_Enlace_Online.command`**.
3. Se abrirá una ventana de terminal y en 5 segundos te mostrará un enlace público HTTPS (ejemplo: `https://xxxx.a.pinggy.link`).
4. **Copia ese enlace y envíalo**. Cualquiera que abra ese link desde cualquier teléfono, tablet o computadora en el mundo podrá ver y usar la aplicación completa.
5. *Nota:* El enlace funciona mientras mantengas esa ventana abierta en tu Mac.

---

## ☁️ Opción 2: Permanente 24/7 en Render (Recomendado si ya usas Render)

Para que quede online las 24 horas del día sin necesidad de tener tu computadora encendida:

1. Sube los archivos de `CRM_NOTA_DE_VENTA` a un repositorio en tu GitHub (ej: `palaversich-ventas`).
2. Entra en tu panel de [Render.com](https://render.com).
3. Haz clic en **New +** > **Web Service**.
4. Conecta el repositorio de GitHub.
5. En la configuración:
   - **Name:** `palaversich-ventas`
   - **Runtime:** `Python 3`
   - **Build Command:** *(dejar vacío o `pip install -r requirements.txt`)*
   - **Start Command:** `python server.py`
   - **Instance Type:** `Free`
6. Haz clic en **Create Web Service**.
7. ¡Listo! Render te dará un enlace permanente:  
   👉 `https://palaversich-ventas.onrender.com`

---

## 🚀 Opción 3: Permanente en Vercel o Netlify (Carga ultrarrápida en 1 clic)

Como el sistema está construido con HTML5, CSS y JavaScript moderno:

- **En Netlify:**
  1. Entra a [app.netlify.com/drop](https://app.netlify.com/drop).
  2. Arrastra la carpeta `CRM_NOTA_DE_VENTA` al navegador.
  3. En 10 segundos te entrega un link permanente gratuito: `https://palaversich-ventas.netlify.app`.

- **En Vercel:**
  1. Entra a [vercel.com](https://vercel.com) con tu cuenta de GitHub.
  2. Importa el repositorio de la Nota de Venta.
  3. Haz clic en **Deploy**.
  4. Te dará un enlace permanente con HTTPS y CDN mundial: `https://palaversich-ventas.vercel.app`.
