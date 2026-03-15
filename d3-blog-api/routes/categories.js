import express from 'express';
const categoriesRouter = express.Router();

let categories = [
  { id: 1, name: "Technology", slug: "technology", description: "Tech posts" },
  { id: 2, name: "Lifestyle", slug: "lifestyle", description: "Life posts" },
  { id: 3, name: "Business", slug: "business", description: "Business posts" }
];

let posts = [
  {
    id: 1,
    title: "Getting Started with Express",
    slug: "getting-started-express",
    content: "Express is a minimal web framework...",
    authorId: 1,
    categoryId: 1,
    published: true,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 2,
    title: "Advanced Express Patterns",
    slug: "advanced-express-patterns",
    content: "Let's explore advanced patterns...",
    authorId: 1,
    categoryId: 1,
    published: true,
    createdAt: new Date('2024-01-22').toISOString(),
    updatedAt: new Date('2024-01-22').toISOString()
  },
  {
    id: 3,
    title: "Work Life Balance",
    slug: "work-life-balance",
    content: "Balance is important...",
    authorId: 2,
    categoryId: 2,
    published: false,
    createdAt: new Date('2024-01-21').toISOString(),
    updatedAt: new Date('2024-01-21').toISOString()
  }
];

categoriesRouter.get('/', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

categoriesRouter.get('/:id', (req, res) => {
  const category = categories.find(c => c.id === parseInt(req.params.id));
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({
    success: true,
    data: category
  });
});


categoriesRouter.post('/', (req, res) => {
  const { name, slug, description } = req.body;
  if(!name || !slug || !description) {
    return res.status(400).json({
        success: false,
        error: 'name slung and description are require'
    });
  }
  const newCategory = {
    id: categories.length + 1,
    name,
    slug,
    description
  };
  categories.push(newCategory);
  res.status(201).json({
    success: true,
    data: newCategory
  });
});

categoriesRouter.delete('/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === parseInt(req.params.id));
  if(index === -1) {
    return res.status(404).json({
        success: false,
        error: 'catagory not found'
    })
  };
  categories.splice(index, 1);
  res.json({ message: 'Category deleted' });
});

categoriesRouter.get('/:id/posts', (req, res) => {
  const catagoryId = parseInt(req.params.id);
  const catagory = categories.find(a => a.id === catagoryId);
  if (!catagory) return res.status(404).json({ success: false, error: 'Author not found' });

  const index = posts.findIndex(p => p.id === catagoryId)
  res.json({ 
    success: true,
    data: posts[index]
  });
});
export default categoriesRouter;
