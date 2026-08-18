### Package managers
Package managers install and lock project dependencies. The common ones are npm, Yarn, and pnpm.

#### 1. npm
##### 1.1 Basics
```bash
# Init
npm init
npm init -y

# Install
npm install package-name
npm i package-name
npm i package-name@version
npm i package-name --save-dev

# Uninstall
npm uninstall package-name
npm remove package-name

# Update
npm update package-name
npm update
```

##### 1.2 Config
```json
// package.json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "Project description",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

#### 2. Yarn
##### 2.1 Commands
```bash
# Init
yarn init
yarn init -y

# Install
yarn add package-name
yarn add package-name@version
yarn add package-name --dev

# Uninstall
yarn remove package-name

# Update
yarn upgrade package-name
yarn upgrade
```

##### 2.2 Features
```bash
# Parallel install
yarn install --parallel

# Offline
yarn install --offline

# Production
yarn install --production

# Clear cache
yarn cache clean
```

#### 3. pnpm
##### 3.1 Commands
```bash
# Init
pnpm init
pnpm init -y

# Install
pnpm add package-name
pnpm add package-name@version
pnpm add -D package-name

# Uninstall
pnpm remove package-name

# Update
pnpm update package-name
pnpm update
```

##### 3.2 Features
```bash
# Hard links / hoist
pnpm install --shamefully-hoist

# Offline
pnpm install --offline

# Production
pnpm install --prod

# Prune store
pnpm store prune
```

#### 4. Dependency management
##### 4.1 Version ranges
```json
// package.json
{
  "dependencies": {
    "package-name": "^1.2.3",  // compatible
    "package-name": "~1.2.3",  // patch
    "package-name": "1.2.3",   // exact
    "package-name": "*",       // latest
    "package-name": ">1.2.3",  // greater than
    "package-name": ">=1.2.3", // greater or equal
    "package-name": "<1.2.3",  // less than
    "package-name": "<=1.2.3"  // less or equal
  }
}
```

##### 4.2 Dependency kinds
```json
// package.json
{
  "dependencies": {
    // production
    "react": "^18.2.0"
  },
  "devDependencies": {
    // development
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    // peer
    "react": "^18.2.0"
  },
  "optionalDependencies": {
    // optional
    "package-name": "^1.0.0"
  }
}
```

#### 5. Practices

1. Use a lockfile
2. Update deps regularly
3. Follow semver
4. Put deps in the right field
5. Use a private registry
6. Configure a mirror
7. Use workspaces
8. Resolve conflicts
9. Use scripts
10. Keep the tree clean

#### 6. Common interview questions

1. **npm vs Yarn vs pnpm**
   - Install speed
   - How deps are laid out
   - Disk use
   - Feature differences

2. **How to resolve conflicts**
   - Lock versions
   - Upgrade
   - Resolve the clash
   - Compatibility

3. **How to optimize package management**
   - Cache
   - Mirrors
   - Drop unused deps
   - Workspaces
