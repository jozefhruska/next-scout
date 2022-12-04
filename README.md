# next-scout 🕵️

`next-scout` is a simple tool (command) that allows you to generate a **strictly typed** route builder for Next.js applications.

> **Note**  
> Supports both the new `app` directory (Next.js 13+) as well as the “legacy” `pages` directory.

[![npm version](https://badge.fury.io/js/next-scout.svg)](https://badge.fury.io/js/next-scout)

## What is a route builder?

A route builder (as generated by `next-scout`) is a nested JavaScript object that mirrors the page structure of your Next.js application.

For example, imagine an application with the following structure:

- `/` (root page, index)
- `/blog`
- `/blog/[pid]`
- `/contact`

The route builder of this application generated by `next-scout` would look like this:

```tsx
type RouteBuilder = { 
  getPath: () => string; // Returns "/"
  blog: {
    getPath: () => string; // Returns "/blog"
    pid: {
      getPath: (pid: string) => string; // Returns "/blog/${pid}"			
    }
  },
  contact: {
    getPath: () => string; // Returns "/contact"		
  }
}
```

## Why do I need a route builder?

While it is true that a route builder is primarily helpful for large-scale applications with tens or hundreds of routes, no obstacles are preventing you from using it on smaller applications which can also benefit from the advantages described below.

### Auto-complete

You don’t have to remember every route in your application. A route builder is a nested object with keys and parameters mirroring the actual structure of your application, so modern code editors will give you suggestions just as you type.

```tsx
<Link href={`/blog`} />; // ❌
<Link href={`/blog/${post.id}`} />; // ❌

<Link href={routeBuilder.blog.getPath()} />; // ✅
<Link href={routeBuilder.blog.pid.getPath(post.id)} />; // ✅
```

### Type safety

Because a route builder generated by `next-scout` is strictly typed, every time a route is changed (file or query parameter renamed, moved, or deleted), you get TypeScript errors during the build. This also makes it super easy to refactor old routes, as you will be notified of every wrong usage of the route builder.

## Installation

```bash
npm install next-scout
# or
yarn add next-scout
```

## Usage

> **Warning**  
> `next-scout` has to be run in the **root directory** of your Next.js application (the folder that contains `pages` and/or `app` directories).

```bash
next-scout
# or
next-scout --output ./lib/routeBuilder.ts
```

The `--output` specifies the file to which the `next-auth` will generate the route builder.