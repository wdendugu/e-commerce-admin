import clientPromise from "@/lib/mongodb"
import { Product } from "@/models/Product"
import moongose from "mongoose"

export default async function handle(req, res) {
    const {method}= req
    moongose.Promise = clientPromise
    if (method === "POST") {
      const {title,description, price} = req.body
      const productDoc = await Product.create({
        title,description, price
      })
      res.json(productDoc)
    }
  }
  