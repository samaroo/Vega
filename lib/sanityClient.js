import sanityClient from '@sanity/client'

export const client = sanityClient({
    projectId: 'icclhpue',
    dataset: 'production',
    apiVersion: '2021-03-25',
    token: 'skMMDWOD6ZWb981XwivcEcJF2IlqVBP8xXTQYcSQYM7L5yM8jU4UAQH6XXsNIZXLqFsdGLq2Q6aAUQ0StvsZrX12dZnAGYHEh1tMvTPEbV0Cyoq5yf1uLO5nAZ5YBufzECoCjWKjXLD5uN10aKSnY7yqQQgCqoJi7VOGAM6Z6HWS1cdVWUXq',
    useCdn: false
})