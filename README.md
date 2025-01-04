# Friend-matching app
By Viktoriia Sokolenko

This app allows signed-up university students to create profiles with their information, look through the profiles of others, and save/unsave the ones they choose. They can also edit their profile information.

I used Supabase in the backend to handle authentication, authorization, and database operations. I created custom REST endpoints with Node.js and Express so that the front end communicates with these APIs instead of interacting directly with Supabase. I also used Supabase's row-level security (RLS) to enforce various permissions at the database level.
