/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: "#bd90ff",
                    200: "#b27eff",
                    300: "#a76bff",
                    400: "#9c59ff",
                    500: "#9146ff",
                    600: "#833fe6",
                    700: "#7438cc",
                    800: "#6631b3",
                    900: "#572a99",
                },
            },
        },
    },
    plugins: [require("tailwind-scrollbar")],
};
