import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (!req.session.user) {
      return res.status(401).json({error: "Not Authorized"})
  }
  
  switch (req.method) {
    case 'POST':
      try {
        const addBook = JSON.parse(req.body)
        const addedBook = await db.book.add(req.session.user.id, addBook)

        if (addedBook === null) {
          req.session.destroy();
          return res.status(401).json({error: "Not Authorized"})
        }
        return res.status(200).json(addBook)
      } catch (error) {
        return res.status(400).json({ error: error.message })
      }

    case 'DELETE':
      try {
          const deleteBook = JSON.parse(req.body)
          const deletedBook = await db.book.remove(req.session.user.id, deleteBook.id)

          if (deletedBook === null) {
            req.session.destroy()
            return res.status(401).json({error:"Not Authorized"})
          }

          return res.status(200).json(deleteBook)
      }
      catch(error) {
        return res.status(400).json({ error: error.message })
      }
    default:
      return res.status(404).end()

  }
  },
  sessionOptions
)