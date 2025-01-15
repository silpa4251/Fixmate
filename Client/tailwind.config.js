/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors:{
        green:{
          default:'#90C158',
          dark:'#5B5858',
          light:'#6AA02D',
          pale: '#D9FFCC',
          darker:'#43A047',
          button: '#319F43',
          bright:'#75B460',
          sidebar:'#1F3521',
          hover:'#315234'

        },
        grey: {
          light: '#D3E4CB',
          dark: '#5B5858',
          medium:'#CBEDA4'
        },
        white: {
          dark:'#D9D9D9',
          medium:'#E0D5D5'
        },
        light:{
          medium:'#D4CDCD',
          pale:'#D2E6CB'
        },
        blue:{
          link: '#388187'
        },
        black:{
          light: '#202E18',
          medium: '#484444',
          dark:'#191818'
        },
        red:{
          dark:'#ED4545'
        }
      }
    },
  },
  plugins: [],
}

