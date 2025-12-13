import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from "@gradio/client";
import formidable from 'formidable';
import fs from 'fs';
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
        const tmpDir = os.tmpdir();

        const form = formidable({
            uploadDir: tmpDir,
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024, // 10MB
            filename: (name, ext, part, form) => {
                const finalExt = ext || '.webm';
                return `audio_${Date.now()}_${Math.random().toString(36).substring(7)}${finalExt}`;
            }
        });

        const parseForm = () => {
            return new Promise((resolve, reject) => {
                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        res.status(500).json({ error: 'Upload failed', details: err.message });
                        return resolve(null);
                    }

                    const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio;
                    if (!audioFile) {
                        res.status(400).json({ error: 'No audio file provided' });
                        return resolve(null);
                    }

                    try {
                        console.log('Connecting to HF Space: helpsulaiman/kashmiri-asr-api');
                        const app = await Client.connect("helpsulaiman/kashmiri-asr-api");

                        // Read file buffer
                        const audioBuffer = fs.readFileSync(audioFile.filepath);
                        const audioBlob = new Blob([audioBuffer], { type: audioFile.mimetype || 'audio/webm' });

                        console.log('Sending audio to cloud...');
                        const prediction = await app.predict("/predict", [
                            audioBlob,
                        ]);

                        console.log('Cloud Response:', prediction.data);
                        const transcription = prediction.data[0];

                        // Cleanup
                        if (fs.existsSync(audioFile.filepath)) fs.unlinkSync(audioFile.filepath);

                        res.status(200).json({
                            text: transcription,
                            status: "success",
                            source: "cloud"
                        });
                        resolve(null);

                    } catch (apiError: any) {
                        console.error('HF Space Error:', apiError);
                        // Cleanup
                        if (fs.existsSync(audioFile.filepath)) fs.unlinkSync(audioFile.filepath);

                        res.status(503).json({
                            error: 'Cloud transcription failed',
                            details: apiError.message
                        });
                        resolve(null);
                    }
                });
            });
        };

        await parseForm();

    } catch (globalErr: any) {
        console.error('API Error:', globalErr);
        res.status(500).json({ error: 'Server error', details: globalErr.message });
    }
}
