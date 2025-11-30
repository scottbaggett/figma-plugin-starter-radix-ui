/// <reference types="@figma/plugin-typings" />

// This is the main plugin code that runs in Figma's sandbox.
// It has access to the Figma API but no access to DOM or browser APIs.

figma.showUI(__html__, {
	width: 400,
	height: 300,
	themeColors: true,
});

// Handle messages from the UI
figma.ui.onmessage = (msg: { type: string; [key: string]: unknown }) => {
	switch (msg.type) {
		case "create-circle": {
			const circle = figma.createEllipse();
			circle.x = figma.viewport.center.x;
			circle.y = figma.viewport.center.y;
			circle.fills = [{ type: "SOLID", color: { r: 0, g: 0.5, b: 1 } }];
			figma.currentPage.appendChild(circle);
			figma.currentPage.selection = [circle];
			figma.viewport.scrollAndZoomIntoView([circle]);
			break;
		}
		case "create-rectangle": {
			const rect = figma.createRectangle();
			rect.x = figma.viewport.center.x;
			rect.y = figma.viewport.center.y;
			rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
			figma.currentPage.appendChild(rect);
			figma.currentPage.selection = [rect];
			figma.viewport.scrollAndZoomIntoView([rect]);
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
