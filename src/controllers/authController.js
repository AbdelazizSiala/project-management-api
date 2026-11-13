const User = require('../models/User');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const { nom, login, password } = req.body;

        const existingUser = await User.findOne({ login });

        if (existingUser) {
            return res.status(409).json({
                message: 'This login is already taken.'
            });
        }

        /*Na3mlo hash lel password 9bal ma n7otouh fel database
        (nbadloh b set mt3 characters m3ndhom 7ta sila bel original password
        bech ken saret attack 3l database, el hacker mynjmsh yreversi el password bel sehel)
        */
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            nom,
            login,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                id: user._id,
                nom: user.nom,
                login: user.login,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Registration failed.',
            error: error.message
        });
    }
};

module.exports = { register };