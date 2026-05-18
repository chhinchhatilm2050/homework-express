import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,    
        ...globals.jest,    
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_'  
      }],
      'quotes': ['error', 'single'],       
      'semi': ['error', 'always'],         
      'indent': ['error', 2],               
      'no-multiple-empty-lines': ['error',  
        { max: 1 }],
    }
  },
];