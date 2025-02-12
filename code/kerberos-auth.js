const kerberos = require('kerberos');

async function authenticate(username, password) {
    try {
        const client = await kerberos.initializeClient(`${username}@EMPRESA2.net`, { password });
        console.log("✅ Autenticación exitosa en Kerberos");
    } catch (err) {
        console.error("❌ Error en autenticación:", err.message);
    }
}

authenticate("usuario", "contraseñaCorrecta");