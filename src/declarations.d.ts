// Allow importing plain CSS files without TypeScript errors
declare module "*.css";

// Allow importing SVG files as modules
declare module "*.svg" {
  const content: string;
  export default content;
}
