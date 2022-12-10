import { NextApiRequest, NextApiResponse } from 'next';
import S3 from 'aws-sdk/clients/s3';

async function uploadImage(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        const s3 = new S3({
            region: process.env.AWS_REGION,
            apiVersion: '2006-03-01',
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        });

        const post = s3.createPresignedPost({
            Bucket: process.env.AWS_BUCKET_NAME,
            Fields: {
                key: req.query.file,
                'Content-Type': req.query.fileType,
            },
            Expires: 60, // seconds
            Conditions: [
                ['content-length-range', 0, 1048576], // up to 1 MB
            ],
        });

        res.status(200).json(post);
    }
}

export default uploadImage;
