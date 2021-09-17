module.exports = {
    // Set the line wrap length to 120 from the default 80. 80 Feels quite restrictive in Typescript.
    printWidth: 120,

    // Increase tab width to 4 for readability. 2 is the default but gets too compact in middling to complex files.
    tabWidth: 4,

    // Use spaces over tabs for alignment.
    useTabs: false,

    // Print semi-colons at the end of lines like lots of other languages.
    semi: true,

    // Only add quotes around object properties when required.
    quoteProps: 'as-needed',

    // Enforce single quotes to differ JS quotes from JSX quotes.
    singleQuote: true,

    // Enforce double quotes for JSX, natural progression from its roots in HTML.
    jsxSingleQuote: false,

    // Print trailing commas on ES5 elements like arrays, objects etc to comply with ESLint.
    trailingComma: 'es5',

    // Print spaces between brackets in object literals for visual clarity.
    bracketSpacing: true,

    // Enforce arrow function parenthisis where possible so it's easier to add type definitions for inputs.
    arrowParens: 'always',
};
