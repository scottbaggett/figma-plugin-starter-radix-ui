/// <reference types="@figma/plugin-typings" />

import type { CSSPaintStyle } from "@/shared/types";

// This is the main plugin code that runs in Figma's sandbox.
// It has access to the Figma API but no access to DOM or browser APIs.

figma.showUI(__html__, {
	width: 320,
	height: 480,
	themeColors: true,
});

// Convert Figma RGB (0–1) to CSS rgba() string
function paintToCss(paint: Paint): string | null {
	if (paint.type !== "SOLID") return null;
	const r = Math.round(paint.color.r * 255);
	const g = Math.round(paint.color.g * 255);
	const b = Math.round(paint.color.b * 255);
	const a = typeof paint.opacity === "number" ? paint.opacity : 1;
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Find a paint style by name and convert its first solid paint to CSS
async function getPaintStyleCssByName(
	styleName: string,
): Promise<string | null> {
	const styles = await figma.getLocalPaintStylesAsync();
	const style = styles.find((s) => s.name === styleName);
	if (!style) return null;
	return paintToCss(style.paints[0]);
}

// Handle messages from the UI
figma.ui.onmessage = async (msg: { type: string; [key: string]: unknown }) => {
	switch (msg.type) {
		case "get-text-styles": {
			const response = await figma.getLocalTextStylesAsync();
			const textStyles = await Promise.all(
				response.map(async (styleObject) => {
					return {
						id: styleObject.id,
						name: styleObject.name,
						fontName: styleObject.fontName,
						lineHeight: styleObject.lineHeight,
						fontSize: styleObject.fontSize,
					};
				}),
			);
			figma.ui.postMessage({
				type: "text-styles-response",
				styles: textStyles,
			});

			break;
		}
		case "get-paint-styles": {
			const response = await figma.getLocalPaintStylesAsync();
			const styles = (await Promise.all(
				response.map(async (styleObject) => {
					return {
						id: styleObject.id,
						name: styleObject.name,
						description: styleObject.description,
						type: styleObject.type,
						paints: styleObject.paints,
						css: await getPaintStyleCssByName(styleObject.name),
					};
				}),
			)) as CSSPaintStyle[];
			figma.ui.postMessage({
				type: "paint-styles-response",
				styles,
			});
			break;
		}

		case "close":
			figma.closePlugin();
			break;
	}
};

// Send current selection to UI
figma.on("selectionchange", () => {
	figma.ui.postMessage({
		type: "selection-change",
		count: figma.currentPage.selection.length,
	});
});
