import CleanCSS from "clean-css";
import pluginFilters from "./_config/filters.js";

export default function (eleventyConfig) {
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Watch CSS files
  eleventyConfig.addWatchTarget("css/**/*.css");

  // Filters plugin
  eleventyConfig.addPlugin(pluginFilters);

  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
    },
  };
}
