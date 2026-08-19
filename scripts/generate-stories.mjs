import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uiDir = path.join(__dirname, '../src/components/ui');

// Recursively find all component .tsx files
function findComponents(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== '__tests__') {
                findComponents(fullPath, fileList);
            }
        } else if (file.endsWith('.tsx') && !file.endsWith('.stories.tsx') && !file.endsWith('.test.tsx')) {
            fileList.push(fullPath);
        }
    }
    
    return fileList;
}

const componentFiles = findComponents(uiDir);
let generatedCount = 0;

for (const filePath of componentFiles) {
    const fileName = path.basename(filePath, '.tsx');
    const dirName = path.dirname(filePath);
    
    // Ignore internal utility files like index.tsx
    if (fileName === 'index') continue;

    // Convert kebab-case file name to PascalCase ComponentName
    const componentName = fileName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    
    // Get semantic group name (e.g. "forms", "overlays")
    const relativeDir = path.relative(uiDir, dirName);
    const categoryName = relativeDir ? relativeDir.charAt(0).toUpperCase() + relativeDir.slice(1) : 'UI';

    const storyFilePath = path.join(dirName, `${fileName}.stories.tsx`);

    // Skip if story already exists
    if (fs.existsSync(storyFilePath)) {
        continue;
    }

    const storyTemplate = `import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${fileName}';

const meta = {
  title: 'UI/${categoryName}/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="p-4 w-full flex items-center justify-center">
      <${componentName} {...args} />
    </div>
  ),
};
`;

    // Only inject boilerplate if we safely infer the component name exists natively 
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Simple check: does the file actually export the componentName we derived?
        if (content.includes(`export const ${componentName}`) || content.includes(`export function ${componentName}`) || content.includes(`export { ${componentName}`)) {
            fs.writeFileSync(storyFilePath, storyTemplate);
            generatedCount++;
        } else {
            // Find the main export using rudimentary parsing if PascalCase filename wasn't right
            const match = content.match(/export (?:const|function) ([A-Z][a-zA-Z0-9]+)/);
            if (match && match[1]) {
                const actualComponentName = match[1];
                const fixedTemplate = storyTemplate
                    .replace(new RegExp(componentName, 'g'), actualComponentName)
                    .replace(`title: 'UI/${categoryName}/${actualComponentName}'`, `title: 'UI/${categoryName}/${actualComponentName}'`);
                fs.writeFileSync(storyFilePath, fixedTemplate);
                generatedCount++;
            }
        }
    } catch (e) {
        console.error(`Error processing ${filePath}: ${e.message}`);
    }
}

console.log(`Successfully generated ${generatedCount} Storybook files.`);
