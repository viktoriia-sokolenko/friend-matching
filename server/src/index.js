const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = 3001;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// });

// pool.connect()
//   .then(() => console.log('Connected to PostgreSQL'))
//   .catch((err) => console.error('Connection error:', err));

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

app.get('/users', async (req, res) => {
    try {
        const { data, error } = await supabase
        .from('users')
        .select();
        if (error) {
            throw error;
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server Error');
    }
});
  
app.get('/allusers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).send('User not found');
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server Error');
    }
    });
app.get('/users/profiles', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select(`
                id,
                first_name,
                last_name,
                email,
                user_profiles (
                    bio,
                    major,
                    year,
                    date_of_birth
                )
            `)

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching users and profiles:', error);
        res.status(500).send('Server Error');
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    });