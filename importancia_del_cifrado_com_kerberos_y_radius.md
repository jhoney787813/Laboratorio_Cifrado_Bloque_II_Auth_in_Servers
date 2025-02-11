## 🔐 Importancia del Cifrado en Bloque en la Seguridad de Autenticación con KERBEROS y RADIUS 
El cifrado en bloque es una técnica fundamental para proteger datos sensibles en servidores de autenticación como Kerberos y RADIUS. Estos protocolos son ampliamente utilizados en entornos empresariales para gestionar accesos seguros a recursos de red, pero su seguridad depende de cómo cifran las credenciales y los mensajes de autenticación.

## 🛡️ ¿Por qué cifrar en bloque en servidores de autenticación?

Cuando se transmiten credenciales y tokens de autenticación, es crucial evitar que un atacante pueda interceptar y leer los datos. El cifrado en bloque permite:

✔ Evitar ataques de fuerza bruta: Los datos encriptados no pueden ser interpretados sin la clave correcta.

✔ Proteger la integridad de los datos: Evita modificaciones en tránsito (ataques MITM).

✔ Garantizar la confidencialidad: Las contraseñas y tokens de sesión se protegen de accesos no autorizados.

✔ Cumplimiento de normativas: Muchos estándares de seguridad (ISO 27001, GDPR, NIST) exigen cifrado robusto en comunicaciones autenticadas.

## 🔄 ¿Cómo implementan el cifrado en bloque Kerberos y RADIUS?

Ambos protocolos utilizan cifrado en bloque para proteger los datos de autenticación, pero lo hacen de maneras diferentes:

<table><thead><tr><th>Servidor</th><th>Cifrado en Bloque</th><th>Algoritmo Principal</th><th>Seguridad</th></tr></thead><tbody><tr><td><strong>Kerberos</strong></td><td>Sí</td><td>AES-256, 3DES</td><td>Alto</td></tr><tr><td><strong>RADIUS</strong></td><td>Sí (solo en contraseñas)</td><td>MD5 (débil), AES-256 (extensiones)</td><td>Medio</td></tr></tbody></table>
