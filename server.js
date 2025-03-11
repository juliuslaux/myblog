const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(express.static(path.join(__dirname, 'public')));

const posts = {
    '1': {
        title: 'Do things that dont scale',
        slug: 'do-things-that-dont-scale',
        content: 'How well you are doing a few months later will depend more on how happy you made those initial users than how many there were of them',
        date: 'March 9, 2025'
    },
    '2': {
        title: 'How to get Startup Ideas',
        slug: 'how-to-get-startup-ideas',
        content: 'But if you want to find startup ideas, you might do better to get a summer job in some unrelated field.',
        date: 'March 9, 2025'
    },
    '3': {
        title: 'How to get addicted to studying',
        slug: 'how-to-get-addicted-to-studying',
        content: `
    Addiction is characterized by persistent changes in the reward circuitry.

    **How to Build a Rewarding and Consistent Study Habit**

    **Use a Habit Loop:** 
    - **Cue:** Choose a consistent cue to start studying (e.g., a specific time, place, or action).
    - **Routine:** Perform your study session.
    - **Reward:** Give yourself a small reward after studying.

    **Consistency Beats Intensity:** 
    - Study a bit every day.
    - Set small, attainable goals to ensure frequent wins.

    **Apply the Pomodoro Technique:** 
    - Work for 25 minutes, then take a 5-minute break.
    - Helps overcome the "pain" of starting a hard task.

    **Leverage Interest and Curiosity:** 
    - Find aspects of your study material that spark curiosity.
    - Connect concepts to real-world applications.

    **Minimize Distractions:** 
    - Reduce high-dopamine distractions in your study environment.
    - Do low-dopamine tasks before indulging in easy pleasures.

    **Make Studying Social:** 
    - Study with friends or join a study group.
    - Share your study goals for accountability.

    **Take Care of Your Brain and Body:** 
    - Prioritize sleep, exercise, and breaks.
    - Use focused and diffuse modes of thinking.

    **Track Progress and Celebrate Milestones:** 
    - Use a habit tracker to mark study days.
    - Celebrate milestones to reinforce positive outcomes.
`,
        date: 'March X, 2025'
    },
    '4': {
        title: 'All things growth',
        slug: 'all-things-growth',
        content: 'Content will follow',
        date: 'March X, 2025'
    }
};

const slugToId = {};
Object.keys(posts).forEach(id => {
    slugToId[posts[id].slug] = id;
});

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/blog/:slug', (req, res) => {
    const slug = req.params.slug;
    const postId = slugToId[slug];
    
    if (postId) {
        const post = posts[postId];
        res.render('post', { post, postId, posts });
    } else {
        res.status(404).render('404', { message: 'Post or Page not found', posts });
    }
});

app.use((req, res) => {
    res.status(404).render('404', { message: 'Post or Page not found', posts });
});

app.listen(port, () => {
    console.log(`Blog server running at http://localhost:${port}`);
});