/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                montserrat: ["Montserrat"],
                italiano: ["Dancing Script"],
                montagu: ["Montagu Slab"],
            },
            colors: {
                green: "#28a745",
                won: "#dad7cd",
            },
            border: {
                2023: "1px",
            },
        },
    },
    plugins: [],
};
