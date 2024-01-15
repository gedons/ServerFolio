const transporter = require('../config/EmailConfig');

exports.submitContactForm = async (req, res) => {
    const { firstname, lastname, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'admin@daeds.uk', 
        subject: 'New Contact Form Submission',
        text: `Name: ${firstname} ${lastname}\nEmail: ${email}\nMessage: ${message}`
    };

    try {        
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error occurred:', error.message);
        return res.status(500).json({ error: 'Failed to send email' });
    }
};
