# **IMPLEMENTACIÓN DE CIFRADO EN BLOQUE EN SERVIDORES DE AUTENTICACIÓN (KERBEROS, RADIUS)**

## **Universidad Politécnico Grancolombiano**  
**Especialización en Seguridad de la Información**  
**Materia:** Criptografía Asimétrica  
**Docente:** José Alfonso Valencia Rodríguez  
**Autor:** Jhon Edison Hincapié  
**Año:** 2025  

---

# **🔐 Implementación de Cifrado en Bloque en Servidores de Autenticación en macOS**  

## **📌 Introducción**  
En este laboratorio, implementaremos **cifrado en bloque** en servidores de autenticación **(Kerberos y RADIUS con EAP-TLS)** en macOS. También se integrará **Node.js** para probar la autenticación en estos sistemas.  

[-> Ver Porque Cifrar en bloque Kerberos y Radius ](https://github.com/jhoney787813/Laboratorio_Cifrado_Bloque_II_Auth_in_Servers/blob/main/importancia_del_cifrado_com_kerberos_y_radius.md)

---

## 🎯 Objetivos

✔ Configurar Kerberos con cifrado AES-256.

✔ Configurar FreeRADIUS con cifrado en bloque AES.

✔ Integrar Node.js para autenticación en Kerberos y RADIUS.

✔ Realizar pruebas de autenticación desde Node.js.


# **📖 Definición de los Métodos de Autenticación**  

## **🔹 Kerberos**  
Es un protocolo de autenticación basado en un modelo de confianza centralizado que utiliza **tickets cifrados** para autenticar usuarios sin transmitir credenciales en texto claro. Su principal ventaja es el uso de **cifrado simétrico (AES-256)** y la reducción de exposición de contraseñas en la red.  

## **🔹 RADIUS (Remote Authentication Dial-In User Service)**  
Es un protocolo de autenticación que permite validar credenciales de usuarios remotos en redes empresariales, VPNs y servicios de acceso a Internet. Utiliza **EAP-TLS** para realizar autenticación segura con certificados digitales y soporta **cifrado AES** para proteger la comunicación.  

---

# **🎯 Justificación del Uso de Cada Método**  

| Método      | Uso Recomendado | Ventajas | Desventajas |
|------------|----------------|----------|-------------|
| **Kerberos** | Entornos empresariales con dominios centralizados (Active Directory) | ✅ Seguridad con cifrado AES <br> ✅ Tickets en lugar de contraseñas | ❌ Requiere infraestructura compleja |
| **RADIUS** | Redes inalámbricas, VPNs, acceso remoto | ✅ Integración con múltiples sistemas <br> ✅ Soporta autenticación multifactor | ❌ Dependencia de servidores externos |  

**Recomendación:**  
- **Usar Kerberos** cuando se necesite un **control de autenticación centralizado** dentro de una organización.  
- **Usar RADIUS** para **redes empresariales, VPNs o autenticación remota** con dispositivos móviles y sistemas distribuidos.  

---

## 🛠 Requisitos Previos

**Sistema:** macOS Ventura o superior, Tambien se podría utilizar **linux** o **kali Linux**

**Software:**

*MIT Kerberos (krb5)

*FreeRADIUS

*Node.js (brew install node)

*Wireshark (opcional, para analizar tráfico)


# **📍 PARTE 1: Instalación y Configuración de Kerberos**  

## **🛠 Requisitos Previos**  
- macOS Ventura o superior  
- Instalación de paquetes necesarios con Homebrew  

### **1️⃣ Instalación de Kerberos**  
```bash
brew install krb5
echo 'export PATH="/usr/local/opt/krb5/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### **2️⃣ Configuración de Kerberos con Cifrado AES**  
Editar el archivo de configuración `/etc/krb5.conf`:  
```plaintext
[libdefaults]
    default_realm = EMPRESA.COM
    default_tkt_enctypes = aes256-cts-hmac-sha1-96
    default_tgs_enctypes = aes256-cts-hmac-sha1-96
```

### **3️⃣ Creación de Usuarios y Tickets**  
```bash
sudo kdb5_util create -s
sudo kadmin.local
addprinc admin@EMPRESA.COM
addprinc usuario@EMPRESA.COM
```
o ejecutar
```bash
        sudo /usr/local/opt/krb5/sbin/kdb5_util create -s
```
Abrir la consola de administración de Kerberos:
```bash
    sudo /usr/local/opt/krb5/sbin/kadmin.local
```
Agregar un administrador principal:

```bash
    addprinc admin@EMPRESA.COM
```
Agregar un usuario:
```bash
    addprinc usuario@EMPRESA.COM
```

🔹 Verificar que Kerberos Funciona
```bash
klist
```
```bash
    kinit usuario@EMPRESA.COM
```

### **4️⃣ Prueba de Autenticación con Node.js**  
#### ✅ Instalación de Dependencias  
```bash
npm init -y
npm install kerberos
```

#### ✅ Script para Autenticación en Kerberos (`kerberos-auth.js`)  
```javascript
const kerberos = require('kerberos');

async function authenticate(username, password) {
    try {
        const client = await kerberos.initializeClient(`${username}@EMPRESA.COM`, { password });
        console.log("✅ Autenticación exitosa en Kerberos");
    } catch (err) {
        console.error("❌ Error en autenticación:", err.message);
    }
}

authenticate("usuario", "contraseñaCorrecta");
```

Ejecutar:  
```bash
node kerberos-auth.js
```

**Salida esperada:**  
✔ `✅ Autenticación exitosa en Kerberos`  
❌ `❌ Error en autenticación: Client not found in Kerberos database`  

---

# **📍 PARTE 2: Instalación y Configuración de FreeRADIUS**  

### **1️⃣ Instalación de FreeRADIUS**  
```bash
brew install freeradius-server
```

### **2️⃣ Configuración de FreeRADIUS con AES**  
Editar `/usr/local/etc/raddb/mods-available/eap`:  
```plaintext
tls {
    cipher_list = "AES256-SHA"
}
```

### **3️⃣ Creación de Usuarios en FreeRADIUS**  
Editar `/usr/local/etc/raddb/users`:  
```plaintext
usuario Cleartext-Password := "contraseña123"
```

### **4️⃣ Prueba de Autenticación con Node.js**  
#### ✅ Instalación de Dependencias  
```bash
npm install radius
```

#### ✅ Script para Autenticación en FreeRADIUS (`radius-auth.js`)  
```javascript
const dgram = require('dgram');
const radius = require('radius');

const secret = "mysecurekey";
const user = "usuario";
const pass = "contraseña123";
const server = "127.0.0.1";
const port = 1812;

const packet = radius.encode({
    code: "Access-Request",
    secret: secret,
    attributes: [
        ["User-Name", user],
        ["User-Password", pass]
    ]
});

const client = dgram.createSocket("udp4");
client.send(packet, 0, packet.length, port, server, (err) => {
    if (err) console.error("Error:", err);
    else console.log("✅ Solicitud enviada a RADIUS");
});

client.on("message", (msg) => {
    const response = radius.decode({ packet: msg, secret: secret });
    if (response.code === "Access-Accept") {
        console.log("✅ Autenticación exitosa en RADIUS");
    } else {
        console.log("❌ Acceso denegado");
    }
    client.close();
});
```

Ejecutar:  
```bash
node radius-auth.js
```

**Salida esperada:**  
✔ `✅ Autenticación exitosa en RADIUS`  
❌ `❌ Acceso denegado`  

---

## **📍 PARTE 3: Verificación del Cifrado con Wireshark**  

🛠️ Instalación de Wireshark en macOS
Wireshark es una herramienta de análisis de tráfico de red que nos permitirá verificar si los datos están cifrados en la comunicación con Kerberos y RADIUS.

📌 1️⃣ Instalación con Homebrew
La forma más sencilla de instalar Wireshark en macOS es utilizando Homebrew.

📌 2️⃣ Habilitar Captura de Paquetes sin Privilegios de Root
Por defecto, en macOS, Wireshark necesita permisos de superusuario para capturar paquetes en interfaces de red. Para evitar esto, ejecuta:
 ```bash
sudo chmod +x /Applications/Wireshark.app/Contents/MacOS/dumpcap
sudo chown root:admin /Applications/Wireshark.app/Contents/MacOS/dumpcap
sudo chmod 755 /Applications/Wireshark.app/Contents/MacOS/dumpcap
sudo chmod u+s /Applications/Wireshark.app/Contents/MacOS/dumpcap
 ```
🔹 Verifica que funciona sin sudo:

 ```bash
        ls -l /Applications/Wireshark.app/Contents/MacOS/dumpcap
 ```
Debe mostrar permisos como:
 ```bash
        -rwsr-xr-x.
 ```
```plaintext
    brew install --cask wireshark
 ```
🔹 Verifica la instalación:
```plaintext
        wireshark --version
 ```
📌 3️⃣ Ejecutar Wireshark
Para abrir Wireshark, puedes ejecutar:

 ```bash
       open /Applications/Wireshark.app
 ```
O simplemente buscar "Wireshark" en Spotlight (Cmd + Espacio y escribir "Wireshark").

📌 4️⃣ Capturar Tráfico de Kerberos y RADIUS
Abrir Wireshark.
Seleccionar la interfaz de red (Wi-Fi o Ethernet).
Usar los siguientes filtros para capturar solo tráfico relevante:
## Kerberos:
  ```plaintext
           kerberos 
   ```
## RADIUS:
 ```plaintext
       radius
  ``` 
2. Aplicar filtroS MULTIPLES para autenticación:  
   ```plaintext
   kerberos || radius
   ```
3. **Verificar que los datos están cifrados con AES**.  

---

# **📌 Conclusiones**  
✔ **Kerberos** protege credenciales con **AES-256**, previniendo ataques de intermediario.  
✔ **RADIUS** permite autenticación remota con cifrado AES seguro.  
✔ **Node.js** facilita la integración de autenticación en sistemas modernos.  
✔ **Los resultados demuestran autenticación segura y tráfico cifrado.**  
✔ Las pruebas exitosas y fallidas validan la seguridad de la configuración.

🚀 **Este laboratorio proporciona una guía práctica para implementar servidores de autenticación con cifrado en bloque en utilizando Node.js para autenticación en servidores de seguridad.**  

## 🔐 ¡Laboratorio completado! 🎉

## ¿Quieres desinstalar los servidores instalados (KERBEROS,FreeRADIUS) ?

[-> Como desintalar los servidores (KERBEROS,FreeRADIUS)](https://github.com/jhoney787813/Laboratorio_Cifrado_Bloque_II_Auth_in_Servers/blob/main/Desinstalacion_Kerberos_FreeRADIUS.md)

# 📚 Referencias

## 🔐 Cifrado en Bloque y Seguridad de Autenticación

Menezes, A. J., van Oorschot, P. C., & Vanstone, S. A. (2018). Handbook of Applied Cryptography. CRC Press.
Stallings, W. (2020). Cryptography and Network Security: Principles and Practice (8th ed.). Pearson.
Schneier, B. (2015). Applied Cryptography: Protocols, Algorithms, and Source Code in C. John Wiley & Sons.
National Institute of Standards and Technology (NIST). (2001). Advanced Encryption Standard (AES). https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf

## 🛡️ Kerberos y su implementación

Neuman, C., & Ts'o, T. (1994). Kerberos: An Authentication Service for Computer Networks. IEEE Communications Magazine, 32(9), 33–38.

MIT Kerberos Consortium. (2023). Kerberos: The Network Authentication Protocol. https://web.mit.edu/kerberos/

Microsoft. (2024). How Kerberos Authentication Works. https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview

## 📡 RADIUS y su seguridad

Rigney, C., Willens, S., Rubens, A., & Simpson, W. (2000). Remote Authentication Dial In User Service (RADIUS). RFC 2865. https://datatracker.ietf.org/doc/html/rfc2865

Open RADIUS Project. (2023). FreeRADIUS: The World's Most Popular RADIUS Server. https://freeradius.org/

Cisco Systems. (2023). RADIUS Authentication and Authorization Configuration Guide. https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_usr_rad/configuration/15-mt/sec-usr-rad-15-mt-book.html

## 🖥️ Implementación Práctica y Laboratorio en macOS

**Apple Developer.** (2024). Configuring Kerberos on macOS. https://developer.apple.com/documentation/security/configuring-kerberos-authentication

**Homebrew Documentation.** (2024). Installing FreeRADIUS on macOS. https://formulae.brew.sh/formula/freeradius-server

**Wireshark Foundation. (2023)**. Capturing and Analyzing Authentication Packets. https://www.wireshark.org/docs/

[Jhon E -> GitHub Profile](https://github.com/jhoney787813/)


