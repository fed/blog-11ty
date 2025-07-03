import CleanCSS from "clean-css";

export default function (eleventyConfig) {
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Watch CSS files
  eleventyConfig.addWatchTarget("css/**/*.css");

  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
    },
  };
}
