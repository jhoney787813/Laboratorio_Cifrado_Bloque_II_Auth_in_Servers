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