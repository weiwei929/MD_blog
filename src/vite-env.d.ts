/// <reference types="vite/client" />

// 允许导入全局样式与其他非 TS 资源
declare module '*.css' {
  const css: string;
  export default css;
}
