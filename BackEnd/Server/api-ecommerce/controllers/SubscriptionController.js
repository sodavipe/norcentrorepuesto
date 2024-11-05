// newsletterController.js
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'frank3000100@gmail.com', // Cambia por tu email
        pass: 'qjbddapiqjzznhzv' // Cambia por tu contraseña o contraseña de aplicación
    }
}));

export const subscribeToNewsletter = async (req, res) => {
    const { email } = req.body;

    // **Opciones del correo**
    const mailOptions = {
        from: 'frank3000100@gmail.com',
        to: email,
        subject: 'Bienvenido a nuestro Boletín',
        text: '¡Gracias por suscribirte a nuestro boletín! Recibirás actualizaciones semanales.'
    };

    // **Enviar el correo**
    try {
        await transporter.sendMail(mailOptions);
        // Enviar una respuesta JSON
        res.status(200).json({ message: 'Suscripción exitosa. Revisa tu correo para confirmar.' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        // Enviar una respuesta JSON en caso de error
        res.status(500).json({ message: 'Error al enviar el correo.' });
    }
};
