import express from 'express';
const authRouter = express.Router();

let authors = [
  { id: 1, name: "John Doe", email: "john@example.com", bio: "Tech writer", createdAt: new Date('2024-01-15').toISOString() },
  { id: 2, name: "Jane Smith", email: "jane@example.com", bio: "Full-stack developer", createdAt: new Date('2024-01-16').toISOString() }
];

let posts = [
  { id: 1, title: "Post 1", authorId: 1 },
  { id: 2, title: "Post 2", authorId: 2 }
];

authRouter.get('/', (req, res) => {
  res.json({ success: true, data: authors });
});


authRouter.get('/:id', (req, res) => {
  const author = authors.find(a => a.id === parseInt(req.params.id));
  if (!author) return res.status(404).json({ success: false, error: 'Author not found' });
  res.json({ success: true, data: author });
});

authRouter.post('/', (req, res) => {
    const { name, email, bio } = req.body;
    if(!name || !email) {
        return res.status(400).json({
            success: false,
            error: 'Name and message are require'
        })
    };
    const newAuthor = {
        id: authors.length + 1,
        name,
        email,
        bio: bio || '',
        createdAt: new Date().toISOString()
    };
    authors.push(newAuthor);
    res.status(201).json({
        success: true,
        data: newAuthor
    })
});
authRouter.put('/:id', (req, res) => {
    const index = authors.findIndex(a => a.id === parseInt(req.params.id));
    if(index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Author not found!'
        });
    }
    const {name, email, bio } = req.body;
    if(!name || !email) {
        return res.status(400).json({
            success: false,
            error: 'name and email are require!'
        })
    };
    authors[index] = {
        ...authors[index],
        name,
        email,
        bio: bio || '',
        updatedAt: new Date().toISOString()
    };
    res.json({
        success: true,
        data: authors[index]
    })

});
authRouter.delete('/:id', (req, res) => {
    const index = authors.findIndex(a => a.id === parseInt(req.params.id));
    if(index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Author not found!'
        })
    };
    authors.splice(index, 1);
    res.json({
        success: true,
        message: 'Author deleted'
    })
});

authRouter.get('/:id/posts', (req, res) => {
  const authorId = parseInt(req.params.id);
  const author = authors.find(a => a.id === authorId);
  if (!author) return res.status(404).json({ success: false, error: 'Author not found' });
  const authorPosts = posts.filter(p => p.authorId === authorId);
  res.json({ 
    success: true,
    author: author.name, 
    count: authorPosts.length, 
    data: authorPosts 
  });
});

export default authRouter;