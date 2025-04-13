import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { SocialIcon } from 'react-social-icons';

export default function SocialMediaFeed() {
  const [posts, setPosts] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialMediaPosts();
  }, []);

  const fetchSocialMediaPosts = async () => {
    try {
      const response = await fetch('/api/social-media/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching social media posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Social Media Listings</h2>

      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b mb-6">
          {['Twitter', 'LinkedIn', 'Instagram', 'Facebook'].map((platform) => (
            <Tab
              key={platform}
              className={({ selected }) =>
                `py-2 px-4 text-sm font-medium focus:outline-none ${
                  selected
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <div className="flex items-center space-x-2">
                <SocialIcon
                  network={platform.toLowerCase()}
                  style={{ height: 20, width: 20 }}
                />
                <span>{platform}</span>
              </div>
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {Object.entries(posts).map(([platform, platformPosts]: [string, any]) => (
            <Tab.Panel key={platform}>
              <div className="space-y-4">
                {platformPosts?.map((post: any) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.author.profileImage}
                          alt={post.author.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{post.author.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button className="text-primary hover:text-blue-700 transition">
                        Import
                      </button>
                    </div>

                    <p className="mt-3">{post.content}</p>

                    {post.media && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {post.media.map((media: any) => (
                          <img
                            key={media.url}
                            src={media.url}
                            alt="Property"
                            className="rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
