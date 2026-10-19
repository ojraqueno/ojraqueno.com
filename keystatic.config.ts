import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        publishedAt: fields.date({
          label: 'Published date',
          description:
            'Original publish date. For migrated Blogger posts, keep the Blogger date.',
        }),
        updatedAt: fields.date({
          label: 'Updated date',
          description: 'Optional. Set when you substantially revise a post.',
        }),
        draft: fields.checkbox({
          label: 'Draft',
          defaultValue: false,
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Tag',
        }),
        githubRepo: fields.url({
          label: 'Companion GitHub repo',
          description: 'Optional link to a related repository.',
        }),
        originalUrl: fields.url({
          label: 'Original Blogger URL',
          description:
            'If this post first appeared on Blogger, paste that URL here.',
        }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'src/assets/images/posts',
              publicPath: '../../assets/images/posts/',
            },
          },
        }),
      },
    }),
  },
});
