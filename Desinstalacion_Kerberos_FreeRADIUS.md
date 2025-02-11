## 🗑️ Desinstalación de FreeRADIUS

# 1️⃣ Eliminar el paquete Kerberos

```bash
    brew uninstall krb5
```
# 2️⃣ Eliminar archivos de configuración de Kerberos

```bash
    sudo rm -rf /etc/krb5.conf
    sudo rm -rf /var/krb5kdc
```

# 3️⃣ Eliminar variables de entorno (si las configuraste)

Si agregaste Kerberos al PATH,  edita ~/.zshrc o ~/.bashrc y elimina esta línea:

```plaintext 
      export PATH="/usr/local/opt/krb5/bin:$PATH
```
Luego, ejecuta:

```bash
    source ~/.zshrc
```


## 🗑️ Desinstalación de FreeRADIUS

# 1️⃣ Eliminar el paquete FreeRADIUS

```bash
    brew uninstall freeradius-server
```
# 2️⃣ Eliminar archivos de configuración de FreeRADIUS

```bash
    sudo rm -rf /usr/local/etc/raddb
    sudo rm -rf /usr/local/var/log/radius
```


## 🗑️ Desinstalación de Dependencias en Node.js 

NOTA: **(OPCIONAL SOLO SI VAS A REUTILIZAR EL PROYECTO PARA OTRA COSA, LO RECOMENDADO SERIA CREAR UNO NUEVO Y ELIMINAR LOS ARCHIVOS EXISTENTES)**


Si instalaste Kerberos y RADIUS en un proyecto Node.js, elimínalos con:

```npm
  npm uninstall kerberos radius
```

Si ya no necesitas el proyecto, simplemente elimina la carpeta:

```bash
  rm -rf /ruta/del/proyecto
```

# ♻️ Verificación de la Desinstalación
Para asegurarte de que no quedan rastros:

```bash
which kinit     # Si no está instalado, no debería devolver una ruta
which radiusd   # Si no está instalado, no debería devolver una ruta

```
**Después de estos pasos, Kerberos y FreeRADIUS estarán completamente eliminados de tu sistema. 🚀**
