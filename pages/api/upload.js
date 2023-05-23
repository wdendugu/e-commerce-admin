import multiparty from "multiparty"
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import fs from "fs"
import mime from "mime-types"
import {  isAdminRequest } from "./auth/[...nextauth]"
import {mongooseConnect} from '../../lib/mongoose'

export default async function handler(req,res) {
    await mongooseConnect()
    await isAdminRequest(req,res)
    const form = new multiparty.Form()
    const local = 'sa-east-1'
    const {fields,files} = await new Promise((resolve, reject)=> {
        form.parse(req, (err, fields, files) => {
            if (err) reject (err)
            resolve({fields,files})
        })  
    })

    const client = new S3Client({
        region: local,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    })
    const links = []
    for (const file of files.file) {
        const ext = file.originalFilename.split('.').pop()
        const newFileName= Date.now() + '.' + ext
        await client.send(new PutObjectCommand({
            Bucket: process.env.BUCKET,
            Key: newFileName,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path)
        }))
        const link = `https://${process.env.BUCKET}.s3.${local}.amazonaws.com/${newFileName}`
        links.push(link)
    }
    return res.json({links})
    }

export const config = {
    api: {bodyParser: false}
}