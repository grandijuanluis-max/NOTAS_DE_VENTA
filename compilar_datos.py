import os
import struct
import json
import csv
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data_presea")

CLIENTES_DBI = os.path.join(DATA_DIR, "CLIENTESPA.DBI")
PRODUCTOS_DBI = os.path.join(DATA_DIR, "PRODUCTOSPA.DBI")
CONDICIONES_DBI = os.path.join(DATA_DIR, "CONDICIONES.DBI")
PRECIOS_CSV = os.path.join(DATA_DIR, "precios_lista_unic_20260814_200008.csv")
STOCK_CSV = os.path.join(DATA_DIR, "stock_20260812_200010.csv")

def read_dbf_records(filepath, fields_to_extract=None):
    if not os.path.exists(filepath):
        print(f"Archivo no encontrado: {filepath}")
        return []
        
    try:
        with open(filepath, 'rb') as f:
            header = f.read(32)
            if len(header) < 32:
                return []
            sig, yy, mm, dd, num_records, header_size, record_len = struct.unpack('<BBBBIHH', header[:12])
            
            fields = []
            while True:
                next_byte = f.read(1)
                if not next_byte or next_byte == b'\x0d':
                    break
                field_data = next_byte + f.read(31)
                if len(field_data) < 32:
                    break
                field_name = field_data[:11].strip(b'\x00').decode('ascii', errors='ignore').strip()
                field_type = chr(field_data[11])
                field_length = field_data[16]
                fields.append({'name': field_name, 'type': field_type, 'length': field_length})
                
            offsets = {}
            curr = 1
            for field in fields:
                offsets[field['name']] = (curr, field['length'], field['type'])
                curr += field['length']
                
            if fields_to_extract:
                ranges = {name: (offsets[name][0], offsets[name][0]+offsets[name][1], offsets[name][2]) 
                          for name in fields_to_extract if name in offsets}
            else:
                ranges = {field['name']: (offsets[field['name']][0], offsets[field['name']][0]+offsets[field['name']][1], offsets[field['name']][2]) 
                          for field in fields}
                          
            f.seek(header_size)
            data = f.read()
            records = []
            ptr = 0
            while ptr + record_len <= len(data):
                rec_bytes = data[ptr:ptr+record_len]
                ptr += record_len
                if rec_bytes[0] == 42: # Borrado
                    continue
                row = {}
                for name, (start, end, ftype) in ranges.items():
                    val = rec_bytes[start:end].decode('latin-1', errors='ignore').strip()
                    row[name] = val
                records.append(row)
            return records
    except Exception as e:
        print(f"Error leyendo {filepath}: {e}")
        return []

