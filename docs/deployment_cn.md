# 部署指南

这份指南专为初学者准备。别担心，你不需要懂复杂的服务器配置，只需要跟着下面的步骤，就能轻松把你的个人主页发布上线！

## 方案一：GitHub Pages

1.  **构建你的项目**

    首先，请确保你安装了正确的 Node.js 版本。
    *   **下载与安装**：请前往 [https://nodejs.org/en/download](https://nodejs.org/en/download) 手动下载并安装。
    *   最好不要使用系统自带的 Node.js 版本，以免出现兼容性问题。

    打开终端，进入项目文件夹，运行以下命令：

    ```bash
    npm install
    npm run build
    ```

    运行完成后，你会发现在项目目录下多了一个名为 `out` 的文件夹。这里面就是你网站的所有静态文件。

2.  **创建一个 GitHub 仓库**

    *   登录 GitHub。
    *   新建一个 **Public** (公开) 仓库。
    *   **关键步骤**：仓库名必须填 `你的用户名.github.io` (请将 `你的用户名` 替换为你实际的 GitHub 账号名)。

3.  **上传文件**

    *   将 `out` 文件夹里 **所有的内容** 上传到这个新仓库。
    *   你可以在 GitHub 仓库页面点击 "Upload files"，然后把 `out` 文件夹里的所有文件全选拖进去。
    *   *当然，如果你熟悉 Git 命令，也可以直接把 `out` 目录的内容 push 到仓库里。*

4.  **添加 .nojekyll 文件（重要）**

    *   在你的 GitHub 仓库页面，点击 "Add file" -> "Create new file"。
    *   文件名填写 `.nojekyll` (注意前面有个点，且全小写)。
    *   文件内容留空即可，直接点击 "Commit changes"。
    *   *这一步非常重要！它告诉 GitHub 不要忽略以下划线开头的文件夹（比如 Next.js 生成的 `_next`），否则网站样式会加载失败。*

5.  **配置 Pages**

    *   进入仓库的 **Settings** (设置)。
    *   在左侧栏找到 **Pages**。
    *   在 **Build and deployment** 下，确保来源选择的是 "Deploy from a branch"。
    *   选择你的分支（通常是 `main`），然后点击 **Save**。

6.  **大功告成！**
    访问 `https://你的用户名.github.io`，欣赏你的新网站吧！

### (可选) 使用 GitHub Actions 自动部署

PRISM 也支持使用 GitHub Actions **自动部署到 GitHub Pages**。
如果您希望每次推送更改时自动更新站点，推荐使用此方法。

#### 如何启用

本仓库包含一个可选的工作流文件，位于：

```
.github/workflows/deploy.yml
```

对于使用模板的用户，GitHub 默认会禁用工作流。
要启用部署：

1. 转到 **Settings (设置) > Pages**，在 **Build and deployment (构建和部署) > Source (来源)** 下，选择 **GitHub Actions**。
2. 转到 **Actions** 标签页，选择 **"Deploy PRISM to GitHub Pages"**。
3. 点击 **"Enable workflow" (启用工作流)**。
4. 使用 **Run workflow (运行工作流)** 手动运行。
5. (可选) 要启用推送时自动部署：
   编辑 `.github/workflows/deploy.yml` 并取消注释：

   ```yaml
   on:
     push:
       branches:
         - main
         - ci
   ```

启用后，GitHub Actions 将会：

- 构建您的站点 (`npm install && npm run build`)
- 将静态文件导出到 `out/`
- 自动部署到 GitHub Pages

您的站点将可以通过 `https://<username>.github.io` 访问。

如果您使用的仓库名称不是 `username.github.io`，您的站点将位于 `https://<username>.github.io/<repository>/`。

在这种情况下，请确保在 `next.config.ts` 中相应地设置 `basePath` 和 `assetPrefix`，以便为您的资源添加路径前缀：

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,

  // 添加这两行
  basePath: "/my-repo",
  assetPrefix: "/my-repo",

  images: {
    unoptimized: true,
  },
  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.bib$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
```

### 部署到组织站点子目录（例如 `mmlab-sigs/groups`）

如果你不是部署到仓库根路径，而是要把站点放到一个已有 GitHub Pages 站点的子目录，例如：

`https://mmlab-sigs.github.io/groups/efficient-deep-learning-and-embodiment-group/`

推荐做法是：

1. 不要把 `basePath` 写死在代码里。
2. 构建时通过环境变量传入目标路径。
3. 只把 `out/` 里的静态文件上传到目标目录。

本项目已经支持通过 `PRISM_BASE_PATH` 指定部署前缀，因此可以直接运行：

```bash
npm install
npm run build:mmlab-group
```

这等价于：

```bash
PRISM_BASE_PATH=/groups/efficient-deep-learning-and-embodiment-group npm run build
```

由于 `mmlab-sigs/groups` 是一个 Jekyll 仓库，而 Next.js 默认会输出 `/_next/` 资源目录，本项目的 `build:mmlab-group` 还会自动将这些资源改写为普通目录名 `next-assets/`，以避免 GitHub Pages 在 Jekyll 构建时忽略以下划线开头的目录。

构建完成后：

1. 打开生成的 `out/` 目录。
2. 将其中所有文件复制到目标仓库的 `efficient-deep-learning-and-embodiment-group/` 目录下。
3. 如果目标仓库启用了 GitHub Pages，访问：

`https://mmlab-sigs.github.io/groups/efficient-deep-learning-and-embodiment-group/`

这种方式最稳妥，因为目标仓库是一个“多组共享”的 Jekyll 静态站点仓库，而不是单独给这个项目运行 Next.js 构建流程的源码仓库。本项目已经在构建阶段把 Next.js 默认的 `/_next/` 资源目录改写为 `next-assets/`，因此不需要也不应该在目标仓库根目录设置 `.nojekyll`。

### 使用 GitHub Actions 自动同步到 `mmlab-sigs/groups`

如果你希望今后每次推送到当前仓库的 `main` 分支时自动更新组织站点，本仓库已经提供了工作流：

`/.github/workflows/deploy-mmlab-groups.yml`

它会自动执行以下步骤：

1. 安装依赖。
2. 运行 `npm run build:mmlab-group`。
3. 将生成的 `out/` 内容同步到 `mmlab-sigs/groups` 仓库的 `efficient-deep-learning-and-embodiment-group/` 目录。
4. 自动提交并推送。

启用前需要先在当前仓库的 GitHub 设置里添加一个 Repository Secret：

- 名称：`MMLAB_SIGS_GROUPS_TOKEN`
- 内容：一个有权限写入 `mmlab-sigs/groups` 仓库的 Personal Access Token

推荐权限：

- 如果使用 fine-grained PAT：给 `mmlab-sigs/groups` 授予 `Contents: Read and write`
- 如果使用 classic PAT：至少需要 `public_repo`

配置完成后：

1. 推送一次到当前仓库 `main`，或
2. 在 GitHub 的 **Actions** 页面手动运行 **Sync to MMLab SIGS Groups**

即可自动完成发布。

---

## 方案二：Cloudflare Pages

1.  **构建项目**
    同样地，先运行 `npm run build`，生成 `out` 文件夹。

2.  **创建应用**
    *   登录 [Cloudflare 控制台 (Dashboard)](https://dash.cloudflare.com/)。
    *   点击左侧的 **Workers & Pages** -> **Create Application**。
    *   选择 **Pages** 标签页。
    *   点击 **Drag and drop your files**。

3.  **上传与发布**
    *   输入 **Project name** (项目名称)，这将成为你域名的前缀（例如：`my-site`）。
    *   点击 **Create project**。
    *   将你的 `out` 文件夹（或者它的压缩包）直接拖入上传区域。
    *   点击 **Deploy**。

4.  **完成！**
    你的网站已经在 `https://<你的项目名>.pages.dev` 上线啦！
