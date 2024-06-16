/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,svelte}"],
  theme: {
    extend: {
      colors: {
        primary: {
          "500":"#f63b3b", "600":"#f63b3b",
          "700":"#ff2c2c", "800":"#a80b0b",
          "900":"#ff0000", "950":"rgba(255,0,58,0.99)"
        }
      },
      fontFamily: {
        'body': [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        'sans': [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ]
      }
    },
  },
  plugins: [
  ]

};

