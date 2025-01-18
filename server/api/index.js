const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const allowedOrigins = ['http://localhost:3000', 'https://friend-matching-lyart.vercel.app','https://friend-matching-viktoriia-sokolenkos-projects.vercel.app'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
        try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        if (!data.session) throw new Error("Invalid credentials");
        res.status(200).json({ token: data.session.access_token, userId: data.user.id });
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
        if (error) throw error;
        if (!data.user) throw new Error("Registration failed");
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
app.get('/api/users', checkAuth, async (req, res) => {
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
app.get('/api/users/profiles', checkAuth, async (req, res) => {
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
                    date_of_birth,
                    interests,
                    rankings
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
app.get('/api/users/profiles/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
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
                date_of_birth,
                contact_info,
                interests,
                rankings
            )
        `)
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
app.delete('/api/users/profiles/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('user_profiles')
            .delete()
            .eq('user_id', id);

        if (error) {
            throw error;
        }
        res.status(200).send('Profile successfully deleted');
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).send('Server Error');
    }
});
app.post('/api/users/profiles', checkAuth, async (req, res) => {
    const { user_id, bio, major, year, dateOfBirth, contactInfo, interests, rankings } = req.body;
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .insert([
                {
                    user_id,
                    bio,
                    major,
                    year,
                    date_of_birth: dateOfBirth,
                    contact_info: contactInfo,
                    interests,
                    rankings
                }
            ])
            .single();

        if (error) {
            throw error;
        }

        res.status(201).json({
            message: "Profile created successfully",
            data
        });
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).send('Server Error');
    }
});
app.patch('/api/users/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    try {
        const { data, error } = await supabase
            .from('users')
            .update({
                first_name: firstName,
                last_name: lastName
            })
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }
        res.json({ message: "Profile updated successfully", data });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server Error');
    }
});
app.patch('/api/profiles/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { bio, major, year, dateOfBirth, contactInfo, interests, rankings } = req.body;
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .update({
                bio,
                major,
                year,
                date_of_birth: dateOfBirth,
                contact_info: contactInfo,
                interests,
                rankings
            })
            .eq('user_id', id)
            .single();

        if (error) {
            throw error;
        }
        res.json({ message: "Profile updated successfully", data });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server Error');
    }
});
app.post('/api/users/saved_profiles', checkAuth, async (req, res) => {
    const { saved_id, user_id } = req.body;
    try {
        const { data, error } = await supabase
          .from('saved_profiles')
          .insert([
            {
              user_id,
              saved_id
            }
          ]);
  
        if (error) {
          throw error;
        }
        res.status(201).json({ message: 'Profile saved successfully', data });
    } catch (error) {
        res.status(500).send('Server Error');
    }
  });
  app.get('/api/users/saved_profiles/:user_id', checkAuth, async (req, res) => {
    const { user_id } = req.params;
    try {
        const { data, error } = await supabase
          .from('saved_profiles')
          .select(`
            saved_id,
            users: saved_id (
                first_name,
                last_name,
                email,
                user_profiles (
                bio,
                major,
                year,
                date_of_birth,
                contact_info,
                interests,
                rankings
                )
            )
          `)
          .eq('user_id', user_id)
        if (error) {
            console.error('Supabase error:', error); 
            throw error;
        }
        res.json(data);
    } catch (error) {
        console.error('Error getting saved profiles:', error);
        res.status(500).send('Server Error');
    }
  });
app.delete('/api/users/saved_profiles/', checkAuth, async (req, res) => {
    const { saved_id, user_id } = req.body;
    try {
        const { data, error } = await supabase
        .from('saved_profiles')
        .delete()
        .eq('saved_id', saved_id)
        .eq('user_id', user_id)
        if (error) throw error;
        res.json({ message: 'Profile deleted successfully', data });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});
module.exports = app;