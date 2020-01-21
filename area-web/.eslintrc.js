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
        'plugin:nuxt/recommended'
    ],
    // add your custom rules here
    rules: {
        "vue/html-indent": ["warn", 4],
        "strict": "off",
        "class-methods-use-this": "off",
        "global-require": "off",
        "no-param-reassign": ["error", { "props": false }],
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "indent": ["warn", 4],
        "semi": "warn",
        "vue/singleline-html-element-content-newline": "off",
        "vue/require-prop-types": "off"
    },

    "overrides": [
        {
            "files": ["*.vue"],
            "rules": {
                "indent": "off",
                "vue/script-indent": "off"
            }
        }
    ]
};
