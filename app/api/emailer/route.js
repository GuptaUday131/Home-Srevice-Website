import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, name, businessName, serviceDate, serviceTime, contactPerson, address } = body;

        // Validate the data
        if (!email || !businessName || !serviceDate || !serviceTime) {
            return new Response(JSON.stringify({ message: 'Missing required information' }), {
                status: 400,
            });
        }

        // Set up Nodemailer transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Define email options with detailed information
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Booking Confirmation - ' + businessName,
            text: `
                Congratulation ${name}, Your booking is confirmed!
                Service: ${businessName}
                Date: ${serviceDate}
                Time: ${serviceTime}
                Contact Person: ${contactPerson}

                Thank you for choosing Home Helper service!
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: 'Confirmation email sent!' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ message: 'Failed to send email.', error }), {
            status: 500,
        });
    }
}
