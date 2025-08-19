#!/usr/bin/env node

import chalk from "chalk";
import { execa } from "execa";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";

// Color theme for consistent styling
const colors = {
  primary: chalk.hex("#00D2FF"),
  success: chalk.hex("#00FF88"),
  warning: chalk.hex("#FFB800"),
  error: chalk.hex("#FF0080"),
  info: chalk.hex("#8A2BE2"),
  muted: chalk.hex("#6B7280"),
  white: chalk.white,
  cyan: chalk.cyan,
  magenta: chalk.magenta,
};

async function run() {
  console.log(
    colors.primary("\n🚀 create-vrx — Modern React Project Generator")
  );
  console.log(
    colors.muted("   Built for developers who want more than basics\n")
  );

  try {
    // Step 1: Project Configuration
    console.log(colors.info("📋 PROJECT CONFIGURATION\n"));

    const projectConfig = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: colors.cyan("📛 Project name:"),
        default: "my-vrx-app",
        validate: (input) => {
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
            return "Project name can only contain letters, numbers, hyphens, and underscores";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "variant",
        message: colors.cyan("🔧 Choose project variant:"),
        choices: [
          { name: "JavaScript", value: "react" },
          { name: "TypeScript", value: "react-ts" },
          { name: "JavaScript + SWC", value: "react-swc" },
          { name: "TypeScript + SWC", value: "react-swc-ts" },
        ],
        default: "react-ts",
      },
      {
        type: "list",
        name: "packageManager",
        message: colors.cyan("📦 Package manager:"),
        choices: [
          { name: "npm", value: "npm" },
          { name: "yarn", value: "yarn" },
          { name: "pnpm", value: "pnpm" },
        ],
        default: "npm",
      },
    ]);

    const { projectName, variant, packageManager } = projectConfig;
    const projectPath = path.resolve(process.cwd(), projectName);
    const isTypeScript = variant.includes("ts");

    // Check if directory already exists
    if (fs.existsSync(projectPath)) {
      console.error(
        colors.error(`✗ Directory '${projectName}' already exists!`)
      );
      process.exit(1);
    }

    // Step 2: Create Vite project
    console.log(colors.info("\n📦 SCAFFOLDING PROJECT\n"));
    console.log(colors.muted("Creating base Vite + React project..."));

    await execa(
      "npm",
      ["create", "vite@latest", projectName, "--", "--template", variant],
      { stdio: "pipe" }
    );

    console.log(colors.success("✔ Base project created"));
    process.chdir(projectPath);

    // Step 3: Essential Tools
    console.log(colors.info("\n🛠  ESSENTIAL TOOLS\n"));

    const essentialTools = await inquirer.prompt([
      {
        type: "confirm",
        name: "tailwind",
        message: colors.cyan("🎨 Include Tailwind CSS?"),
        default: true,
      },
      {
        type: "confirm",
        name: "router",
        message: colors.cyan("🗺  Include React Router?"),
        default: true,
      },
      {
        type: "list",
        name: "httpClient",
        message: colors.cyan("🌐 HTTP Client:"),
        choices: [
          { name: "None", value: "none" },
          { name: "Axios", value: "axios" },
          { name: "Fetch API wrapper", value: "ofetch" },
        ],
        default: "axios",
      },
      {
        type: "list",
        name: "stateManager",
        message: colors.cyan("🗃  State Management:"),
        choices: [
          { name: "None", value: "none" },
          { name: "Zustand (Lightweight)", value: "zustand" },
          { name: "Redux Toolkit", value: "redux" },
          { name: "Jotai (Atomic)", value: "jotai" },
        ],
        default: "zustand",
      },
      {
        type: "list",
        name: "uiLibrary",
        message: colors.cyan("🎯 UI Components:"),
        choices: [
          { name: "None", value: "none" },
          { name: "Lucide React (Icons)", value: "lucide" },
          { name: "Heroicons", value: "heroicons" },
          { name: "React Icons", value: "react-icons" },
        ],
        default: "lucide",
      },
    ]);

    // Step 4: Development Tools
    console.log(colors.info("\n🔧 DEVELOPMENT TOOLS\n"));

    const devTools = await inquirer.prompt([
      {
        type: "confirm",
        name: "eslintPrettier",
        message: colors.cyan("✨ Setup ESLint + Prettier?"),
        default: true,
      },
      {
        type: "list",
        name: "testing",
        message: colors.cyan("🧪 Testing Framework:"),
        choices: [
          { name: "None", value: "none" },
          { name: "Vitest", value: "vitest" },
          { name: "Jest", value: "jest" },
          { name: "Vitest + React Testing Library", value: "vitest-rtl" },
        ],
        default: "vitest-rtl",
      },
      {
        type: "confirm",
        name: "husky",
        message: colors.cyan("🐕 Setup Git hooks (Husky)?"),
        default: true,
      },
      {
        type: "list",
        name: "alias",
        message: colors.cyan("📂 Import alias:"),
        choices: [
          { name: "None", value: "none" },
          { name: "@ → src/ (Recommended)", value: "@" },
          { name: "~ → src/", value: "~" },
        ],
        default: "@",
      },
    ]);

    // Step 5: Project Structure
    console.log(colors.info("\n📁 PROJECT STRUCTURE\n"));

    const structure = await inquirer.prompt([
      {
        type: "checkbox",
        name: "folders",
        message: colors.cyan("📂 Select folders to create:"),
        choices: [
          { name: "components/", value: "components", checked: true },
          { name: "pages/", value: "pages", checked: true },
          { name: "hooks/", value: "hooks", checked: true },
          { name: "utils/", value: "utils", checked: true },
          { name: "services/", value: "services", checked: true },
          { name: "stores/", value: "stores", checked: false },
          { name: "types/", value: "types", checked: isTypeScript },
          { name: "constants/", value: "constants", checked: false },
          { name: "contexts/", value: "contexts", checked: false },
        ],
      },
      {
        type: "confirm",
        name: "env",
        message: colors.cyan("🔐 Create environment files?"),
        default: true,
      },
      {
        type: "confirm",
        name: "readme",
        message: colors.cyan("📝 Generate custom README?"),
        default: true,
      },
      {
        type: "confirm",
        name: "git",
        message: colors.cyan("📚 Initialize Git repository?"),
        default: true,
      },
    ]);

    // Step 6: Build dependency arrays
    let dependencies = [];
    let devDependencies = [];

    if (essentialTools.router) dependencies.push("react-router-dom");
    if (essentialTools.httpClient === "axios") dependencies.push("axios");
    if (essentialTools.httpClient === "ofetch") dependencies.push("ofetch");

    if (essentialTools.stateManager === "zustand") dependencies.push("zustand");
    if (essentialTools.stateManager === "redux")
      dependencies.push("@reduxjs/toolkit", "react-redux");
    if (essentialTools.stateManager === "jotai") dependencies.push("jotai");

    if (essentialTools.uiLibrary === "lucide")
      dependencies.push("lucide-react");
    if (essentialTools.uiLibrary === "heroicons")
      dependencies.push("@heroicons/react");
    if (essentialTools.uiLibrary === "react-icons")
      dependencies.push("react-icons");

    if (essentialTools.tailwind) {
      dependencies.push("tailwindcss", "@tailwindcss/vite");
    }

    if (devTools.eslintPrettier) {
      devDependencies.push(
        "prettier",
        "eslint-config-prettier",
        "eslint-plugin-prettier"
      );
    }

    if (devTools.testing === "vitest") {
      devDependencies.push("vitest");
    } else if (devTools.testing === "jest") {
      devDependencies.push("jest", "@types/jest");
    } else if (devTools.testing === "vitest-rtl") {
      devDependencies.push(
        "vitest",
        "@testing-library/react",
        "@testing-library/jest-dom",
        "@testing-library/user-event"
      );
    }

    if (devTools.husky) {
      devDependencies.push("husky", "lint-staged");
    }

    // Step 7: Install Dependencies
    if (dependencies.length > 0 || devDependencies.length > 0) {
      console.log(colors.info("\n📦 INSTALLING PACKAGES\n"));

      if (dependencies.length > 0) {
        console.log(
          colors.muted(`Installing dependencies: ${dependencies.join(", ")}`)
        );
        await execa(packageManager, ["install", ...dependencies], {
          stdio: "inherit",
        });
        console.log(colors.success("✔ Dependencies installed"));
      }

      if (devDependencies.length > 0) {
        console.log(
          colors.muted(
            `Installing dev dependencies: ${devDependencies.join(", ")}`
          )
        );
        const devFlag = packageManager === "npm" ? "--save-dev" : "-D";
        await execa(packageManager, ["install", devFlag, ...devDependencies], {
          stdio: "inherit",
        });
        console.log(colors.success("✔ Dev dependencies installed"));
      }
    }

    // Step 8: Configure Tailwind
    if (essentialTools.tailwind || devTools.alias !== "none") {
      console.log(colors.info("\n🎨 CONFIGURING VITE\n"));

      const viteConfigPath = path.join(projectPath, "vite.config.ts");

      // Build imports
      let imports = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'\n`;

      if (essentialTools.tailwind) {
        imports += `import tailwindcss from '@tailwindcss/vite'\n`;
      }

      // Build plugins array
      let plugins = ["react()"];
      if (essentialTools.tailwind) {
        plugins.push("tailwindcss()");
      }

      // Build alias block
      let aliasBlock = "";
      if (devTools.alias !== "none") {
        aliasBlock = `
  resolve: {
    alias: {
      "${devTools.alias}": "/src",
    },
  },`;
      }

      const configContent = `${imports}
export default defineConfig({
  plugins: [
    ${plugins.join(",\n    ")}
  ],${aliasBlock}
})
`;

      fs.writeFileSync(viteConfigPath, configContent, "utf-8");

      // Update CSS if Tailwind selected
      if (essentialTools.tailwind) {
        const cssFile = path.join(projectPath, "src", "index.css");
        if (fs.existsSync(cssFile)) {
          const tailwindDirectives = `@import "tailwindcss";\n\n`;
          const existingCss = fs.readFileSync(cssFile, "utf-8");
          if (!existingCss.includes('@import "tailwindcss";')) {
            fs.writeFileSync(
              cssFile,
              tailwindDirectives + existingCss,
              "utf-8"
            );
          }
        }
        console.log(colors.success("✔ Tailwind configured"));
      }

      if (devTools.alias !== "none") {
        console.log(
          colors.success(`✔ Import alias '${devTools.alias}' configured`)
        );
      }
    }

    // Step 9: Create Project Structure
    console.log(colors.info("\n📁 CREATING PROJECT STRUCTURE\n"));

    structure.folders.forEach((folder) => {
      const folderPath = path.join("src", folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });

        // Create index files for certain folders
        if (["utils", "constants", "types"].includes(folder)) {
          const ext = isTypeScript ? "ts" : "js";
          const indexFile = path.join(folderPath, `index.${ext}`);
          fs.writeFileSync(indexFile, `// Export ${folder} here\n`, "utf-8");
        }

        console.log(colors.success(`✔ Created src/${folder}/`));
      }
    });

    // Step 10: Create Configuration Files
    console.log(colors.info("\n⚙️  CREATING CONFIG FILES\n"));

    if (structure.env) {
      fs.writeFileSync(".env", "VITE_API_URL=http://localhost:8000\n", "utf-8");
      fs.writeFileSync(".env.example", "VITE_API_URL=\n", "utf-8");
      console.log(colors.success("✔ Environment files created"));
    }

    if (devTools.testing === "vitest" || devTools.testing === "vitest-rtl") {
      const vitestConfig = generateVitestConfig(
        devTools.testing === "vitest-rtl"
      );
      fs.writeFileSync("vitest.config.js", vitestConfig, "utf-8");

      // Update package.json scripts
      updatePackageJsonScripts({
        test: "vitest",
        "test:ui": "vitest --ui",
        "test:coverage": "vitest --coverage",
      });
      console.log(colors.success("✔ Vitest configured"));
    }

    if (devTools.eslintPrettier) {
      const prettierConfig = {
        semi: true,
        trailingComma: "es5",
        singleQuote: true,
        printWidth: 80,
        tabWidth: 2,
      };
      fs.writeFileSync(
        ".prettierrc",
        JSON.stringify(prettierConfig, null, 2),
        "utf-8"
      );
      console.log(colors.success("✔ Prettier configured"));
    }

    if (structure.readme) {
      const readme = generateReadme({
        projectName,
        variant,
        packageManager,
        tailwind: essentialTools.tailwind,
        router: essentialTools.router,
        testing: devTools.testing,
      });
      fs.writeFileSync("README.md", readme, "utf-8");
      console.log(colors.success("✔ README.md generated"));
    }

    // Step 11: Git & Husky Setup
    if (structure.git) {
      await execa("git", ["init"], { stdio: "ignore" });
      console.log(colors.success("✔ Git repository initialized"));

      if (devTools.husky) {
        // Create .gitignore additions
        const gitignoreAdditions = `\n# Logs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n\n# Runtime data\npids\n*.pid\n*.seed\n*.pid.lock\n\n# Coverage directory used by tools like istanbul\ncoverage/\n\n# IDE\n.vscode/\n.idea/\n`;
        if (fs.existsSync(".gitignore")) {
          fs.appendFileSync(".gitignore", gitignoreAdditions, "utf-8");
        }

        console.log(
          colors.success("✔ Git hooks will be set up on first commit")
        );
      }
    }

    // Step 12: Success Message
    console.log(colors.primary("\n🎉 PROJECT CREATED SUCCESSFULLY!\n"));
    console.log(colors.info("📋 Project Summary:"));
    console.log(colors.muted(`   └─ Name: ${projectName}`));
    console.log(colors.muted(`   └─ Variant: ${variant}`));
    console.log(colors.muted(`   └─ Package Manager: ${packageManager}`));
    console.log(
      colors.muted(
        `   └─ Dependencies: ${
          dependencies.length + devDependencies.length
        } packages`
      )
    );

    console.log(colors.warning("\n🚀 Next Steps:"));
    console.log(colors.white(`   cd ${projectName}`));
    console.log(colors.white(`   ${packageManager} run dev`));

    if (devTools.testing !== "none") {
      console.log(colors.white(`   ${packageManager} run test`));
    }

    console.log(colors.cyan("\n   Happy coding! 🎯\n"));
  } catch (error) {
    console.error(colors.error(`\n✗ Error: ${error.message}`));
    process.exit(1);
  }
}

