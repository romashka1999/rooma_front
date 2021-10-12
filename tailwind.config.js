module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        secondary: "#16202C",
        primary: "#1DA1F2",
        hover: "#1872a9",
        customGray: "#37526d",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
