import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = formidable({
        uploadDir: path.join(process.cwd(), 'tmp'), // Ensure this exists or use os.tmpdir()
        keepExtensions: true,
        filename: (name, ext, part, form) => {
            return `audio_${Date.now()}${ext}`; // Rename to avoid collisions
        }
    });

    // Ensure tmp dir exists
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }

    const parseForm = () => {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error('Upload error:', err);
                    res.status(500).json({ error: 'Failed to upload audio' });
                    return resolve(null);
                }

                const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio;
                if (!audioFile) {
                    res.status(400).json({ error: 'No audio file provided' });
                    return resolve(null);
                }

                const audioPath = audioFile.filepath;

                try {
                    // Read file
                    const fileData = fs.readFileSync(audioPath);

                    // Hugging Face Inference API
                    const MODEL_ID = "helpsulaiman/kashmiri-wav2vec2";
                    const HF_API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;
                    const HF_TOKEN = process.env.HF_ACCESS_TOKEN;

                    if (!HF_TOKEN) {
                        throw new Error("Missing HF_ACCESS_TOKEN. Please set it in .env.local");
                    }

                    const response = await fetch(HF_API_URL, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${HF_TOKEN}`,
                            'Content-Type': 'audio/webm', // HF handles raw audio bytes usually, but we'll send the blob directly
                        },
                        body: fileData,
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('HF API Error:', errorText);

                        if (response.status === 503) {
                            throw new Error("Model is loading (Cold Boot). Please try again in 20 seconds.");
                        }

                        throw new Error(`Inference failed: ${response.status} ${response.statusText}`);
                    }

                    const result = await response.json();

                    // Cleanup upload
                    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

                    return res.status(200).json(result);

                } catch (error: any) {
                    console.error('Processing error:', error);
                    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
                    return res.status(500).json({ error: 'Transcription failed', details: error.message });
                }
            });
        });
    };

    await parseForm();
}
