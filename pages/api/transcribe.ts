import { NextApiRequest, NextApiResponse } from 'next';
import { Client, handle_file } from "@gradio/client";
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

                        // Direct fetch to Gradio API (more robust for Node.js uploads)
                        // Gradio API requires specific payload structure
                        // For audio input, we often send the file as a base64 or via upload endpoint
                        // But easiest with Client is to let it handle it, IF it doesn't disconnect.
                        // Since Client is failing, let's try increasing timeout or using 'handle_file' utility if available.
                        // Actually, let's simply retry the Client connection with a lighter approach.

                        // Alternative: Use the fallback HF Inference API which we know works? 
                        // No, the user wants to use their custom Space.

                        // Let's try to just read the file and send it as a base64 data URI
                        // This avoids the multipart streaming issues often seen in Node->Gradio

                        console.log('5. Connecting to HF Space...');
                        const app = await Client.connect("helpsulaiman/kashmiri-asr-api");

                        // Read file buffer
                        const audioBuffer = fs.readFileSync(audioFile.filepath);
                        const mimeType = audioFile.mimetype || 'audio/webm';

                        console.log('------------------------------------------------');
                        console.log('AUDIO UPLOAD DEBUG:');
                        console.log('1. File Path:', audioFile.filepath);
                        console.log('2. File Size:', audioFile.size, 'bytes');
                        console.log('3. Mime Type:', mimeType);
                        console.log('4. Buffer Size:', audioBuffer.length);
                        console.log('------------------------------------------------');

                        const audioBlob = new Blob([audioBuffer], { type: mimeType });

                        console.log('6. Sending prediction request to endpoint 0...');
                        // Use index 0 as it's the safest way to target the default Interface function
                        const prediction = await app.predict(0, [
                            handle_file(audioBlob)
                        ]);

                        console.log('Cloud Response:', prediction.data);
                        const responseData = prediction.data as any[];
                        const transcription = responseData[0];

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
