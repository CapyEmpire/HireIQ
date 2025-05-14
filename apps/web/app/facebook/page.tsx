'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import fbStyles from './styles.module.css';

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
  permalink_url?: string;
  attachments?: any;
}

export default function FacebookPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [posts, setPosts] = useState<FacebookPost[]>([]);

  // Try to load posts on initial page load
  useEffect(() => {
    fetchPostsData();
  }, []);

  const handleFetchPosts = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('http://localhost:4000/facebook/posts', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Posts retrieved and saved to: ${data.result}`);
        
        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts);
        } else {
          await fetchPostsData();
        }
      } else {
        setError(data.result || 'Failed to retrieve Facebook posts');
      }
    } catch (err) {
      setError('Error connecting to the API: ' + 
        (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchPostsData = async () => {
    try {
      const response = await fetch('http://localhost:4000/facebook/posts-data', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.posts && data.posts.length > 0) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts data:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <main className={styles.main}>
      <h1>Facebook Posts</h1>
      
      <button 
        onClick={handleFetchPosts}
        disabled={loading}
        className={styles.button}
      >
        {loading ? 'Loading...' : 'Retrieve Facebook Posts'}
      </button>
      
      {error && <div className={fbStyles.error}>{error}</div>}
      {success && <div className={fbStyles.success}>{success}</div>}
      
      {posts.length > 0 ? (
        <div className={fbStyles.postGrid}>
          {posts.map(post => (
            <div key={post.id} className={fbStyles.postCard}>
              <h2>{formatDate(post.created_time)}</h2>
              <p>{post.message || '(No message)'}</p>
              {post.permalink_url && (
                <a href={post.permalink_url} target="_blank" rel="noopener noreferrer">
                  View on Facebook
                </a>
              )}
              {post.attachments && post.attachments.data && post.attachments.data.length > 0 && (
                <div className={fbStyles.attachments}>
                  <h3>Attachments</h3>
                  {post.attachments.data.map((attachment: any, index: number) => (
                    <div key={index} className={fbStyles.attachment}>
                      {attachment.media && attachment.media.image && (
                        <img 
                          src={attachment.media.image.src} 
                          alt="Attachment" 
                          className={fbStyles.attachmentImage}
                        />
                      )}
                      {attachment.title && <p>{attachment.title}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No posts to display. Click the button above to retrieve your Facebook posts.</p>
      )}
    </main>
  );
}