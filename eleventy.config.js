import CleanCSS from "clean-css";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginFilters from "./_config/filters.js";
import metadata from "./_data/metadata.js";

export default function (eleventyConfig) {
	eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});

	// Watch CSS files
	eleventyConfig.addWatchTarget("css/**/*.css");

	// RSS feed plugin
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: "/feed.xml",
		collection: {
			name: "posts", // iterate over `collections.posts`
			limit: 0 // no limit
		},
		metadata
	});

	// Filters plugin
	eleventyConfig.addPlugin(pluginFilters);

	return {
		dir: {
			input: "content",
			includes: "../_includes",
			data: "../_data"
		}
	};
}
