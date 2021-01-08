const prettierOptions = require('./.prettierrc.js');

module.exports = {
	env: {
		browser: true,
		node: true,
		jest: true,
		es6: true
	},
	ignorePatterns: [
		'node_modules/',
		'build/',
		'scripts/',
		'config/',
		'dist/',
		'diagrams-demo-gallery/',
		'src/serviceWorker.ts',
		'src/react-app-env.d.ts'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		}
	},
	extends: [
		'plugin:react/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:flowtype/recommended'
	],
	plugins: ['import', 'react', 'flowtype', 'prettier'],
	globals: {
		__DEV__: true
	},
	rules: {
		'prettier/prettier': [2, prettierOptions],
		'prefer-const': 2,
		'arrow-body-style': [2, 'as-needed'],
		'class-methods-use-this': 0,
		'comma-dangle': [2, 'always-multiline'],
		'import/imports-first': 0,
		'import/newline-after-import': 0,
		'import/no-cycle': 2,
		'import/no-dynamic-require': 0,
		'import/extensions': 0,
		'import/no-extraneous-dependencies': 0,
		'import/no-named-as-default': 0,
		'import/no-unresolved': [2, { ignore: ['@projectstorm/*'] }],
		'import/no-webpack-loader-syntax': 0,
		'import/prefer-default-export': 0,
		'no-console': 2,
		'new-cap': 0,
		'require-yield': 0,
		'react/display-name': 0,
		'react/jsx-filename-extension': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/ban-ts-ignore': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/no-empty-function': 0,
		'prefer-template': 2,
		'react/jsx-closing-tag-location': 0,
		'react/forbid-prop-types': 0,
		'react/jsx-first-prop-new-line': [2, 'multiline'],
		'react/jsx-filename-extension': 0,
		'react/jsx-no-target-blank': 0,
		'react/jsx-sort-props': [2, { callbacksLast: true, shorthandLast: true }],
		'react/require-default-props': 0,
		'react/require-extension': 0,
		'react/self-closing-comp': 0,
		'react/sort-comp': 0,
		'react/sort-prop-types': [2, { callbacksLast: true, requiredFirst: true }],
		'react/prop-types': [1, { skipUndeclared: true }],
		'flowtype/no-types-missing-file-annotation': 0
	},
	settings: {
		react: {
			version: 'detect'
		},
		'import/resolver': {
			ts: {
				alwaysTryTypes: true
			}
		}
	}
};
