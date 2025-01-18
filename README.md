# Friend-matching app
By Viktoriia Sokolenko

You can check it out <a href='https://friend-matching-viktoriia-sokolenkos-projects.vercel.app/'> here</a>!

This app allows signed-up university students to connect with other students based on their shared interests. Users can create and delete profiles and edit their bio information. They can also look through the profiles of others, view their bios and interest match scores, and save/unsave the ones they choose.

I used Supabase in the backend to handle authentication, authorization, and database operations. I created custom REST endpoints with Node.js and Express so that the front end communicates with these APIs instead of interacting directly with Supabase. I also used Supabase's row-level security (RLS) to enforce various permissions at the database level.
