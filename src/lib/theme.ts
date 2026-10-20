export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'ecoponto-theme';

export const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`;
