import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';

// Apply Storybook's preview annotations to the test environment
const annotations = setProjectAnnotations([projectAnnotations]);

beforeAll(annotations.beforeAll);
