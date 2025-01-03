const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = 3001;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

app.use(express.json());

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
        res.status(500).send('Server Error');
    }
    });
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
        try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        if (!data.session) throw new Error("Invalid credentials");
        res.status(200).json({ token: data.session.access_token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
    });
app.post("/api/register", async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    try {
        const { data, error } = await supabase.auth.signUp({
        email,
        password,
        });
        if (!data.user) throw new Error("Registration failed");
        if (error) throw error;
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: data.user.id,
                    email: data.user.email,
                    first_name,
                    last_name,
                }
            ]);
        if (insertError) {
            throw insertError;
        }
        res.status(201).json({ message: "Registration successful! Please log in", user: data.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    });
const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const { data: user, error } = await supabase.auth.getUser(token);
        if (error) throw error
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
    };
app.get('/users/profiles', checkAuth, async (req, res) => {
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