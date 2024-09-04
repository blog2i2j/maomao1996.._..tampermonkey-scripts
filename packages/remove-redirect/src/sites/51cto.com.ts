/******************************************************************************
 ** 51CTO 博客
 **   - https://blog.51cto.com/bashrc/6042107
 ******************************************************************************/
const sites: SiteModule = [
  [
    '51CTO 博客',
    'blog.51cto.com',
    {
      rewriteWindowOpen: {
        validationRule: '51cto.com/transfer?',
        separator: '?',
      },
      autojump: {
        validator: ({ pathname }) => pathname === '/transfer',
        separator: '?',
      },
    },
  ],
]

export default sites
