const express = require('express');
const router = express.Router();
const guardrails = require('../analysis/guardrails');

router.post('/simulate', async (req, res) => {
    try {
        const { prompt, model } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const result = await guardrails.analyzePrompt(prompt);

        // Simulate a small delay for "processing" feel if it was too fast (e.g. regex hit)
        if (!process.env.OPENAI_API_KEY) {
            await new Promise(r => setTimeout(r, 800));
        }

        res.json({
            status: result.isAttack ? 'blocked' : 'success',
            logs: result.logs,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Red Team Simulation Error:', error);
        res.status(500).json({ error: 'Internal Simulator Error' });
    }
});

module.exports = router;
