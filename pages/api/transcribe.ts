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
                    // Spawn Python process
                    const pythonScript = path.join(process.cwd(), 'model', 'inference.py');

                    // Check if python script exists
                    if (!fs.existsSync(pythonScript)) {
                        fs.unlinkSync(audioPath);
                        res.status(500).json({ error: 'Inference script not found' });
                        return resolve(null);
                    }

                    const pythonProcess = spawn('python3', [pythonScript, audioPath]);

                    let resultString = '';
                    let errorString = '';

                    pythonProcess.stdout.on('data', (data) => {
                        resultString += data.toString();
                    });

                    pythonProcess.stderr.on('data', (data) => {
                        errorString += data.toString();
                    });

                    pythonProcess.on('close', (code) => {
                        fs.unlinkSync(audioPath);

                        if (code !== 0) {
                            console.error('Python script error:', errorString);
                            res.status(500).json({ error: 'Transcription failed', details: errorString });
                            return resolve(null);
                        }

                        try {
                            console.log('Raw Python Output:', resultString);
                            const result = JSON.parse(resultString);
                            res.status(200).json(result);
                            resolve(null);
                        } catch (e) {
                            console.error('Parse error:', e, 'Raw:', resultString);
                            res.status(500).json({ error: 'Invalid response from model', details: resultString });
                            resolve(null);
                        }
                    });

                } catch (error) {
                    console.error('Processing error:', error);
                    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
                    res.status(500).json({ error: 'Internal server error' });
                    resolve(null);
                }
            });
        });
    };

    await parseForm();
}
