import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "./",
      entryFileNames: pkg.main,
      format: "cjs",
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: "dist/types/",
        rootDir: "src/",
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: pkg.module,
      format: "es",
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [typescript()],
  },
];
