require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const Joi = require('joi');
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = process.env.SENDGRID_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);

app.use(bodyParser.json());

app.post('/user/details', (req,res) => {

    const { firstname, lastname, email, phone } = req.body;

    const userSchema = Joi.object({

        firstname: Joi.string().min(3).required(),
        lastname: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(11).max(14).required()
    })

    const { value, error } = userSchema.validate(req.body);

    if(error !== undefined){
        res.status(400).json({
            status: false,
            message: error.details[0].message
        })
    }

    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL, // Use the email address or domain you verified above
        subject: 'Trying out Email Sender API',
        text: `Hello ${firstname} ${lastname}, thank you for bearing with me motherfucker.`
    };
        sgMail.send(msg)
        .then(() => {
            console.log('Email Sent')
            res.status(200).json({
                status: true,
                message: "User details successfully created"
            })
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                status: false,
                message: "Apologies, Email cannot be sent at this time. Please try again later"
            })
        });
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})