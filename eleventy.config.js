import CleanCSS from "clean-css";
import navigationPlugin from "@11ty/eleventy-navigation";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import filtersPlugin from "./_config/filters.js";
import metadata from "./_data/metadata.js";

export default function (eleventyConfig) {
	// Copy the entire assets folder
	eleventyConfig.addPassthroughCopy("assets");

	// Minify and inline CSS
	eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});

	// Watch CSS files and assets
	eleventyConfig.addWatchTarget("**/*.css");
	eleventyConfig.addWatchTarget("assets");

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

	// Image plugin
	eleventyConfig.addPlugin(eleventyImageTransformPlugin);

	// Navigation plugin
	eleventyConfig.addPlugin(navigationPlugin);

	// Filters plugin
	eleventyConfig.addPlugin(filtersPlugin);

	return {
		dir: {
			input: "content",
			includes: "../_includes",
			data: "../_data"
		}
	};
}
