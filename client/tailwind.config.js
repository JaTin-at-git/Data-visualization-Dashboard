/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {
        extend: {
            fontFamily: {
                pa: ["Playwrite AR", "cursive"],
                roboto: ["Roboto", "sans-serif"],
                monte: ["Montserrat", "sans-serif"]
            }, keyframes: {
                hideShow: {
                    '0%': {opacity: 0},
                    '50%': {opacity: 0},
                    '100%': {opacity: 100},
                }
            },  animation: {
                hideShow: 'hideShow .7s infinite',
            }
        },
    },
    plugins: [
        require('daisyui'),
        require('flowbite/plugin')
    ], daisyui: {
        themes: ["light"],
    },
}