# Fixing Google Login "Invalid Path" Error

Yes, you need to change a setting in Supabase! This error happens when the URL your app is trying to redirect to isn't on the "Safe List" in your Supabase project.

## Steps to Fix

1.  Go to your **Supabase Dashboard** for this project.
2.  Click on the **Authentication** icon (on the left sidebar).
3.  Click on **URL Configuration** (in the submenu).
4.  Look at the **Redirect URLs** section.
5.  You need to add the exact URL you are running the app on.
    *   If you are on localhost, add: `http://localhost:3000/` (and maybe `http://localhost:3000` just to be safe).
    *   If you have a deployed Vercel URL, add that too (e.g., `https://kashmiri-idioms-2.vercel.app/`).
    *   **Crucially**: Ensure you include the trailing slash if your code uses it, or use a wildcard like `http://localhost:3000/**`.
6.  Click **Save**.

## What about the "ERR_BLOCKED_BY_CLIENT"?
Those console errors are just your browser (or an ad blocker) blocking Google's tracking scripts. They are annoying but **harmless** and are **not** the cause of login failing. You can ignore them.