def compilar():
    print("🚀 Compilando datos de Palaversich (Presea)...")
    t0 = time.time()
    
    # 1. Precios de lista CSV
    precios_map = {}
    if os.path.exists(PRECIOS_CSV):
        with open(PRECIOS_CSV, 'r', encoding='latin-1') as f:
            reader = csv.reader(f, delimiter=';')
            try:
                next(reader)
                for r in reader:
                    if len(r) >= 5 and r[0].strip():
                        cod = r[0].strip()
                        try:
                            p = float(r[4].replace(',', '.'))
                            if cod not in precios_map or p > precios_map[cod]:
                                precios_map[cod] = p
                        except:
                            pass
            except Exception as e:
                print(f"Aviso leyendo precios CSV: {e}")
    print(f"Precios de lista cargados: {len(precios_map)}")

    # 2. Stock actualizado CSV
    stock_csv_map = {}
    if os.path.exists(STOCK_CSV):
        with open(STOCK_CSV, 'r', encoding='latin-1') as f:
            reader = csv.reader(f, delimiter=';')
            try:
                next(reader)
                for r in reader:
                    if len(r) >= 3 and r[0].strip():
                        cod = r[0].strip()
                        try:
                            st = float(r[2].replace(',', '.'))
                            stock_csv_map[cod] = st
                        except:
                            pass
            except Exception as e:
                print(f"Aviso leyendo stock CSV: {e}")
    print(f"Stock CSV cargado: {len(stock_csv_map)}")

    # 3. Condiciones de Venta
    cond_records = read_dbf_records(CONDICIONES_DBI, ['CODIGO', 'NOMBRE', 'DIAS', 'DESCUENTO', 'RECARGO'])
    condiciones_out = []
    for c in cond_records:
        if not c.get('NOMBRE'):
            continue
        try:
            dias = int(c.get('DIAS') or 0)
        except:
            dias = 0
        condiciones_out.append({
            'codigo': c['CODIGO'],
            'nombre': c['NOMBRE'].strip(),
            'dias': dias,
            'descuento': float(c.get('DESCUENTO') or 0.0),
            'recargo': float(c.get('RECARGO') or 0.0)
        })
    condiciones_out.sort(key=lambda x: int(x['codigo']) if x['codigo'].isdigit() else 999)

    # 4. Clientes Palaversich
    clientes_records = read_dbf_records(CLIENTES_DBI, [
        'CODIGO', 'NOMBRE', 'N_FANTASIA', 'CUIT', 'DOMICILIO', 'LOCALIDAD', 'TELEFONO', 'TRANSPORTE', 'VENDEDOR'
    ])
    clientes_out = []
    for cl in clientes_records:
        nombre = cl.get('NOMBRE', '').strip()
        codigo = cl.get('CODIGO', '').strip()
        if not nombre and not codigo:
            continue
        cuit = cl.get('CUIT', '').strip()
        if cuit == '0':
            cuit = ''
        nombre_display = nombre if nombre else f"CLIENTE {codigo}"
        display_id = f"{nombre_display} - {cuit}" if cuit else nombre_display

        clientes_out.append({
            'id': display_id,
            'codigo': codigo,
            'nombre': nombre_display,
            'fantasia': cl.get('N_FANTASIA', '').strip(),
            'cuit': cuit,
            'domicilio': cl.get('DOMICILIO', '').strip(),
            'localidad': cl.get('LOCALIDAD', '').strip(),
            'telefono': cl.get('TELEFONO', '').strip(),
            'transporte': cl.get('TRANSPORTE', '').strip(),
            'vendedor': cl.get('VENDEDOR', '').strip()
        })
    clientes_out.sort(key=lambda x: x['nombre'])

    # 5. Productos Palaversich (Stock & Precios)
    prod_records = read_dbf_records(PRODUCTOS_DBI, [
        'CODIGO', 'DETALLE', 'RUBRO', 'SUBRUBRO', 'PRE_VENTA', 'PRECIO_0', 'ULT_PRECIO', 'COSTO', 'STOCK', 'IVA', 'COD_ALFA', 'COD_BARRAS'
    ])
    productos_out = []
    for p in prod_records:
        codigo = p.get('CODIGO', '').strip()
        detalle = p.get('DETALLE', '').strip()
        if not codigo or not detalle:
            continue

        # Precio: 1) CSV de lista única, 2) ULT_PRECIO, 3) PRE_VENTA, 4) COSTO * 1.3
        precio = 0.0
        if codigo in precios_map:
            precio = round(precios_map[codigo], 2)
        else:
            try:
                precio = float(p.get('ULT_PRECIO') or 0.0)
            except:
                precio = 0.0
            if precio <= 0:
                try:
                    precio = float(p.get('PRE_VENTA') or 0.0)
                except:
                    precio = 0.0
            if precio <= 0:
                try:
                    costo = float(p.get('COSTO') or 0.0)
                    if costo > 0:
                        precio = round(costo * 1.35, 2)
                except:
                    precio = 0.0

        # Stock: 1) CSV de stock, 2) DBF
        stock = 0.0
        if codigo in stock_csv_map:
            stock = stock_csv_map[codigo]
        else:
            try:
                stock = float(p.get('STOCK') or 0.0)
            except:
                stock = 0.0

        try:
            iva = float(p.get('IVA') or 21.0)
        except:
            iva = 21.0

        productos_out.append({
            'codigo': codigo,
            'detalle': detalle,
            'rubro': p.get('RUBRO', '').strip(),
            'subrubro': p.get('SUBRUBRO', '').strip(),
            'precio': round(precio, 2),
            'stock': round(stock, 2),
            'iva': iva,
            'cod_alfa': p.get('COD_ALFA', '').strip(),
            'cod_barras': p.get('COD_BARRAS', '').strip()
        })
    productos_out.sort(key=lambda x: x['detalle'])

    # Guardar archivos JavaScript
    with open(os.path.join(BASE_DIR, "condiciones_db.js"), "w", encoding="utf-8") as f:
        f.write("const condicionesDB = " + json.dumps(condiciones_out, indent=2, ensure_ascii=False) + ";\n")

    with open(os.path.join(BASE_DIR, "clientes_db.js"), "w", encoding="utf-8") as f:
        f.write("const clientesDB = " + json.dumps(clientes_out, indent=2, ensure_ascii=False) + ";\n")

    with open(os.path.join(BASE_DIR, "productos_db.js"), "w", encoding="utf-8") as f:
        f.write("const productosDB = " + json.dumps(productos_out, indent=2, ensure_ascii=False) + ";\n")

    print(f"✅ Compilación exitosa en {time.time() - t0:.2f}s:")
    print(f"   - Clientes: {len(clientes_out)}")
    print(f"   - Productos: {len(productos_out)}")
    print(f"   - Condiciones de Venta: {len(condiciones_out)}")

if __name__ == "__main__":
    compilar()
