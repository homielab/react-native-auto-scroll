import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";

const env = process.env.NODE_ENV;

const config = {
  input: "src/index.tsx",
  sourcemap: false,
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
    typescript({ useTsconfigDeclarationDir: true, tsconfig: "tsconfig.json" }),
    resolve(),
    babel({
      exclude: "node_modules/**"
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env)
    })
  ]
};

if (env === "production") {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