function generateViteConfig({ isTypeScript, tailwind, alias }) {
  const ext = isTypeScript ? "ts" : "js";

  let imports = `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'`;
  if (tailwind) imports += `\nimport tailwindcss from '@tailwindcss/vite'`;

  let plugins = `[react()${tailwind ? ", tailwindcss()" : ""}]`;

  let aliasConfig = "";
  if (alias !== "none") {
    aliasConfig = `,\n  resolve: {\n    alias: {\n      '${alias}': '/src',\n    },\n  }`;
  }

  return `${imports}

export default defineConfig({
  plugins: ${plugins}${aliasConfig}
})`;
}

function generateVitestConfig(includeRTL) {
  let setupFiles = "";
  if (includeRTL) {
    setupFiles = `,\n    setupFiles: './src/test/setup.js'`;
  }

  return `import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom'${setupFiles}
  },
})`;
}

function generateReadme({
  projectName,
  variant,
  packageManager,
  tailwind,
  router,
  testing,
}) {
  const features = [];
  if (variant.includes("ts")) features.push("TypeScript");
  if (tailwind) features.push("Tailwind CSS");
  if (router) features.push("React Router");
  if (testing !== "none") features.push(`${testing} Testing`);

  return `# ${projectName}

> Generated with 🚀 **create-vrx** - Modern React Project Generator

## ✨ Features

${features.map((f) => `- ✅ ${f}`).join("\n")}

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
${packageManager} install

# Start development server
${packageManager} run dev

# Build for production
${packageManager} run build

# Preview production build
${packageManager} run preview
${testing !== "none" ? `\n# Run tests\n${packageManager} run test` : ""}
\`\`\`

## 📂 Project Structure

\`\`\`
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── services/      # API services
${variant.includes("ts") ? "├── types/         # TypeScript definitions" : ""}
└── App.${variant.includes("ts") ? "tsx" : "jsx"}
\`\`\`

## 🛠 Built With

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
${
  tailwind
    ? "- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework"
    : ""
}
${
  router
    ? "- [React Router](https://reactrouter.com/) - Declarative routing for React"
    : ""
}
${
  testing !== "none"
    ? `- [${
        testing === "vitest" || testing === "vitest-rtl" ? "Vitest" : "Jest"
      }](${
        testing === "vitest" || testing === "vitest-rtl"
          ? "https://vitest.dev/"
          : "https://jestjs.io/"
      }) - Testing Framework`
    : ""
}

---

Made with ❤️ using create-vrx
`;
}

function updatePackageJsonScripts(newScripts) {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    packageJson.scripts = { ...packageJson.scripts, ...newScripts };
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf-8"
    );
  }
}

run().catch(console.error);
