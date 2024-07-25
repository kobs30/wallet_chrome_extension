module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	overrides: [
		{
			files: ['*.ts'],
			rules: {
				'@typescript-eslint/explicit-module-boundary-types': 'warn',
			},
		},
	],
	env:  {
		es6: true,
		jest: true,
		browser: true,
		node: true,
	},
	settings: {
		'import/resolver': {
			node: {
				paths: ['src'],
				extensions: ['.js', '.d.ts', '.ts', '.tsx'],
			},
			typescript: {
				alwaysTryTypes: true
			},
		},
	},
	globals: {
		window: 'readonly',
	},
	rules: {
		'import/order': [
			'error',
			{
				groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],
				'newlines-between': 'always',
			},
		],
		'import/named': 'off',
		'import/no-cycle': [
			'error',
			{
				maxDepth: 2,
			},
		],

		'no-case-declarations': 'off',
		'@typescript-eslint/no-var-requires': 'off',

		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-namespace': 'off',
		'react-hooks/exhaustive-deps': 'off',
	}
}
