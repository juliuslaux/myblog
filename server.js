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

    **How to build a rewarding and consistent study habit aka get addicted**

    Use a habit loop: Habits form when a cue triggers a routine and is followed by a reward. To make studying automatic, deliberately set up a habit loop for it. For example, choose a consistent cue to start studying – it could be a specific time (e.g. sit at your desk at 7:00 PM every weekday), a particular place (a library corner or a clear desk), or an action (right after dinner, you open your textbook). Consistency in cues is key; our brains learn to associate the cue with the activity. Then perform your study session (that's the routine). Right after, give yourself a reward – something you enjoy that doesn't overshadow studying. This could be a small treat (like a snack you love), 10 minutes of your favorite show or game, or simply the satisfaction of checking off that task on your to-do list. Rewards work: we are "wired for rewards", so a well-chosen immediate reward can motivate your brain to repeat the routine. Even the act of crossing off a task as done can release a little dopamine and give you a sense of accomplishment, which fuels the desire to tackle the next task. Over time, as you repeat the cue-routine-reward cycle, your brain starts to anticipate the reward when the cue appears, and you'll feel a pull to start studying out of habit. Tip: make the cue obvious (an alarm, a calendar reminder, or a visual setup) and keep the reward healthy and proportional. As studying itself becomes more satisfying (through mastery or interest), you may gradually rely less on extrinsic rewards – but in the beginning, don't shy away from rewarding yourself for sticking to your plan.

    **Consistency beats intensity every time:** It's better to study a bit every day than to binge-study irregularly. Set small, attainable goals to ensure frequent wins. For example, commit to just 20–30 minutes of focused study at first if longer is intimidating. Small goals that you achieve consistently lead to dopamine releases for each success, which train your brain to enjoy progress. Psychologically, finishing a short study session successfully makes you feel good and confident, and that positive emotion gets associated with studying. You can gradually increase your study duration as the habit solidifies. Think of it like training for a marathon – you start with short runs and build up stamina. Here, you're building mental stamina. Also, try to study around the same time each day if possible; time of day can become a strong cue (e.g. your brain knows that "after lunch is study time"). Regularity helps turn actions into routine.

    **Apply the Pomodoro Technique:** One of the most recommended techniques (emphasized in "Learning How to Learn") for beating procrastination and building study focus is the Pomodoro Technique. This involves setting a timer for a short, focused period of work (traditionally 25 minutes) – a manageable chunk – and working only on the study task during that time, then giving yourself a short break as a reward. For example, you might set a 25-minute timer (one "Pomodoro") to concentrate on reading or problem-solving without distractions. Knowing you only have to last 25 minutes makes it easier to start (since it's not an indefinite slog). After the timer rings, reward yourself with a 5-minute break – stand up, stretch, check your phone briefly, grab a coffee – something you enjoy. This break is the reward phase, and it also lets your brain rest (more on rest in a moment). This method works on a neural level because it helps you overcome the "pain" of starting a hard task by promising a forthcoming reward. As Dr. Barbara Oakley explains, when we even think about something like homework, it can activate pain centers in the brain – so we tend to escape that discomfort by doing something fun (procrastinating). The Pomodoro Technique short-circuits this by (a) making the pain period short and finite and (b) associating a known reward after each session. Over time, you may find you can do longer focused sessions or that starting isn't as painful because your brain has gotten used to diving into work knowing a break is coming. Many students find that after a few Pomodoros, they get into a "flow" state and the work itself starts to feel engaging – that's a sign the habit is taking hold and intrinsic motivation is kicking in.

    **Leverage Interest and Curiosity:** A powerful way to make studying rewarding is to boost your intrinsic interest in the material. Find aspects of what you're studying that spark your curiosity or relate to your life. Ask yourself questions, try to connect concepts to real-world applications or to subjects you already enjoy. This matters because, as mentioned, curiosity triggers dopamine in the brain's reward circuit, effectively making learning itself pleasurable. For instance, if you're studying history, focus on fascinating stories or imagine you're investigating a mystery. If it's math, treat problems like puzzles or challenges to beat. Even in subjects that aren't your favorite, setting little challenges or goals ("Can I teach this concept to someone else?" , "Can I solve 5 problems in a row?") can gamify the process. Some students use learning apps or games to make study more fun. The idea is to shift from "I have to study" (external pressure) to "I'm curious what I can learn or achieve". When you manage this mental shift, studying becomes inherently more satisfying, and you'll be more likely to do it voluntarily. In short: make it a game for your brain. The more your brain sees studying as something that leads to interesting discoveries or personal achievement, the more it will reward you with positive feelings for doing it.

    **Minimize Distractions & Competing Pleasures:** One reason studying doesn't grip us like a video game or social media is that those activities are engineered to provide rapid rewards. To help your brain focus on (and enjoy) studying, reduce high-dopamine distractions in your study environment. For example, when it's time to study, put your phone on silent or in another room (or use apps that block distracting sites for a period of time). If you sit down to study but succumb to checking messages or watching videos, your brain gets the quick dopamine hit from those, which will make the textbook in front of you feel even duller by comparison. One student-focused strategy is "dopamine control": do the low-dopamine, high-effort tasks (like studying) before indulging in easy pleasures. Some productivity experts suggest starting your day with studying (or another important task) before you expose yourself to things like social media, games, or TV, which can saturate your reward system early. Treat those fun activities as rewards after you've done your focused work. By doing this, you essentially make sure that your brain's reward system isn't already "overheated" by instant gratification when you need to concentrate. Over time, you'll also prove to yourself that leisure is more enjoyable when it's truly earned guilt-free after getting work done. Additionally, create a study-friendly environment: a clean, quiet (or suitably ambient) space that signals your brain it's time to focus. If you find music helps, choose music without lyrics or use noise-cancelling headphones – whatever keeps you in the zone. A focused environment will help you get into deep work faster, where you might even hit a rewarding flow state (when you lose track of time because you're so absorbed). Achieving flow while studying is like a natural high – it can make you feel "addicted" to making progress.

    **Make Studying Social (to a Healthy Extent):** Humans are social creatures, and we get dopamine from positive social interactions too. You can harness this by studying with friends or joining a study group (in person or online) where you encourage each other. For example, agreeing on joint study times (even via a video call where each person works quietly but together) can provide a sense of accountability – the cue is set ("at 8 PM, we all log on to study") and the reward might be a short chat at break time to celebrate what you got done. Teaching each other or discussing problems can also enhance learning (the protégé effect, where teaching someone else reinforces your knowledge). Just be sure the group stays on task – it should be a positive support, not a distraction. Alternatively, simply share your study goals with a friend or parent and have them check in – the little praise or acknowledgment you get for meeting your goal can serve as a reward. Some students find motivation in apps or communities where they log study hours and gain points or streaks (turning study into a game with social recognition). These approaches tap into social reward circuits and can make the habit more enjoyable.

    **Take Care of Your Brain and Body:** A strong study habit is easier to maintain when you're physically and mentally healthy. It might sound unrelated to "motivation," but basics like adequate sleep, exercise, and breaks hugely influence how rewarding studying feels. The "Learning How to Learn" course emphasizes the importance of sleep for memory consolidation – after a solid study session, your brain literally replays and practices the material during sleep, strengthening those neural connections. When you consistently lack sleep, not only is learning harder, but everything feels more onerous (your brain's reward chemistry also gets out of whack). So, prioritize sleep as part of your study habit – think of it as part of the routine, not optional. Exercise is another booster: even a short walk or some jumping jacks during a study break can increase blood flow and mood. Exercise releases endorphins and can increase dopamine sensitivity in a healthy way, which can improve focus and mood when you return to study. Essentially, a healthy brain is a motivated brain. Also, remember the concept of focused and diffuse modes from Learning How to Learn: after intense focus, giving your mind a rest (diffuse thinking) is crucial for creativity and solving tough problems. So, schedule short breaks in your study sessions. During a break, you might do something relaxing or fun (your reward) or even just let your mind wander. This isn't procrastination; it's allowing your brain to recharge and often leads to flashes of insight. Knowing that breaks are part of the plan can make long study periods feel less daunting (because you're not grinding non-stop) and thus more sustainable day after day.

    **Track Progress and Celebrate Milestones:** We mentioned the power of small wins – take advantage of this by tracking your study habit and celebrating growth. Use a habit tracker or calendar and put an X or a sticker for each day you met your study goal. Seeing a chain of consecutive days is satisfying and you'll want to keep the streak going (a bit of gamification of your own behavior). When you reach a milestone – say 7 days in a row, or finishing a chapter or acing a practice quiz – reward yourself in a bigger way (watch a movie, treat yourself to something you've been wanting, etc.). This reinforces the idea that studying leads to positive outcomes. Psychologically, acknowledging your progress builds self-efficacy: you start to identify as "someone who studies consistently," which strengthens the habit loop at the belief level. In Charles Duhigg's habit framework, belief in the value of the habit and in your own ability to stick with it makes the loop more robust. So, take a moment to pat yourself on the back for wins – it's not frivolous, it's neuroscience! It gives your brain a hit of dopamine and serotonin (from feeling proud), making you inclined to continue.
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