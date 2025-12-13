import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';
import os from 'os';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const tmpDir = os.tmpdir(); // Use system temp directory

        const form = formidable({
            uploadDir: tmpDir,
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024, // 10MB limit
            filename: (name, ext, part, form) => {
                // Ensure we respect the extension sent by the browser
                const finalExt = ext || '.webm';
                return `audio_${Date.now()}_${Math.random().toString(36).substring(7)}${finalExt}`;
            }
        });

        const parseForm = () => {
            return new Promise((resolve, reject) => {
                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        console.error('Formidable Error:', err);
                        res.status(500).json({ error: 'Upload failed', details: err.message });
                        return resolve(null);
                    }

                    const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio;
                    if (!audioFile) {
                        res.status(400).json({ error: 'No audio file provided' });
                        return resolve(null);
                    }

                    console.log('Audio received:', audioFile.filepath, 'Size:', audioFile.size);

                    const audioPath = audioFile.filepath;

                    try {
                        const pythonScript = path.join(process.cwd(), 'model', 'inference.py');

                        if (!fs.existsSync(pythonScript)) {
                            console.error('Script missing:', pythonScript);
                            res.status(500).json({ error: 'AI Model script not found' });
                            return resolve(null);
                        }

                        console.log('Spawning:', pythonScript);
                        const pythonProcess = spawn('python3', [pythonScript, audioPath]);

                        let resultString = '';
                        let errorString = '';

                        pythonProcess.stdout.on('data', (data) => {
                            resultString += data.toString();
                        });

                        pythonProcess.stderr.on('data', (data) => {
                            errorString += data.toString();
                            console.error('Python Stderr:', data.toString());
                        });

                        pythonProcess.on('error', (spawnErr) => {
                            console.error('Failed to spawn python:', spawnErr);
                            res.status(500).json({ error: 'Failed to start AI process', details: spawnErr.message });
                            resolve(null);
                        });

                        pythonProcess.on('close', (code) => {
                            // Cleanup only after process is done
                            try {
                                if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
                            } catch (cleanupErr) {
                                console.warn('Cleanup warning:', cleanupErr);
                            }

                            if (code !== 0) {
                                console.error('Python Exit Code:', code, 'Error:', errorString);
                                res.status(500).json({ error: 'Transcription process failed', details: errorString });
                                return resolve(null);
                            }

                            try {
                                // Sometimes python prints extra newlines
                                const jsonStart = resultString.indexOf('{');
                                const jsonEnd = resultString.lastIndexOf('}');
                                if (jsonStart === -1 || jsonEnd === -1) {
                                    throw new Error('No JSON found in output');
                                }
                                const cleanJson = resultString.substring(jsonStart, jsonEnd + 1);

                                const result = JSON.parse(cleanJson);
                                res.status(200).json(result);
                                resolve(null);
                            } catch (e: any) {
                                console.error('JSON Parse Error:', e, 'Raw Output:', resultString);
                                res.status(500).json({ error: 'Invalid model response', details: resultString });
                                resolve(null);
                            }
                        });

                    } catch (error: any) {
                        console.error('Processing logic error:', error);
                        res.status(500).json({ error: 'Internal processing error', details: error.message });
                        resolve(null);
                    }
                });
            });
        };

        await parseForm();
    } catch (globalErr: any) {
        console.error('Global API Handler Error:', globalErr);
        res.status(500).json({ error: 'Server handler crashed', details: globalErr.message });
    }
}
