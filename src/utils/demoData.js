export const demoPeople = [
  { id: 'person-1', name: 'Avery Morgan', tagline: 'Making room for the little things', color: 'coral' },
  { id: 'person-2', name: 'Jordan Lee', tagline: 'Books, walks, and good questions', color: 'blue' },
  { id: 'person-3', name: 'Sam Rivera', tagline: 'Trying something new this week', color: 'green' },
];

export const createInitialState = () => ({
  users: [],
  currentUserId: null,
  friendships: [],
  chats: [],
  posts: [
    {
      id: 'post-welcome',
      authorId: 'person-1',
      authorName: 'Avery Morgan',
      content: 'A small reminder to step outside and notice what is growing. This is sample content for the demo.',
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      reposts: [],
      isDemo: true,
    },
  ],
});
