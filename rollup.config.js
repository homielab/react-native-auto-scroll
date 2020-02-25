import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";

export default {
  input: "src/index.tsx",
  external: ["react", "react-native"],
  output: {
    format: "umd",
    name: "react-native-auto-scrolling",
    globals: {
      react: "React",
      "react-native": "ReactNative"
    }
  },
  plugins: [
    typescript({ tsconfig: "tsconfig.json" }),
    resolve(),
    babel({
      exclude: "node_modules/**"
    })
  ]
};
