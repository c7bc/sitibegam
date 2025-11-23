// components/BlogGrid.tsx
import BlogPostCard from './blog-post-card';

interface BlogPost {
  id: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  readTime: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  link: string;
}

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2">
      {posts.map((post, index) => (
        <BlogPostCard key={post.id} post={post} featured={index === 0} />
      ))}
    </ul>
  );
}