module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    "eslint:recommended", "google"
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    "semi": "off",
    "quotes": "off",
    "max-len": "off",
    "comma-dangle": "off",
    "space-before-function-paren": "off",
    "vue/html-self-closing": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/html-indent": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": "off",
    "linebreak-style": "off",
    "indent": "off",
    "vue/no-v-html": "off",
    "eol-last": "off",
    "no-unused-expressions": "off",
    "import/no-duplicates": "off",
    "require-jsdoc": "off",
    "arrow-parens": "off"
  }
}
