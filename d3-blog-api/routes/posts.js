import express from 'express';
const postsRouter = express.Router();
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

postsRouter.get('/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if(index === -1) {
    return res.status(404).json({
      success: false,
      error: 'post not found'
    })
  };
  res.json({
    success: true,
    data: posts[index]
  })
});

postsRouter.post('/', (req, res) => {
  const { title, content, slug, authorId, categoryId, published } = req.body;
  if (!title || !content || !slug) {
    return res.status(400).json({
      success: false,
      error: 'title, content, and slug are required!'
    });
  }

  const slugExists = posts.some(p => p.slug === slug);
  if (slugExists) {
    return res.status(409).json({
      success: false,
      error: 'A post with this slug already exists'
    });
  }

  if (categoryId) {
    const categoryExists = categories.find(c => c.id === categoryId);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }
  }

  const newPost = {
    id: posts.length + 1,
    title,
    slug,
    content,
    authorId: authorId || null,
    categoryId: categoryId || null,
    published: published ?? false,   
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  posts.push(newPost);

  res.status(201).json({
    success: true,
    data: newPost
  });
});

postsRouter.put('/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if(index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Post not found!'
    })
  };

  const { title, content, slug, authorId, categoryId, published } = req.body;
  if(!title || !content || !slug) {
    return res.status(400).json({
      success: false,
      error: 'title and content and slug are require!'
    })
  }
  if(slug !== posts[index].slug) {
    const slugExists = posts.some(p => p.slug === slug && p.id !== parseInt(req.params.id));
    if(slugExists) {
      return res.status(409).json({
        success: false,
        error: 'A post with this slug already exists'
      })
    }
  }
  if(categoryId) {
    const catagoryExists = categories.find(c => c.id === categoryId);
    if(!catagoryExists) {
      return res.status(400).json({
        success: false,
        error: 'Catagory not found!'
      })
    }
  };

  posts[index] = {
    ...posts[index],
    title,
    content,
    slug,
    authorId: authorId || null,
    categoryId: categoryId || null,
    published: published ?? false,
    updatedAt: new Date().toISOString()
  }
  res.json({
    success: true,
    data: posts[index]
  })
});

postsRouter.delete('/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if(index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Post not foune!'
    })
  };
  posts.splice(index, 1);
  res.json({
    success: true,
    message: 'Post has delete!'
  })
})
postsRouter.get('/', (req, res) => {
  let result = [...posts];

if (req.query.category) {
  const matchedCategories = categories.filter(c =>
    c.slug === req.query.category || 
    c.name.toLowerCase() === req.query.category.toLowerCase()
  );
  const categoryIds = matchedCategories.map(c => c.id);
  result = result.filter(p => categoryIds.includes(p.categoryId)); 
}

  if (req.query.authorId) {
    result = result.filter(p => p.authorId === parseInt(req.query.authorId));
  }

  if (req.query.published === 'true' || req.query.published === 'false') {
    const isPublished = req.query.published === 'true';
    result = result.filter(p => p.published === isPublished);
  }

  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.content.toLowerCase().includes(searchTerm)
    );
  }

  if (req.query.sort) {
    const allowedFields = ['title', 'createdAt', 'updatedAt', 'id'];
    const sortField = req.query.sort.replace('-', '');

    if (!allowedFields.includes(sortField)) {
      return res.status(400).json({
        success: false,
        error: `Invalid sort field. Allowed fields: ${allowedFields.join(', ')}`
      });
    }

    const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const paginatedResults = result.slice(startIndex, startIndex + limit);

  res.json({
    success: true,
    count: paginatedResults.length,
    total: result.length,
    page,
    totalPages: Math.ceil(result.length / limit),
    data: paginatedResults
  });
});

export default postsRouter;
